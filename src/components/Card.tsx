import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = true, onClick }) => {
  const baseStyles =
    'rounded-2xl bg-white border border-slate-100 transition-all duration-300 dark:bg-slate-800 dark:border-slate-700';
  const hoverStyles = hover
    ? 'hover:shadow-xl hover:-translate-y-1 hover:border-brand-200 dark:hover:border-brand-700'
    : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';

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
      className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      {...(onClick ? { role: 'button', tabIndex: 0, onKeyDown: handleKeyDown } : {})}
    >
      {children}
    </div>
  );
};

export default Card;
