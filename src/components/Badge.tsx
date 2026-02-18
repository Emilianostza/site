import React from 'react';

export type BadgeVariant =
  | 'default'
  | 'brand'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'purple'
  | 'cyan'
  | 'orange';

export type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
}) => {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded-full';

  const variants: Record<BadgeVariant, string> = {
    default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    brand: 'bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300',
    success: 'bg-success-light text-success-dark dark:bg-emerald-950/60 dark:text-emerald-400',
    warning: 'bg-warning-light text-warning-dark dark:bg-amber-950/60 dark:text-amber-400',
    error: 'bg-error-light text-error-dark dark:bg-red-950/60 dark:text-red-400',
    info: 'bg-info-light text-info-dark dark:bg-blue-950/60 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400',
    cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400',
  };

  const sizes: Record<BadgeSize, string> = {
    xs: 'px-2 py-0.5 text-2xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: 'bg-zinc-400',
    brand: 'bg-brand-500',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500',
    orange: 'bg-orange-500',
  };

  const dotSizes: Record<BadgeSize, string> = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
  };

  return (
    <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span
          className={`rounded-full flex-shrink-0 ${dotColors[variant]} ${dotSizes[size]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
