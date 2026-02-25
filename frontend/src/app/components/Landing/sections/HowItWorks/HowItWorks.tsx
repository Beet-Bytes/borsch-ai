import { Fragment } from 'react';
import { steps } from '../../Landing.data';
import styles from './HowItWorks.module.css';

export function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <p className={styles.sectionSubtitle}>From fridge to fork in three simple steps.</p>
        </div>

        <div className={styles.steps}>
          {steps.map((step, index) => (
            <Fragment key={step.number}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className={styles.connector} aria-hidden="true" />}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
