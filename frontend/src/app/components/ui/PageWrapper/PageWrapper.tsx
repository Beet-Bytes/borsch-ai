import type { ReactNode } from 'react';
import styles from './PageWrapper.module.css';

interface PageWrapperProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export function PageWrapper({
  title,
  subtitle,
  children,
  className,
  fullHeight,
}: PageWrapperProps) {
  return (
    <div
      className={[styles.wrapper, fullHeight ? styles.fullHeight : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
