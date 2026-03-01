'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/app/services/auth';

export function useRegister() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    agreed?: string;
    submit?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email';
    if (password.length < 8) next.password = 'Password must be at least 8 characters';
    if (!agreed) next.agreed = 'You must agree to the Terms & Privacy Policy';
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await register(email, password, agreed);
      router.push(`/confirm?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      if (message.toLowerCase().includes('password')) {
        setErrors({ password: message });
      } else if (
        message.toLowerCase().includes('email') ||
        message.toLowerCase().includes('username')
      ) {
        setErrors({ email: message });
      } else {
        setErrors({ submit: message });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    agreed,
    setAgreed,
    errors,
    loading,
    handleSubmit,
  };
}
