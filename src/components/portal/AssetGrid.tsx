import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Share2, Box, Edit, PackageOpen } from 'lucide-react';
import { Asset } from '@/types';

import { QRCodeModal } from '@/components/portal/QRCodeModal';

interface AssetGridProps {
  assets: Asset[];
  role: 'employee' | 'customer';
}

export const AssetGrid: React.FC<AssetGridProps> = ({ assets, role }) => {
  const [selectedAssetForQR, setSelectedAssetForQR] = React.useState<Asset | null>(null);

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <PackageOpen className="w-7 h-7 text-zinc-400 dark:text-zinc-500" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
          No assets yet
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-xs">
          Assets will appear here once your capture project is complete and reviewed.
        </p>
      </div>
    );
  }

  return (
    <>
      <QRCodeModal
        isOpen={Boolean(selectedAssetForQR)}
        onClose={() => setSelectedAssetForQR(null)}
        asset={selectedAssetForQR}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-brand-400/60 dark:hover:border-brand-600/60 transition-all duration-300 hover:shadow-hover"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <img
                src={asset.thumb}
                alt={asset.name}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 scale-[1.03] group-hover:scale-100"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-zinc-950/50 backdrop-blur-[2px]">
                <Link to={`/project/${asset.project_id}/menu`}>
                  <button className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 translate-y-3 group-hover:translate-y-0 transition-transform duration-200 shadow-glow mb-2.5">
                    <Box className="w-4 h-4" /> View in 3D
                  </button>
                </Link>
                <div className="flex gap-2 translate-y-3 group-hover:translate-y-0 transition-transform duration-200 delay-75">
                  <Link to={`/project/${asset.project_id}/menu/edit`}>
                    <button className="bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white px-3.5 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:bg-white dark:hover:bg-zinc-900 transition-colors">
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => setSelectedAssetForQR(asset)}
                    className="bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white px-3.5 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:bg-white dark:hover:bg-zinc-900 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" /> QR
                  </button>
                </div>
              </div>

              {/* Status badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider backdrop-blur-sm ${
                    asset.status === 'Published'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25'
                      : 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border border-orange-500/25'
                  }`}
                >
                  {asset.status}
                </span>
              </div>

              {/* 3D badge */}
              <div className="absolute top-3 right-3 bg-zinc-900/70 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-white/80 uppercase tracking-wider flex items-center gap-1">
                <Box className="w-3 h-3" /> 3D
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-1.5">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white truncate pr-2">
                  {asset.name}
                </h3>
                {role === 'customer' && (
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-zinc-400 dark:text-zinc-500 text-xs mb-4 leading-relaxed">
                {asset.type || '3D Model'} · {asset.size || 'Unknown size'} · Updated{' '}
                {asset.updated || 'recently'}
              </p>

              <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3.5">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono tabular-nums">
                  {asset.id.slice(0, 8)}…
                </span>
                <Link
                  to={`/project/${asset.project_id}/menu/edit`}
                  className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-500 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit className="w-3 h-3" /> Edit Menu
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
