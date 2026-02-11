import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Download, Share2, Box, Edit } from 'lucide-react';
import { Asset } from '@/types';


import { QRCodeModal } from '@/QRCodeModal';

interface AssetGridProps {
    assets: Asset[];
    role: 'employee' | 'customer';
}

export const AssetGrid: React.FC<AssetGridProps> = ({ assets, role }) => {
    const [selectedAssetForQR, setSelectedAssetForQR] = React.useState<Asset | null>(null);

    return (
        <>
            <QRCodeModal
                isOpen={!!selectedAssetForQR}
                onClose={() => setSelectedAssetForQR(null)}
                asset={selectedAssetForQR}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {assets.map(asset => (
                    <div key={asset.id} className="group relative bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-stone-800 hover:border-amber-500/60 dark:hover:border-amber-700/60 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/10">
                        {/* Image */}
                        <div className="relative aspect-[4/3] bg-slate-100 dark:bg-stone-800 overflow-hidden">
                            <img
                                src={asset.thumb}
                                alt={asset.name}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700 scale-105 group-hover:scale-100"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
                                <Link to={`/app/editor/${asset.id}`}>
                                    <button
                                        className="bg-amber-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg shadow-amber-900/40 hover:bg-amber-500 mb-3"
                                    >
                                        <Box className="w-5 h-5" /> View
                                    </button>
                                </Link>
                                <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                    <Link to={`/app/editor/${asset.id}`}>
                                        <button
                                            className="bg-white/90 text-stone-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-white transition-colors"
                                        >
                                            <Edit className="w-4 h-4" /> Edit
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => setSelectedAssetForQR(asset)}
                                        className="bg-white/90 text-stone-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-white transition-colors"
                                    >
                                        <Share2 className="w-4 h-4" /> QR
                                    </button>
                                </div>
                            </div>

                            {/* Status Badge (Top Left like Tags) */}
                            <div className="absolute top-3 left-3">
                                <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider ${asset.status === 'Published'
                                    ? 'bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30 backdrop-blur-md'
                                    : 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 backdrop-blur-md'
                                    }`}>
                                    {asset.status}
                                </span>
                            </div>

                            {/* 3D Badge (Top Right) */}
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-white uppercase tracking-wider flex items-center gap-1">
                                <Box className="w-3 h-3" /> 3D
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-amber-50">{asset.name}</h3>
                                <div className="flex gap-2">
                                    {role === 'customer' && (
                                        <>
                                            <button className="text-slate-400 hover:text-amber-600 transition-colors" title="Download">
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button className="text-slate-400 hover:text-amber-600 transition-colors" title="Share">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <p className="text-slate-500 dark:text-stone-400 text-sm mb-4 leading-relaxed line-clamp-2">
                                {asset.type || '3D Model'} • {asset.size || 'Unknown size'} • Last updated {asset.updated || 'recently'}
                            </p>

                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-stone-800 pt-4 mt-auto">
                                <span className="text-xs text-slate-400 dark:text-stone-500 font-mono">ID: {asset.id}</span>
                                <Link to={`/app/editor/${asset.id}`} className="text-xs text-amber-600 dark:text-amber-500 hover:text-amber-500 font-bold flex items-center gap-1 transition-colors">
                                    <Edit className="w-3 h-3" /> Open Editor
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
