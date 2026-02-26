import type { ReactNode } from 'react';
import Link from 'next/link';
import { Navbar } from '@/app/components/ui/Navbar/Navbar';
import { Button } from '@/app/components/ui/Button/Button';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar
        logo={
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-50)' }}>
            <span style={{ color: 'var(--color-primary-500)' }}>AI</span>-Borsch
          </span>
        }
        actions={
          <Link href="/login">
            <Button variant="secondary" size="md">
              Login
            </Button>
          </Link>
        }
      />
      <main style={{ paddingTop: 64 }}>{children}</main>
    </>
  );
}
