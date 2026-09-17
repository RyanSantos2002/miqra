import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen, ArrowUpRight, AlertCircle, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '../../../layouts/DashboardLayout/DashboardLayout';
import { getAllFavorites, removeFavorite } from '../../../services/study';
import { getBookMetadata } from '../../../constants/bibleMetadata';
import type { FavoriteItem } from '../../../types/study';
import styles from './FavoritesPage.module.css';

export const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadFavorites = () => {
    setIsLoading(true);
    setErrorMessage(null);

    getAllFavorites()
      .then((items) => {
        setFavorites(items);
      })
      .catch((err) => {
        console.error('[Miqra Favorites] Erro ao carregar favoritos:', err);
        setErrorMessage('Não foi possível carregar seus versículos favoritos.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;

    getAllFavorites()
      .then((items) => {
        if (!isMounted) return;
        setFavorites(items);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('[Miqra Favorites] Erro ao carregar favoritos:', err);
        setErrorMessage('Não foi possível carregar seus versículos favoritos.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRemove = async (id: string) => {
    // Atualização otimista
    const previous = [...favorites];
    setFavorites((prev) => prev.filter((f) => f.id !== id));

    try {
      await removeFavorite(id);
    } catch (err) {
      console.error('[Miqra Favorites] Erro ao remover favorito:', err);
      // Reverter se der erro
      setFavorites(previous);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.pageContainer}>
        {/* Cabeçalho da Página */}
        <header className={styles.pageHeader}>
          <div className={styles.headerInfo}>
            <h1>
              <Star size={26} fill="#e4c47a" className={styles.headerStarIcon} />
              <span>Meus Favoritos</span>
            </h1>
            <p>Versículos sagrados e passagens guardadas em sua coleção pessoal de estudos.</p>
          </div>

          {!isLoading && favorites.length > 0 && (
            <div className={styles.counterBadge}>
              <span>{favorites.length} {favorites.length === 1 ? 'versículo' : 'versículos'}</span>
            </div>
          )}
        </header>

        {/* Estado de Carregamento */}
        {isLoading ? (
          <div className={styles.loadingContainer}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        ) : errorMessage ? (
          /* Estado de Erro */
          <div className={styles.errorBox} role="alert">
            <AlertCircle size={28} color="#e06255" />
            <h2 className={styles.errorTitle}>Falha ao carregar favoritos</h2>
            <p className={styles.errorText}>{errorMessage}</p>
            <button type="button" className={styles.btnRetry} onClick={loadFavorites}>
              <RefreshCw size={13} style={{ marginRight: '6px' }} />
              Tentar novamente
            </button>
          </div>
        ) : favorites.length === 0 ? (
          /* Estado Vazio */
          <div className={styles.emptyState}>
            <Star size={42} className={styles.emptyIcon} strokeWidth={1.5} />
            <h2 className={styles.emptyTitle}>Nenhum versículo favoritado ainda</h2>
            <p className={styles.emptyDescription}>
              Durante sua leitura nas Escrituras, clique sobre qualquer versículo e selecione a estrela para guardá-lo aqui em sua coleção sagrada.
            </p>
            <Link to="/bible" className={styles.btnExploreBible}>
              <BookOpen size={16} />
              <span>Explorar a Bíblia</span>
            </Link>
          </div>
        ) : (
          /* Lista de Versículos Favoritos */
          <div className={styles.favoritesList}>
            {favorites.map((fav) => {
              const bookMeta = getBookMetadata(fav.book);
              const referenceText = `${bookMeta.name} ${fav.chapter}:${fav.verse}`;
              const readerUrl = `/bible/${fav.book}/${fav.chapter}#v${fav.verse}`;

              return (
                <article key={fav.id} className={styles.favoriteCard}>
                  <div className={styles.cardTopRow}>
                    <div className={styles.referenceBadgeGroup}>
                      <h2 className={styles.referenceTitle}>{referenceText}</h2>
                      <span className={styles.versionPill}>NVI</span>
                    </div>

                    <button
                      type="button"
                      className={styles.btnRemoveFavorite}
                      onClick={() => handleRemove(fav.id)}
                      title="Remover dos favoritos"
                      aria-label={`Remover ${referenceText} dos favoritos`}
                    >
                      <Star size={16} fill="#e4c47a" />
                    </button>
                  </div>

                  {fav.verseText && (
                    <blockquote className={styles.verseQuoteText}>
                      “{fav.verseText}”
                    </blockquote>
                  )}

                  <div className={styles.cardBottomRow}>
                    <span className={styles.savedDate}>
                      Guardado em {formatDate(fav.createdAt)}
                    </span>

                    <Link to={readerUrl} className={styles.btnOpenReader}>
                      <span>Abrir no Leitor</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FavoritesPage;
