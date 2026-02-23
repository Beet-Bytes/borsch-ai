import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { Icon } from '@/app/components/ui/Icon/Icon';
import type { SelectOption, SelectProps } from './types';
import styles from './Select.module.css';

const isPrimitive = (value: unknown): value is string | number => {
  return typeof value === 'string' || typeof value === 'number';
};

export const Select = <TValue,>({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  label,
  id: idProp,
  className,
}: SelectProps<TValue>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const reactId = useId();
  const triggerId = idProp ?? `select-${reactId}`;
  const listboxId = `${triggerId}-listbox`;

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === value),
    [options, value]
  );

  const selectedOption: SelectOption<TValue> | null =
    selectedIndex >= 0 ? options[selectedIndex] : null;

  const getOptionId = (index: number) => `${listboxId}-option-${index}`;

  const close = () => {
    setIsOpen(false);
    setHighlightedIndex(null);
  };

  const open = () => {
    if (disabled || !options.length) return;
    setIsOpen(true);
    setHighlightedIndex((current) => {
      if (current !== null && current >= 0 && current < options.length) {
        return current;
      }
      if (selectedIndex >= 0) return selectedIndex;
      return 0;
    });
  };

  const toggleOpen = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setHighlightedIndex((current) => {
          if (current !== null && current >= 0 && current < options.length) {
            return current;
          }
          if (selectedIndex >= 0) return selectedIndex;
          return options.length ? 0 : null;
        });
      } else {
        setHighlightedIndex(null);
      }
      return next;
    });
  };

  const commitSelection = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;

    onChange(option.value, option);
    close();

    triggerRef.current?.focus();
  };

  const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toggleOpen();
  };

  const moveHighlight = (direction: 1 | -1) => {
    if (!options.length) return;

    const startIndex =
      highlightedIndex !== null && highlightedIndex >= 0
        ? highlightedIndex
        : selectedIndex >= 0
          ? selectedIndex
          : 0;

    let nextIndex = startIndex;

    for (let i = 0; i < options.length; i += 1) {
      nextIndex = (nextIndex + direction + options.length) % options.length;
      if (!options[nextIndex].disabled) {
        setHighlightedIndex(nextIndex);
        break;
      }
    }
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case ' ':
      case 'Enter': {
        event.preventDefault();
        if (!isOpen) {
          open();
        } else if (
          highlightedIndex !== null &&
          highlightedIndex >= 0 &&
          highlightedIndex < options.length
        ) {
          commitSelection(highlightedIndex);
        } else if (selectedIndex >= 0) {
          commitSelection(selectedIndex);
        }
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        if (!isOpen) {
          open();
        } else {
          moveHighlight(1);
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (!isOpen) {
          open();
        } else {
          moveHighlight(-1);
        }
        break;
      }
      case 'Escape': {
        if (isOpen) {
          event.preventDefault();
          close();
        }
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: Event) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      close();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const rootClassName = [styles.root, className ?? ''].filter(Boolean).join(' ');

  const labelClassName = [
    styles.label,
    disabled ? styles.labelDisabled : '',
    isOpen ? styles.labelOpen : '',
  ]
    .filter(Boolean)
    .join(' ');

  const triggerClassName = [
    styles.trigger,
    isOpen ? styles.triggerOpen : '',
    disabled ? styles.triggerDisabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  const chevronBaseClassName = [
    styles.chevron,
    disabled ? styles.chevronDisabled : '',
    isOpen ? styles.chevronOpen : '',
  ]
    .filter(Boolean)
    .join(' ');

  const chevronLeftClassName = [chevronBaseClassName, styles.chevronLeft].filter(Boolean).join(' ');

  const chevronRightClassName = [chevronBaseClassName, styles.chevronRight]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={rootRef} className={rootClassName}>
      {label && (
        <label htmlFor={triggerId} className={labelClassName}>
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={triggerClassName}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={styles.triggerContent}>
          <span className={styles.triggerMain}>
            <Icon
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size="sm"
              className={chevronLeftClassName}
              aria-hidden="true"
            />
            <span className={selectedOption ? styles.value : styles.placeholder}>
              {selectedOption?.label ?? placeholder}
            </span>
          </span>
          <Icon
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size="sm"
            className={chevronRightClassName}
            aria-hidden="true"
          />
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <ul
            id={listboxId}
            role="listbox"
            aria-activedescendant={
              highlightedIndex !== null && highlightedIndex >= 0
                ? getOptionId(highlightedIndex)
                : undefined
            }
            className={styles.list}
          >
            {options.map((option, index) => {
              const isSelected = index === selectedIndex;
              const isHighlighted = index === highlightedIndex;

              const optionClassName = [
                styles.option,
                isSelected ? styles.optionSelected : '',
                isHighlighted ? styles.optionHighlighted : '',
                option.disabled ? styles.optionDisabled : '',
              ]
                .filter(Boolean)
                .join(' ');

              const key = isPrimitive(option.value) ? option.value : index;

              return (
                <li
                  key={key}
                  id={getOptionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  className={optionClassName}
                  onClick={() => {
                    if (option.disabled) return;
                    commitSelection(index);
                  }}
                  onMouseEnter={() => {
                    if (option.disabled) return;
                    setHighlightedIndex(index);
                  }}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <Icon
                      style={{ width: '18px', height: '16px' }}
                      name="check"
                      size="sm"
                      className={styles.checkIcon}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
