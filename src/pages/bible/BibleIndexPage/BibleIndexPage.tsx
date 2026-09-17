import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Database,
} from 'lucide-react';
import { DashboardLayout } from '../../../layouts/DashboardLayout/DashboardLayout';
import {
  getAvailableVersions,
  getBooksOverview,
} from '../../../services/bible';
import { isSupabaseConfigured } from '../../../lib/supabase';
import type { BibleBookSummary, Testament } from '../../../types/bible';
import styles from './BibleIndexPage.module.css';

type TestamentFilter = 'ALL' | Testament;

export const BibleIndexPage: React.FC = () => {
  const [versions, setVersions] = useState<string[]>(['nvi']);
  const [selectedVersion, setSelectedVersion] = useState<string>('nvi');
  const [books, setBooks] = useState<BibleBookSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNotConfigured, setIsNotConfigured] = useState<boolean>(false);

  // Filtros de busca e testamento
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [testamentFilter, setTestamentFilter] = useState<TestamentFilter>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!isSupabaseConfigured()) {
        if (isMounted) {
          setIsNotConfigured(true);
          setIsLoading(false);
        }
        return;
      }

      try {
        const availableVersions = await getAvailableVersions();
        if (!isMounted) return;
        setVersions(availableVersions);

        const activeVer = availableVersions.includes(selectedVersion)
          ? selectedVersion
          : availableVersions[0] || 'nvi';
        setSelectedVersion(activeVer);

        const booksData = await getBooksOverview(activeVer);
        if (!isMounted) return;
        setBooks(booksData);
      } catch (err: unknown) {
        if (!isMounted) return;
        const errorStr = String(err);
        if (errorStr.includes('CONFIG_REQUIRED') || !isSupabaseConfigured()) {
          setIsNotConfigured(true);
        } else {
          setErrorMessage(
            'Não foi possível carregar os livros da Bíblia a partir do Supabase. Verifique a conexão com a tabela capitulos_biblia.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [selectedVersion]);

  const handleRetry = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsNotConfigured(false);
    getBooksOverview(selectedVersion)
      .then((data) => setBooks(data))
      .catch(() => setErrorMessage('Falha ao conectar com o Supabase.'))
      .finally(() => setIsLoading(false));
  };

  // Extrair categorias disponíveis dos livros carregados
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    books.forEach((b) => {
      if (testamentFilter === 'ALL' || b.testament === testamentFilter) {
        cats.add(b.category);
      }
    });
    return Array.from(cats);
  }, [books, testamentFilter]);

  // Filtragem combinada
  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return books.filter((book) => {
      // Filtro de Testamento
      if (testamentFilter !== 'ALL' && book.testament !== testamentFilter) {
        return false;
      }

      // Filtro de Categoria
      if (selectedCategory !== 'ALL' && book.category !== selectedCategory) {
        return false;
      }

      // Filtro de Busca
      if (query.length > 0) {
        const normalizedName = book.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const normalizedAbbrev = book.abbrev.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const normalizedSlug = book.slug.toLowerCase().replace(/[-_]/g, '');

        const matchesName = normalizedName.includes(query);
        const matchesAbbrev = normalizedAbbrev.includes(query);
        const matchesSlug = normalizedSlug.includes(query);

        return matchesName || matchesAbbrev || matchesSlug;
      }

      return true;
    });
  }, [books, searchQuery, testamentFilter, selectedCategory]);

  return (
    <DashboardLayout>
      <div className={styles.pageContainer}>
        {/* Cabeçalho da Página */}
        <header className={styles.pageHeader}>
          <div className={styles.headerTitleArea}>
            <div className={styles.badgeWrapper}>
              <BookOpen size={13} />
              <span>TEXTO SAGRADO</span>
            </div>
            <h1 className={styles.title}>As Escrituras Sagradas</h1>
            <p className={styles.subtitle}>
              Navegue pelos livros canônicos, examine os capítulos e estude o texto original.
            </p>
          </div>

          {/* Seletor de Versão Bíblica Real */}
          <div className={styles.versionSelectorArea}>
            <label htmlFor="versionSelect" className={styles.versionLabel}>
              Versão:
            </label>
              <select
                id="versionSelect"
                className={styles.versionSelect}
                value={selectedVersion}
                onChange={(e) => {
                  setSelectedVersion(e.target.value);
                }}
                disabled={isLoading || isNotConfigured}
              >
                {versions.map((ver) => (
                  <option key={ver} value={ver}>
                    {ver.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </header>

          {/* Aviso de Configuração Ausente do Supabase */}
          {isNotConfigured && (
            <div className={styles.setupBanner} role="alert">
              <div className={styles.setupIconArea}>
                <Database size={24} className={styles.setupIcon} />
              </div>
              <div className={styles.setupContent}>
                <h2 className={styles.setupTitle}>Conexão com o Supabase pendente</h2>
                <p className={styles.setupText}>
                  O Miqra consome a Bíblia diretamente da tabela <code>capitulos_biblia</code> do seu Supabase.
                  Para ativar a leitura real, configure as seguintes variáveis no arquivo <code>.env</code> na raiz do projeto:
                </p>
                <div className={styles.envCodeBlock}>
                  <code>
                    VITE_SUPABASE_URL=https://seu-projeto.supabase.co<br />
                    VITE_SUPABASE_ANON_KEY=sua-chave-anonima
                  </code>
                </div>
                <button
                  type="button"
                  className={styles.retryBtn}
                  onClick={handleRetry}
                >
                  <RefreshCw size={14} />
                  <span>Testar conexão novamente</span>
                </button>
              </div>
            </div>
          )}

          {/* Mensagem de Erro de Conexão */}
          {errorMessage && !isNotConfigured && (
            <div className={styles.errorBanner} role="alert">
              <AlertTriangle size={18} />
              <span>{errorMessage}</span>
              <button
                type="button"
                className={styles.retryBtnInline}
                onClick={handleRetry}
              >
                Tentar novamente
              </button>
            </div>
          )}

        {/* Barra de Filtros e Busca */}
        <div className={styles.controlsBar}>
          {/* Campo de Busca */}
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Buscar livro... (ex: Gênesis, Romanos, João)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>

          {/* Filtros de Testamento */}
          <div className={styles.testamentTabs}>
            <button
              type="button"
              className={`${styles.tabBtn} ${testamentFilter === 'ALL' ? styles.tabActive : ''}`}
              onClick={() => {
                setTestamentFilter('ALL');
                setSelectedCategory('ALL');
              }}
            >
              Todos ({books.length})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${testamentFilter === 'OT' ? styles.tabActive : ''}`}
              onClick={() => {
                setTestamentFilter('OT');
                setSelectedCategory('ALL');
              }}
            >
              Antigo Testamento
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${testamentFilter === 'NT' ? styles.tabActive : ''}`}
              onClick={() => {
                setTestamentFilter('NT');
                setSelectedCategory('ALL');
              }}
            >
              Novo Testamento
            </button>
          </div>
        </div>

        {/* Filtros de Categoria (Pills) */}
        {availableCategories.length > 0 && (
          <div className={styles.categoryPills}>
            <span className={styles.categoryLabel}>
              <SlidersHorizontal size={12} />
              <span>Categorias:</span>
            </span>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedCategory === 'ALL' ? styles.pillActive : ''}`}
              onClick={() => setSelectedCategory('ALL')}
            >
              Todas
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.pillBtn} ${selectedCategory === cat ? styles.pillActive : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grade de Livros */}
        <div className={styles.booksSection}>
          {isLoading ? (
            <div className={styles.loadingGrid}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhum livro encontrado com os filtros selecionados.</p>
              {searchQuery && (
                <button
                  type="button"
                  className={styles.resetFiltersBtn}
                  onClick={() => {
                    setSearchQuery('');
                    setTestamentFilter('ALL');
                    setSelectedCategory('ALL');
                  }}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className={styles.booksGrid}>
              {filteredBooks.map((book) => (
                <Link
                  key={book.slug}
                  to={`/bible/${book.slug}`}
                  className={styles.bookCard}
                >
                  <div className={styles.bookCardTop}>
                    <span className={styles.bookAbbrev}>{book.abbrev}</span>
                    <span className={styles.bookCategory}>{book.category}</span>
                  </div>

                  <h3 className={styles.bookName}>{book.name}</h3>

                  <div className={styles.bookCardBottom}>
                    <span className={styles.chaptersCount}>
                      {book.chaptersCount} {book.chaptersCount === 1 ? 'capítulo' : 'capítulos'}
                    </span>
                    <span className={styles.cardArrow}>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BibleIndexPage;
