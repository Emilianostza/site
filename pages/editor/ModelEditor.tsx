import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Save, Undo, Redo, Box, Layers, Sun,
    Move, RotateCw, Scaling, Download, Share2, Settings,
    Smartphone, RotateCcw, X, Copy, Check, Globe, QrCode
} from 'lucide-react';
import { AssetUploader } from '../../components/editor/AssetUploader';
import { saveAsset } from '../../services/mockData';
import { useToast } from '../../contexts/ToastContext';

const ModelEditor: React.FC = () => {
    const { assetId } = useParams<{ assetId: string }>();
    const navigate = useNavigate();
    const { success, error } = useToast();
    const [modelSrc, setModelSrc] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'transform' | 'materials' | 'lighting'>('transform');

    // Saving State
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Share Modal State
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Model Properties
    const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
    const [scale, setScale] = useState({ x: 1, y: 1, z: 1 });

    // Environment Properties
    const [exposure, setExposure] = useState(1.0);
    const [shadowIntensity, setShadowIntensity] = useState(1.0);
    const [autoRotate, setAutoRotate] = useState(false);

    // Initialize
    useEffect(() => {
        // Load model-viewer
        import('@google/model-viewer');

        if (assetId && assetId !== 'new') {
            // Mock loading existing asset
            setModelSrc('https://modelviewer.dev/shared-assets/models/Astronaut.glb');
            // If it was a real app, we'd fetch the specific asset data here
        }
    }, [assetId]);

    const handleUpload = (url: string, file: File) => {
        setModelSrc(url);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const savedAsset = await saveAsset({
                id: assetId === 'new' ? undefined : assetId,
                name: assetId === 'new' ? 'My New AR Scene' : 'Updated AR Scene',
                // In a real app we'd upload the blob/file here
                // For MVP we can't easily persist the blob URL, so we keep using the placeholder or the blob URL if valid
                thumb: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
                updated: 'Just now'
            });

            setLastSaved(new Date());
            success('Scene saved successfully');

            if (assetId === 'new') {
                navigate(`/app/editor/${savedAsset.id}`);
            }
        } catch (e) {
            error('Failed to save scene');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        success('Link copied to clipboard');
    };

    const handleReset = () => {
        setRotation({ x: 0, y: 0, z: 0 });
        setScale({ x: 1, y: 1, z: 1 });
        setExposure(1.0);
        setShadowIntensity(1.0);
        const viewer = document.querySelector('model-viewer') as any;
        if (viewer) viewer.cameraOrbit = '45deg 55deg 2.5m';
    };

    const handleActivateAR = () => {
        const viewer = document.querySelector('model-viewer') as any;
        if (viewer?.activateAR) viewer.activateAR();
    };

    // If no model is loaded, show uploader
    if (!modelSrc) {
        return (
            <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4">
                <Link to="/app/dashboard" className="absolute top-8 left-8 text-stone-400 hover:text-white flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                </Link>
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-stone-100 mb-2">Create New AR Scene</h1>
                    <p className="text-stone-400">Upload your 3D model to get started</p>
                </div>
                <AssetUploader onUpload={handleUpload} />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-stone-950 text-stone-200 overflow-hidden font-sans" data-component="Model Editor" data-file="src/pages/editor/ModelEditor.tsx">

            {/* Top Bar */}
            <header className="fixed top-0 w-full h-14 bg-stone-900 border-b border-stone-800 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-4">
                    <Link to={`/app/dashboard`} className="p-2 hover:bg-stone-800 rounded-md text-stone-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-6 w-px bg-stone-800"></div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm tracking-wide text-stone-100">
                            {assetId === 'new' ? 'Untitled Scene' : assetId}
                        </span>
                        <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded border border-amber-500/30">DRAFT</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 mr-2 hidden md:inline">
                        {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Unsaved changes'}
                    </span>
                    <button className="p-2 hover:bg-stone-800 rounded text-stone-400 hover:text-white" title="Undo"><Undo className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-stone-800 rounded text-stone-400 hover:text-white" title="Redo"><Redo className="w-4 h-4" /></button>
                    <div className="h-6 w-px bg-stone-800 mx-2"></div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? 'Saving...' : 'Save Scene'}
                    </button>
                    <button
                        onClick={() => setIsShareOpen(true)}
                        className="p-2 hover:bg-stone-800 rounded text-stone-400 hover:text-white"
                        title="Share / Publish"
                    >
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

                    {/* 3D Model Viewer */}
                    <div className="w-full h-full">
                        {/* @ts-ignore - model-viewer custom element properties */}
                        <model-viewer
                            src={modelSrc}
                            alt="3D Asset Editor"
                            camera-controls
                            interaction-prompt="none"
                            shadow-intensity={shadowIntensity.toString()}
                            exposure={exposure.toString()}
                            auto-rotate={autoRotate ? 'true' : undefined}
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            orientation={`${rotation.x}deg ${rotation.y}deg ${rotation.z}deg`}
                            scale={`${scale.x} ${scale.y} ${scale.z}`}
                            style={{ width: '100%', height: '100%' }}
                        ></model-viewer>
                    </div>

                    {/* Viewport Overlay Controls */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                        <button
                            onClick={handleReset}
                            className="bg-stone-900/80 backdrop-blur text-stone-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-stone-800 border border-stone-700 flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset View
                        </button>
                        <button
                            onClick={handleActivateAR}
                            className="bg-amber-600/90 backdrop-blur text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-amber-500 shadow-lg shadow-amber-900/40 flex items-center gap-2"
                        >
                            <Smartphone className="w-4 h-4" /> Preview in AR
                        </button>
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
                                    <h3 className="text-xs font-bold text-stone-500 uppercase">Scale (Factor)</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-stone-950 p-2 rounded border border-stone-800 flex items-center gap-2">
                                            <span className="text-red-500 text-xs font-bold">X</span>
                                            <input
                                                type="number" step="0.1"
                                                className="bg-transparent w-full text-sm outline-none"
                                                value={scale.x}
                                                onChange={(e) => setScale({ ...scale, x: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                        <div className="bg-stone-950 p-2 rounded border border-stone-800 flex items-center gap-2">
                                            <span className="text-green-500 text-xs font-bold">Y</span>
                                            <input
                                                type="number" step="0.1"
                                                className="bg-transparent w-full text-sm outline-none"
                                                value={scale.y}
                                                onChange={(e) => setScale({ ...scale, y: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                        <div className="bg-stone-950 p-2 rounded border border-stone-800 flex items-center gap-2">
                                            <span className="text-blue-500 text-xs font-bold">Z</span>
                                            <input
                                                type="number" step="0.1"
                                                className="bg-transparent w-full text-sm outline-none"
                                                value={scale.z}
                                                onChange={(e) => setScale({ ...scale, z: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setScale({ x: 1, y: 1, z: 1 })}
                                            className="text-xs text-stone-500 underline hover:text-stone-300"
                                        >
                                            Reset Scale
                                        </button>
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
                            <div className="text-center py-10 text-stone-500">
                                <Layers className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Material editing coming in V2</p>
                            </div>
                        )}

                        {activeTab === 'lighting' && (
                            <>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-stone-500 uppercase">Environment</h3>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm text-stone-300">Auto-Rotate</label>
                                        <input
                                            type="checkbox"
                                            checked={autoRotate}
                                            onChange={(e) => setAutoRotate(e.target.checked)}
                                            className="w-4 h-4 rounded bg-stone-800 border-stone-600 accent-amber-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm text-stone-300">Exposure</label>
                                        <span className="text-xs text-stone-500">{exposure}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="2" step="0.1"
                                        value={exposure}
                                        onChange={(e) => setExposure(parseFloat(e.target.value))}
                                        className="w-full h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm text-stone-300">Shadow Intensity</label>
                                        <span className="text-xs text-stone-500">{shadowIntensity}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="2" step="0.1"
                                        value={shadowIntensity}
                                        onChange={(e) => setShadowIntensity(parseFloat(e.target.value))}
                                        className="w-full h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="p-4 border-t border-stone-800 mt-auto">
                        <button
                            onClick={handleReset}
                            className="w-full py-2 bg-stone-800 hover:bg-stone-700 rounded text-sm font-medium text-stone-300 transition-colors"
                        >
                            Reset All Settings
                        </button>
                    </div>
                </aside>
            </div>

            {/* Share / Publish Modal */}
            {isShareOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsShareOpen(false)}>
                    <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white font-serif">Publish & Share</h2>
                            <button onClick={() => setIsShareOpen(false)} className="text-stone-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Privacy */}
                            <div className="bg-stone-950/50 p-4 rounded-xl border border-stone-800/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-green-900/20 text-green-500 flex items-center justify-center">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-stone-200">Public Access</div>
                                        <div className="text-xs text-stone-500">Anyone with the link can view</div>
                                    </div>
                                    <div className="ml-auto">
                                        <input type="checkbox" checked readOnly className="toggle accent-amber-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Link Copy */}
                            <div>
                                <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Share Link</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={window.location.href}
                                        readOnly
                                        className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-300"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className="bg-stone-800 hover:bg-stone-700 text-white px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Embed Code */}
                            <div>
                                <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Embed Snippet</label>
                                <div className="bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs font-mono text-stone-400 overflow-x-auto whitespace-pre">
                                    {`<iframe src="${window.location.href}" width="100%" height="400px" frameborder="0"></iframe>`}
                                </div>
                            </div>

                            {/* QR Code */}
                            <div className="flex items-center gap-4 pt-4 border-t border-stone-800/50">
                                <div className="w-16 h-16 bg-white p-1 rounded-lg">
                                    {/* Placeholder QR */}
                                    <div className="w-full h-full bg-stone-900 flex items-center justify-center text-[8px] text-stone-500 text-center leading-tight">
                                        QR Code
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-stone-200 text-sm mb-1">Mobile AR Experience</div>
                                    <p className="text-xs text-stone-500">Scan this code to instantly view in AR on iOS or Android.</p>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelEditor;
