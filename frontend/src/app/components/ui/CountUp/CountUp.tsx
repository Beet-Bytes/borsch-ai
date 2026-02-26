'use client';

import { useCallback, useEffect, useRef } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) return decimals.length;
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (value: number) => {
      const hasDecimals = maxDecimals > 0;
      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
      };
      const formatted = Intl.NumberFormat('en-US', options).format(value);
      return separator ? formatted.replace(/,/g, separator) : formatted;
    },
    [maxDecimals, separator]
  );

  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = direction === 'down' ? to : from;
    const end = direction === 'down' ? from : to;
    el.textContent = formatValue(start);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || !startWhen) return;
        observer.disconnect();

        timeoutRef.current = setTimeout(() => {
          if (typeof onStart === 'function') onStart();

          const startTime = performance.now();
          const durationMs = duration * 1000;

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            const eased = easeOutQuart(progress);
            const current = start + (end - start) * eased;

            if (el) el.textContent = formatValue(current);

            if (progress < 1) {
              rafRef.current = requestAnimationFrame(tick);
            } else {
              if (el) el.textContent = formatValue(end);
              if (typeof onEnd === 'function') onEnd();
            }
          };

          rafRef.current = requestAnimationFrame(tick);
        }, delay * 1000);
      },
      { threshold: 0 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [from, to, direction, delay, duration, startWhen, formatValue, onStart, onEnd]);

  return <span className={className} ref={ref} />;
}
