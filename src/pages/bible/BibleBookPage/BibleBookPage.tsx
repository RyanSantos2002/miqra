import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { DashboardLayout } from '../../../layouts/DashboardLayout/DashboardLayout';
import { getBookDetails } from '../../../services/bible';
import { isSupabaseConfigured } from '../../../lib/supabase';
import type { BibleBookSummary } from '../../../types/bible';
import styles from './BibleBookPage.module.css';

export const BibleBookPage: React.FC = () => {
  const { book: bookSlug } = useParams<{ book: string }>();
  const navigate = useNavigate();

  const [bookData, setBookData] = useState<BibleBookSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const selectedVersion = 'nvi';

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!bookSlug) return;

      if (!isSupabaseConfigured()) {
        if (isMounted) {
          setErrorMessage('As variáveis de ambiente do Supabase não estão configuradas.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const summary = await getBookDetails(bookSlug, selectedVersion);
        if (!isMounted) return;

        if (!summary) {
          setErrorMessage(`Livro "${bookSlug}" não encontrado no banco de dados.`);
        } else {
          setBookData(summary);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('[Miqra] Erro ao buscar dados do livro:', err);
        setErrorMessage('Falha ao conectar com o Supabase para carregar os capítulos deste livro.');
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
  }, [bookSlug, selectedVersion]);

  const handleRetry = () => {
    if (!bookSlug) return;
    setIsLoading(true);
    setErrorMessage(null);
    getBookDetails(bookSlug, selectedVersion)
      .then((summary) => {
        if (!summary) {
          setErrorMessage(`Livro "${bookSlug}" não encontrado no banco de dados.`);
        } else {
          setBookData(summary);
        }
      })
      .catch(() => setErrorMessage('Falha ao conectar com o Supabase.'))
      .finally(() => setIsLoading(false));
  };

  return (
    <DashboardLayout>
      <div className={styles.pageContainer}>
        {/* Breadcrumb de Navegação */}
        <nav className={styles.breadcrumbNav} aria-label="Navegação hierárquica">
          <Link to="/bible" className={styles.backLink}>
            <ChevronLeft size={16} />
            <span>Todas as Escrituras</span>
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>
            {bookData?.name || bookSlug}
          </span>
        </nav>

        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.skeletonHeader} />
            <div className={styles.skeletonChaptersGrid}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className={styles.skeletonChapterTile} />
              ))}
            </div>
          </div>
        ) : errorMessage || !bookData ? (
          <div className={styles.errorCard} role="alert">
            <AlertTriangle size={24} className={styles.errorIcon} />
            <h2 className={styles.errorTitle}>Livro não encontrado</h2>
            <p className={styles.errorText}>
              {errorMessage || 'Não foi possível encontrar este livro na base de dados.'}
            </p>
            <div className={styles.errorActions}>
              <Link to="/bible" className={styles.backToBibleBtn}>
                Voltar à lista de livros
              </Link>
              <button
                type="button"
                className={styles.retryBtn}
                onClick={handleRetry}
              >
                <RefreshCw size={14} />
                <span>Tentar novamente</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Cabeçalho do Livro */}
            <header className={styles.bookHeaderCard}>
              <div className={styles.headerTop}>
                <div className={styles.badgesGroup}>
                  <span className={styles.testamentBadge}>
                    {bookData.testament === 'OT' ? 'Antigo Testamento' : 'Novo Testamento'}
                  </span>
                  <span className={styles.categoryBadge}>{bookData.category}</span>
                  <span className={styles.versionBadge}>{selectedVersion.toUpperCase()}</span>
                </div>

                <span className={styles.totalBadge}>
                  {bookData.chaptersCount} {bookData.chaptersCount === 1 ? 'capítulo' : 'capítulos'}
                </span>
              </div>

              <div className={styles.headerMain}>
                <h1 className={styles.bookTitle}>{bookData.name}</h1>
                <p className={styles.bookSubtitle}>
                  Selecione um capítulo abaixo para abrir o leitor do texto sagrado.
                </p>
              </div>

              {bookData.availableChapters.length > 0 && (
                <div className={styles.headerCta}>
                  <button
                    type="button"
                    className={styles.startReadingBtn}
                    onClick={() => navigate(`/bible/${bookData.slug}/${bookData.availableChapters[0]}`)}
                  >
                    <BookOpen size={16} />
                    <span>Começar do Capítulo {bookData.availableChapters[0]}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </header>

            {/* Seletor de Capítulos */}
            <section className={styles.chaptersSection} aria-label="Capítulos disponíveis">
              <div className={styles.sectionHeading}>
                <h2 className={styles.sectionTitle}>Capítulos</h2>
                <span className={styles.sectionCount}>
                  Total de {bookData.chaptersCount} capítulos disponíveis
                </span>
              </div>

              <div className={styles.chaptersGrid}>
                {bookData.availableChapters.map((chapterNum) => (
                  <Link
                    key={chapterNum}
                    to={`/bible/${bookData.slug}/${chapterNum}`}
                    className={styles.chapterTile}
                    aria-label={`${bookData.name} capítulo ${chapterNum}`}
                  >
                    <span className={styles.chapterNumber}>{chapterNum}</span>
                    <span className={styles.chapterLabel}>Capítulo</span>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BibleBookPage;
