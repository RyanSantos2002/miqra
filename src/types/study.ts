export type HighlightColor = 'gold' | 'green' | 'bronze' | 'red';

export interface FavoriteItem {
  id: string;
  userId: string;
  book: string;
  chapter: number;
  verse: number;
  verseText?: string;
  createdAt: string;
}

export interface FavoriteRow {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  verse: number;
  verse_text?: string;
  created_at: string;
}

export interface VerseHighlight {
  id: string;
  userId: string;
  book: string;
  chapter: number;
  verse: number;
  color: HighlightColor;
  createdAt: string;
  updatedAt: string;
}

export interface VerseHighlightRow {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  verse: number;
  color: string;
  created_at: string;
  updated_at: string;
}
