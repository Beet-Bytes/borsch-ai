import Link from 'next/link';
import { Button } from '@/app/components/ui/Button/Button';
import { Icon } from '@/app/components/ui/Icon/Icon';
import { SpotlightCard } from '@/app/components/ui/SpotlightCard/SpotlightCard';
import { features } from '../../Landing.data';
import styles from './Features.module.css';

export function Features() {
  return (
    <section className={styles.features}>
      <div className={styles.featuresInner}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Borsch AI?</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to cook smarter, waste less, and eat better — every single day.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <SpotlightCard
              key={feature.icon}
              className={styles.featureCard}
              spotlightColor="rgba(255, 90, 31, 0.2)"
            >
              <div className={styles.featureIconWrap}>
                <Icon name={feature.icon} size="md" />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
            </SpotlightCard>
          ))}
        </div>

        <Link href="/recipes">
          <Button variant="primary" size="lg" icon="arrow-right" iconPosition="right">
            Get started — it&apos;s free
          </Button>
        </Link>
      </div>
    </section>
  );
}
