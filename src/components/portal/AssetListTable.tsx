import React from 'react';
import { Asset } from '@/types';
import { ExternalLink, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AssetListTableProps {
  assets: Asset[];
}

export const AssetListTable: React.FC<AssetListTableProps> = ({ assets }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
          <tr>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              ID
            </th>
            <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Asset Name
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
            <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
              <td className="p-4 text-sm text-slate-500 dark:text-slate-400 font-mono">
                {asset.id}
              </td>
              <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/project/${asset.project_id}/menu`}
                    className="flex items-center gap-2 hover:text-brand-600 transition-colors group"
                    title="View as Customer"
                  >
                    <img
                      src={asset.thumb}
                      alt=""
                      className="w-6 h-6 rounded object-cover bg-slate-100 group-hover:ring-2 ring-brand-500 transition-all"
                    />
                    {asset.name}
                  </Link>
                </div>
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
                <div className="flex items-center gap-3">
                  <Link
                    to={`/app/editor/${asset.id}`}
                    className="text-brand-600 hover:text-brand-800 text-sm font-bold flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </Link>
                  <a
                    href={asset.access_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-brand-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
