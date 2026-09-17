export interface UserProfile {
  name: string;
  username: string;
  avatarUrl?: string;
  readingStreakDays?: number;
}

export interface ContinueStudyData {
  book: string;
  chapter: number;
  totalChapters: number;
  verseSnippet: string;
  reference: string;
  progressPercent: number;
  lastRead: string;
}

export interface QuickAccessItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'BookOpen' | 'Layers' | 'Languages' | 'Landmark';
  href: string;
}

export interface RecentStudyItem {
  id: string;
  title: string;
  author: string;
  biblicalReference: string;
  excerpt: string;
  crossReferencesCount: number;
  timeAgo: string;
}

export interface JourneyStats {
  chaptersRead: number;
  studiesCreated: number;
  notesCount: number;
  crossReferencesCount: number;
}

export interface DiscussionItem {
  id: string;
  title: string;
  reference: string;
  repliesCount: number;
  lastActivity: string;
}

export interface VerseHighlightData {
  verseText: string;
  reference: string;
  originalLanguageNote: {
    term: string;
    transliteration: string;
    meaning: string;
  };
}
