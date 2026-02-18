import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Box,
  Search,
  Utensils,
  QrCode,
  AlertCircle,
  Plus,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Asset } from '@/types';
import { QRCodeModal } from '@/components/portal/QRCodeModal';
import { EmbeddedModelEditor } from '@/components/editor/EmbeddedModelEditor';
import { AssetsProvider } from '@/services/dataProvider';
import { NewCaptureWizard } from '@/components/editor/NewCaptureWizard';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  thumb: string;
  modelUrl: string;
  category: string;
  isMain: boolean;
}

const SceneDashboard: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Mains');
  const [selectedAssetForQR, setSelectedAssetForQR] = useState<Asset | null>(null);

  // Split Screen State
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);

  // Simulate loading
  useEffect(() => {
    try {
      setError(null);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load scene';
      console.error('Failed to load scene dashboard', err);
      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  const categories = ['Starters', 'Mains', 'Desserts', 'Drinks', 'Sides'];

  const [menuItems, setMenuItems] = useState([
    {
      id: 'item-1',
      name: 'The Signature Burger',
      description: 'Juicy beef patty, melted cheddar, caramelized onions, and our secret sauce.',
      price: '$18.00',
      thumb: 'https://picsum.photos/seed/burger/200/200',
      modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      category: 'Mains',
      isMain: true,
    },
    {
      id: 'item-2',
      name: 'Truffle Fries',
      description: 'Crispy golden fries tossed with truffle oil and parmesan cheese.',
      price: '$8.50',
      thumb: 'https://picsum.photos/seed/fries/200/200',
      modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      category: 'Sides',
      isMain: false,
    },
    {
      id: 'item-3',
      name: 'Classic Milkshake',
      description: 'Creamy vanilla milkshake topped with whipped cream and a cherry.',
      price: '$6.00',
      thumb: 'https://picsum.photos/seed/shake/200/200',
      modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      category: 'Drinks',
      isMain: false,
    },
    {
      id: 'item-4',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce, croutons, parmesan, and signature dressing.',
      price: '$12.00',
      thumb: 'https://picsum.photos/seed/salad/200/200',
      modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      category: 'Starters',
      isMain: false,
    },
  ]);

  // Load asset if ID is present
  useEffect(() => {
    const loadAsset = async () => {
      // Early return for 'new' or no ID
      if (!assetId || assetId === 'new') {
        if (!selectedItem && menuItems.length > 0) {
          setSelectedItem(menuItems[0]);
        }
        return;
      }

      try {
        // Check if already in list
        const existing = menuItems.find((i) => i.id === assetId);
        if (existing) {
          setSelectedItem(existing);
          return;
        }

        // Fetch from provider
        const asset = await AssetsProvider.get(assetId);
        if (asset) {
          const newItem = {
            id: asset.id,
            name: asset.name,
            description: asset.type || 'Imported Asset',
            price: '--',
            thumb: (asset as { thumb?: string }).thumb || '',
            modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Fallback for mock
            category: 'Mains', // Defaulting to Mains for now
            isMain: true,
          };
          setMenuItems((prev) => [...prev, newItem]);
          setSelectedItem(newItem);
          setActiveCategory('Mains');
        }
      } catch (err) {
        console.error('Failed to fetch asset', err);
      }
    };
    loadAsset();
  }, [assetId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 max-w-md">
          <div className="flex gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-200">Error Loading Scene</p>
              <p className="text-sm text-red-300 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-stone-950 text-stone-200 font-sans flex flex-col overflow-hidden">
      {/* Header / Navigation Overlay */}
      <nav className="w-full z-50 bg-stone-900 border-b border-stone-800 flex-shrink-0 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            to="/app/dashboard"
            className="p-2 -ml-2 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="font-serif font-bold text-lg tracking-wide text-white">Menu Editor</div>
        </div>

        <div className="flex items-center gap-4 text-xs text-stone-400 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800">
          <Utensils className="w-3 h-3 text-amber-500" />
          <span>TableQR Demo</span>
          <span className="text-stone-600">|</span>
          <span className="text-green-400">Live</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-stone-800 mx-2"></div>
          <button
            onClick={() => setIsEditorExpanded(!isEditorExpanded)}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isEditorExpanded ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-white'}`}
          >
            {isEditorExpanded ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
            {isEditorExpanded ? 'Show List' : 'Expand Editor'}
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {assetId === 'new' ? (
          <NewCaptureWizard />
        ) : (
          <>
            {/* LEFT PANEL: Menu List */}
            <div
              className={`
                        bg-stone-950 border-r border-stone-800 transition-all duration-300 flex flex-col
                        ${isEditorExpanded ? 'w-0 opacity-0 overflow-hidden' : 'w-full md:w-80 lg:w-96'} 
                    `}
            >
              {/* Categories */}
              <div className="p-2 border-b border-stone-800 overflow-x-auto no-scrollbar flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeCategory === cat
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Item List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {menuItems
                  .filter((item) => item.category === activeCategory)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`
                                    group flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-all duration-200
                                    ${
                                      selectedItem?.id === item.id
                                        ? 'bg-stone-900 border-amber-600 ring-1 ring-amber-600/50'
                                        : 'bg-stone-900/50 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                                    }
                                `}
                    >
                      <div className="w-12 h-12 rounded-lg bg-stone-800 overflow-hidden flex-shrink-0 relative">
                        <img
                          src={item.thumb}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {selectedItem?.id === item.id && (
                          <div className="absolute inset-0 bg-amber-600/20 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="w-2 h-2 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-sm font-bold truncate ${selectedItem?.id === item.id ? 'text-white' : 'text-stone-300'}`}
                        >
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-stone-500 truncate">{item.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono text-amber-500">{item.price}</span>
                          {item.isMain && (
                            <span className="text-[8px] bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded border border-stone-700">
                              3D
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAssetForQR({
                            id: item.id,
                            name: item.name,
                            thumb: item.thumb,
                            status: 'Published',
                          });
                        }}
                        className="p-2 rounded-lg hover:bg-stone-800 text-stone-600 hover:text-white transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                <button className="w-full py-3 border border-dashed border-stone-800 rounded-xl text-stone-500 hover:text-white hover:bg-stone-900/50 hover:border-stone-700 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide">
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
            </div>

            {/* RIGHT PANEL: Editor */}
            <div className="flex-1 bg-stone-950 relative overflow-hidden flex flex-col">
              {selectedItem ? (
                <EmbeddedModelEditor
                  key={selectedItem.id}
                  assetId={selectedItem.id}
                  initialData={selectedItem}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-stone-500">
                  <Box className="w-16 h-16 mb-4 opacity-20" />
                  <p>Select an item to edit 3D scene</p>
                </div>
              )}
            </div>
          </>
        )}

        <QRCodeModal
          isOpen={Boolean(selectedAssetForQR)}
          onClose={() => setSelectedAssetForQR(null)}
          asset={selectedAssetForQR}
        />
      </div>
    </div>
  );
};

export default SceneDashboard;
