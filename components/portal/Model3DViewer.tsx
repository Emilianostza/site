import React, { useEffect, useRef, useState } from 'react';
import { X, RotateCw, Maximize2, QrCode } from 'lucide-react';
import { Asset } from '../../types';

interface Model3DViewerProps {
    asset: Asset | null;
    isOpen: boolean;
    onClose: () => void;
}

export const Model3DViewer: React.FC<Model3DViewerProps> = ({ asset, isOpen, onClose }) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showARCode, setShowARCode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !asset) return;

        const loadModelViewer = async () => {
            try {
                setIsLoading(true);
                // Dynamically import model-viewer
                if (!customElements.get('model-viewer')) {
                    await import('@google/model-viewer');
                }

                // Create model-viewer element
                if (viewerRef.current) {
                    viewerRef.current.innerHTML = `
                        <model-viewer
                            src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                            alt="${asset.name}"
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            camera-controls
                            auto-rotate
                            shadow-intensity="1"
                            camera-orbit="0deg 75deg 105%"
                            style="width: 100%; height: 100%;"
                        ></model-viewer>
                    `;
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to load 3D model viewer', error);
                setIsLoading(false);
            }
        };

        loadModelViewer();
    }, [isOpen, asset]);

    if (!isOpen || !asset) return null;

    const handleResetView = () => {
        const viewer = viewerRef.current?.querySelector('model-viewer') as any;
        if (viewer) {
            viewer.cameraOrbit = '0deg 75deg 105%';
        }
    };

    const handleARPreview = () => {
        const viewer = viewerRef.current?.querySelector('model-viewer') as any;
        if (viewer) {
            viewer.activateAR();
        }
    };

    return (
        <div className={`fixed inset-0 z-50 bg-slate-900/95 flex flex-col ${isOpen ? 'visible' : 'invisible'}`}>
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">{asset.name}</h2>
                    <p className="text-slate-400 text-sm">Status: {asset.status}</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Viewer Container */}
            <div className="flex-1 relative overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-300">Loading 3D model...</p>
                        </div>
                    </div>
                )}

                <div
                    ref={viewerRef}
                    className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-900"
                    style={{ perspective: '1000px' }}
                />

                {/* Floating Controls */}
                <div className="absolute bottom-6 left-6 flex gap-3">
                    <button
                        onClick={handleResetView}
                        className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors shadow-lg"
                        title="Reset camera view"
                    >
                        <RotateCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleARPreview}
                        className="p-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors shadow-lg flex items-center gap-2"
                        title="View in AR"
                    >
                        <Maximize2 className="w-5 h-5" />
                        <span className="text-sm font-bold">View in AR</span>
                    </button>
                    <button
                        onClick={() => setShowARCode(!showARCode)}
                        className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors shadow-lg"
                        title="Show QR code"
                    >
                        <QrCode className="w-5 h-5" />
                    </button>
                </div>

                {/* QR Code Panel */}
                {showARCode && (
                    <div className="absolute bottom-6 right-6 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl max-w-sm">
                        <h3 className="text-white font-bold mb-3 text-sm">Scan for AR Experience</h3>
                        <div className="bg-white p-3 rounded mb-3">
                            <svg
                                className="w-full"
                                viewBox="0 0 200 200"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Simple QR placeholder */}
                                <rect width="200" height="200" fill="white" />
                                <rect x="10" y="10" width="30" height="30" fill="black" />
                                <rect x="160" y="10" width="30" height="30" fill="black" />
                                <rect x="10" y="160" width="30" height="30" fill="black" />
                                {/* Grid pattern for demo */}
                                {Array.from({ length: 14 }).map((_, i) =>
                                    Array.from({ length: 14 }).map((_, j) => (
                                        <rect
                                            key={`${i}-${j}`}
                                            x={40 + i * 10}
                                            y={40 + j * 10}
                                            width={Math.random() > 0.5 ? 8 : 0}
                                            height={Math.random() > 0.5 ? 8 : 0}
                                            fill="black"
                                        />
                                    ))
                                )}
                            </svg>
                        </div>
                        <p className="text-slate-400 text-xs">
                            Share this QR code to let others view the model in AR on their phone.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-slate-800 border-t border-slate-700 p-4">
                <div className="grid grid-cols-3 gap-4 max-w-2xl">
                    <div>
                        <p className="text-slate-400 text-xs uppercase">Format</p>
                        <p className="text-white font-semibold">GLB</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase">Size</p>
                        <p className="text-white font-semibold">2.4 MB</p>
                    </div>
                    <div className="text-right">
                        <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold text-sm transition-colors">
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
