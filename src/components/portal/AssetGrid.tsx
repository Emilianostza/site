import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Share2,
  Box,
  Edit,
  PackageOpen,
  Filter,
  LayoutGrid,
  List,
  Search,
  MoreVertical,
  Eye,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { Asset } from '@/types';

import { QRCodeModal } from '@/components/portal/QRCodeModal';

interface AssetGridProps {
  assets: Asset[];
  role: 'employee' | 'customer';
}

type SortOption = 'newest' | 'oldest' | 'views' | 'name';

export const AssetGrid: React.FC<AssetGridProps> = ({ assets, role }) => {
  const [selectedAssetForQR, setSelectedAssetForQR] = useState<Asset | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Derive unique categories from assets
  const categories = useMemo(() => {
    const uniqueTypes = Array.from(new Set(assets.map((a) => a.type || 'Uncategorized')));
    return ['All', ...uniqueTypes.sort()];
  }, [assets]);

  // Filter and sort assets
  const processedAssets = useMemo(() => {
    const filtered =
      activeCategory === 'All'
        ? [...assets]
        : assets.filter((a) => (a.type || 'Uncategorized') === activeCategory);

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.updated || 0).getTime() - new Date(a.updated || 0).getTime();
        case 'oldest':
          return new Date(a.updated || 0).getTime() - new Date(b.updated || 0).getTime();
        case 'views':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [assets, activeCategory, sortBy]);

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 shadow-sm">
          <PackageOpen className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          No assets found
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-sm leading-relaxed">
          Your collection is currently empty. Assets will appear here once your capture project is
          processed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <QRCodeModal
        isOpen={Boolean(selectedAssetForQR)}
        onClose={() => setSelectedAssetForQR(null)}
        asset={selectedAssetForQR}
      />

      {/* Controls Header — only for employee role */}
      {role === 'employee' && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          {/* Category Filters */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto p-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* View & Sort Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto px-1">
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-sm font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="views">Most Viewed</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {processedAssets.map((asset) => (
            <div
              key={asset.id}
              className="group relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <img
                  src={asset.thumb}
                  alt={asset.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                      asset.status === 'Published'
                        ? 'bg-white/90 dark:bg-black/50 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50'
                        : 'bg-white/90 dark:bg-black/50 text-orange-700 dark:text-orange-400 border-orange-200/50 dark:border-orange-800/50'
                    }`}
                  >
                    {asset.status}
                  </span>
                </div>

                {/* 3D Indicator */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                    <Box className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                </div>

                {/* Hover Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Link
                    to={`/project/${asset.project_id}/menu`}
                    className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
                  >
                    <button className="bg-white text-zinc-900 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-zinc-100 hover:scale-105 transition-all shadow-xl flex items-center gap-2">
                      View <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link
                    to={`/project/${asset.project_id}/menu/edit`}
                    className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100"
                  >
                    <button className="bg-white text-zinc-900 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-zinc-100 hover:scale-105 transition-all shadow-xl flex items-center gap-2">
                      Edit <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => setSelectedAssetForQR(asset)}
                    className="bg-zinc-900/80 text-white p-2.5 rounded-full hover:bg-black hover:scale-105 transition-all shadow-xl transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150 backdrop-blur-sm border border-white/10"
                    title="Generate QR"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {asset.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
                      {asset.type || '3D Model'}
                    </p>
                  </div>
                  <Link to={`/project/${asset.project_id}/menu/edit`}>
                    <button className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                  </Link>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <Eye className="w-3.5 h-3.5" />
                    {(asset.viewCount || 0).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(asset.updated || Date.now()).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="ml-auto">
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                      {asset.file_size
                        ? (asset.file_size / 1024 / 1024).toFixed(1) + 'MB'
                        : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
              <tr>
                <th className="px-6 py-4 font-medium">Asset</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium text-right">Views</th>
                <th className="px-6 py-4 font-medium text-right">Last Updated</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {processedAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={asset.thumb}
                        alt={asset.name}
                        className="w-12 h-12 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800"
                      />
                      <div>
                        <div className="font-bold text-zinc-900 dark:text-white">{asset.name}</div>
                        <div className="text-xs text-zinc-500 font-mono mt-0.5">
                          {asset.id.slice(0, 8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        asset.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          asset.status === 'Published' ? 'bg-emerald-500' : 'bg-orange-500'
                        }`}
                      />
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {asset.type || 'Standard'}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-zinc-600 dark:text-zinc-400">
                    {(asset.viewCount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-600 dark:text-zinc-400">
                    {new Date(asset.updated || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/project/${asset.project_id}/menu/edit`}>
                        <button className="p-2 text-zinc-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => setSelectedAssetForQR(asset)}
                        className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
