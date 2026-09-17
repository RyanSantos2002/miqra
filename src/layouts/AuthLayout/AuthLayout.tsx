import React from 'react';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  quote?: {
    text: string;
    reference: string;
  };
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  quote = {
    text: '“Examinai as Escrituras... são elas que testificam do conhecimento eterno e das verdades antigas.”',
    reference: '— JOÃO 5:39',
  },
}) => {
  return (
    <main className={styles.authPage}>
      {/* Lado Esquerdo: Arte bíblica e identidade visual */}
      <section className={styles.authVisual} aria-label="Painel visual do Miqra">
        <div className={styles.visualOverlay} aria-hidden="true" />

        {/* Marca Miqra no topo esquerdo com logo oficial exato */}
        <div className={styles.brand}>
          <div className={styles.brandHeader}>
            <div className={styles.brandMark} aria-hidden="true">
              <img
                src="/assets/logo-icon-exact.png"
                alt="Logo Miqra"
                className={styles.brandLogoImg}
              />
            </div>
            <span className={styles.brandName}>Miqra</span>
          </div>
          <span className={styles.brandTagline}>Leia. Explore. Compreenda.</span>
        </div>

        {/* Citação bíblica na base esquerda */}
        <div className={styles.scriptureQuote}>
          <div className={styles.quoteLine} aria-hidden="true" />
          <div className={styles.quoteContent}>
            <p>{quote.text}</p>
            <span>{quote.reference}</span>
          </div>
        </div>
      </section>

      {/* Lado Direito: Card de Autenticação */}
      <section className={styles.authPanel} aria-label="Painel de acesso">
        {/* Ícone solar no canto superior direito */}
        <button className={styles.themeToggle} aria-label="Alternar tema" type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="4.5" />
            <path
              d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className={styles.authCard}>
          {/* Cantoneiras de manuscrito antigo em formato de amêndoa/laço idênticas à referência */}
          <div className={`${styles.corner} ${styles.cornerTopLeft}`} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <ellipse cx="8" cy="8" rx="4.5" ry="2.2" transform="rotate(-45 8 8)" stroke="#d4a85c" strokeWidth="1.2" strokeOpacity="0.85" />
            </svg>
          </div>
          <div className={`${styles.corner} ${styles.cornerTopRight}`} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <ellipse cx="8" cy="8" rx="4.5" ry="2.2" transform="rotate(-45 8 8)" stroke="#d4a85c" strokeWidth="1.2" strokeOpacity="0.85" />
            </svg>
          </div>
          <div className={`${styles.corner} ${styles.cornerBottomLeft}`} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <ellipse cx="8" cy="8" rx="4.5" ry="2.2" transform="rotate(-45 8 8)" stroke="#d4a85c" strokeWidth="1.2" strokeOpacity="0.85" />
            </svg>
          </div>
          <div className={`${styles.corner} ${styles.cornerBottomRight}`} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <ellipse cx="8" cy="8" rx="4.5" ry="2.2" transform="rotate(-45 8 8)" stroke="#d4a85c" strokeWidth="1.2" strokeOpacity="0.85" />
            </svg>
          </div>

          {children}
        </div>
      </section>
    </main>
  );
};
