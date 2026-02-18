import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  showCount?: boolean;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      optional = false,
      showCount = false,
      maxLength,
      className = '',
      id,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const charCount = typeof value === 'string' ? value.length : 0;

    const base = [
      'w-full rounded-xl border bg-white dark:bg-zinc-900',
      'px-3.5 py-3 text-sm',
      'text-zinc-900 dark:text-zinc-100',
      'placeholder:text-zinc-400 dark:placeholder:text-zinc-600',
      'transition-all duration-150 resize-y min-h-[100px]',
      'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
      'dark:focus:border-brand-400',
      error
        ? 'border-error focus:border-error focus:ring-error/20'
        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600',
      disabled ? 'bg-zinc-50 dark:bg-zinc-950 opacity-60 cursor-not-allowed resize-none' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={textareaId}
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              {label}
            </label>
            {optional && <span className="text-xs text-zinc-400 dark:text-zinc-600">Optional</span>}
          </div>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={base}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />

        <div className="flex items-start justify-between gap-2">
          <div>
            {error && (
              <p id={`${textareaId}-error`} role="alert" className="text-xs font-medium text-error">
                {error}
              </p>
            )}
            {hint && !error && (
              <p id={`${textareaId}-hint`} className="text-xs text-zinc-500 dark:text-zinc-400">
                {hint}
              </p>
            )}
          </div>

          {showCount && maxLength && (
            <span
              className={`text-xs tabular-nums flex-shrink-0 ${
                charCount >= maxLength
                  ? 'text-error'
                  : charCount >= maxLength * 0.9
                    ? 'text-warning'
                    : 'text-zinc-400 dark:text-zinc-600'
              }`}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
