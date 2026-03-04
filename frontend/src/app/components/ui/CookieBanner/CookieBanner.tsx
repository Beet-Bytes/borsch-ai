'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/Button/Button';
import { getLegalStatus, postConsent } from '@/app/services/legal';
import styles from './CookieBanner.module.css';

const STORAGE_KEY = 'cookie_consent_dismissed';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
      getLegalStatus()
        .then((status) => setVersion(status.cookie_policy ?? null))
        .catch(() => {});
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  const handleAccept = async () => {
    if (version) {
      try {
        await postConsent('cookie_policy', version);
      } catch {
        // user may not be authenticated — ignore
      }
    }
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <p className={styles.title}>We use cookies 🍪</p>
      <p className={styles.text}>
        We use cookies to improve your experience.{' '}
        <Link href="/legal/privacy_policy" className={styles.link}>
          Privacy Policy
        </Link>
      </p>
      <div className={styles.actions}>
        <Button variant="ghost" size="sm" onClick={dismiss} fullWidth>
          Decline
        </Button>
        <Button variant="primary" size="sm" onClick={handleAccept} fullWidth>
          Accept all
        </Button>
      </div>
    </div>
  );
}
