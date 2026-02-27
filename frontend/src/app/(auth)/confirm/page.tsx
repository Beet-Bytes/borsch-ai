'use client';

import { Button } from '@/app/components/ui/Button/Button';
import { useConfirm } from './useConfirm';
import styles from './page.module.css';

export default function ConfirmPage() {
  const {
    email,
    digits,
    error,
    loading,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
  } = useConfirm();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Check your email</h1>
        <p className={styles.subtitle}>
          We sent a 6-digit code to <strong>{email || 'your email'}</strong>. Enter it below.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.codeRow} onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              className={styles.digitInput}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              autoFocus={i === 0}
            />
          ))}
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" fullWidth loading={loading}>
          Confirm email
        </Button>
      </form>
    </div>
  );
}
