import type {
  UserProfile,
  ContinueStudyData,
  QuickAccessItem,
  RecentStudyItem,
  JourneyStats,
  DiscussionItem,
  VerseHighlightData,
} from '../types/home';

export const mockCurrentUser: UserProfile = {
  name: 'Ryan Matheus',
  username: 'dev_ryan',
  readingStreakDays: 14,
};

export const mockContinueStudy: ContinueStudyData = {
  book: 'Evangelho de João',
  chapter: 5,
  totalChapters: 21,
  verseSnippet: '“Examinai as Escrituras, porque vós cuidais ter nelas a vida eterna, e são elas que de mim testificam.”',
  reference: 'João 5:39',
  progressPercent: 24,
  lastRead: 'há 2 horas',
};

export const mockQuickAccess: QuickAccessItem[] = [
  {
    id: 'bible',
    title: 'Bíblia',
    subtitle: 'Leia as Escrituras',
    iconName: 'BookOpen',
    href: '/bible',
  },
  {
    id: 'themes',
    title: 'Temas',
    subtitle: 'Explore assuntos bíblicos',
    iconName: 'Layers',
    href: '/themes',
  },
  {
    id: 'words',
    title: 'Palavras',
    subtitle: 'Hebraico e grego',
    iconName: 'Languages',
    href: '/words',
  },
  {
    id: 'context',
    title: 'Contexto',
    subtitle: 'História e cultura',
    iconName: 'Landmark',
    href: '/context',
  },
];

export const mockRecentStudies: RecentStudyItem[] = [
  {
    id: 'study-1',
    title: 'A soberania de Deus e a fidelidade da aliança',
    author: 'João Silva',
    biblicalReference: 'Romanos 9',
    excerpt: 'Uma exegese cuidadosa sobre a eleição divina, a distinção entre os filhos da carne e os filhos da promessa.',
    crossReferencesCount: 16,
    timeAgo: 'há 2 dias',
  },
  {
    id: 'study-2',
    title: 'O significado de Logos no prólogo Joanino',
    author: 'Maria Costa',
    biblicalReference: 'João 1:1-18',
    excerpt: 'Investigação do conceito de Logos à luz do Targum aramaico (Memra) e do pensamento judaico do Segundo Templo.',
    crossReferencesCount: 22,
    timeAgo: 'há 4 dias',
  },
  {
    id: 'study-3',
    title: 'Contexto histórico, geográfico e cultural do Êxodo',
    author: 'Pedro Martins',
    biblicalReference: 'Êxodo 12-14',
    excerpt: 'A correlação entre o Novo Império Egípcio, rotas do Sinai e a liturgia pascal estabelecida nas Escrituras.',
    crossReferencesCount: 11,
    timeAgo: 'há 1 semana',
  },
  {
    id: 'study-4',
    title: 'A aliança abraâmica e sua progressão redentiva',
    author: 'Lucas Ferreira',
    biblicalReference: 'Gênesis 12 & 15',
    excerpt: 'A promessa tripartite de descendência, terra e bênção universal no desdobramento das alianças bíblicas.',
    crossReferencesCount: 19,
    timeAgo: 'há 1 semana',
  },
];

export const mockJourneyStats: JourneyStats = {
  chaptersRead: 127,
  studiesCreated: 24,
  notesCount: 86,
  crossReferencesCount: 312,
};

export const mockDiscussions: DiscussionItem[] = [
  {
    id: 'disc-1',
    title: 'Paulo fala de eleição corporativa ou individual em Romanos 9?',
    reference: 'Romanos 9:6-16',
    repliesCount: 28,
    lastActivity: 'há 40 min',
  },
  {
    id: 'disc-2',
    title: 'Qual a intenção retórica de João 5:39 no diálogo com as autoridades?',
    reference: 'João 5:39',
    repliesCount: 19,
    lastActivity: 'há 2 horas',
  },
  {
    id: 'disc-3',
    title: 'A terminologia sacrificial em Levítico e Hebreus: paralelos exegéticos',
    reference: 'Hebreus 9:11-28',
    repliesCount: 34,
    lastActivity: 'há 5 horas',
  },
];

export const mockVerseHighlight: VerseHighlightData = {
  verseText: '“Conhecereis a verdade, e a verdade vos libertará.”',
  reference: 'João 8:32',
  originalLanguageNote: {
    term: 'ἀλήθεια',
    transliteration: 'alētheia',
    meaning: 'a verdade autêntica, objetiva, divina e desvelada nas Escrituras',
  },
};
