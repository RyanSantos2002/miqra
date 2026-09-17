import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getBookMetadata } from '../constants/bibleMetadata';
import type {
  BibleBookSummary,
  BibleChapterData,
  BibleChapterRecord,
  NormalizedVerse,
} from '../types/bible';

// Cache em memória para evitar requisições repetidas de livros/capítulos
const booksOverviewCache = new Map<string, BibleBookSummary[]>();

/**
 * Normalizador defensivo para a coluna JSONB `verses`.
 * Lida com qualquer formato retornado pelo Supabase:
 * - Array de objetos: [{ number: 1, text: "..." }] ou [{ verse: 1, text: "..." }]
 * - Dicionário chave-valor: { "1": "No princípio...", "2": "..." }
 * - Array de strings: ["No princípio...", "..."]
 */
export const normalizeVerses = (raw: unknown): NormalizedVerse[] => {
  if (!raw) return [];

  // Caso 1: Array
  if (Array.isArray(raw)) {
    return raw
      .map((item, index): NormalizedVerse | null => {
        if (typeof item === 'string') {
          return { number: index + 1, text: item.trim() };
        }

        if (typeof item === 'object' && item !== null) {
          const rec = item as Record<string, unknown>;
          const verseNum =
            Number(rec.number) ||
            Number(rec.verse) ||
            Number(rec.n) ||
            Number(rec.v) ||
            index + 1;
          const verseText =
            typeof rec.text === 'string'
              ? rec.text
              : typeof rec.verse_text === 'string'
              ? rec.verse_text
              : typeof rec.t === 'string'
              ? rec.t
              : typeof rec.content === 'string'
              ? rec.content
              : JSON.stringify(rec);

          return {
            number: verseNum,
            text: verseText.trim(),
          };
        }

        return null;
      })
      .filter((v): v is NormalizedVerse => v !== null)
      .sort((a, b) => a.number - b.number);
  }

  // Caso 2: Objeto chave-valor { "1": "No princípio...", "2": "..." }
  if (typeof raw === 'object' && raw !== null) {
    const entries = Object.entries(raw as Record<string, unknown>);
    return entries
      .map(([key, val]): NormalizedVerse => {
        const verseNum = parseInt(key, 10) || 1;
        let verseText = '';

        if (typeof val === 'string') {
          verseText = val;
        } else if (typeof val === 'object' && val !== null) {
          const rec = val as Record<string, unknown>;
          verseText = typeof rec.text === 'string' ? rec.text : JSON.stringify(val);
        }

        return {
          number: verseNum,
          text: verseText.trim(),
        };
      })
      .sort((a, b) => a.number - b.number);
  }

  return [];
};

/**
 * Busca as versões disponíveis na tabela `capitulos_biblia`.
 */
export const getAvailableVersions = async (): Promise<string[]> => {
  if (!isSupabaseConfigured()) {
    return ['nvi'];
  }

  try {
    const { data, error } = await supabase
      .from('capitulos_biblia')
      .select('version')
      .limit(200);

    if (error || !data || data.length === 0) {
      return ['nvi'];
    }

    const versionsSet = new Set<string>();
    data.forEach((row) => {
      if (row.version && typeof row.version === 'string') {
        versionsSet.add(row.version.toLowerCase().trim());
      }
    });

    const uniqueVersions = Array.from(versionsSet);
    return uniqueVersions.length > 0 ? uniqueVersions : ['nvi'];
  } catch (err) {
    console.error('[Miqra] Erro ao buscar versões disponíveis:', err);
    return ['nvi'];
  }
};

/**
 * Busca todos os livros e capítulos existentes para determinada versão,
 * de forma otimizada (sem trazer o JSONB pesado de verses de todos os 1189 registros).
 */
export const getBooksOverview = async (version: string): Promise<BibleBookSummary[]> => {
  const cacheKey = version.toLowerCase();
  if (booksOverviewCache.has(cacheKey)) {
    return booksOverviewCache.get(cacheKey)!;
  }

  if (!isSupabaseConfigured()) {
    throw new Error('CONFIG_REQUIRED');
  }

  // Consulta leve trazendo apenas book e chapter
  const { data, error } = await supabase
    .from('capitulos_biblia')
    .select('book, chapter')
    .eq('version', version)
    .order('chapter', { ascending: true });

  if (error) {
    console.error('[Miqra] Erro ao consultar livros no Supabase:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Agrupando capítulos por livro
  const bookChaptersMap = new Map<string, Set<number>>();

  data.forEach((row) => {
    if (!row.book) return;
    const rawBook = String(row.book).trim().toLowerCase();
    const chapterNum = Number(row.chapter);

    if (!bookChaptersMap.has(rawBook)) {
      bookChaptersMap.set(rawBook, new Set<number>());
    }

    if (!isNaN(chapterNum) && chapterNum > 0) {
      bookChaptersMap.get(rawBook)!.add(chapterNum);
    }
  });

  // Convertendo para o formato canônico com metadados
  const summaries: BibleBookSummary[] = [];

  bookChaptersMap.forEach((chaptersSet, bookSlug) => {
    const chaptersArray = Array.from(chaptersSet).sort((a, b) => a - b);
    const meta = getBookMetadata(bookSlug);

    summaries.push({
      slug: bookSlug,
      name: meta.name,
      abbrev: meta.abbrev,
      testament: meta.testament,
      category: meta.category,
      order: meta.order,
      chaptersCount: chaptersArray.length,
      availableChapters: chaptersArray,
    });
  });

  // Ordena pela ordem bíblica canônica (1 a 66)
  summaries.sort((a, b) => a.order - b.order);

  booksOverviewCache.set(cacheKey, summaries);
  return summaries;
};

/**
 * Busca os dados de um livro específico.
 */
export const getBookDetails = async (
  bookSlug: string,
  version: string
): Promise<BibleBookSummary | null> => {
  const allBooks = await getBooksOverview(version);
  const normalized = bookSlug.trim().toLowerCase().replace(/[\s_-]+/g, '');

  const found = allBooks.find(
    (b) =>
      b.slug.toLowerCase().replace(/[\s_-]+/g, '') === normalized ||
      b.name.toLowerCase().replace(/[\s_-]+/g, '') === normalized
  );

  return found || null;
};

/**
 * Busca o conteúdo real de um capítulo no Supabase e seus versículos.
 */
export const getChapter = async (
  bookSlug: string,
  chapterNumber: number,
  version: string
): Promise<BibleChapterData> => {
  if (!isSupabaseConfigured()) {
    throw new Error('CONFIG_REQUIRED');
  }

  // 1. Busca os metadados do livro para saber os limites de navegação
  const bookSummary = await getBookDetails(bookSlug, version);

  // 2. Consulta o capítulo real
  // Tentativa primária com o slug fornecido
  let query = supabase
    .from('capitulos_biblia')
    .select('*')
    .eq('version', version)
    .eq('book', bookSlug)
    .eq('chapter', chapterNumber)
    .maybeSingle();

  let { data, error } = await query;

  // Se não encontrar, tenta buscar pelo slug cadastrado no resumo
  if (!data && bookSummary && bookSummary.slug !== bookSlug) {
    const retry = await supabase
      .from('capitulos_biblia')
      .select('*')
      .eq('version', version)
      .eq('book', bookSummary.slug)
      .eq('chapter', chapterNumber)
      .maybeSingle();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.error(`[Miqra] Erro ao buscar capítulo ${bookSlug} ${chapterNumber}:`, error);
    throw error;
  }

  if (!data) {
    throw new Error(`Capítulo não encontrado no banco de dados para ${bookSlug} ${chapterNumber}`);
  }

  const rawRecord = data as BibleChapterRecord;
  const normalizedVerses = normalizeVerses(rawRecord.verses);

  // Log informativo para validação da estrutura do JSONB verses
  if (import.meta.env.DEV) {
    console.info(`[Miqra] Capítulo carregado com sucesso (${rawRecord.id}):`, {
      book: rawRecord.book,
      chapter: rawRecord.chapter,
      versesCount: normalizedVerses.length,
      sampleVerse: normalizedVerses[0],
    });
  }

  // Cálculo de capítulos anterior e próximo
  const availableChapters = bookSummary?.availableChapters || [chapterNumber];
  const currentIndex = availableChapters.indexOf(chapterNumber);

  const previousChapter = currentIndex > 0 ? availableChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex >= 0 && currentIndex < availableChapters.length - 1
      ? availableChapters[currentIndex + 1]
      : null;

  return {
    id: rawRecord.id || `${version}-${bookSlug}-${chapterNumber}`,
    version: rawRecord.version,
    bookSlug: rawRecord.book,
    bookName: bookSummary ? bookSummary.name : getBookMetadata(bookSlug).name,
    chapter: rawRecord.chapter,
    verses: normalizedVerses,
    totalBookChapters: availableChapters.length,
    previousChapter,
    nextChapter,
  };
};
