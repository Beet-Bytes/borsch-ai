'use client';

import { useState, type ReactNode } from 'react';
import { Checkbox } from '@/app/components/ui/Checkbox/Checkbox';
import { Button } from '@/app/components/ui/Button/Button';
import styles from './Disclaimer.module.css';

interface DisclaimerProps {
  label: ReactNode;
  onAccept: () => void | Promise<void>;
  loading?: boolean;
  buttonText?: string;
}

export function Disclaimer({ label, onAccept, loading, buttonText = 'Continue' }: DisclaimerProps) {
  const [checked, setChecked] = useState(false);

  return (
    <div className={styles.wrapper}>
      <Checkbox label={label} checked={checked} onChange={(e) => setChecked(e.target.checked)} />
      <Button fullWidth disabled={!checked} loading={loading} onClick={onAccept}>
        {buttonText}
      </Button>
    </div>
  );
}
