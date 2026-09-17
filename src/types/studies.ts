export interface Study {
  id: string;
  userId: string;
  title: string;
  description: string;
  notes: string;
  versesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudyVerse {
  id: string;
  studyId: string;
  book: string;
  bookName: string;
  chapter: number;
  verse: number;
  verseText: string;
  version: string;
  createdAt: string;
}

export interface CreateStudyInput {
  title: string;
  description?: string;
  notes?: string;
}

export interface UpdateStudyInput {
  title?: string;
  description?: string;
  notes?: string;
}

export interface StudyRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudyVerseRow {
  id: string;
  study_id: string;
  book: string;
  chapter: number;
  verse: number;
  created_at: string;
}
