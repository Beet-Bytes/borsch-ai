import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'diet' | 'ai' | 'info' | 'status' | 'meal';

export type BadgeSize = 'default' | 'small';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant: diet (dietary tags), ai (AI labels), info (metadata), status (progress), meal (category) */
  variant?: BadgeVariant;
  /** Badge size */
  size?: BadgeSize;
  children: ReactNode;
}

export function Badge({
  variant = 'meal',
  size = 'default',
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[styles.badge, styles[variant], styles[size], className ?? '']
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </span>
  );
}
