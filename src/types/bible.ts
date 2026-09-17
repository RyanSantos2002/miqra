export type Testament = 'OT' | 'NT';

export type BibleCategory =
  | 'Pentateuco'
  | 'Livros Históricos'
  | 'Poéticos e Sapienciais'
  | 'Profetas Maiores'
  | 'Profetas Menores'
  | 'Evangelhos'
  | 'Histórico do NT'
  | 'Cartas Paulinas'
  | 'Cartas Gerais'
  | 'Profético';

export interface BibleBookMeta {
  slug: string;
  name: string;
  abbrev: string;
  testament: Testament;
  category: BibleCategory;
  order: number;
}

export interface NormalizedVerse {
  number: number;
  text: string;
}

export interface BibleChapterRecord {
  id: string;
  version: string;
  book: string;
  chapter: number;
  verses: unknown;
  created_at?: string;
}

export interface BibleBookSummary {
  slug: string;
  name: string;
  abbrev: string;
  testament: Testament;
  category: BibleCategory;
  order: number;
  chaptersCount: number;
  availableChapters: number[];
}

export interface BibleChapterData {
  id: string;
  version: string;
  bookSlug: string;
  bookName: string;
  chapter: number;
  verses: NormalizedVerse[];
  totalBookChapters: number;
  previousChapter: number | null;
  nextChapter: number | null;
}
