import type { BibleBookMeta } from '../types/bible';

export const CANONICAL_BOOKS: BibleBookMeta[] = [
  // Antigo Testamento — Pentateuco
  { slug: 'genesis', name: 'Gênesis', abbrev: 'Gn', testament: 'OT', category: 'Pentateuco', order: 1 },
  { slug: 'exodus', name: 'Êxodo', abbrev: 'Êx', testament: 'OT', category: 'Pentateuco', order: 2 },
  { slug: 'leviticus', name: 'Levítico', abbrev: 'Lv', testament: 'OT', category: 'Pentateuco', order: 3 },
  { slug: 'numbers', name: 'Números', abbrev: 'Nm', testament: 'OT', category: 'Pentateuco', order: 4 },
  { slug: 'deuteronomy', name: 'Deuteronômio', abbrev: 'Dt', testament: 'OT', category: 'Pentateuco', order: 5 },

  // Antigo Testamento — Livros Históricos
  { slug: 'joshua', name: 'Josué', abbrev: 'Js', testament: 'OT', category: 'Livros Históricos', order: 6 },
  { slug: 'judges', name: 'Juízes', abbrev: 'Jz', testament: 'OT', category: 'Livros Históricos', order: 7 },
  { slug: 'ruth', name: 'Rute', abbrev: 'Rt', testament: 'OT', category: 'Livros Históricos', order: 8 },
  { slug: '1samuel', name: '1 Samuel', abbrev: '1Sm', testament: 'OT', category: 'Livros Históricos', order: 9 },
  { slug: '2samuel', name: '2 Samuel', abbrev: '2Sm', testament: 'OT', category: 'Livros Históricos', order: 10 },
  { slug: '1kings', name: '1 Reis', abbrev: '1Rs', testament: 'OT', category: 'Livros Históricos', order: 11 },
  { slug: '2kings', name: '2 Reis', abbrev: '2Rs', testament: 'OT', category: 'Livros Históricos', order: 12 },
  { slug: '1chronicles', name: '1 Crônicas', abbrev: '1Cr', testament: 'OT', category: 'Livros Históricos', order: 13 },
  { slug: '2chronicles', name: '2 Crônicas', abbrev: '2Cr', testament: 'OT', category: 'Livros Históricos', order: 14 },
  { slug: 'ezra', name: 'Esdras', abbrev: 'Ed', testament: 'OT', category: 'Livros Históricos', order: 15 },
  { slug: 'nehemiah', name: 'Neemias', abbrev: 'Ne', testament: 'OT', category: 'Livros Históricos', order: 16 },
  { slug: 'esther', name: 'Ester', abbrev: 'Et', testament: 'OT', category: 'Livros Históricos', order: 17 },

  // Antigo Testamento — Poéticos e Sapienciais
  { slug: 'job', name: 'Jó', abbrev: 'Jó', testament: 'OT', category: 'Poéticos e Sapienciais', order: 18 },
  { slug: 'psalms', name: 'Salmos', abbrev: 'Sl', testament: 'OT', category: 'Poéticos e Sapienciais', order: 19 },
  { slug: 'proverbs', name: 'Provérbios', abbrev: 'Pv', testament: 'OT', category: 'Poéticos e Sapienciais', order: 20 },
  { slug: 'ecclesiastes', name: 'Eclesiastes', abbrev: 'Ec', testament: 'OT', category: 'Poéticos e Sapienciais', order: 21 },
  { slug: 'songofsongs', name: 'Cânticos', abbrev: 'Ct', testament: 'OT', category: 'Poéticos e Sapienciais', order: 22 },

  // Antigo Testamento — Profetas Maiores
  { slug: 'isaiah', name: 'Isaías', abbrev: 'Is', testament: 'OT', category: 'Profetas Maiores', order: 23 },
  { slug: 'jeremiah', name: 'Jeremias', abbrev: 'Jr', testament: 'OT', category: 'Profetas Maiores', order: 24 },
  { slug: 'lamentations', name: 'Lamentações', abbrev: 'Lm', testament: 'OT', category: 'Profetas Maiores', order: 25 },
  { slug: 'ezekiel', name: 'Ezequiel', abbrev: 'Ez', testament: 'OT', category: 'Profetas Maiores', order: 26 },
  { slug: 'daniel', name: 'Daniel', abbrev: 'Dn', testament: 'OT', category: 'Profetas Maiores', order: 27 },

  // Antigo Testamento — Profetas Menores
  { slug: 'hosea', name: 'Oseias', abbrev: 'Os', testament: 'OT', category: 'Profetas Menores', order: 28 },
  { slug: 'joel', name: 'Joel', abbrev: 'Jl', testament: 'OT', category: 'Profetas Menores', order: 29 },
  { slug: 'amos', name: 'Amós', abbrev: 'Am', testament: 'OT', category: 'Profetas Menores', order: 30 },
  { slug: 'obadiah', name: 'Obadias', abbrev: 'Ob', testament: 'OT', category: 'Profetas Menores', order: 31 },
  { slug: 'jonah', name: 'Jonas', abbrev: 'Jn', testament: 'OT', category: 'Profetas Menores', order: 32 },
  { slug: 'micah', name: 'Miqueias', abbrev: 'Mq', testament: 'OT', category: 'Profetas Menores', order: 33 },
  { slug: 'nahum', name: 'Naum', abbrev: 'Na', testament: 'OT', category: 'Profetas Menores', order: 34 },
  { slug: 'habakkuk', name: 'Habacuque', abbrev: 'Hc', testament: 'OT', category: 'Profetas Menores', order: 35 },
  { slug: 'zephaniah', name: 'Sofonias', abbrev: 'Sf', testament: 'OT', category: 'Profetas Menores', order: 36 },
  { slug: 'haggai', name: 'Ageu', abbrev: 'Ag', testament: 'OT', category: 'Profetas Menores', order: 37 },
  { slug: 'zechariah', name: 'Zacarias', abbrev: 'Zc', testament: 'OT', category: 'Profetas Menores', order: 38 },
  { slug: 'malachi', name: 'Malaquias', abbrev: 'Ml', testament: 'OT', category: 'Profetas Menores', order: 39 },

  // Novo Testamento — Evangelhos
  { slug: 'matthew', name: 'Mateus', abbrev: 'Mt', testament: 'NT', category: 'Evangelhos', order: 40 },
  { slug: 'mark', name: 'Marcos', abbrev: 'Mc', testament: 'NT', category: 'Evangelhos', order: 41 },
  { slug: 'luke', name: 'Lucas', abbrev: 'Lc', testament: 'NT', category: 'Evangelhos', order: 42 },
  { slug: 'john', name: 'João', abbrev: 'Jo', testament: 'NT', category: 'Evangelhos', order: 43 },

  // Novo Testamento — Histórico do NT
  { slug: 'acts', name: 'Atos dos Apóstolos', abbrev: 'At', testament: 'NT', category: 'Histórico do NT', order: 44 },

  // Novo Testamento — Cartas Paulinas
  { slug: 'romans', name: 'Romanos', abbrev: 'Rm', testament: 'NT', category: 'Cartas Paulinas', order: 45 },
  { slug: '1corinthians', name: '1 Coríntios', abbrev: '1Co', testament: 'NT', category: 'Cartas Paulinas', order: 46 },
  { slug: '2corinthians', name: '2 Coríntios', abbrev: '2Co', testament: 'NT', category: 'Cartas Paulinas', order: 47 },
  { slug: 'galatians', name: 'Gálatas', abbrev: 'Gl', testament: 'NT', category: 'Cartas Paulinas', order: 48 },
  { slug: 'ephesians', name: 'Efésios', abbrev: 'Ef', testament: 'NT', category: 'Cartas Paulinas', order: 49 },
  { slug: 'philippians', name: 'Filipenses', abbrev: 'Fp', testament: 'NT', category: 'Cartas Paulinas', order: 50 },
  { slug: 'colossians', name: 'Colossenses', abbrev: 'Cl', testament: 'NT', category: 'Cartas Paulinas', order: 51 },
  { slug: '1thessalonians', name: '1 Tessalonicenses', abbrev: '1Ts', testament: 'NT', category: 'Cartas Paulinas', order: 52 },
  { slug: '2thessalonians', name: '2 Tessalonicenses', abbrev: '2Ts', testament: 'NT', category: 'Cartas Paulinas', order: 53 },
  { slug: '1timothy', name: '1 Timóteo', abbrev: '1Tm', testament: 'NT', category: 'Cartas Paulinas', order: 54 },
  { slug: '2timothy', name: '2 Timóteo', abbrev: '2Tm', testament: 'NT', category: 'Cartas Paulinas', order: 55 },
  { slug: 'titus', name: 'Tito', abbrev: 'Tt', testament: 'NT', category: 'Cartas Paulinas', order: 56 },
  { slug: 'philemon', name: 'Filemom', abbrev: 'Fm', testament: 'NT', category: 'Cartas Paulinas', order: 57 },

  // Novo Testamento — Cartas Gerais
  { slug: 'hebrews', name: 'Hebreus', abbrev: 'Hb', testament: 'NT', category: 'Cartas Gerais', order: 58 },
  { slug: 'james', name: 'Tiago', abbrev: 'Tg', testament: 'NT', category: 'Cartas Gerais', order: 59 },
  { slug: '1peter', name: '1 Pedro', abbrev: '1Pe', testament: 'NT', category: 'Cartas Gerais', order: 60 },
  { slug: '2peter', name: '2 Pedro', abbrev: '2Pe', testament: 'NT', category: 'Cartas Gerais', order: 61 },
  { slug: '1john', name: '1 João', abbrev: '1Jo', testament: 'NT', category: 'Cartas Gerais', order: 62 },
  { slug: '2john', name: '2 João', abbrev: '2Jo', testament: 'NT', category: 'Cartas Gerais', order: 63 },
  { slug: '3john', name: '3 João', abbrev: '3Jo', testament: 'NT', category: 'Cartas Gerais', order: 64 },
  { slug: 'jude', name: 'Judas', abbrev: 'Jd', testament: 'NT', category: 'Cartas Gerais', order: 65 },

  // Novo Testamento — Profético
  { slug: 'revelation', name: 'Apocalipse', abbrev: 'Ap', testament: 'NT', category: 'Profético', order: 66 },
];

// Mapa com slugs normalizados (incluindo variações como '1-chronicles' ou 'canticos')
const metadataMap = new Map<string, BibleBookMeta>();

// Populando mapa com versões normais e variantes com hífen/espaço
CANONICAL_BOOKS.forEach((book) => {
  metadataMap.set(book.slug.toLowerCase(), book);

  // Variações de Cânticos / Song of Solomon
  if (book.slug === 'songofsongs') {
    metadataMap.set('songofsolomon', book);
    metadataMap.set('canticos', book);
    metadataMap.set('canticodossois', book);
  }

  // Variações comuns (ex: 1chronicles <-> 1-chronicles)
  const withHyphen = book.slug.replace(/^([1-3])/, '$1-');
  metadataMap.set(withHyphen, book);

  // Variação em português caso venha em pt-br no banco
  const normalizedPt = book.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
  metadataMap.set(normalizedPt, book);
});

export const getBookMetadata = (rawSlug: string): BibleBookMeta => {
  const normalizedKey = rawSlug.trim().toLowerCase().replace(/[\s_-]+/g, '');
  const found = metadataMap.get(normalizedKey) || metadataMap.get(rawSlug.trim().toLowerCase());

  if (found) {
    return found;
  }

  // Fallback seguro caso o banco contenha um livro com slug inesperado
  const formattedName = rawSlug
    .replace(/^([1-3])/, '$1 ')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    slug: rawSlug,
    name: formattedName,
    abbrev: rawSlug.substring(0, 3).toUpperCase(),
    testament: 'OT',
    category: 'Livros Históricos',
    order: 999,
  };
};
