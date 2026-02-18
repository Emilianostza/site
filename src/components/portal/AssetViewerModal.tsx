import React, { useCallback, useEffect, useState } from 'react';
import { X, Maximize2, Minimize2, Smartphone, RotateCcw } from 'lucide-react';
import { useEscapeKey } from '@/hooks/useEscapeKey';

interface AssetViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelUrl: string;
  assetName: string;
}

export const AssetViewerModal: React.FC<AssetViewerModalProps> = ({
  isOpen,
  onClose,
  modelUrl,
  assetName,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEscapeKey(
    useCallback(() => onClose(), [onClose]),
    isOpen
  );

  // Dynamically load @google/model-viewer
  useEffect(() => {
    if (isOpen) {
      import('@google/model-viewer');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-zinc-900/95 backdrop-blur-sm flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={assetName}
    >
      {/* Modal Container */}
      <div
        className={`relative w-full ${isFullscreen ? 'h-full' : 'h-[80vh] max-w-6xl mx-4 rounded-2xl overflow-hidden'} bg-zinc-950 transition-all duration-300 border border-zinc-900 shadow-2xl`}
      >
        {/* 3D Viewer */}
        <div className="absolute inset-0">
          <model-viewer
            src={modelUrl}
            alt={`3D model of ${assetName}`}
            auto-rotate
            camera-controls
            shadow-intensity="1"
            ar
            ar-modes="webxr scene-viewer quick-look"
            touch-action="pan-y"
            style={{ width: '100%', height: '100%', background: 'transparent' }}
            onLoad={() => setModelLoaded(true)}
          ></model-viewer>

          {/* Loading State */}
          {!modelLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 gap-3">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-zinc-400 text-sm">Loading 3D Model...</p>
            </div>
          )}
        </div>

        {/* Header Controls */}
        <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center bg-gradient-to-b from-zinc-950/80 to-transparent z-10">
          <h3 className="text-white font-bold text-lg drop-shadow-md">{assetName}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors focus-visible:ring-2 focus-visible:ring-white/60 focus:outline-none"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Maximize2 className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-red-500/80 text-white backdrop-blur-md transition-colors focus-visible:ring-2 focus-visible:ring-red-400 focus:outline-none"
              aria-label="Close viewer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 pointer-events-none">
          <button
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-colors text-sm focus-visible:ring-2 focus-visible:ring-white/60 focus:outline-none"
            onClick={() => {
              const viewer = document.querySelector('model-viewer') as any;
              if (viewer) viewer.cameraOrbit = '0deg 75deg 130%';
            }}
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" /> Reset
          </button>
          <button
            className="pointer-events-auto flex items-center gap-2 px-5 py-2 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-500/20 transition-all text-sm focus-visible:ring-2 focus-visible:ring-brand-400 focus:outline-none"
            onClick={() => {
              const viewer = document.querySelector('model-viewer') as any;
              if (viewer?.activateAR) viewer.activateAR();
            }}
          >
            <Smartphone className="w-4 h-4" aria-hidden="true" /> View in AR
          </button>
        </div>
      </div>
    </div>
  );
};
