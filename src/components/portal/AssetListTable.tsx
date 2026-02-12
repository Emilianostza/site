import React from 'react';
import { Asset } from '@/types';
import { ExternalLink, Edit, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AssetGrid } from '@/components/portal/AssetGrid';

interface AssetListTableProps {
  assets: Asset[];
  allAssets?: Asset[];
  expandedAssetId?: string | null;
  onAssetClick?: (asset: Asset) => void;
  onEditProject?: (projectId: string) => void;
}

export const AssetListTable: React.FC<AssetListTableProps> = ({
  assets,
  allAssets = [],
  expandedAssetId,
  onAssetClick,
  onEditProject,
}) => {
  // Mock team member assignments for demo
  const getAssignee = (assetId: string) => {
    const assignees = [
      'Sarah Chen (SC)',
      'Alex Rodriguez (AR)',
      'Jordan Park (JP)',
      'Casey Thompson (CT)',
    ];
    return assignees[assetId.charCodeAt(0) % assignees.length];
  };

  const getPriority = (status: string) => {
    if (status === 'In Review') return 'High';
    if (status === 'Processing') return 'Medium';
    return 'Low';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px] md:min-w-full">
        <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
          <tr>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Asset
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Status
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Assigned To
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Priority
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Views
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {assets.map((asset) => {
            const priority = getPriority(asset.status);
            const assignee = getAssignee(asset.id);
            const isUrgent = asset.status === 'In Review';

            return (
              <React.Fragment key={asset.id}>
                <tr
                  className={`transition-colors ${
                    isUrgent
                      ? 'bg-red-50 dark:bg-red-900/10 hover:bg-red-100/50 dark:hover:bg-red-900/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {/* Asset with thumbnail */}
                  <td className="p-4">
                    <button
                      onClick={() => onAssetClick?.(asset)}
                      className="flex items-center gap-3 hover:text-brand-600 transition-colors text-left group"
                    >
                      <img
                        src={asset.thumb}
                        alt=""
                        className="w-8 h-8 rounded object-cover bg-slate-100 dark:bg-slate-700 ring-1 ring-slate-200 dark:ring-slate-600 group-hover:ring-brand-400 transition-all"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">
                          {asset.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {asset.type}
                        </div>
                      </div>
                    </button>
                  </td>

                  {/* Status with icon */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {asset.status === 'Published' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : asset.status === 'In Review' ? (
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      )}
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          asset.status === 'Published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : asset.status === 'In Review'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : asset.status === 'Processing'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {asset.status}
                      </span>
                    </div>
                  </td>

                  {/* Assigned To with avatar */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-bold text-white">
                        {assignee.slice(-4, -1)}
                      </div>
                      <div className="text-sm text-slate-700 dark:text-slate-300">{assignee}</div>
                    </div>
                  </td>

                  {/* Priority Badge */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        priority === 'High'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}
                    >
                      {priority}
                    </span>
                  </td>

                  {/* View Count */}
                  <td className="p-4">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {asset.viewCount?.toLocaleString() || 0}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">views</div>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onEditProject?.(asset.project_id || '')}
                        className="p-1.5 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded transition-colors"
                        title="Edit asset"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/project/${asset.project_id}/menu`}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                        title="View in menu"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>

                {expandedAssetId === asset.id && (
                  <tr className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800">
                    <td colSpan={6} className="p-6">
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                            <span className="text-brand-700 dark:text-brand-300 font-bold text-sm">
                              {allAssets.filter((a) => a.project_id === asset.project_id).length}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">
                              All Project Assets
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Complete asset list for this project
                            </p>
                          </div>
                        </div>
                        <AssetGrid
                          assets={allAssets.filter((a) => a.project_id === asset.project_id)}
                          role="employee"
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
