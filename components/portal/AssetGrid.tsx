import React from 'react';
import { Eye, Download, Share2, Box } from 'lucide-react';
import { Asset } from '../../types';
import { AssetViewerModal } from './AssetViewerModal';

interface AssetGridProps {
    assets: Asset[];
    role: 'employee' | 'customer';
}

export const AssetGrid: React.FC<AssetGridProps> = ({ assets, role }) => {
    const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {assets.map(asset => (
                    <div key={asset.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="aspect-square bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                            <img src={asset.thumb} alt={asset.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${asset.status === 'Published' ? 'bg-green-100/90 dark:bg-green-900/90 text-green-600 dark:text-green-400' : 'bg-orange-100/90 dark:bg-orange-900/90 text-orange-600 dark:text-orange-400'}`}>
                                {asset.status}
                            </span>

                            {/* Hover Overlay with 3D Button */}
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => setSelectedAsset(asset)}
                                    className="bg-white/90 text-slate-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-white hover:scale-105 transition-all shadow-lg"
                                >
                                    <Box className="w-4 h-4" /> View 3D
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">{asset.name}</h3>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setSelectedAsset(asset)}
                                    className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded"
                                    title="View"
                                    aria-label={`View ${asset.name}`}
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                {role === 'customer' && (
                                    <>
                                        <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded" title="Download" aria-label={`Download ${asset.name}`}>
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded" title="Share" aria-label={`Share ${asset.name}`}>
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedAsset && (
                <AssetViewerModal
                    isOpen={!!selectedAsset}
                    onClose={() => setSelectedAsset(null)}
                    modelUrl="https://modelviewer.dev/shared-assets/models/Astronaut.glb" // Using mock URL as in RestaurantMenu
                    assetName={selectedAsset.name}
                />
            )}
        </>
    );
};
