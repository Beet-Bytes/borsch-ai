'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getLegalDocument } from '@/app/services/legal';
import type { LegalDocument } from '@/app/services/legal';
import styles from './page.module.css';

export default function LegalDocumentPage() {
  const { doc_type } = useParams<{ doc_type: string }>();
  const [doc, setDoc] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLegalDocument(doc_type)
      .then(setDoc)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [doc_type]);

  if (loading) return <p className={styles.state}>Loading...</p>;
  if (error) return <p className={styles.state}>Failed to load document.</p>;
  if (!doc) return null;

  return <article className={styles.content} dangerouslySetInnerHTML={{ __html: doc.content }} />;
}
