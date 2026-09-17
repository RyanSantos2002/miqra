export interface Note {
  id: string;
  userId: string;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteRow {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  book: string;
  chapter: number;
  verse: number;
  content: string;
}

export interface UpdateNoteInput {
  id: string;
  content: string;
}
