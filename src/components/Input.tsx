import React, { forwardRef } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  inputSize?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  optional?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      inputSize = 'md',
      leftIcon,
      rightIcon,
      optional = false,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const sizeStyles: Record<InputSize, string> = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-3.5 py-2.5 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    const iconPadLeft: Record<InputSize, string> = {
      sm: 'pl-8',
      md: 'pl-9',
      lg: 'pl-10',
    };

    const iconPadRight: Record<InputSize, string> = {
      sm: 'pr-8',
      md: 'pr-9',
      lg: 'pr-10',
    };

    const iconSize: Record<InputSize, string> = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    const iconLeft: Record<InputSize, string> = {
      sm: 'left-2.5',
      md: 'left-3',
      lg: 'left-3.5',
    };

    const iconRight: Record<InputSize, string> = {
      sm: 'right-2.5',
      md: 'right-3',
      lg: 'right-3.5',
    };

    const base = [
      'w-full rounded-xl border bg-white dark:bg-zinc-900',
      'text-zinc-900 dark:text-zinc-100',
      'placeholder:text-zinc-400 dark:placeholder:text-zinc-600',
      'transition-all duration-150',
      'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
      'dark:focus:border-brand-400',
      sizeStyles[inputSize],
      leftIcon ? iconPadLeft[inputSize] : '',
      rightIcon ? iconPadRight[inputSize] : '',
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
              htmlFor={inputId}
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              {label}
            </label>
            {optional && <span className="text-xs text-zinc-400 dark:text-zinc-600">Optional</span>}
          </div>
        )}

        <div className="relative">
          {leftIcon && (
            <span
              className={`absolute top-1/2 -translate-y-1/2 ${iconLeft[inputSize]} text-zinc-400 dark:text-zinc-600 pointer-events-none ${iconSize[inputSize]}`}
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={base}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {rightIcon && (
            <span
              className={`absolute top-1/2 -translate-y-1/2 ${iconRight[inputSize]} text-zinc-400 dark:text-zinc-600 ${iconSize[inputSize]}`}
            >
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs font-medium text-error flex items-center gap-1"
          >
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-zinc-500 dark:text-zinc-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
