/**
 * Metric Card Component
 *
 * Displays a single metric with trend indicator and formatted value.
 *
 * Usage:
 * <MetricCard
 *   title="Active Users"
 *   value={156}
 *   trend={{ change: 12, isPositive: true }}
 *   icon={Users}
 *   color="brand-500"
 * />
 */

import { ReactNode } from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    change: number;
    isPositive: boolean;
  };
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'brand';
  layout?: 'compact' | 'expanded';
}

const colorClasses = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  red: 'bg-red-50 border-red-200 text-red-700',
  brand: 'bg-brand-50 border-brand-200 text-brand-700'
};

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'brand',
  layout = 'compact'
}: MetricCardProps) {
  const colorClass = colorClasses[color];

  return (
    <div className={`${colorClass} border rounded-lg p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{value}</span>

            {trend && (
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  trend.isPositive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.change)}%
              </span>
            )}
          </div>

          {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
        </div>

        {icon && (
          <div className="text-2xl text-gray-400 ml-3">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Metric Grid Component
 *
 * Responsive grid for displaying multiple metrics.
 */

export interface MetricGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

export function MetricGrid({ children, columns = 3 }: MetricGridProps) {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {children}
    </div>
  );
}

/**
 * Metric Loading Skeleton
 */
export function MetricCardSkeleton() {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="mt-2 h-8 bg-gray-300 rounded w-16"></div>
          <div className="mt-1 h-3 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="h-8 w-8 bg-gray-300 rounded ml-3"></div>
      </div>
    </div>
  );
}
