import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, Save, Undo, Redo, Box, Layers, Sun,
    Move, RotateCw, Scaling, Download, Share2, Settings
} from 'lucide-react';

const ModelEditor: React.FC = () => {
    const { assetId } = useParams<{ assetId: string }>();

    // Mock State for UI interactivity
    const [activeTab, setActiveTab] = useState<'transform' | 'materials' | 'lighting'>('transform');
    const [rotation, setRotation] = useState({ x: 0, y: 45, z: 0 });
    const [scale, setScale] = useState(1.2);
    const [exposure, setExposure] = useState(1.0);
    const [roughness, setRoughness] = useState(0.4);

    return (
        <div className="flex h-screen bg-stone-950 text-stone-200 overflow-hidden font-sans" data-component="Model Editor" data-file="src/pages/editor/ModelEditor.tsx">

            {/* Top Bar */}
            <header className="fixed top-0 w-full h-14 bg-stone-900 border-b border-stone-800 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-4">
                    <Link to={`/project/PRJ-001/menu`} className="p-2 hover:bg-stone-800 rounded-md text-stone-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-6 w-px bg-stone-800"></div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm tracking-wide text-stone-100">Signature Burger_v2.glb</span>
                        <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded border border-amber-500/30">EDITING</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-stone-800 rounded text-stone-400 hover:text-white" title="Undo"><Undo className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-stone-800 rounded text-stone-400 hover:text-white" title="Redo"><Redo className="w-4 h-4" /></button>
                    <div className="h-6 w-px bg-stone-800 mx-2"></div>
                    <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-colors">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                    <button className="p-2 hover:bg-stone-800 rounded text-stone-400 hover:text-white">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex flex-1 pt-14 w-full">

                {/* Toolbar (Left) */}
                <aside className="w-14 bg-stone-900 border-r border-stone-800 flex flex-col items-center py-4 gap-4">
                    <button
                        className={`p-3 rounded-xl transition-all ${activeTab === 'transform' ? 'bg-amber-500/20 text-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
                        onClick={() => setActiveTab('transform')}
                        title="Transform"
                    >
                        <Move className="w-5 h-5" />
                    </button>
                    <button
                        className={`p-3 rounded-xl transition-all ${activeTab === 'materials' ? 'bg-amber-500/20 text-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
                        onClick={() => setActiveTab('materials')}
                        title="Materials"
                    >
                        <Layers className="w-5 h-5" />
                    </button>
                    <button
                        className={`p-3 rounded-xl transition-all ${activeTab === 'lighting' ? 'bg-amber-500/20 text-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
                        onClick={() => setActiveTab('lighting')}
                        title="Lighting"
                    >
                        <Sun className="w-5 h-5" />
                    </button>
                    <div className="flex-1"></div>
                    <button className="p-3 text-stone-500 hover:text-white"><Settings className="w-5 h-5" /></button>
                </aside>

                {/* Viewport (Center) */}
                <main className="flex-1 bg-gradient-to-br from-stone-800 to-stone-900 relative overflow-hidden flex items-center justify-center group">
                    {/* Grid Background Mock */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    {/* 3D Model Placeholder */}
                    <div className="relative transform transition-transform duration-200" style={{ transform: `scale(${scale}) rotateY(${rotation.y}deg) rotateX(${rotation.x}deg)` }}>
                        <img
                            src="https://picsum.photos/seed/burger/600/600"
                            alt="3D Model Preview"
                            className="w-96 h-96 object-contain drop-shadow-2xl"
                        />
                        {/* Fake Interaction Helpers */}
                        <div className="absolute -inset-4 border-2 border-amber-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>

                    {/* Viewport HUD */}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-xs font-mono text-stone-400">
                        {rotation.y.toFixed(1)}°
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                        <button className="bg-black/50 backdrop-blur p-2 rounded hover:bg-black/70 text-stone-300"><RotateCw className="w-4 h-4" onClick={() => setRotation(p => ({ ...p, y: p.y + 45 }))} /></button>
                        <button className="bg-black/50 backdrop-blur p-2 rounded hover:bg-black/70 text-stone-300"><Scaling className="w-4 h-4" onClick={() => setScale(p => p === 1 ? 1.5 : 1)} /></button>
                    </div>
                </main>

                {/* Properties Panel (Right) */}
                <aside className="w-80 bg-stone-900 border-l border-stone-800 overflow-y-auto">
                    <div className="p-4 border-b border-stone-800">
                        <h2 className="font-bold text-sm uppercase tracking-wider text-stone-400">
                            {activeTab === 'transform' && 'Transform Properties'}
                            {activeTab === 'materials' && 'Material Settings'}
                            {activeTab === 'lighting' && 'Scene Lighting'}
                        </h2>
                    </div>

                    <div className="p-6 space-y-8">
                        {activeTab === 'transform' && (
                            <>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-stone-500 uppercase">Position</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-stone-950 p-2 rounded border border-stone-800 flex items-center gap-2">
                                            <span className="text-red-500 text-xs font-bold">X</span>
                                            <input type="number" className="bg-transparent w-full text-sm outline-none" defaultValue="0.0" />
                                        </div>
                                        <div className="bg-stone-950 p-2 rounded border border-stone-800 flex items-center gap-2">
                                            <span className="text-green-500 text-xs font-bold">Y</span>
                                            <input type="number" className="bg-transparent w-full text-sm outline-none" defaultValue="0.5" />
                                        </div>
                                        <div className="bg-stone-950 p-2 rounded border border-stone-800 flex items-center gap-2">
                                            <span className="text-blue-500 text-xs font-bold">Z</span>
                                            <input type="number" className="bg-transparent w-full text-sm outline-none" defaultValue="0.0" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-stone-500 uppercase">Rotation (deg)</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-stone-950 p-2 rounded border border-stone-800 flex items-center gap-2">
                                            <span className="text-red-500 text-xs font-bold">X</span>
                                            <input
                                                type="number"
                                                className="bg-transparent w-full text-sm outline-none"
                                                value={rotation.x}
                                                onChange={(e) => setRotation({ ...rotation, x: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="bg-stone-950 p-2 rounded border border-stone-800 flex items-center gap-2">
                                            <span className="text-green-500 text-xs font-bold">Y</span>
                                            <input
                                                type="number"
                                                className="bg-transparent w-full text-sm outline-none"
                                                value={rotation.y}
                                                onChange={(e) => setRotation({ ...rotation, y: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="bg-stone-950 p-2 rounded border border-stone-800 flex items-center gap-2">
                                            <span className="text-blue-500 text-xs font-bold">Z</span>
                                            <input
                                                type="number"
                                                className="bg-transparent w-full text-sm outline-none"
                                                value={rotation.z}
                                                onChange={(e) => setRotation({ ...rotation, z: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'materials' && (
                            <>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-stone-500 uppercase">Surface</h3>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm text-stone-300">Roughness</label>
                                            <span className="text-xs text-stone-500">{roughness}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="1" step="0.01"
                                            value={roughness}
                                            onChange={(e) => setRoughness(parseFloat(e.target.value))}
                                            className="w-full h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-sm text-stone-300">Metalness</label>
                                            <span className="text-xs text-stone-500">0.0</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="1" step="0.01"
                                            className="w-full h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-stone-500 uppercase">Textures</h3>
                                    <div className="h-20 bg-stone-950 border border-stone-800 border-dashed rounded flex flex-col items-center justify-center text-stone-600 gap-1 hover:border-amber-500/50 hover:text-amber-500 transition-colors cursor-pointer">
                                        <Download className="w-4 h-4" />
                                        <span className="text-xs">Drop texture map</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'lighting' && (
                            <>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-stone-500 uppercase">Environment</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="h-16 rounded bg-gradient-to-br from-gray-200 to-gray-400 cursor-pointer ring-2 ring-amber-500"></div>
                                        <div className="h-16 rounded bg-gradient-to-br from-blue-900 to-black cursor-pointer opacity-50 hover:opacity-100"></div>
                                        <div className="h-16 rounded bg-gradient-to-br from-orange-200 to-orange-100 cursor-pointer opacity-50 hover:opacity-100"></div>
                                        <div className="h-16 rounded bg-stone-800 flex items-center justify-center text-xs text-stone-500 cursor-pointer border border-stone-700 hover:border-stone-500">
                                            Studio
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm text-stone-300">Exposure</label>
                                        <span className="text-xs text-stone-500">{exposure}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="5" step="0.1"
                                        value={exposure}
                                        onChange={(e) => setExposure(parseFloat(e.target.value))}
                                        className="w-full h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="p-4 border-t border-stone-800 mt-auto">
                        <button className="w-full py-2 bg-stone-800 hover:bg-stone-700 rounded text-sm font-medium text-stone-300 transition-colors">
                            Reset All Settings
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ModelEditor;
