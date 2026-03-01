import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, icon, children, className }: CardProps) {
  return (
    <div className={[styles.card, className ?? ''].filter(Boolean).join(' ')}>
      {(title || icon) && (
        <div className={styles.header}>
          {icon}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
