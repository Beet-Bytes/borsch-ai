import { forwardRef, type InputHTMLAttributes } from 'react';
import { Icon } from '@/app/components/ui/Icon/Icon';
import type { IconName } from '@/app/components/ui/Icon/icons';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, disabled, className, ...props }, ref) => {
    return (
      <div className={styles.wrapper}>
        {label && (
          <label
            className={[
              styles.label,
              error ? styles.labelError : '',
              disabled ? styles.labelDisabled : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {label}
          </label>
        )}
        <div
          className={[
            styles.inputWrapper,
            error ? styles.error : '',
            disabled ? styles.disabled : '',
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {leftIcon && <Icon name={leftIcon} size="sm" className={styles.icon} />}
          <input ref={ref} disabled={disabled} className={styles.input} {...props} />
          {rightIcon && <Icon name={rightIcon} size="sm" className={styles.icon} />}
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
