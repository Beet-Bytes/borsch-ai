import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Flame,
  ShoppingCart,
  BarChart2,
  User,
} from 'lucide-react';
import { Navbar } from '@/app/components/ui/Navbar/Navbar';
import { FoodDecor } from '@/app/components/ui/FoodDecor/FoodDecor';
import styles from './layout.module.css';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar
        logo={
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-50)' }}>
              <span style={{ color: 'var(--color-primary-500)' }}>AI</span>-Borsch
            </span>
          </Link>
        }
        actions={
          <>
            <Link href="/dashboard" className={styles.navLink}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link href="/ai-recipe" className={styles.navLink}>
              <Sparkles size={18} />
              AI Recipe
            </Link>
            <Link href="/recipes" className={styles.navLink}>
              <BookOpen size={18} />
              Recipes
            </Link>
            <Link href="/calories" className={styles.navLink}>
              <Flame size={18} />
              Calories
            </Link>
            <Link href="/shopping" className={styles.navLink}>
              <ShoppingCart size={18} />
              Shopping
            </Link>
            <Link href="/statistics" className={styles.navLink}>
              <BarChart2 size={18} />
              Statistics
            </Link>
            <Link href="/profile" className={styles.navLink}>
              <User size={18} />
              Profile
            </Link>
          </>
        }
      />
      <FoodDecor className={styles.page}>
        <main style={{ paddingTop: 64 }}>{children}</main>
      </FoodDecor>
    </>
  );
}
