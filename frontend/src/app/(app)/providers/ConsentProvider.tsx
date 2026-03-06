'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { registerConsentHandler, type MissingDoc } from '@/app/services/apiClient';
import { getLegalStatus, postConsent } from '@/app/services/legal';
import { Button } from '@/app/components/ui/Button/Button';
import styles from './ConsentProvider.module.css';

const ConsentContext = createContext<null>(null);

export function useConsent() {
  return useContext(ConsentContext);
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [missing, setMissing] = useState<MissingDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const resolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    registerConsentHandler((missingDocs) => {
      return new Promise<void>((resolve) => {
        setMissing(missingDocs);
        setVisible(true);
        resolveRef.current = resolve;
      });
    });
  }, []);

  const handleAccept = useCallback(async () => {
    setLoading(true);
    try {
      const status = await getLegalStatus();
      await Promise.all(missing.map(({ type }) => postConsent(type, status[type] ?? '1.0')));
      setVisible(false);
      resolveRef.current?.();
      resolveRef.current = null;
    } catch {
      // retry on next request
    } finally {
      setLoading(false);
    }
  }, [missing]);

  return (
    <ConsentContext.Provider value={null}>
      {children}
      {visible && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.title}>Terms Updated</h2>
            <p className={styles.text}>
              We have updated our legal documents. Please review and accept the new terms to
              continue using the application.
            </p>
            <ul className={styles.list}>
              {missing.map((doc) => (
                <li key={doc.type}>
                  <Link
                    href={`/legal/${doc.type}`}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {doc.type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Link>
                  <span className={styles.version}>v{doc.required_version}</span>
                </li>
              ))}
            </ul>
            <Button fullWidth loading={loading} onClick={handleAccept}>
              Accept new terms
            </Button>
          </div>
        </div>
      )}
    </ConsentContext.Provider>
  );
}
