import type { ReactNode } from 'react';
import Link from 'next/link';
import { Icon } from '@/app/components/ui/Icon/Icon';
import type { IconName } from '@/app/components/ui/Icon/icons';
import styles from './Navbar.module.css';

export interface NavItem {
  label: string;
  href: string;
  icon?: IconName;
}

interface NavbarProps {
  logo: ReactNode;
  navItems?: NavItem[];
  actions?: ReactNode;
}

export function Navbar({ logo, navItems, actions }: NavbarProps) {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <div className={styles.logo}>{logo}</div>

        {navItems && navItems.length > 0 && (
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={styles.navLink}>
                {item.icon && <Icon name={item.icon} size="sm" className={styles.navIcon} />}
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </header>
  );
}
