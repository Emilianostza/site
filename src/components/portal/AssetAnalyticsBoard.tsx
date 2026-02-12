import React, { useMemo } from 'react';
import { Asset } from '@/types';
import {
  Eye,
  TrendingUp,
  Users,
  Clock,
  MousePointer,
  Smartphone,
  Monitor,
  Globe,
} from 'lucide-react';

interface AssetAnalyticsBoardProps {
  assets: Asset[];
}

export const AssetAnalyticsBoard: React.FC<AssetAnalyticsBoardProps> = ({ assets }) => {
  const stats = useMemo(() => {
    const totalViews = assets.reduce((sum, asset) => sum + (asset.viewCount || 0), 0);
    const uniqueViews = assets.reduce((sum, asset) => sum + (asset.uniqueViewCount || 0), 0);

    // Sort assets by view count descending
    const topAssets = [...assets]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5);

    return { totalViews, uniqueViews, topAssets };
  }, [assets]);

  // Mock data for the chart (Views over 30 days)
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 1; i <= 30; i++) {
      // Random trend with some noise
      const base = 50 + i * 2;
      const noise = Math.random() * 40 - 20;
      data.push({ day: i, views: Math.max(10, Math.floor(base + noise)) });
    }
    return data;
  }, []);

  const maxChartViews = Math.max(...chartData.map((d) => d.views));
  const chartPoints = chartData
    .map((d, i) => {
      const x = (i / (chartData.length - 1)) * 100;
      const y = 100 - (d.views / maxChartViews) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" />
            Performance Analytics
          </h3>
          <select className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-sm font-medium px-3 py-1 text-slate-600 dark:text-slate-300">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Year</option>
          </select>
        </div>

        {/* Top Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1 text-sm font-medium">
              <Eye className="w-4 h-4" />
              Total Views
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.totalViews.toLocaleString()}
            </div>
            <div className="text-xs text-green-500 font-medium mt-1 flex items-center">
              +12.5% <span className="text-slate-400 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1 text-sm font-medium">
              <Users className="w-4 h-4" />
              Unique Visitors
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.uniqueViews.toLocaleString()}
            </div>
            <div className="text-xs text-green-500 font-medium mt-1 flex items-center">
              +8.2% <span className="text-slate-400 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1 text-sm font-medium">
              <Clock className="w-4 h-4" />
              Avg. Time on Scene
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">1m 42s</div>
            <div className="text-xs text-slate-400 font-medium mt-1 flex items-center">
              0.0% <span className="text-slate-400 ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1 text-sm font-medium">
              <MousePointer className="w-4 h-4" />
              Interaction Rate
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">68.4%</div>
            <div className="text-xs text-green-500 font-medium mt-1 flex items-center">
              +2.1% <span className="text-slate-400 ml-1">vs last period</span>
            </div>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
            Views Trend
          </h4>
          <div className="h-64 w-full relative">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="0.5"
                  strokeDasharray="2"
                />
              ))}

              {/* Area Fill */}
              <path
                d={`M 0,100 ${chartPoints} 100,100 Z`}
                className="fill-brand-100 dark:fill-brand-900/20 opacity-50"
              />

              {/* Line */}
              <polyline
                points={chartPoints}
                fill="none"
                stroke="currentColor"
                className="text-brand-500"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />

              {/* Tooltip dot (simulated at last point) */}
              <circle
                cx="100"
                cy={100 - (chartData[chartData.length - 1].views / maxChartViews) * 100}
                r="1.5"
                className="fill-brand-600"
              />
            </svg>

            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>Nov 1</span>
              <span>Nov 8</span>
              <span>Nov 15</span>
              <span>Nov 23</span>
              <span>Nov 30</span>
            </div>
          </div>
        </div>

        {/* Bottom Split: Top Models & Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Models List */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Top Performing Models
            </h4>
            <div className="space-y-4">
              {stats.topAssets.map((asset, index) => {
                const views = asset.viewCount || 0;
                const maxViews = stats.topAssets[0]?.viewCount || 1;
                const percentage = (views / maxViews) * 100;

                return (
                  <div key={asset.id} className="group">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-200 truncate pr-4">
                        {index + 1}. {asset.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono">
                        {views.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Device & Location Stats (Mock) */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-400" /> Device Type
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Smartphone className="w-3 h-3" /> Mobile
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">65%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '65%' }}></div>
                </div>

                <div className="flex items-center justify-between text-sm mt-3">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Monitor className="w-3 h-3" /> Desktop
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">35%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" /> Top Locations
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-300">United States</span>
                  <span className="font-medium text-slate-900 dark:text-white">42%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-300">United Kingdom</span>
                  <span className="font-medium text-slate-900 dark:text-white">18%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-300">Germany</span>
                  <span className="font-medium text-slate-900 dark:text-white">12%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-300">Other</span>
                  <span className="font-medium text-slate-900 dark:text-white">28%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
