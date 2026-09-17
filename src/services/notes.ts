import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Note, NoteRow } from '../types/notes';

const mapRowToNote = (row: NoteRow): Note => ({
  id: row.id,
  userId: row.user_id,
  book: row.book,
  chapter: row.chapter,
  verse: row.verse,
  content: row.content,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * Busca a anotação pessoal do usuário para um versículo específico.
 */
export const getNoteForVerse = async (
  book: string,
  chapter: number,
  verse: number
): Promise<Note | null> => {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('book', book.toLowerCase())
      .eq('chapter', chapter)
      .eq('verse', verse)
      .maybeSingle();

    if (error) {
      // Se a tabela ainda não foi criada no Supabase
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        console.warn('[Miqra Notes] Tabela "notes" ainda não foi criada no Supabase.');
        return null;
      }
      console.error('[Miqra Notes] Erro ao buscar anotação do versículo:', error);
      return null;
    }

    return data ? mapRowToNote(data as NoteRow) : null;
  } catch (err) {
    console.error('[Miqra Notes] Falha inesperada ao consultar nota:', err);
    return null;
  }
};

/**
 * Busca todas as anotações do usuário no capítulo atual.
 * Retorna um mapa { [verseNumber]: Note } para rápido acesso no leitor.
 */
export const getNotesForChapter = async (
  book: string,
  chapter: number
): Promise<Record<number, Note>> => {
  if (!isSupabaseConfigured()) return {};

  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('book', book.toLowerCase())
      .eq('chapter', chapter);

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return {};
      }
      console.error('[Miqra Notes] Erro ao buscar anotações do capítulo:', error);
      return {};
    }

    const notesMap: Record<number, Note> = {};
    if (data && Array.isArray(data)) {
      for (const row of data as NoteRow[]) {
        notesMap[row.verse] = mapRowToNote(row);
      }
    }

    return notesMap;
  } catch (err) {
    console.error('[Miqra Notes] Falha inesperada ao buscar notas do capítulo:', err);
    return {};
  }
};

/**
 * Cria ou atualiza uma anotação pessoal vinculada ao versículo e usuário autenticado.
 */
export const saveNote = async (
  book: string,
  chapter: number,
  verse: number,
  content: string,
  noteId?: string
): Promise<Note> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado.');
  }

  const trimmedContent = content.trim();
  if (!trimmedContent) {
    throw new Error('O conteúdo da anotação não pode estar vazio.');
  }

  // 1. Atualização por ID se já possuir nota existente
  if (noteId) {
    const { data, error } = await supabase
      .from('notes')
      .update({
        content: trimmedContent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', noteId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar anotação: ${error.message}`);
    }

    return mapRowToNote(data as NoteRow);
  }

  // 2. Inserção ou Upsert para garantir unicidade por usuário e versículo
  const { data, error } = await supabase
    .from('notes')
    .upsert(
      {
        book: book.toLowerCase(),
        chapter,
        verse,
        content: trimmedContent,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,book,chapter,verse',
      }
    )
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
      throw new Error(
        'A tabela "notes" ainda não foi criada no banco de dados. Execute o script SQL no Supabase.'
      );
    }
    throw new Error(`Erro ao salvar anotação: ${error.message}`);
  }

  return mapRowToNote(data as NoteRow);
};

/**
 * Exclui uma anotação pessoal.
 */
export const deleteNote = async (noteId: string): Promise<void> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado.');
  }

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId);

  if (error) {
    throw new Error(`Erro ao excluir anotação: ${error.message}`);
  }
};
