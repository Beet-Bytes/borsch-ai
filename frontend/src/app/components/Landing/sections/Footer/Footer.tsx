import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerText}>
        © {new Date().getFullYear()} BorschAI. All rights reserved.
      </p>
    </footer>
  );
}
