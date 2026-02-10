
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Box,
    Layers,
    Settings,
    Share2,
    MoreHorizontal,
    Clock,
    FileText,
    Image as ImageIcon
} from 'lucide-react';

const SceneDashboard: React.FC = () => {
    const { assetId } = useParams<{ assetId: string }>();
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading asset data
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-stone-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 font-sans">
            {/* Header */}
            <header className="fixed top-0 w-full h-16 bg-stone-900/80 backdrop-blur-md border-b border-stone-800 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-4">
                    <Link to="/app/dashboard" className="p-2 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-6 w-px bg-stone-800"></div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold text-stone-100 tracking-wide">
                            {assetId === 'new' ? 'Untitled Project' : assetId}
                        </h1>
                        <span className="text-[10px] text-stone-500 uppercase tracking-widest">Scene Dashboard</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                    <div className="h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center text-xs font-bold text-white">
                        JS
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 px-6 max-w-7xl mx-auto pb-20">

                {/* Hero Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-serif font-bold text-white mb-2">Project Overview</h2>
                    <p className="text-stone-400 max-w-2xl">Manage your 3D assets, scenes, and configurations for this project.</p>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    <div className="bg-stone-900/50 border border-stone-800 p-4 rounded-xl flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
                            <Box className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">1</div>
                            <div className="text-xs text-stone-500 uppercase font-bold">3D Models</div>
                        </div>
                    </div>

                    <div className="bg-stone-900/50 border border-stone-800 p-4 rounded-xl flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">3</div>
                            <div className="text-xs text-stone-500 uppercase font-bold">Materials</div>
                        </div>
                    </div>

                    <div className="bg-stone-900/50 border border-stone-800 p-4 rounded-xl flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">2m ago</div>
                            <div className="text-xs text-stone-500 uppercase font-bold">Last Edited</div>
                        </div>
                    </div>

                    <div className="bg-stone-900/50 border border-stone-800 p-4 rounded-xl flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
                            <Share2 className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">Private</div>
                            <div className="text-xs text-stone-500 uppercase font-bold">Visibility</div>
                        </div>
                    </div>
                </div>

                {/* "Fancy Product List" (Models) */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Box className="w-5 h-5 text-amber-500" />
                            3D Assets
                        </h3>
                        <button className="text-sm text-stone-400 hover:text-white transition-colors">
                            View All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* The Main 3D Model Card */}
                        <Link to={`/app/editor/${assetId}/3d`} className="group block">
                            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/20 group-hover:-translate-y-1">
                                <div className="aspect-video bg-stone-800 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-700/20 to-stone-900"></div>
                                    <img
                                        src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                                        // Simple placeholder preview, or ideally a screenshot 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                        className="w-full h-full object-contain p-8 mix-blend-overlay opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                                        alt="3D Model Preview"
                                    />
                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-white uppercase tracking-wider flex items-center gap-1">
                                        <Box className="w-3 h-3" /> GLB
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-amber-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            Open Editor
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors">Main Scene Model</h4>
                                        <button className="text-stone-500 hover:text-white">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-stone-400 mb-4 line-clamp-2">
                                        The primary 3D asset for this project. Includes materials, textures, and lighting configurations.
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-stone-500 font-mono">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Updated just now
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FileText className="w-3 h-3" /> 12.5 MB
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Placeholder Card for "Add New" or generic items to make it look like a list */}
                        <div className="bg-stone-900/30 border border-stone-800/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 border-dashed hover:border-stone-700 hover:bg-stone-900/50 transition-colors cursor-pointer group">
                            <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-stone-500 group-hover:text-white group-hover:bg-stone-700 transition-all">
                                <Box className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-stone-300 group-hover:text-white mb-1">Add Variant</h4>
                                <p className="text-xs text-stone-500 px-4">Create a new variant or upload another model to this project.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Additional Sections (Project Files, etc.) - To flesh out the "page menu" feel */}
                <section className="mt-12">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-500" />
                        Project Media
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-stone-900 border border-stone-800 rounded-xl p-3 hover:border-stone-600 transition-colors cursor-pointer">
                                <div className="aspect-square bg-stone-800 rounded-lg mb-3 flex items-center justify-center text-stone-600">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <div className="h-2 w-2/3 bg-stone-800 rounded mb-2"></div>
                                <div className="h-2 w-1/3 bg-stone-800 rounded"></div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
};

export default SceneDashboard;
