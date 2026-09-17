import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className = '', checked, ...rest }, ref) => {
    const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`${styles.container} ${className}`}>
        <label htmlFor={inputId} className={styles.labelWrapper}>
          <div className={styles.checkboxBox}>
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              className={styles.hiddenInput}
              checked={checked}
              {...rest}
            />
            <div className={`${styles.customCheck} ${checked ? styles.checked : ''}`}>
              <Check size={13} strokeWidth={3} className={styles.checkIcon} />
            </div>
          </div>
          <span className={styles.labelText}>{label}</span>
        </label>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
