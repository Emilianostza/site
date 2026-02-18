import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  optional?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      placeholder,
      optional = false,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const base = [
      'w-full appearance-none rounded-xl border bg-white dark:bg-zinc-900',
      'px-3.5 py-2.5 pr-9 text-sm',
      'text-zinc-900 dark:text-zinc-100',
      'transition-all duration-150',
      'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
      'dark:focus:border-brand-400',
      'cursor-pointer',
      error
        ? 'border-error focus:border-error focus:ring-error/20'
        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600',
      disabled ? 'bg-zinc-50 dark:bg-zinc-950 opacity-60 cursor-not-allowed' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={selectId}
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              {label}
            </label>
            {optional && <span className="text-xs text-zinc-400 dark:text-zinc-600">Optional</span>}
          </div>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={base}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-600 pointer-events-none" />
        </div>

        {error && (
          <p id={`${selectId}-error`} role="alert" className="text-xs font-medium text-error">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${selectId}-hint`} className="text-xs text-zinc-500 dark:text-zinc-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
