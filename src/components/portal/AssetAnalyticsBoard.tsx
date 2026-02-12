import React, { useMemo } from 'react';
import { Asset } from '@/types';
import { Eye, TrendingUp, Users, Clock, MousePointer, Smartphone, Globe } from 'lucide-react';

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
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-6 md:mb-8">
          <div>
            <h3 className="font-bold text-lg md:text-xl text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-brand-600" />
              Performance Analytics
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track viewer engagement and model performance
            </p>
          </div>
          <select className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700 rounded-lg text-sm font-medium px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors w-full md:w-auto">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Year</option>
          </select>
        </div>

        {/* Top Cards Row - Responsive grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
          {/* Total Views Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-900/5 p-3 md:p-5 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-1 md:gap-2 text-blue-700 dark:text-blue-300 mb-1 md:mb-2 text-xs md:text-sm font-semibold">
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">Total Views</span>
              <span className="md:hidden">Views</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
              {stats.totalViews.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center">
              ↑ +12.5%{' '}
              <span className="text-slate-500 dark:text-slate-400 ml-1 font-normal hidden sm:inline">
                vs last period
              </span>
            </div>
          </div>

          {/* Unique Visitors Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/10 dark:to-purple-900/5 p-3 md:p-5 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-1 md:gap-2 text-purple-700 dark:text-purple-300 mb-1 md:mb-2 text-xs md:text-sm font-semibold">
              <Users className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">Unique Visitors</span>
              <span className="md:hidden">Visitors</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
              {stats.uniqueViews.toLocaleString()}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold flex items-center">
              ↑ +8.2%{' '}
              <span className="text-slate-500 dark:text-slate-400 ml-1 font-normal hidden sm:inline">
                vs last period
              </span>
            </div>
          </div>

          {/* Time on Scene Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/10 dark:to-orange-900/5 p-3 md:p-5 rounded-xl border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-1 md:gap-2 text-orange-700 dark:text-orange-300 mb-1 md:mb-2 text-xs md:text-sm font-semibold">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">Avg. Time Viewing</span>
              <span className="md:hidden">Avg. Time</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
              1m 42s
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center">
              — Steady engagement
            </div>
          </div>

          {/* Interaction Rate Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/10 dark:to-green-900/5 p-3 md:p-5 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-1 md:gap-2 text-green-700 dark:text-green-300 mb-1 md:mb-2 text-xs md:text-sm font-semibold">
              <MousePointer className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">Interaction Rate</span>
              <span className="md:hidden">Interaction</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
              68.4%
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center">
              ↑ +2.1%{' '}
              <span className="text-slate-500 dark:text-slate-400 ml-1 font-normal hidden sm:inline">
                vs last period
              </span>
            </div>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="mb-6 md:mb-8 p-4 md:p-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4 md:mb-6">
            <div>
              <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1">
                Views Trend Over Time
              </h4>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Daily engagement metrics for the past 30 days
              </p>
            </div>
          </div>
          <div className="h-48 md:h-64 w-full relative">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Top Models List */}
          <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800 p-4 md:p-5 rounded-xl border border-slate-100 dark:border-slate-700">
            <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1">
              🏆 Top Performing Models
            </h4>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-4 md:mb-5">
              Your most-viewed 3D assets
            </p>
            <div className="space-y-3">
              {stats.topAssets.map((asset, index) => {
                const views = asset.viewCount || 0;
                const maxViews = stats.topAssets[0]?.viewCount || 1;
                const percentage = (views / maxViews) * 100;

                const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
                const medal = medals[index] || `${index + 1}.`;

                return (
                  <div
                    key={asset.id}
                    className="group p-3 rounded-lg hover:bg-white dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xl">{medal}</span>
                        <span className="font-semibold text-slate-900 dark:text-white truncate">
                          {asset.name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-brand-600 dark:text-brand-400 ml-2">
                        {views.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Device & Location Stats (Mock) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Device Type Stats */}
            <div className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/10 dark:to-slate-800 p-4 md:p-5 rounded-xl border border-slate-100 dark:border-slate-700">
              <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <Smartphone className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />{' '}
                Viewing Devices
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 md:mb-5">
                Where your viewers are using
              </p>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      📱 Mobile
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">65%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full"
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      💻 Desktop
                    </span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">35%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full"
                      style={{ width: '35%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Locations Stats */}
            <div className="bg-gradient-to-b from-green-50 to-white dark:from-green-900/10 dark:to-slate-800 p-4 md:p-5 rounded-xl border border-slate-100 dark:border-slate-700">
              <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <Globe className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" /> Top
                Locations
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 md:mb-5">
                Where your traffic comes from
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                  <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                    🇺🇸 United States
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">42%</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                  <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                    🇬🇧 United Kingdom
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">18%</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                  <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                    🇩🇪 Germany
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">12%</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                  <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                    🌍 Other
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">28%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
