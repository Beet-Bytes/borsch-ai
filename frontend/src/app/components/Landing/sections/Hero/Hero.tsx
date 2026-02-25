import Link from 'next/link';
import { Button } from '@/app/components/ui/Button/Button';
import { Icon } from '@/app/components/ui/Icon/Icon';
import { stats } from '../../Landing.data';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.badge}>
          <Icon name="ai" size="sm" />
          AI-Powered Recipe Assistant
        </div>

        <h1 className={styles.heroTitle}>
          Cook smarter.
          <br />
          <span className={styles.heroAccent}>Waste less.</span>
        </h1>

        <p className={styles.heroSubtitle}>
          Turn whatever&apos;s left in your fridge into delicious meals. Track calories, save money,
          and reduce food waste — all in one place.
        </p>

        <div className={styles.heroActions}>
          <Link href="/recipes">
            <Button variant="primary" size="lg" icon="arrow-right" iconPosition="right">
              Try for free
            </Button>
          </Link>
          <Button variant="ghost" size="lg">
            Sign in
          </Button>
        </div>

        <div className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
