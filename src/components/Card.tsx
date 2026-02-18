import React from 'react';

export type CardVariant = 'default' | 'glass' | 'flat' | 'elevated' | 'bordered';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
  onClick,
  padding = 'none',
}) => {
  const base = 'rounded-2xl transition-all duration-200 ease-spring';

  const variants: Record<CardVariant, string> = {
    // Clean white card — primary surface
    default: 'bg-white border border-zinc-100 shadow-card dark:bg-zinc-900 dark:border-zinc-800',

    // Frosted glass — for overlays, hero sections, feature cards
    glass:
      'bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-card',

    // Flat — zero shadow, subtle border — for dense UI / portals
    flat: 'bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800',

    // Elevated — stronger presence, pricing / feature highlight
    elevated: 'bg-white border border-zinc-100 shadow-hover dark:bg-zinc-900 dark:border-zinc-700',

    // Bordered — outline emphasis, no shadow
    bordered: 'bg-transparent border-2 border-zinc-200 dark:border-zinc-700',
  };

  const hoverStyles: Partial<Record<CardVariant, string>> = {
    default:
      'hover:shadow-hover hover:-translate-y-0.5 hover:border-brand-100 dark:hover:border-brand-900',
    glass: 'hover:shadow-hover hover:-translate-y-0.5 hover:bg-white/80 dark:hover:bg-zinc-900/80',
    flat: 'hover:bg-zinc-100 hover:border-zinc-300 dark:hover:bg-zinc-800 dark:hover:border-zinc-700',
    elevated: 'hover:shadow-glow hover:-translate-y-1',
    bordered:
      'hover:border-brand-400 hover:bg-brand-50/30 dark:hover:border-brand-700 dark:hover:bg-brand-950/20',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClass = hover ? (hoverStyles[variant] ?? '') : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  const handleKeyDown = onClick
    ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }
    : undefined;

  return (
    <div
      className={`${base} ${variants[variant]} ${hoverClass} ${clickableClass} ${paddings[padding]} ${className}`}
      onClick={onClick}
      {...(onClick ? { role: 'button', tabIndex: 0, onKeyDown: handleKeyDown } : {})}
    >
      {children}
    </div>
  );
};

export default Card;
