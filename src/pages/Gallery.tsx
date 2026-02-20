import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Asset } from '@/types';
import { AssetsProvider } from '@/services/dataProvider';
import { Box, PlayCircle, X, Search, Loader2 } from 'lucide-react';
import { SEO } from '@/components/common/SEO';

// Declare model-viewer type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

const Gallery: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialFilter = params.get('industry');

  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>(initialFilter ?? 'All');
  const [copied, setCopied] = useState(false);

  // Reset copied state when switching assets
  useEffect(() => {
    setCopied(false);
  }, [selectedAsset]);

  useEffect(() => {
    import('@google/model-viewer');
  }, []);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const data = await AssetsProvider.list();
        const publishedAssets = (data as Asset[]).filter((a) => (a.status as any) === 'published');
        setAssets(publishedAssets);
      } catch (error) {
        console.error('Failed to load gallery assets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || asset.type === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', ...Array.from(new Set(assets.map((a) => a.type).filter(Boolean)))];

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 min-h-screen py-8 md:py-16">
      <SEO
        title="3D Gallery"
        description="Browse our collection of high-fidelity 3D food and product captures. Interact with models in 3D and AR."
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 mb-4 animate-fade-in-up">
            Capture Gallery
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            Explore our collection of high-fidelity 3D assets. Click any model to interact with it
            in 3D/AR.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as string)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  filter === cat
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 transform scale-105'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-brand-300 dark:hover:border-brand-500 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-zinc-400" />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
          </div>
        ) : filteredAssets.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedAsset(asset)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedAsset(asset);
                  }
                }}
                className="group break-inside-avoid bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-2xl hover:shadow-brand-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-700">
                  <img
                    src={asset.thumb}
                    alt={asset.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                      <PlayCircle className="w-16 h-16 text-white drop-shadow-2xl animate-pulse" />
                      <p className="text-white font-bold text-center mt-2 drop-shadow-lg">
                        View 3D Model
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/95 dark:bg-zinc-900/95 rounded-full text-xs font-bold text-zinc-900 dark:text-white shadow-md backdrop-blur-sm border border-white/50 dark:border-zinc-700/50">
                    {asset.type}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2">
                    {asset.name}
                  </h3>
                  <div className="flex items-center justify-between mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5" />
                      <span className="font-medium">{asset.size || '3MB'}</span>
                    </div>
                    <span className="font-medium">
                      {asset.viewCount?.toLocaleString() || 0} views
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-500 dark:text-zinc-400">
            <p className="text-xl">No models found matching your criteria.</p>
            <button
              onClick={() => {
                setFilter('All');
                setSearchTerm('');
              }}
              className="mt-4 text-brand-600 hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* 3D Viewer Modal */}
      {selectedAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={`3D viewer: ${selectedAsset.name}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedAsset(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSelectedAsset(null);
          }}
        >
          <div className="relative w-full max-w-6xl bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-[75vh] animate-slide-up">
            <button
              onClick={() => setSelectedAsset(null)}
              className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/30 active:bg-white/40 rounded-full text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Viewer */}
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 relative">
              <model-viewer
                src={
                  selectedAsset.file_key?.startsWith('http') ? selectedAsset.file_key : undefined
                }
                poster={selectedAsset.thumb}
                alt={selectedAsset.name}
                auto-rotate
                camera-controls
                shadow-intensity="1"
                ar
                style={{ width: '100%', height: '100%' }}
              >
                <div slot="progress-bar" className="absolute top-0 left-0 w-full h-1 bg-zinc-200">
                  <div
                    className="h-full bg-brand-600 transition-all duration-300"
                    style={{ width: '0%' }}
                    id="progress-bar"
                  ></div>
                </div>
              </model-viewer>

              {!selectedAsset.file_key?.startsWith('http') && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white p-6 text-center">
                  <p>
                    3D preview is loading or not yet available for this asset.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar Details */}
            <div className="w-full md:w-96 bg-white dark:bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 p-6 md:p-8 flex flex-col overflow-y-auto">
              <div>
                <span className="inline-block px-4 py-1.5 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold mb-4 border border-brand-200 dark:border-brand-800">
                  {selectedAsset.type}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-3 leading-tight">
                  {selectedAsset.name}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                  High-fidelity 3D capture optimized for web and AR experiences. Photorealistic
                  textures with true-to-life detail.
                </p>
              </div>

              <div className="space-y-3 mb-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between py-2">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    File Size
                  </span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    {selectedAsset.size}
                  </span>
                </div>
                <div className="h-px bg-zinc-200 dark:bg-zinc-700"></div>
                <div className="flex justify-between py-2">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Format
                  </span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    GLB (Binary)
                  </span>
                </div>
                <div className="h-px bg-zinc-200 dark:bg-zinc-700"></div>
                <div className="flex justify-between py-2">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Views
                  </span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    {selectedAsset.viewCount?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <button
                  onClick={() => window.open(`/view/${selectedAsset.id}`, '_blank')}
                  className="group w-full py-3.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:scale-105 active:scale-100 flex items-center justify-center gap-2"
                >
                  View in AR
                  <Box className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/view/${selectedAsset.id}`;
                    navigator.clipboard.writeText(url).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }).catch(() => {});
                  }}
                  className="group w-full py-3.5 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:scale-105 active:scale-100"
                >
                  {copied ? 'Copied!' : 'Copy Share Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
