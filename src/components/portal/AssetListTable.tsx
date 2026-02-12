import React from 'react';
import { Asset } from '@/types';
import { ExternalLink, Edit } from 'lucide-react';
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
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
          <tr>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              ID
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Brand
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Type
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Status
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Views
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {assets.map((asset) => (
            <React.Fragment key={asset.id}>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-700">
                <td className="p-4 text-sm text-slate-500 dark:text-slate-400 font-mono">
                  {asset.id}
                </td>
                <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">
                  <button
                    onClick={() => onAssetClick?.(asset)}
                    className="flex items-center gap-2 hover:text-brand-600 transition-colors text-left"
                  >
                    <img
                      src={asset.thumb}
                      alt=""
                      className="w-6 h-6 rounded object-cover bg-slate-100 ring-1 ring-slate-200 dark:ring-slate-600"
                    />
                    {asset.name}
                  </button>
                </td>
                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{asset.type}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      asset.status === 'Published'
                        ? 'bg-green-100 text-green-800'
                        : asset.status === 'In Review'
                          ? 'bg-orange-100 text-orange-800'
                          : asset.status === 'Processing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {asset.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                  {asset.viewCount?.toLocaleString() || 0}
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => onEditProject?.(asset.project_id || '')}
                      className="text-brand-600 hover:text-brand-800 text-sm font-bold flex items-center gap-1 text-left"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <Link
                      to={`/project/${asset.project_id}/menu`}
                      className="text-slate-500 hover:text-brand-600 text-xs flex items-center gap-1"
                      title="View Customer Menu"
                    >
                      <ExternalLink className="w-3 h-3" /> View Menu
                    </Link>
                  </div>
                </td>
              </tr>
              {expandedAssetId === asset.id && (
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td colSpan={6} className="p-4">
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded text-xs">
                            Project Assets
                          </span>
                        </h3>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};
