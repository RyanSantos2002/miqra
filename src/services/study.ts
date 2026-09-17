import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  FavoriteItem,
  FavoriteRow,
  VerseHighlight,
  VerseHighlightRow,
  HighlightColor,
} from '../types/study';

const mapFavoriteRow = (row: FavoriteRow): FavoriteItem => ({
  id: row.id,
  userId: row.user_id,
  book: row.book,
  chapter: row.chapter,
  verse: row.verse,
  verseText: row.verse_text,
  createdAt: row.created_at,
});

const mapHighlightRow = (row: VerseHighlightRow): VerseHighlight => ({
  id: row.id,
  userId: row.user_id,
  book: row.book,
  chapter: row.chapter,
  verse: row.verse,
  color: row.color as HighlightColor,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// ==============================================================================
// FAVORITOS
// ==============================================================================

/**
 * Busca os favoritos do usuário para um capítulo específico.
 * Retorna um mapa { [verseNumber]: FavoriteItem }
 */
export const getFavoritesForChapter = async (
  book: string,
  chapter: number
): Promise<Record<number, FavoriteItem>> => {
  if (!isSupabaseConfigured()) return {};

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('book', book.toLowerCase())
      .eq('chapter', chapter);

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return {};
      }
      console.error('[Miqra Study] Erro ao buscar favoritos do capítulo:', error);
      return {};
    }

    const map: Record<number, FavoriteItem> = {};
    if (data && Array.isArray(data)) {
      for (const row of data as FavoriteRow[]) {
        map[row.verse] = mapFavoriteRow(row);
      }
    }
    return map;
  } catch (err) {
    console.error('[Miqra Study] Falha ao recuperar favoritos:', err);
    return {};
  }
};

/**
 * Busca todos os favoritos do usuário (para a página /favorites).
 */
export const getAllFavorites = async (): Promise<FavoriteItem[]> => {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return [];
      }
      console.error('[Miqra Study] Erro ao buscar lista de favoritos:', error);
      return [];
    }

    return (data as FavoriteRow[]).map(mapFavoriteRow);
  } catch (err) {
    console.error('[Miqra Study] Falha ao recuperar todos os favoritos:', err);
    return [];
  }
};

/**
 * Alterna o estado de favorito de um versículo (favorita ou desfavorita).
 */
export const toggleFavorite = async (
  book: string,
  chapter: number,
  verse: number,
  verseText?: string
): Promise<{ isFavorited: boolean; item?: FavoriteItem }> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado.');
  }

  const cleanBook = book.toLowerCase();

  // 1. Verifica se já está favoritado
  const { data: existing, error: checkError } = await supabase
    .from('favorites')
    .select('id')
    .eq('book', cleanBook)
    .eq('chapter', chapter)
    .eq('verse', verse)
    .maybeSingle();

  if (checkError && checkError.code !== 'PGRST205') {
    console.error('[Miqra Study] Erro ao verificar favorito:', checkError);
  }

  // 2. Se já existe, remove
  if (existing) {
    const { error: delError } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existing.id);

    if (delError) {
      throw new Error(`Erro ao desfavoritar: ${delError.message}`);
    }

    return { isFavorited: false };
  }

  // 3. Se não existe, adiciona
  const { data: inserted, error: insertError } = await supabase
    .from('favorites')
    .insert({
      book: cleanBook,
      chapter,
      verse,
      verse_text: verseText || null,
    })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === 'PGRST205' || insertError.message?.includes('schema cache')) {
      throw new Error(
        'A tabela "favorites" ainda não foi criada no Supabase. Execute o script SQL no painel.'
      );
    }
    throw new Error(`Erro ao favoritar versículo: ${insertError.message}`);
  }

  return { isFavorited: true, item: mapFavoriteRow(inserted as FavoriteRow) };
};

/**
 * Remove um favorito pelo ID.
 */
export const removeFavorite = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado.');
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Erro ao remover favorito: ${error.message}`);
  }
};

// ==============================================================================
// MARCAÇÕES / DESTAQUES (HIGHLIGHTS)
// ==============================================================================

/**
 * Busca todas as marcações de cor do capítulo atual.
 * Retorna um mapa { [verseNumber]: HighlightColor }
 */
export const getHighlightsForChapter = async (
  book: string,
  chapter: number
): Promise<Record<number, HighlightColor>> => {
  if (!isSupabaseConfigured()) return {};

  try {
    const { data, error } = await supabase
      .from('verse_highlights')
      .select('*')
      .eq('book', book.toLowerCase())
      .eq('chapter', chapter);

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return {};
      }
      console.error('[Miqra Study] Erro ao buscar marcações do capítulo:', error);
      return {};
    }

    const map: Record<number, HighlightColor> = {};
    if (data && Array.isArray(data)) {
      for (const row of data as VerseHighlightRow[]) {
        map[row.verse] = row.color as HighlightColor;
      }
    }
    return map;
  } catch (err) {
    console.error('[Miqra Study] Falha ao recuperar marcações:', err);
    return {};
  }
};

/**
 * Define ou atualiza a cor de destaque de um versículo.
 */
export const setHighlight = async (
  book: string,
  chapter: number,
  verse: number,
  color: HighlightColor
): Promise<VerseHighlight> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado.');
  }

  const { data, error } = await supabase
    .from('verse_highlights')
    .upsert(
      {
        book: book.toLowerCase(),
        chapter,
        verse,
        color,
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
        'A tabela "verse_highlights" ainda não foi criada no Supabase. Execute o script SQL no painel.'
      );
    }
    throw new Error(`Erro ao salvar destaque: ${error.message}`);
  }

  return mapHighlightRow(data as VerseHighlightRow);
};

/**
 * Remove a marcação de um versículo.
 */
export const removeHighlight = async (
  book: string,
  chapter: number,
  verse: number
): Promise<void> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado.');
  }

  const { error } = await supabase
    .from('verse_highlights')
    .delete()
    .eq('book', book.toLowerCase())
    .eq('chapter', chapter)
    .eq('verse', verse);

  if (error) {
    throw new Error(`Erro ao remover destaque: ${error.message}`);
  }
};
