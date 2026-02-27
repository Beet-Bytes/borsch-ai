'use client';

import Link from 'next/link';
import { Input } from '@/app/components/ui/Input/Input';
import { Button } from '@/app/components/ui/Button/Button';
import { useLogin } from './useLogin';
import styles from './page.module.css';

export default function LoginPage() {
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLogin();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your AI-Borsch account</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <div className={styles.passwordField}>
          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <div className={styles.forgotRow}>
            <Link href="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" fullWidth loading={loading}>
          Sign in
        </Button>
      </form>

      <p className={styles.footer}>
        Don't have an account?{' '}
        <Link href="/register" className={styles.link}>
          Create one
        </Link>
      </p>
    </div>
  );
}
