'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/app/components/ui/Navbar/Navbar';
import { GradientOrbs } from '@/app/components/ui/GradientOrbs/GradientOrbs';
import CurvedLoop from '@/app/components/ui/CurvedLoop/CurvedLoop';
import styles from './layout.module.css';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navActions =
    pathname === '/confirm' ? null : pathname === '/login' ? (
      <Link href="/register" className={styles.navLink}>
        No account? <span className={styles.navLinkAccent}>Sign up</span>
      </Link>
    ) : (
      <Link href="/login" className={styles.navLink}>
        Have an account? <span className={styles.navLinkAccent}>Sign in</span>
      </Link>
    );

  return (
    <>
      <Navbar
        logo={
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-50)' }}>
            <Link href="/">
              <span style={{ color: 'var(--color-primary-500)' }}>AI</span>-Borsch
            </Link>
          </span>
        }
        actions={navActions}
      />
      <GradientOrbs />
      <div className={styles.curvedLoopTop}>
        <CurvedLoop
          marqueeText="AI-Borsch ✦ Smart Recipes ✦ Cook Smarter ✦ Less Waste ✦"
          speed={1}
          curveAmount={400}
          direction="right"
          interactive={false}
        />
      </div>
      <div className={styles.curvedLoopBottom}>
        <CurvedLoop
          marqueeText="AI-Borsch ✦ Smart Recipes ✦ Cook Smarter ✦ Less Waste ✦"
          speed={1}
          curveAmount={-400}
          direction="left"
          interactive={false}
        />
      </div>
      <main className={styles.main}>{children}</main>
    </>
  );
}
