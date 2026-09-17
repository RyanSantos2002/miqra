import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...rest
}) => {
  return (
    <button
      className={`
        ${styles.button}
        ${styles[variant]}
        ${styles[size]}
        ${fullWidth ? styles.fullWidth : ''}
        ${isLoading ? styles.loading : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-label="Carregando..." />
      ) : (
        <>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          <span className={styles.content}>{children}</span>
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
