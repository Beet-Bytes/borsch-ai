import type { ReactNode } from 'react';
import Link from 'next/link';
import { Navbar } from '@/app/components/ui/Navbar/Navbar';
import styles from './layout.module.css';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar
        logo={
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-50)' }}>
              <span style={{ color: 'var(--color-primary-500)' }}>AI</span>-Borsch
            </span>
          </Link>
        }
      />
      <main className={styles.main}>{children}</main>
    </>
  );
}
