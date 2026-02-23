export interface SelectOption<TValue = string> {
  label: string;
  value: TValue;
  disabled?: boolean;
}

export interface SelectProps<TValue = string> {
  options: SelectOption<TValue>[];
  value: TValue | null;
  onChange: (value: TValue | null, option: SelectOption<TValue> | null) => void;
  placeholder?: string;
  disabled?: boolean;
  /**
   * Optional visible label rendered above the select trigger.
   */
  label?: string;
  /**
   * Optional id for the trigger button; used to associate the label and listbox.
   * If not provided, a stable id will be generated.
   */
  id?: string;
  /**
   * Additional className applied to the root container.
   */
  className?: string;
}
