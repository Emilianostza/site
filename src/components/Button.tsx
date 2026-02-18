import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'gradient'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'ghost-brand'
  | 'danger'
  | 'danger-outline';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const isIconOnly = !children && Boolean(icon);

  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 ease-spring focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants: Record<ButtonVariant, string> = {
    // Solid indigo — workhorse CTA
    primary:
      'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 focus-visible:ring-brand-500 shadow-xs hover:shadow-soft hover:-translate-y-px active:translate-y-0',

    // Gradient — hero / signature CTA
    gradient:
      'bg-gradient-brand text-white hover:opacity-90 active:opacity-100 focus-visible:ring-brand-500 shadow-xs hover:shadow-glow hover:-translate-y-px active:translate-y-0',

    // White/zinc — secondary actions
    secondary:
      'bg-white text-zinc-800 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 hover:text-brand-600 focus-visible:ring-zinc-400 shadow-xs hover:shadow-card dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:border-zinc-600',

    // Outlined brand
    outline:
      'bg-transparent border-2 border-brand-500 text-brand-600 hover:bg-brand-50 hover:border-brand-600 focus-visible:ring-brand-500 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-950/30',

    // Transparent — no border
    ghost:
      'bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-zinc-400 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',

    // Transparent — brand tint on hover
    'ghost-brand':
      'bg-transparent text-brand-600 hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-brand-500 dark:text-brand-400 dark:hover:bg-brand-950/40',

    // Danger — destructive solid
    danger:
      'bg-error text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-500 shadow-xs hover:shadow-soft hover:-translate-y-px active:translate-y-0',

    // Danger — outlined
    'danger-outline':
      'bg-transparent border-2 border-error text-error hover:bg-error-light hover:text-red-700 focus-visible:ring-red-500 dark:hover:bg-red-950/30',
  };

  const sizes: Record<ButtonSize, string> = {
    xs: isIconOnly ? 'p-1.5' : 'px-3 py-1.5 text-xs',
    sm: isIconOnly ? 'p-2' : 'px-4 py-2 text-sm',
    md: isIconOnly ? 'p-2.5' : 'px-5 py-2.5 text-sm',
    lg: isIconOnly ? 'p-3' : 'px-6 py-3 text-base',
    xl: isIconOnly ? 'p-3.5' : 'px-8 py-4 text-lg',
  };

  const iconSizes: Record<ButtonSize, string> = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-5 h-5',
  };

  const spinner = loading ? (
    <Loader2 className={`${iconSizes[size]} animate-spin flex-shrink-0`} />
  ) : null;

  const iconEl =
    icon && !loading ? (
      <span className={`${iconSizes[size]} flex-shrink-0 flex items-center justify-center`}>
        {icon}
      </span>
    ) : null;

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && spinner}
      {!loading && icon && iconPosition === 'left' && iconEl}
      {children && <span>{children}</span>}
      {!loading && icon && iconPosition === 'right' && iconEl}
    </button>
  );
};

export default Button;
