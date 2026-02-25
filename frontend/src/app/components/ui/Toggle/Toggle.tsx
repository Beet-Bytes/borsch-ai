import type { HTMLAttributes } from 'react';
import styles from './Toggle.module.css';

export interface ToggleProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle = ({
  checked,
  onChange,
  disabled = false,
  className,
  ...rest
}: ToggleProps) => {
  const handleClick = () => {
    if (disabled) return;
    onChange(!checked);
  };

  const trackClassName = [
    styles.track,
    !disabled && checked ? styles.trackOnEnabled : '',
    disabled && checked ? styles.trackDisabledOn : '',
    disabled && !checked ? styles.trackDisabledOff : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const thumbClassName = [
    styles.thumb,
    checked ? styles.thumbOn : '',
    !disabled && !checked ? styles.thumbOffEnabled : '',
    disabled ? styles.thumbDisabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={styles.root}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={handleClick}
      disabled={disabled}
      {...rest}
    >
      <span className={trackClassName}>
        <span className={thumbClassName} />
      </span>
    </button>
  );
};
