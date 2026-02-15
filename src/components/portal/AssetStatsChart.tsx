import React, { useMemo } from 'react';
import { Asset } from '@/types';

interface AssetStatsChartProps {
  assets: Asset[];
}

export const AssetStatsChart: React.FC<AssetStatsChartProps> = ({ assets }) => {
  // Calculate stats
  const stats = useMemo(() => {
    const total = assets.length;
    if (total === 0) return { total, data: [] };

    const counts = assets.reduce(
      (acc, asset) => {
        const status = asset.status || 'Draft';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const data = Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percentage: (value / total) * 100,
      color: getColorForStatus(name),
    }));

    // Sort by value desc
    return { total, data: data.sort((a, b) => b.value - a.value) };
  }, [assets]);

  function getColorForStatus(status: string) {
    switch (status) {
      case 'Published':
        return '#22c55e'; // green-500
      case 'In Review':
        return '#f97316'; // orange-500
      case 'Draft':
        return '#94a3b8'; // slate-400
      default:
        return '#cbd5e1'; // slate-300
    }
  }

  // Calculate pie slices
  const slices = useMemo(() => {
    let cumulativePercent = 0;
    return stats.data.map((slice) => {
      const startPercent = cumulativePercent;
      const slicePercent = slice.percentage / 100;
      const endPercent = cumulativePercent + slicePercent;
      cumulativePercent = endPercent;

      // Full circle case
      if (slicePercent >= 0.999) {
        return (
          <circle
            key={slice.name}
            cx="0"
            cy="0"
            r="1"
            fill="none"
            stroke={slice.color}
            strokeWidth="0.4"
          />
        );
      }

      const startX = Math.cos(2 * Math.PI * startPercent - Math.PI / 2);
      const startY = Math.sin(2 * Math.PI * startPercent - Math.PI / 2);
      const endX = Math.cos(2 * Math.PI * endPercent - Math.PI / 2);
      const endY = Math.sin(2 * Math.PI * endPercent - Math.PI / 2);

      const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

      const pathData = [`M ${startX} ${startY}`, `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`].join(
        ' '
      );

      return (
        <path
          key={slice.name}
          d={pathData}
          fill="none"
          stroke={slice.color}
          strokeWidth="0.4"
          className="hover:opacity-80 transition-opacity cursor-pointer"
        >
          <title>{`${slice.name}: ${slice.value} (${Math.round(slice.percentage)}%)`}</title>
        </path>
      );
    });
  }, [stats]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Asset Distribution</h3>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Chart */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-full h-full">
            {/* Background Circle if empty */}
            {stats.total === 0 && (
              <circle
                cx="0"
                cy="0"
                r="1"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="0.4"
                className="dark:stroke-slate-700"
              />
            )}
            {slices}
          </svg>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-3">
          {stats.data.map((item) => (
            <div key={item.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.value}
                </span>
                <span className="text-xs text-slate-400">({Math.round(item.percentage)}%)</span>
              </div>
            </div>
          ))}
          {stats.total === 0 && (
            <div className="text-center text-slate-400 text-sm py-2">No assets found</div>
          )}
        </div>
      </div>
    </div>
  );
};
