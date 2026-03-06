'use client';

import { useEffect, useState } from 'react';
import { checkAuth } from '@/app/services/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    checkAuth().then((isAuth) => {
      if (isAuth) {
        setChecked(true);
      } else {
        window.location.href = '/login';
      }
    });
  }, []);

  if (!checked) return null;

  return <>{children}</>;
}
