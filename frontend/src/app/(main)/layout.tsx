import type { ReactNode } from 'react';
import Link from 'next/link';
import { Navbar } from '@/app/components/ui/Navbar/Navbar';
import { Button } from '@/app/components/ui/Button/Button';
import Logo from '@/app/assets/icons/Logo32X32.svg';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar
        logo={
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Logo aria-hidden="true" />
            <span>
              <span style={{ color: 'var(--color-primary-500)' }}>AI</span>-Borsch
            </span>
          </Link>
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
