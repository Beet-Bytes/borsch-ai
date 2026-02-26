import styles from './GradientOrbs.module.css';

export function GradientOrbs() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={`${styles.orb} ${styles.orbOrange}`} />
      <div className={`${styles.orb} ${styles.orbOrangeRight}`} />
    </div>
  );
}
