
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Box,
    Settings,
    Search,
    ShoppingBag,
    ChevronRight,
    Star,
    Plus,
    Minus,
    Utensils,
    QrCode,
    AlertCircle
} from 'lucide-react';
import { Asset } from '../../types';
import { QRCodeModal } from '../../components/portal/QRCodeModal';

const SceneDashboard: React.FC = () => {
    const { assetId } = useParams<{ assetId: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('Mains');
    const [selectedAssetForQR, setSelectedAssetForQR] = useState<Asset | null>(null);

    // Simulate loading
    useEffect(() => {
        try {
            setError(null);
            const timer = setTimeout(() => setIsLoading(false), 800);
            return () => clearTimeout(timer);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load scene';
            console.error("Failed to load scene dashboard", err);
            setError(errorMessage);
            setIsLoading(false);
        }
    }, []);

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

    const categories = ['Starters', 'Mains', 'Desserts', 'Drinks', 'Sides'];

    const menuItems = [
        {
            id: 'item-1',
            name: assetId === 'new' ? 'Untitled Project' : 'The Signature Burger',
            description: 'Juicy beef patty, melted cheddar, caramelized onions, and our secret sauce.',
            price: '$18.00',
            image: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
            category: 'Mains',
            isMain: true
        },
        {
            id: 'item-2',
            name: 'Truffle Fries',
            description: 'Crispy golden fries tossed with truffle oil and parmesan cheese.',
            price: '$8.50',
            image: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Placeholder
            category: 'Sides',
            isMain: false
        },
        {
            id: 'item-3',
            name: 'Classic Milkshake',
            description: 'Creamy vanilla milkshake topped with whipped cream and a cherry.',
            price: '$6.00',
            image: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Placeholder
            category: 'Drinks',
            isMain: false
        },
        {
            id: 'item-4',
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce, croutons, parmesan, and signature dressing.',
            price: '$12.00',
            image: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Placeholder
            category: 'Starters',
            isMain: false
        }
    ];

    // const filteredItems = menuItems.filter(item =>
    //     activeCategory === 'All' || item.category === activeCategory || (activeCategory === 'Mains' && item.isMain)
    // );

    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 font-sans pb-24">
            {/* Header / Navigation Overlay */}
            <nav className="fixed top-0 w-full z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 transition-all duration-300">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/app/dashboard" className="p-2 -ml-2 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    <div className="font-serif font-bold text-lg tracking-wide text-white">
                        Menu Editor
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero / Banner Area */}
            <div className="relative h-48 md:h-64 w-full overflow-hidden mt-16">
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2574&auto=format&fit=crop"
                    alt="Restaurant Ambiance"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 max-w-3xl mx-auto left-0 right-0">
                    <div className="flex items-center gap-2 text-amber-500 mb-2">
                        <Utensils className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Fine Dining</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-1">
                        TableQR Demo
                    </h1>
                    <div className="flex items-center gap-4 text-xs text-stone-400">
                        <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Open Now</span>
                        <span>• Italian Cuisine</span>
                        <span>• $$$</span>
                    </div>
                </div>
            </div>

            {/* Sticky Category Nav */}
            <div className="sticky top-16 z-40 bg-stone-950/95 border-b border-stone-800 backdrop-blur-sm shadow-lg">
                <div className="max-w-3xl mx-auto overflow-x-auto no-scrollbar py-3 px-4 flex gap-4">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activeCategory === cat
                                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
                                : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Menu List */}
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-12">
                {categories.map(category => {
                    const categoryItems = menuItems.filter(item => item.category === category);
                    if (categoryItems.length === 0) return null;

                    return (
                        <div key={category} id={category}>
                            <h2 className="text-xl font-bold text-white mb-4 px-1 flex items-center gap-2 sticky top-28 bg-stone-950/95 py-2 z-30">
                                {category}
                                <span className="text-xs font-normal text-stone-500 bg-stone-900 px-2 py-0.5 rounded-full border border-stone-800">
                                    {categoryItems.length}
                                </span>
                            </h2>

                            <div className="space-y-4">
                                {categoryItems.map((item) => (
                                    <div key={item.id} className="group block relative">
                                        <Link
                                            to={item.isMain ? `/app/editor/${assetId}/3d` : '#'}
                                            className="block"
                                            onClick={(e) => !item.isMain && e.preventDefault()}
                                        >
                                            <div className="flex bg-stone-900 border border-stone-800 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 relative">

                                                {/* Left Content */}
                                                <div className="flex-1 p-4 flex flex-col">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-base font-bold text-white group-hover:text-amber-500 transition-colors line-clamp-1 mb-1">
                                                            {item.name}
                                                        </h3>
                                                    </div>

                                                    <p className="text-stone-400 text-xs leading-relaxed line-clamp-2 mb-3">
                                                        {item.description}
                                                    </p>

                                                    <div className="mt-auto flex items-center justify-between">
                                                        <span className="font-mono text-amber-500 font-bold text-sm">
                                                            {item.price}
                                                        </span>

                                                        {item.isMain ? (
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-950 px-2 py-1 rounded border border-stone-800 group-hover:border-amber-500/30 transition-colors">
                                                                <Box className="w-3 h-3 text-amber-500" />
                                                                3D READY
                                                            </div>
                                                        ) : (
                                                            <button className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-amber-600 hover:text-white transition-colors">
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right Image (Square) */}
                                                <div className="w-32 h-32 bg-stone-800 relative shrink-0 border-l border-stone-800">
                                                    {/* @ts-ignore - model-viewer custom element */}
                                                    <model-viewer
                                                        src={item.image}
                                                        poster="https://via.placeholder.com/150"
                                                        alt={item.name}
                                                        auto-rotate
                                                        camera-controls={false}
                                                        interaction-prompt="none"
                                                        style={{ width: '100%', height: '100%' }}
                                                        className="mix-blend-normal transform scale-[0.8] group-hover:scale-100 transition-transform duration-500"
                                                    ></model-viewer>
                                                    {item.isMain && (
                                                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                                                            <span className="bg-amber-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                                                                TOP
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>

                                        {/* QR Code Button - Positioned absolutely over the card but separate from the link */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSelectedAssetForQR({
                                                    id: item.id,
                                                    name: item.name,
                                                    thumb: item.image,
                                                    status: 'Published' // Mock status
                                                });
                                            }}
                                            className="absolute top-2 right-2 z-20 p-1.5 bg-black/60 hover:bg-amber-600 text-white/80 hover:text-white rounded-lg backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                                            title="View QR Code"
                                        >
                                            <QrCode className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Add New Item Placeholder */}
                <button className="w-full py-4 border border-dashed border-stone-800 rounded-xl text-stone-500 hover:text-white hover:bg-stone-900/30 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                    <Plus className="w-4 h-4" /> Add New Item
                </button>
            </div>

            <QRCodeModal
                isOpen={!!selectedAssetForQR}
                onClose={() => setSelectedAssetForQR(null)}
                asset={selectedAssetForQR}
            />

            {/* Bottom Floating Action Bar (View Order Style) */}
            <div className="fixed bottom-0 left-0 w-full p-4 z-50 bg-gradient-to-t from-stone-950 to-transparent pt-8 pointer-events-none">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                    <button className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-xl shadow-xl shadow-black/50 flex items-center justify-between px-6 transition-transform active:scale-[0.98]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center font-bold text-sm">
                                2
                            </div>
                            <span className="font-bold text-sm uppercase tracking-wide">View Order</span>
                        </div>
                        <span className="font-bold font-mono text-lg">$26.50</span>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default SceneDashboard;
