import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, type = 'text', id, className = '', ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={`${styles.container} ${className}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''}`}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}

          <input
            ref={ref}
            id={inputId}
            type={computedType}
            className={`
              ${styles.input}
              ${leftIcon ? styles.withLeftIcon : ''}
              ${isPassword ? styles.withRightIcon : ''}
            `}
            {...rest}
          />

          {isPassword && (
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error ? (
          <div className={styles.errorText} role="alert">
            <AlertCircle size={14} className={styles.errorIcon} />
            <span>{error}</span>
          </div>
        ) : hint ? (
          <span className={styles.hintText}>{hint}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
