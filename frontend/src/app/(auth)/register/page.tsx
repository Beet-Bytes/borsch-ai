'use client';

import Link from 'next/link';
import { Input } from '@/app/components/ui/Input/Input';
import { Button } from '@/app/components/ui/Button/Button';
import { Checkbox } from '@/app/components/ui/Checkbox/Checkbox';
import { useRegister } from './useRegister';
import styles from './page.module.css';

export default function RegisterPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    agreedTerms,
    setAgreedTerms,
    agreedPrivacy,
    setAgreedPrivacy,
    allAgreed,
    errors,
    loading,
    handleSubmit,
  } = useRegister();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Start cooking smarter today</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          error={errors.password}
        />
        <Checkbox
          checked={agreedTerms}
          onChange={(e) => setAgreedTerms(e.target.checked)}
          error={errors.agreedTerms}
          label={
            <>
              I agree to the{' '}
              <Link href="/legal/terms_of_service" className={styles.link}>
                Terms of Service
              </Link>{' '}
              &{' '}
              <Link href="/legal/eula" className={styles.link}>
                EULA
              </Link>
            </>
          }
        />
        <Checkbox
          checked={agreedPrivacy}
          onChange={(e) => setAgreedPrivacy(e.target.checked)}
          error={errors.agreedPrivacy}
          label={
            <>
              I agree to the{' '}
              <Link href="/legal/privacy_policy" className={styles.link}>
                Privacy Policy
              </Link>
            </>
          }
        />
        {errors.submit && <p className={styles.error}>{errors.submit}</p>}
        <Button type="submit" fullWidth loading={loading} disabled={!allAgreed}>
          Create account
        </Button>
      </form>

      <p className={styles.footer}>
        Already have an account?{' '}
        <Link href="/login" className={styles.link}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
