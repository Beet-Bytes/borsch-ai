import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Icon } from '@/app/components/ui/Icon/Icon';
import type { IconName } from '@/app/components/ui/Icon/icons';
import styles from './Button.module.css';

import type { IconSize } from '@/app/components/ui/Icon/Icon';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const iconSizeMap: Record<ButtonSize, IconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'sm',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={[
          styles.button,
          styles[variant],
          styles[size],
          fullWidth ? styles.fullWidth : '',
          loading ? styles.loading : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        {!loading && icon && iconPosition === 'left' && (
          <Icon name={icon} size={iconSizeMap[size]} />
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <Icon name={icon} size={iconSizeMap[size]} />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
