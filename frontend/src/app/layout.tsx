import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/app/components/ui/Navbar/Navbar';
import { Button } from '@/app/components/ui/Button/Button';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Borsch AI',
  description: 'AI-powered recipe assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
        <Navbar
          logo={
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-50)' }}>
              Borsch<span style={{ color: 'var(--color-primary-500)' }}>AI</span>
            </span>
          }
          navItems={[
            { label: 'Рецепти', href: '/recipes' },
            { label: 'Пошук', href: '/search' },
            { label: 'Про нас', href: '/about' },
          ]}
          actions={
            <>
              <Button variant="ghost" size="sm">
                Увійти
              </Button>
              <Button variant="primary" size="sm">
                Реєстрація
              </Button>
            </>
          }
        />
        <main style={{ paddingTop: 64 }}>{children}</main>
      </body>
    </html>
  );
}
