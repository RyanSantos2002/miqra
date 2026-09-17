import React from 'react';
import { ArrowRight, Clock, BookOpen, Sparkles } from 'lucide-react';
import type { ContinueStudyData } from '../../../types/home';
import styles from './ContinueStudyCard.module.css';

interface ContinueStudyCardProps {
  data: ContinueStudyData;
  onContinue?: () => void;
}

export const ContinueStudyCard: React.FC<ContinueStudyCardProps> = ({ data, onContinue }) => {
  return (
    <section className={styles.cardContainer} aria-label="Continuar estudo anterior">
      {/* Cantoneiras ornamentais de manuscrito */}
      <div className={`${styles.corner} ${styles.cornerTopLeft}`} aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <ellipse cx="8" cy="8" rx="4.5" ry="2.2" transform="rotate(-45 8 8)" stroke="#d4a85c" strokeWidth="1.2" strokeOpacity="0.8" />
        </svg>
      </div>
      <div className={`${styles.corner} ${styles.cornerTopRight}`} aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <ellipse cx="8" cy="8" rx="4.5" ry="2.2" transform="rotate(-45 8 8)" stroke="#d4a85c" strokeWidth="1.2" strokeOpacity="0.8" />
        </svg>
      </div>
      <div className={`${styles.corner} ${styles.cornerBottomLeft}`} aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <ellipse cx="8" cy="8" rx="4.5" ry="2.2" transform="rotate(-45 8 8)" stroke="#d4a85c" strokeWidth="1.2" strokeOpacity="0.8" />
        </svg>
      </div>
      <div className={`${styles.corner} ${styles.cornerBottomRight}`} aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <ellipse cx="8" cy="8" rx="4.5" ry="2.2" transform="rotate(-45 8 8)" stroke="#d4a85c" strokeWidth="1.2" strokeOpacity="0.8" />
        </svg>
      </div>

      <div className={styles.cardContent}>
        {/* Cabeçalho do Card */}
        <div className={styles.headerRow}>
          <div className={styles.sectionBadge}>
            <Sparkles size={13} className={styles.badgeIcon} />
            <span>CONTINUE DE ONDE PAROU</span>
          </div>

          <div className={styles.lastReadInfo}>
            <Clock size={13} />
            <span>Última leitura {data.lastRead}</span>
          </div>
        </div>

        {/* Título & Referência Bíblica */}
        <div className={styles.bookDetails}>
          <span className={styles.bookCategory}>{data.book.toUpperCase()}</span>
          <h2 className={styles.chapterTitle}>
            {data.book.split(' ')[2] || 'João'} {data.chapter}
          </h2>
        </div>

        {/* Citação Bíblica em Itálico Nobre */}
        <blockquote className={styles.verseQuote}>
          <div className={styles.quoteBar} aria-hidden="true" />
          <p>{data.verseSnippet}</p>
        </blockquote>

        {/* Barra de Progresso & Ação */}
        <div className={styles.footerRow}>
          <div className={styles.progressContainer}>
            <div className={styles.progressLabels}>
              <span className={styles.progressChapter}>
                Capítulo {data.chapter} de {data.totalChapters}
              </span>
              <span className={styles.progressPercentage}>{data.progressPercent}% concluído</span>
            </div>
            <div
              className={styles.progressBarTrack}
              role="progressbar"
              aria-valuenow={data.progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={styles.progressBarFill}
                style={{ width: `${data.progressPercent}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            className={styles.continueBtn}
            onClick={onContinue}
          >
            <BookOpen size={16} strokeWidth={1.8} />
            <span>Continuar estudo</span>
            <ArrowRight size={15} className={styles.btnArrow} />
          </button>
        </div>
      </div>
    </section>
  );
};
