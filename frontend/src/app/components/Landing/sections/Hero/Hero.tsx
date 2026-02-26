import Link from 'next/link';
import { Button } from '@/app/components/ui/Button/Button';
import { CountUp } from '@/app/components/ui/CountUp/CountUp';
import { Icon } from '@/app/components/ui/Icon/Icon';
import { stats } from '../../Landing.data';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        // TODO Implement toast component instead of hard-coded div
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
          <Link href="/register">
            <Button variant="primary" size="lg" icon="arrow-right" iconPosition="right">
              Try for free
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="lg">
              Sign in
            </Button>
          </Link>
        </div>
        <div className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <span className={styles.statValue}>
                <CountUp from={0} to={stat.to} duration={3} />
                {stat.suffix}
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
