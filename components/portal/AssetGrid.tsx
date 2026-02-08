import React from 'react';
import { Eye, Download, Share2 } from 'lucide-react';

export interface Asset {
    id: string;
    name: string;
    thumb: string;
    status: 'Published' | 'In Review' | 'Processing';
}

interface AssetGridProps {
    assets: Asset[];
    role: 'employee' | 'customer';
}

export const AssetGrid: React.FC<AssetGridProps> = ({ assets, role }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {assets.map(asset => (
                <div key={asset.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-slate-100 relative">
                        <img src={asset.thumb} alt={asset.name} className="w-full h-full object-cover" />
                        <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded bg-white/90 ${asset.status === 'Published' ? 'text-green-600' : 'text-orange-600'}`}>
                            {asset.status}
                        </span>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-slate-900 text-sm mb-3">{asset.name}</h3>
                        <div className="flex justify-between">
                            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded" title="View">
                                <Eye className="w-4 h-4" />
                            </button>
                            {role === 'customer' && (
                                <>
                                    <button className="p-2 text-slate-500 hover:bg-slate-50 rounded" title="Download">
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-slate-500 hover:bg-slate-50 rounded" title="Share">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
