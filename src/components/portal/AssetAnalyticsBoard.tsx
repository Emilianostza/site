import React, { useMemo } from 'react';
import { Asset } from '@/types';
import { Eye, TrendingUp, Users } from 'lucide-react';

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

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-brand-600" />
        Views Analytics
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1 text-sm">
            <Eye className="w-4 h-4" />
            Total Views
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalViews.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1 text-sm">
            <Users className="w-4 h-4" />
            Unique
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.uniqueViews.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
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
                  <span
                    className="font-medium text-slate-700 dark:text-slate-200 truncate pr-4"
                    title={asset.name}
                  >
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
          {assets.length === 0 && (
            <div className="text-center text-slate-400 text-sm py-4">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};
