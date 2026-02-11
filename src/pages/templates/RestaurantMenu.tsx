import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProjectsProvider } from '@/services/dataProvider';
import { ArrowLeft, Box, ChefHat, X, ChevronLeft, ChevronRight, Smartphone, RotateCcw, Maximize2, Minimize2, Info } from 'lucide-react';
import { Project } from '@/types';

interface MenuItem {
    name: string;
    desc: string;
    price: string;
    image: string;
    calories: string;
    tags: string[];
    modelUrl: string;
}

const RestaurantMenu: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewerState, setViewerState] = useState<{ index: number } | null>(null);
    const [modelLoaded, setModelLoaded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showInfo, setShowInfo] = useState(true);

    // Dynamically load @google/model-viewer only when 3D viewer is opened
    useEffect(() => {
        if (viewerState) {
            import('@google/model-viewer');
        }
    }, [viewerState]);

    // Reset model loaded state when switching items
    useEffect(() => {
        setModelLoaded(false);
    }, [viewerState?.index]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projects = await ProjectsProvider.list();
                const found = projects.find(p => p.id === id);
                if (found) setProject(found);
            } catch (e) {
                console.error("Failed to load project");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Mock Menu Items
    const menuItems: MenuItem[] = [
        {
            name: "Signature Burger",
            desc: "Wagyu beef patty, aged white cheddar, house-made truffle aioli, caramelized onions on a toasted brioche bun.",
            price: "$24",
            image: "https://picsum.photos/seed/burger/400/300",
            calories: "850 kcal",
            tags: ["Chef's Pick", "Bestseller"],
            modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
        },
        {
            name: "Truffle Fries",
            desc: "Hand-cut Kennebec potatoes, parmesan dust, fresh herbs, drizzled with black truffle oil.",
            price: "$12",
            image: "https://picsum.photos/seed/fries/400/300",
            calories: "450 kcal",
            tags: ["Vegetarian", "Shareable"],
            modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
        },
        {
            name: "Artisan Shake",
            desc: "Tahitian vanilla bean, house salted caramel swirl, whipped cream, edible gold leaf.",
            price: "$16",
            image: "https://picsum.photos/seed/shake/400/300",
            calories: "600 kcal",
            tags: ["Signature", "Sweet"],
            modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
        },
        {
            name: "Lobster Roll",
            desc: "Maine lobster, lemon-herb butter, chives, served on a toasted New England split-top roll.",
            price: "$32",
            image: "https://picsum.photos/seed/lobster/400/300",
            calories: "520 kcal",
            tags: ["Premium", "Seasonal"],
            modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
        },
        {
            name: "Wagyu Tartare",
            desc: "A5 wagyu, quail egg yolk, capers, shallots, dijon, served with crostini.",
            price: "$28",
            image: "https://picsum.photos/seed/tartare/400/300",
            calories: "380 kcal",
            tags: ["Raw", "Chef's Pick"],
            modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
        },
        {
            name: "Crème Brûlée",
            desc: "Classic Tahitian vanilla custard, torched sugar crust, fresh berries.",
            price: "$14",
            image: "https://picsum.photos/seed/creme/400/300",
            calories: "420 kcal",
            tags: ["Dessert", "Classic"],
            modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
        }
    ];

    const currentItem = viewerState ? menuItems[viewerState.index] : null;

    const navigateViewer = useCallback((direction: 1 | -1) => {
        if (!viewerState) return;
        const next = viewerState.index + direction;
        if (next >= 0 && next < menuItems.length) {
            setViewerState({ index: next });
        }
    }, [viewerState, menuItems.length]);

    // Keyboard navigation for the viewer
    useEffect(() => {
        if (!viewerState) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setViewerState(null);
            if (e.key === 'ArrowLeft') navigateViewer(-1);
            if (e.key === 'ArrowRight') navigateViewer(1);
            if (e.key === 'i') setShowInfo(prev => !prev);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [viewerState, navigateViewer]);

    // Lock body scroll when viewer is open
    useEffect(() => {
        if (viewerState) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [viewerState]);

    if (loading) {
        return (
            <div className="bg-stone-950 min-h-screen text-amber-50 flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-stone-400 text-sm">Loading Menu...</p>
            </div>
        );
    }
    if (!project) {
        return (
            <div className="bg-stone-950 min-h-screen text-amber-50 flex flex-col items-center justify-center gap-4">
                <ChefHat className="w-12 h-12 text-stone-600" />
                <p className="text-stone-400">Menu Not Found</p>
                <Link to="/app/dashboard" className="text-amber-500 hover:text-amber-400 text-sm underline underline-offset-4">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-950 text-amber-50 font-sans selection:bg-amber-900 selection:text-white" {...(import.meta.env.DEV && { 'data-component': 'Restaurant Menu Template', 'data-file': 'src/pages/templates/RestaurantMenu.tsx' })}>
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/app/dashboard" className="text-stone-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <div className="font-serif text-xl font-bold tracking-wider text-amber-500">
                        {project.client.toUpperCase()}
                    </div>
                    <div className="w-28" />
                </div>
            </nav>

            {/* Hero */}
            <header className="pt-32 pb-16 px-4 text-center">
                <div className="w-16 h-16 bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500 border border-amber-900/50">
                    <ChefHat className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{project.name}</h1>
                <p className="text-stone-400 max-w-lg mx-auto text-lg">
                    Experience our culinary masterpieces in interactive 3D before you order.
                </p>
                <div className="flex items-center justify-center gap-6 mt-8 text-stone-500 text-xs font-mono uppercase tracking-widest">
                    <span>{menuItems.length} Items</span>
                    <span className="w-1 h-1 bg-stone-700 rounded-full" />
                    <span>3D Interactive</span>
                    <span className="w-1 h-1 bg-stone-700 rounded-full" />
                    <span>AR Ready</span>
                </div>
            </header>

            {/* Menu Grid */}
            <div className="container mx-auto px-4 max-w-6xl pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {menuItems.map((item, idx) => (
                        <div key={item.name} className="group relative bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-700/60 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/10">
                            {/* Image */}
                            <div className="relative aspect-[4/3] bg-stone-800 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity duration-700 scale-105 group-hover:scale-100"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        onClick={() => setViewerState({ index: idx })}
                                        className="bg-amber-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg shadow-amber-900/40 hover:bg-amber-500"
                                    >
                                        <Box className="w-5 h-5" /> View in 3D
                                    </button>
                                </div>
                                {/* Tags */}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="absolute top-3 right-3 bg-amber-600/90 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-white uppercase tracking-wider flex items-center gap-1">
                                    <Box className="w-3 h-3" /> 3D
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold font-serif">{item.name}</h3>
                                    <span className="text-amber-500 font-bold font-mono text-lg">{item.price}</span>
                                </div>
                                <p className="text-stone-400 text-sm mb-4 leading-relaxed line-clamp-2">
                                    {item.desc}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-stone-500 font-mono">{item.calories}</span>
                                    <button
                                        onClick={() => setViewerState({ index: idx })}
                                        className="text-xs text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 transition-colors"
                                    >
                                        <Smartphone className="w-3 h-3" /> Try AR
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="pb-8 text-center text-stone-700 text-xs font-mono">
                <p>Powered by Managed Capture 3D</p>
            </footer>

            {/* ===== IMMERSIVE 3D VIEWER ===== */}
            {viewerState && currentItem && (
                <div className="fixed inset-0 z-[100] bg-stone-950">
                    {/* Model Viewer - Full background */}
                    <div className={`absolute inset-0 transition-all duration-500 ${isFullscreen ? '' : 'md:right-[380px]'}`}>
                        <model-viewer
                            src={currentItem.modelUrl}
                            alt={`3D model of ${currentItem.name}`}
                            auto-rotate
                            auto-rotate-delay="0"
                            rotation-per-second="30deg"
                            camera-controls
                            camera-orbit="45deg 75deg 1.5m"
                            shadow-intensity="1.5"
                            shadow-softness="0.8"
                            exposure="0.8"
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            touch-action="pan-y"
                            interaction-prompt="auto"
                            loading="eager"
                            style={{ width: '100%', height: '100%', background: 'transparent' }}
                            onLoad={() => setModelLoaded(true)}
                        ></model-viewer>

                        {/* Loading overlay */}
                        {!modelLoaded && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-950/80 gap-3">
                                <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-stone-400 text-sm font-mono">Loading 3D Model...</p>
                            </div>
                        )}

                        {/* Subtle gradient edges */}
                        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-stone-950/60 to-transparent pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-950/60 to-transparent pointer-events-none" />
                    </div>

                    {/* Top bar */}
                    <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 md:px-6 h-16">
                        <button
                            onClick={() => setViewerState(null)}
                            className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors bg-stone-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-stone-800"
                        >
                            <X className="w-4 h-4" />
                            <span className="text-sm font-medium hidden sm:inline">Close</span>
                        </button>

                        <div className="flex items-center gap-1 text-stone-500 text-xs font-mono bg-stone-900/60 backdrop-blur-md px-3 py-2 rounded-full border border-stone-800">
                            <span className="text-amber-500">{viewerState.index + 1}</span>
                            <span>/</span>
                            <span>{menuItems.length}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowInfo(prev => !prev)}
                                className={`p-2 rounded-full border transition-colors backdrop-blur-md ${showInfo ? 'bg-amber-600/20 border-amber-700 text-amber-500' : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-white'}`}
                                aria-label="Toggle item details"
                                title="Toggle details (I)"
                            >
                                <Info className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsFullscreen(prev => !prev)}
                                className="p-2 rounded-full bg-stone-900/60 backdrop-blur-md border border-stone-800 text-stone-400 hover:text-white transition-colors hidden md:flex"
                                aria-label="Toggle fullscreen view"
                            >
                                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Navigation arrows */}
                    <button
                        onClick={() => navigateViewer(-1)}
                        disabled={viewerState.index === 0}
                        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-stone-900/70 backdrop-blur-md border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800/80 transition-all disabled:opacity-20 disabled:pointer-events-none"
                        aria-label="Previous item"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => navigateViewer(1)}
                        disabled={viewerState.index === menuItems.length - 1}
                        className={`absolute top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-stone-900/70 backdrop-blur-md border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800/80 transition-all disabled:opacity-20 disabled:pointer-events-none ${isFullscreen ? 'right-3 md:right-6' : 'right-3 md:right-[396px]'}`}
                        aria-label="Next item"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Bottom controls */}
                    <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
                        <button
                            onClick={() => {
                                const viewer = document.querySelector('model-viewer') as HTMLElement & { resetTurntableRotation?: () => void; cameraOrbit?: string };
                                if (viewer) viewer.setAttribute('camera-orbit', '45deg 75deg 1.5m');
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900/70 backdrop-blur-md border border-stone-800 text-stone-300 hover:text-white transition-colors text-sm"
                            aria-label="Reset camera"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                        <button
                            onClick={() => {
                                const viewer = document.querySelector('model-viewer') as HTMLElement & { activateAR?: () => void };
                                if (viewer?.activateAR) viewer.activateAR();
                            }}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors text-sm shadow-lg shadow-amber-900/30"
                            aria-label="View in AR"
                        >
                            <Smartphone className="w-4 h-4" />
                            View in AR
                        </button>
                    </div>

                    {/* Keyboard hints */}
                    <div className="absolute bottom-4 right-4 z-10 hidden lg:flex items-center gap-3 text-stone-600 text-[10px] font-mono">
                        <span className="px-1.5 py-0.5 border border-stone-800 rounded">ESC</span> close
                        <span className="px-1.5 py-0.5 border border-stone-800 rounded">&larr; &rarr;</span> navigate
                        <span className="px-1.5 py-0.5 border border-stone-800 rounded">I</span> info
                    </div>

                    {/* Side panel - item details */}
                    <div className={`absolute top-0 right-0 bottom-0 w-full md:w-[380px] z-10 bg-stone-950/95 backdrop-blur-xl border-l border-stone-800 flex flex-col transition-transform duration-500 ${showInfo && !isFullscreen ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="flex-1 overflow-auto p-6 md:p-8 pt-20 md:pt-24">
                            {/* Item image */}
                            <div className="aspect-video rounded-xl overflow-hidden mb-6 border border-stone-800">
                                <img
                                    src={currentItem.image}
                                    alt={currentItem.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Tags */}
                            <div className="flex gap-2 mb-4">
                                {currentItem.tags.map(tag => (
                                    <span key={tag} className="px-2.5 py-1 rounded-full text-[10px] font-mono text-amber-400 uppercase tracking-wider bg-amber-900/20 border border-amber-900/30">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Title & price */}
                            <div className="flex justify-between items-start mb-3">
                                <h2 className="text-2xl font-serif font-bold text-amber-50">{currentItem.name}</h2>
                                <span className="text-2xl font-bold font-mono text-amber-500">{currentItem.price}</span>
                            </div>

                            {/* Description */}
                            <p className="text-stone-400 text-sm leading-relaxed mb-6">
                                {currentItem.desc}
                            </p>

                            {/* Details */}
                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-sm py-2 border-b border-stone-800/60">
                                    <span className="text-stone-500">Calories</span>
                                    <span className="text-stone-300 font-mono">{currentItem.calories}</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-stone-800/60">
                                    <span className="text-stone-500">3D Model</span>
                                    <span className="text-green-500 font-mono text-xs flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Available
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-stone-800/60">
                                    <span className="text-stone-500">AR Experience</span>
                                    <span className="text-green-500 font-mono text-xs flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Ready
                                    </span>
                                </div>
                            </div>

                            {/* Thumbnail strip - navigate items */}
                            <div className="mb-4">
                                <h4 className="text-stone-500 text-xs font-mono uppercase tracking-widest mb-3">All Items</h4>
                                <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                                    {menuItems.map((item, idx) => (
                                        <button
                                            key={item.name}
                                            onClick={() => setViewerState({ index: idx })}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === viewerState.index ? 'border-amber-500 ring-1 ring-amber-500/30' : 'border-stone-800 opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantMenu;
