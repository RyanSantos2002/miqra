import React from 'react';
import { Sparkles, ArrowRight, Languages } from 'lucide-react';
import type { VerseHighlightData } from '../../../types/home';
import styles from './VerseHighlight.module.css';

interface VerseHighlightProps {
  data: VerseHighlightData;
}

export const VerseHighlight: React.FC<VerseHighlightProps> = ({ data }) => {
  return (
    <div className={styles.container} aria-label="Versículo para explorar">
      {/* Cantoneiras de iluminação em manuscrito */}
      <div className={`${styles.corner} ${styles.cornerTopLeft}`} aria-hidden="true" />
      <div className={`${styles.corner} ${styles.cornerBottomRight}`} aria-hidden="true" />

      <div className={styles.header}>
        <div className={styles.labelWrapper}>
          <Sparkles size={12} className={styles.sparkleIcon} />
          <span className={styles.label}>VERSÍCULO PARA EXPLORAR</span>
        </div>
        <span className={styles.reference}>{data.reference}</span>
      </div>

      <blockquote className={styles.quoteBody}>
        <p className={styles.verseText}>{data.verseText}</p>
      </blockquote>

      {/* Nota sobre o termo no idioma original (Grego/Hebraico) */}
      <div className={styles.linguisticNote}>
        <div className={styles.termBadge}>
          <Languages size={13} />
          <span className={styles.greekTerm}>{data.originalLanguageNote.term}</span>
          <span className={styles.transliteration}>({data.originalLanguageNote.transliteration})</span>
        </div>
        <p className={styles.meaningText}>{data.originalLanguageNote.meaning}</p>
      </div>

      <div className={styles.footer}>
        <a href="#interlinear" className={styles.exploreOriginalLink}>
          <span>Análise interlinear e referências cruzadas</span>
          <ArrowRight size={13} className={styles.arrowIcon} />
        </a>
      </div>
    </div>
  );
};
