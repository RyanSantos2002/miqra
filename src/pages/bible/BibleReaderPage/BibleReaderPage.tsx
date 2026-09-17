import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  List,
  AlertTriangle,
  RefreshCw,
  PenTool,
} from 'lucide-react';
import { DashboardLayout } from '../../../layouts/DashboardLayout/DashboardLayout';
import { VerseExplorerDrawer } from '../../../components/study/VerseExplorer/VerseExplorerDrawer';
import { getChapter } from '../../../services/bible';
import { getNotesForChapter } from '../../../services/notes';
import { getHighlightsForChapter, getFavoritesForChapter } from '../../../services/study';
import { isSupabaseConfigured } from '../../../lib/supabase';
import type { BibleChapterData, NormalizedVerse } from '../../../types/bible';
import type { Note } from '../../../types/notes';
import type { HighlightColor } from '../../../types/study';
import styles from './BibleReaderPage.module.css';

export const BibleReaderPage: React.FC = () => {
  const { book: bookSlug, chapter: chapterParam } = useParams<{ book: string; chapter: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const chapterNumber = parseInt(chapterParam || '1', 10);
  const selectedVersion = 'nvi';

  const [chapterData, setChapterData] = useState<BibleChapterData | null>(null);
  const [chapterNotes, setChapterNotes] = useState<Record<number, Note>>({});
  const [chapterHighlights, setChapterHighlights] = useState<Record<number, HighlightColor>>({});
  const [chapterFavorites, setChapterFavorites] = useState<Record<number, boolean>>({});
  const [selectedVerse, setSelectedVerse] = useState<NormalizedVerse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!bookSlug || isNaN(chapterNumber)) return;

      if (!isSupabaseConfigured()) {
        if (isMounted) {
          setErrorMessage('As variáveis de ambiente do Supabase não estão configuradas.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const [data, notesMap, highlightsMap, favoritesMap] = await Promise.all([
          getChapter(bookSlug, chapterNumber, selectedVersion),
          getNotesForChapter(bookSlug, chapterNumber),
          getHighlightsForChapter(bookSlug, chapterNumber),
          getFavoritesForChapter(bookSlug, chapterNumber),
        ]);

        if (!isMounted) return;
        setChapterData(data);
        setChapterNotes(notesMap);
        setChapterHighlights(highlightsMap);

        const favsBoolMap: Record<number, boolean> = {};
        for (const vStr of Object.keys(favoritesMap)) {
          favsBoolMap[Number(vStr)] = true;
        }
        setChapterFavorites(favsBoolMap);
        setSelectedVerse(null);

        // Se houver âncora de versículo no URL (ex: #v1 ou #verse-1)
        if (location.hash) {
          setTimeout(() => {
            const cleanId = location.hash.replace('#', '');
            const targetEl = document.getElementById(cleanId);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 200);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        console.error(`[Miqra] Erro ao carregar capítulo ${bookSlug} ${chapterNumber}:`, err);
        setErrorMessage(
          `Não foi possível carregar o capítulo ${chapterNumber} de ${bookSlug} a partir do Supabase.`
        );
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
  }, [bookSlug, chapterNumber, selectedVersion, location.hash]);

  const handleRetry = () => {
    if (!bookSlug || isNaN(chapterNumber)) return;
    setIsLoading(true);
    setErrorMessage(null);
    Promise.all([
      getChapter(bookSlug, chapterNumber, selectedVersion),
      getNotesForChapter(bookSlug, chapterNumber),
      getHighlightsForChapter(bookSlug, chapterNumber),
      getFavoritesForChapter(bookSlug, chapterNumber),
    ])
      .then(([data, notesMap, highlightsMap, favoritesMap]) => {
        setChapterData(data);
        setChapterNotes(notesMap);
        setChapterHighlights(highlightsMap);

        const favsBoolMap: Record<number, boolean> = {};
        for (const vStr of Object.keys(favoritesMap)) {
          favsBoolMap[Number(vStr)] = true;
        }
        setChapterFavorites(favsBoolMap);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(`Não foi possível carregar o capítulo ${chapterNumber} de ${bookSlug}.`);
      })
      .finally(() => setIsLoading(false));
  };

  const handleNoteChange = (verseNum: number, updatedNote: Note | null) => {
    setChapterNotes((prev) => {
      const next = { ...prev };
      if (updatedNote) {
        next[verseNum] = updatedNote;
      } else {
        delete next[verseNum];
      }
      return next;
    });
  };

  const handleStudyChange = (
    verseNum: number,
    data: { isFavorited?: boolean; highlight?: HighlightColor | null }
  ) => {
    if (data.isFavorited !== undefined) {
      setChapterFavorites((prev) => ({
        ...prev,
        [verseNum]: data.isFavorited!,
      }));
    }
    if (data.highlight !== undefined) {
      setChapterHighlights((prev) => {
        const next = { ...prev };
        if (data.highlight) {
          next[verseNum] = data.highlight;
        } else {
          delete next[verseNum];
        }
        return next;
      });
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.readerPageContainer}>
        {/* Barra Superior do Leitor */}
        <nav className={styles.readerNavHeader} aria-label="Navegação do leitor">
          <Link to={`/bible/${bookSlug}`} className={styles.navBackBtn}>
            <ArrowLeft size={16} />
            <span>Voltar para {chapterData?.bookName || bookSlug}</span>
          </Link>

          <div className={styles.navCenterInfo}>
            <span className={styles.navBookChapter}>
              {chapterData?.bookName || bookSlug} {chapterNumber}
            </span>
            <span className={styles.navVersionBadge}>{selectedVersion.toUpperCase()}</span>
          </div>

          <Link to={`/bible/${bookSlug}`} className={styles.navChaptersListBtn} title="Ver todos os capítulos">
            <List size={15} />
            <span>Capítulos</span>
          </Link>
        </nav>

        {/* Estados de Carregamento e Erro */}
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonSubtitle} />
            <div className={styles.skeletonDivider} />
            <div className={styles.skeletonVerses}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className={styles.skeletonVerseLine} />
              ))}
            </div>
          </div>
        ) : errorMessage || !chapterData ? (
          <div className={styles.errorContainer} role="alert">
            <AlertTriangle size={24} className={styles.errorIcon} />
            <h2 className={styles.errorTitle}>Capítulo não encontrado</h2>
            <p className={styles.errorText}>
              {errorMessage || 'Não encontramos os versículos deste capítulo no banco de dados.'}
            </p>
            <div className={styles.errorActions}>
              <Link to={`/bible/${bookSlug}`} className={styles.btnSecondary}>
                Voltar aos capítulos
              </Link>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={handleRetry}
              >
                <RefreshCw size={14} />
                <span>Tentar novamente</span>
              </button>
            </div>
          </div>
        ) : (
          /* Área de Leitura Principal */
          <article className={styles.scriptureManuscript}>
            {/* Cabeçalho do Texto */}
            <header className={styles.scriptureHeader}>
              <div className={styles.ornamentLine} aria-hidden="true" />
              <span className={styles.scriptureBookName}>{chapterData.bookName.toUpperCase()}</span>
              <h1 className={styles.scriptureChapterTitle}>Capítulo {chapterData.chapter}</h1>
              <span className={styles.scriptureVersionName}>Nova Versão Internacional • NVI</span>
              <div className={styles.scriptureDivider} aria-hidden="true" />
            </header>

            {/* Versículos do Capítulo */}
            <section className={styles.versesContainer} aria-label="Versículos do capítulo">
              {chapterData.verses.length === 0 ? (
                <p className={styles.emptyVersesMessage}>
                  Nenhum versículo registrado para este capítulo no banco.
                </p>
              ) : (
                chapterData.verses.map((verse) => {
                  const hasNote = Boolean(chapterNotes[verse.number]);
                  const isFavorited = Boolean(chapterFavorites[verse.number]);
                  const highlight = chapterHighlights[verse.number];
                  const isSelected = selectedVerse?.number === verse.number;

                  const highlightClass = highlight === 'gold'
                    ? styles.highlightGold
                    : highlight === 'green'
                    ? styles.highlightGreen
                    : highlight === 'bronze'
                    ? styles.highlightBronze
                    : highlight === 'red'
                    ? styles.highlightRed
                    : '';

                  return (
                    <p
                      key={verse.number}
                      className={`${styles.verseParagraph} ${isSelected ? styles.verseSelected : ''} ${hasNote ? styles.verseHasNote : ''} ${highlightClass}`}
                      id={`v${verse.number}`}
                      onClick={() => setSelectedVerse(verse)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedVerse(verse);
                        }
                      }}
                      title={`Clique para explorar o versículo ${verse.number}${hasNote ? ' (Possui anotação)' : ''}${isFavorited ? ' (Favoritado)' : ''}`}
                    >
                      <sup className={styles.verseNumber}>
                        {isFavorited && (
                          <span className={styles.verseFavoriteIndicator} title="Versículo favoritado">
                            ★
                          </span>
                        )}
                        {verse.number}
                        {hasNote && (
                          <span className={styles.verseNoteIndicator} title="Possui anotação pessoal">
                            <PenTool size={9} />
                          </span>
                        )}
                      </sup>
                      <span className={styles.verseText}>{verse.text}</span>
                    </p>
                  );
                })
              )}
            </section>

            {/* Rodapé de Navegação entre Capítulos */}
            <footer className={styles.readerFooter}>
              <div className={styles.footerNavigation}>
                {chapterData.previousChapter !== null ? (
                  <button
                    type="button"
                    className={styles.footerNavBtn}
                    onClick={() => navigate(`/bible/${bookSlug}/${chapterData.previousChapter}`)}
                  >
                    <ChevronLeft size={16} />
                    <span>Capítulo {chapterData.previousChapter}</span>
                  </button>
                ) : (
                  <div className={styles.navPlaceholder} />
                )}

                <Link to={`/bible/${bookSlug}`} className={styles.footerChaptersBtn}>
                  <BookOpen size={15} />
                  <span>Todos os Capítulos</span>
                </Link>

                {chapterData.nextChapter !== null ? (
                  <button
                    type="button"
                    className={styles.footerNavBtn}
                    onClick={() => navigate(`/bible/${bookSlug}/${chapterData.nextChapter}`)}
                  >
                    <span>Capítulo {chapterData.nextChapter}</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <div className={styles.navPlaceholder} />
                )}
              </div>
            </footer>
          </article>
        )}

        {/* Painel Drawer de Exploração do Versículo */}
        {selectedVerse && chapterData && (
          <VerseExplorerDrawer
            key={`${bookSlug}-${chapterData.chapter}-${selectedVerse.number}`}
            isOpen={Boolean(selectedVerse)}
            bookSlug={bookSlug || ''}
            bookName={chapterData.bookName}
            chapter={chapterData.chapter}
            verseNumber={selectedVerse.number}
            verseText={selectedVerse.text}
            initialFavorited={Boolean(chapterFavorites[selectedVerse.number])}
            initialHighlight={chapterHighlights[selectedVerse.number] || null}
            onClose={() => setSelectedVerse(null)}
            onNoteChange={handleNoteChange}
            onStudyChange={handleStudyChange}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default BibleReaderPage;
