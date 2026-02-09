import React, { useState, useEffect, useRef } from 'react';
import { Code, X, Zap, Copy, Check, Lock, MousePointer2, Box, Image as ImageIcon } from 'lucide-react';

export const CodeInspector: React.FC = () => {
    const [enabled, setEnabled] = useState(false);
    const [inspecting, setInspecting] = useState<{
        name: string;
        file?: string;
        rect: DOMRect;
        width: number;
        height: number;
        tagName: string;
        src?: string;
    } | null>(null);
    const [locked, setLocked] = useState(false);
    const [copied, setCopied] = useState(false);
    const hoverTimer = useRef<NodeJS.Timeout | null>(null);
    const currentTarget = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!enabled) {
            setInspecting(null);
            setLocked(false);
            return;
        }

        const handleMouseOver = (e: MouseEvent) => {
            if (locked) return;

            const target = e.target as HTMLElement;
            // Ignore inspector UI itself
            if (target.closest('[data-inspector-ui]')) return;

            // Find the closest component for context (file path)
            const componentEl = target.closest('[data-component]') as HTMLElement;

            // We want to inspect the *target* element itself, not just the component wrapper
            // But we only care if it's inside a component we track
            if (componentEl) {
                if (target !== currentTarget.current) {
                    currentTarget.current = target;

                    if (hoverTimer.current) clearTimeout(hoverTimer.current);

                    // Immediate feedback for direct selection
                    const rect = target.getBoundingClientRect();
                    // Delay feedback for direct selection to avoid flickering on rapid movement
                    hoverTimer.current = setTimeout(() => {
                        const rect = target.getBoundingClientRect();
                        setInspecting({
                            name: componentEl.dataset.component || 'Unknown Component',
                            file: componentEl.dataset.file,
                            rect,
                            width: Math.round(rect.width),
                            height: Math.round(rect.height),
                            tagName: target.tagName.toLowerCase(),
                            src: (target as HTMLImageElement).src
                        });
                    }, 1000); // 1 second delay
                }
            } else {
                currentTarget.current = null;
                setInspecting(null);
                if (hoverTimer.current) clearTimeout(hoverTimer.current);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!inspecting) return;

            // Toggle lock with 'L'
            if (e.key.toLowerCase() === 'l') {
                setLocked(prev => !prev);
            }
            // Clear on Escape
            if (e.key === 'Escape') {
                setLocked(false);
                setInspecting(null);
            }
        };

        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('keydown', handleKeyDown);
            if (hoverTimer.current) clearTimeout(hoverTimer.current);
        };
    }, [enabled, locked, inspecting]);

    const handleCopy = () => {
        if (!inspecting || !inspecting.file) return;
        const mentionText = `@${inspecting.file.replace('src/', '')} `;
        navigator.clipboard.writeText(mentionText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="fixed bottom-4 left-4 z-[9999]" data-inspector-ui>
                <button
                    onClick={() => {
                        setEnabled(!enabled);
                        if (enabled) setLocked(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-bold shadow-lg transition-all border border-transparent ${enabled ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-800 text-slate-400 opacity-50 hover:opacity-100 hover:border-slate-600'
                        }`}
                >
                    <Code className="w-4 h-4" />
                    {enabled ? (locked ? 'Inspector LOCKED' : 'Inspector ON') : 'Inspector OFF'}
                </button>
                {enabled && (
                    <div className="mt-2 text-[10px] text-slate-500 font-mono bg-black/50 backdrop-blur px-2 py-1 rounded">
                        Hover element • Press 'L' to lock
                    </div>
                )}
            </div>

            {enabled && inspecting && (
                <>
                    {/* Highlight Box */}
                    <div
                        className={`fixed pointer-events-none z-[9990] border-2 transition-all duration-100 ${locked ? 'border-red-500 bg-red-500/10' : 'border-indigo-500 bg-indigo-500/10'}`}
                        style={{
                            top: inspecting.rect.top,
                            left: inspecting.rect.left,
                            width: inspecting.rect.width,
                            height: inspecting.rect.height,
                        }}
                    />

                    {/* Info Tooltip */}
                    <div
                        className="fixed z-[9995] bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-slate-700 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
                        style={{
                            top: Math.max(10, inspecting.rect.top - 100), // Position above if possible
                            left: Math.max(10, inspecting.rect.left),
                            maxWidth: '300px'
                        }}
                        data-inspector-ui
                    >
                        <div className="flex flex-col gap-2">
                            {/* Header: Element Type + Lock Status */}
                            <div className="flex items-center justify-between gap-4 border-b border-gray-700 pb-2 mb-1">
                                <div className="flex items-center gap-2 text-indigo-400 font-bold font-mono text-sm truncate">
                                    {inspecting.tagName === 'img' ? <ImageIcon className="w-3 h-3" /> : <Box className="w-3 h-3" />}
                                    <span className="uppercase">{inspecting.tagName}</span>
                                    <span className="text-slate-500 font-normal text-xs ml-2 truncate max-w-[120px]">in {inspecting.name}</span>
                                </div>
                                {locked && <Lock className="w-3 h-3 text-red-500" />}
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-400 font-mono">
                                <span>Dimensions:</span> <span className="text-slate-200">{inspecting.width}px × {inspecting.height}px</span>
                                {inspecting.src && (
                                    <div className="col-span-2 truncate mt-1 pt-1 border-t border-slate-800">
                                        <span className="block text-[9px] text-slate-500 uppercase">Source</span>
                                        <span className="text-slate-300 truncate block" title={inspecting.src}>{inspecting.src}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            {inspecting.file && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 text-xs font-mono mt-2 bg-slate-800 hover:bg-slate-700 px-2 py-1.5 rounded transition-colors w-full justify-center group"
                                >
                                    {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-slate-400 group-hover:text-white" />}
                                    <span className={copied ? 'text-green-400' : 'text-slate-300 group-hover:text-white'}>
                                        {copied ? 'Copied!' : 'Copy Path'}
                                    </span>
                                </button>
                            )}

                            {!locked && (
                                <div className="text-[9px] text-slate-600 text-center mt-1">
                                    Press <span className="bg-slate-800 px-1 rounded text-slate-500">L</span> to lock selection
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
