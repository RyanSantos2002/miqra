import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getBookMetadata } from '../constants/bibleMetadata';
import { getChapter } from './bible';
import type {
  Study,
  StudyVerse,
  CreateStudyInput,
  UpdateStudyInput,
  StudyRow,
  StudyVerseRow,
} from '../types/studies';

// Cache em memória para textos de capítulos bíblicos durante a sessão
const chapterVersesCache = new Map<string, Map<number, string>>();

const mapRowToStudy = (
  row: StudyRow & { study_verses?: { count?: number }[] | { id: string }[] },
  versesCount = 0
): Study => {
  let count = versesCount;
  if (Array.isArray(row.study_verses)) {
    if (row.study_verses.length > 0 && 'count' in row.study_verses[0]) {
      count = (row.study_verses[0] as { count: number }).count || 0;
    } else {
      count = row.study_verses.length;
    }
  }

  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description || '',
    notes: row.notes || '',
    versesCount: count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Busca todos os estudos criados pelo usuário autenticado.
 */
export const getMyStudies = async (): Promise<Study[]> => {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('studies')
      .select('*, study_verses(id)')
      .order('updated_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        console.warn('[Miqra Studies] Tabela "studies" ainda não foi criada no Supabase.');
        return [];
      }
      console.error('[Miqra Studies] Erro ao buscar estudos:', error);
      return [];
    }

    if (!data || !Array.isArray(data)) return [];

    return data.map((row) => mapRowToStudy(row as StudyRow & { study_verses?: { id: string }[] }));
  } catch (err) {
    console.error('[Miqra Studies] Falha inesperada ao consultar estudos:', err);
    return [];
  }
};

/**
 * Busca os dados de um estudo específico e todas as suas referências bíblicas.
 * O texto do versículo é resolvido em tempo real através da fonte bíblica,
 * sem duplicação de texto no banco de dados.
 */
export const getStudyById = async (
  studyId: string
): Promise<{ study: Study; verses: StudyVerse[] } | null> => {
  if (!isSupabaseConfigured()) return null;

  try {
    // 1. Busca os dados do estudo
    const { data: studyRow, error: studyError } = await supabase
      .from('studies')
      .select('*')
      .eq('id', studyId)
      .maybeSingle();

    if (studyError || !studyRow) {
      if (studyError && studyError.code !== 'PGRST116') {
        console.error('[Miqra Studies] Erro ao carregar estudo:', studyError);
      }
      return null;
    }

    // 2. Busca as referências associadas
    const { data: versesRows, error: versesError } = await supabase
      .from('study_verses')
      .select('*')
      .eq('study_id', studyId)
      .order('created_at', { ascending: true });

    if (versesError) {
      console.error('[Miqra Studies] Erro ao buscar versículos do estudo:', versesError);
    }

    const rows = (versesRows || []) as StudyVerseRow[];

    // 3. Resolução dos textos dos versículos via serviço da Bíblia (otimizada por capítulo)
    const resolvedVerses: StudyVerse[] = [];

    for (const vRow of rows) {
      const bookSlug = vRow.book.toLowerCase();
      const meta = getBookMetadata(bookSlug);
      const bookName = meta ? meta.name : vRow.book;
      const cacheKey = `${bookSlug}_${vRow.chapter}`;

      let verseText = '';

      if (!chapterVersesCache.has(cacheKey)) {
        try {
          const chapterData = await getChapter(bookSlug, vRow.chapter, 'nvi');
          const vMap = new Map<number, string>();
          for (const item of chapterData.verses) {
            vMap.set(item.number, item.text);
          }
          chapterVersesCache.set(cacheKey, vMap);
        } catch {
          // Se falhar o carregamento do capítulo, mantemos vazio
        }
      }

      const cachedMap = chapterVersesCache.get(cacheKey);
      if (cachedMap && cachedMap.has(vRow.verse)) {
        verseText = cachedMap.get(vRow.verse)!;
      }

      resolvedVerses.push({
        id: vRow.id,
        studyId: vRow.study_id,
        book: bookSlug,
        bookName,
        chapter: vRow.chapter,
        verse: vRow.verse,
        verseText,
        version: 'NVI',
        createdAt: vRow.created_at,
      });
    }

    const study = mapRowToStudy(studyRow as StudyRow, resolvedVerses.length);

    return {
      study,
      verses: resolvedVerses,
    };
  } catch (err) {
    console.error('[Miqra Studies] Falha inesperada ao consultar estudo e versículos:', err);
    return null;
  }
};

/**
 * Cria um novo estudo para o usuário autenticado.
 */
export const createStudy = async (input: CreateStudyInput): Promise<Study> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado.');
  }

  const trimmedTitle = input.title.trim();
  if (!trimmedTitle) {
    throw new Error('O título do estudo é obrigatório.');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Você precisa estar autenticado para criar um estudo.');
  }

  const { data, error } = await supabase
    .from('studies')
    .insert({
      user_id: user.id,
      title: trimmedTitle,
      description: input.description?.trim() || '',
      notes: input.notes?.trim() || '',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar estudo: ${error.message}`);
  }

  return mapRowToStudy(data as StudyRow, 0);
};

/**
 * Atualiza os dados de um estudo existente (título, descrição ou anotações).
 */
export const updateStudy = async (
  studyId: string,
  input: UpdateStudyInput
): Promise<Study> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado.');
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) {
    const trimmed = input.title.trim();
    if (!trimmed) throw new Error('O título do estudo não pode ficar vazio.');
    updates.title = trimmed;
  }

  if (input.description !== undefined) {
    updates.description = input.description.trim();
  }

  if (input.notes !== undefined) {
    updates.notes = input.notes;
  }

  const { data, error } = await supabase
    .from('studies')
    .update(updates)
    .eq('id', studyId)
    .select('*, study_verses(id)')
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar estudo: ${error.message}`);
  }

  return mapRowToStudy(data as StudyRow & { study_verses?: { id: string }[] });
};

/**
 * Exclui um estudo e todas as referências vinculadas (removidas em cascata).
 */
export const deleteStudy = async (studyId: string): Promise<void> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado.');
  }

  const { error } = await supabase.from('studies').delete().eq('id', studyId);

  if (error) {
    throw new Error(`Erro ao excluir estudo: ${error.message}`);
  }
};

/**
 * Adiciona uma referência bíblica a um estudo, prevenindo duplicidades.
 */
export const addVerseToStudy = async (
  studyId: string,
  book: string,
  chapter: number,
  verse: number
): Promise<StudyVerse> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado.');
  }

  const cleanBook = book.toLowerCase().trim();

  // Inserção com tratamento de unicidade
  const { data, error } = await supabase
    .from('study_verses')
    .insert({
      study_id: studyId,
      book: cleanBook,
      chapter,
      verse,
    })
    .select()
    .single();

  if (error) {
    // Código PostgreSQL 23505 indica violação de chave única
    if (error.code === '23505') {
      throw new Error('Este versículo já faz parte deste estudo.');
    }
    throw new Error(`Erro ao adicionar versículo ao estudo: ${error.message}`);
  }

  // Atualizar data do estudo pai
  await supabase
    .from('studies')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', studyId);

  const meta = getBookMetadata(cleanBook);
  const row = data as StudyVerseRow;

  return {
    id: row.id,
    studyId: row.study_id,
    book: cleanBook,
    bookName: meta ? meta.name : cleanBook,
    chapter: row.chapter,
    verse: row.verse,
    verseText: '',
    version: 'NVI',
    createdAt: row.created_at,
  };
};

/**
 * Remove uma referência bíblica do estudo sem afetar a Bíblia nem anotações pessoais.
 */
export const removeVerseFromStudy = async (studyVerseId: string): Promise<void> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado.');
  }

  const { error } = await supabase
    .from('study_verses')
    .delete()
    .eq('id', studyVerseId);

  if (error) {
    throw new Error(`Erro ao remover versículo do estudo: ${error.message}`);
  }
};

/**
 * Retorna os IDs dos estudos que já contêm o versículo indicado.
 */
export const getStudiesContainingVerse = async (
  book: string,
  chapter: number,
  verse: number
): Promise<Set<string>> => {
  if (!isSupabaseConfigured()) return new Set();

  try {
    const { data, error } = await supabase
      .from('study_verses')
      .select('study_id')
      .eq('book', book.toLowerCase().trim())
      .eq('chapter', chapter)
      .eq('verse', verse);

    if (error || !data) return new Set();

    return new Set(data.map((r: { study_id: string }) => r.study_id));
  } catch {
    return new Set();
  }
};
