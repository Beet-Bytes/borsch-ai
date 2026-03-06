'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth } from '@/app/services/auth';

export function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    checkAuth().then((isAuth) => {
      if (isAuth) router.replace('/dashboard');
    });
  }, [router]);

  return null;
}
