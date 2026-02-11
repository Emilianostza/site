import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Industry } from '@/types';
import { Box, PlayCircle } from 'lucide-react';

const MOCK_MODELS = [
  { id: 1, title: 'Signature Burger', industry: Industry.Restaurant, img: 'https://picsum.photos/seed/burger/400/400' },
  { id: 2, title: 'Ancient Vase', industry: Industry.Museum, img: 'https://picsum.photos/seed/vase/400/400' },
  { id: 3, title: 'Running Shoe', industry: Industry.Ecommerce, img: 'https://picsum.photos/seed/shoe/400/400' },
  { id: 4, title: 'Espresso Machine', industry: Industry.Ecommerce, img: 'https://picsum.photos/seed/coffee/400/400' },
  { id: 5, title: 'Cocktail', industry: Industry.Restaurant, img: 'https://picsum.photos/seed/drink/400/400' },
  { id: 6, title: 'Fossil Specimen', industry: Industry.Museum, img: 'https://picsum.photos/seed/fossil/400/400' },
];

const Gallery: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialFilter = params.get('industry');

  const [filter, setFilter] = useState<string>(initialFilter ? 
    (initialFilter === 'restaurants' ? Industry.Restaurant : 
     initialFilter === 'museums' ? Industry.Museum : 
     initialFilter === 'ecommerce' ? Industry.Ecommerce : 'All') 
    : 'All');

  const filteredModels = filter === 'All' 
    ? MOCK_MODELS 
    : MOCK_MODELS.filter(m => m.industry === filter);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Capture Gallery</h1>
          <p className="text-slate-600 dark:text-slate-400">Explore high-fidelity 3D assets captured by our team.</p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {['All', Industry.Restaurant, Industry.Museum, Industry.Ecommerce].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === f
                  ? 'bg-brand-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModels.map((model) => (
            <div key={model.id} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all cursor-pointer">
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-700">
                <img src={model.img} alt={model.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-white" />
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 rounded-full text-xs font-bold text-slate-900 dark:text-white shadow-sm">
                  {model.industry}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{model.title}</h3>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-2 gap-2">
                  <Box className="w-3 h-3" />
                  <span>3D Model • AR Ready</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;