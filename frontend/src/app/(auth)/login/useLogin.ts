'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/services/auth';
import { getLegalStatus, postConsent } from '@/app/services/legal';

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Record consent for all active legal documents
      try {
        const status = await getLegalStatus();
        await Promise.all(
          Object.entries(status).map(([docType, version]) =>
            postConsent(docType, version as string)
          )
        );
      } catch {
        // Non-critical — consent can be re-recorded later via CONSENT_REQUIRED flow
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, error, loading, handleSubmit };
}
