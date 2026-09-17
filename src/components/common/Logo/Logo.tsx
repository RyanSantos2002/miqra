import React from 'react';
import styles from './Logo.module.css';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  showText?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  showText = true,
  orientation = 'horizontal',
  className = '',
}) => {
  return (
    <div className={`${styles.logoContainer} ${styles[size]} ${styles[orientation]} ${className}`}>
      {/* Símbolo Vetorial: Códex Aberto & Geometria Manuscrita 'M' */}
      <div className={styles.iconWrapper} aria-hidden="true">
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svgIcon}
        >
          {/* Círculo sutil de fundo com halo */}
          <circle cx="22" cy="22" r="21" className={styles.haloCircle} />
          
          {/* Páginas do códex formando o 'M' */}
          <path
            d="M10 32V14.5C10 13.5 11.2 13 12.2 13.5L22 19L31.8 13.5C32.8 13 34 13.5 34 14.5V32"
            stroke="url(#goldGradient)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Coluna central do códex */}
          <path
            d="M22 19V35"
            stroke="#E4C47A"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Nervuras inferiores do livro antigo */}
          <path
            d="M13 29L22 33.5L31 29"
            stroke="#967342"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Ponto superior de iluminação do conhecimento */}
          <circle cx="22" cy="10" r="1.5" fill="#E4C47A" />

          {/* Definições de Gradiente Dourado Antigo */}
          <defs>
            <linearGradient id="goldGradient" x1="10" y1="13" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E4C47A" />
              <stop offset="0.5" stopColor="#D4A85C" />
              <stop offset="1" stopColor="#967342" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Identidade Tipográfica */}
      {showText && (
        <div className={styles.textWrapper}>
          <span className={styles.brandName}>MIQRA</span>
          {showTagline && (
            <span className={styles.tagline}>Leia. Explore. Compreenda.</span>
          )}
        </div>
      )}
    </div>
  );
};
