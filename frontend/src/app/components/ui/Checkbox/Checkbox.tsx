import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, disabled, className, id, ...props }, ref) => {
    return (
      <div className={styles.wrapper}>
        <label
          className={[styles.row, disabled ? styles.disabled : '', className ?? '']
            .filter(Boolean)
            .join(' ')}
        >
          <input
            ref={ref}
            type="checkbox"
            id={id}
            disabled={disabled}
            className={styles.input}
            {...props}
          />
          <span className={[styles.box, error ? styles.boxError : ''].filter(Boolean).join(' ')}>
            <svg className={styles.checkmark} viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {label && <span className={styles.label}>{label}</span>}
        </label>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
