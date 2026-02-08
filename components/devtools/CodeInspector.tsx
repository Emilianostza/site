import React, { useState, useEffect, useRef } from 'react';
import { Code, X, Zap, Copy, Check } from 'lucide-react';

export const CodeInspector: React.FC = () => {
    const [enabled, setEnabled] = useState(false);
    const [inspecting, setInspecting] = useState<{ name: string; file?: string; rect: DOMRect } | null>(null);
    const [copied, setCopied] = useState(false);
    const hoverTimer = useRef<NodeJS.Timeout | null>(null);
    const currentTarget = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!enabled) {
            setInspecting(null);
            return;
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const componentEl = target.closest('[data-component]') as HTMLElement;

            if (componentEl && componentEl !== currentTarget.current) {
                currentTarget.current = componentEl;

                if (hoverTimer.current) clearTimeout(hoverTimer.current);

                hoverTimer.current = setTimeout(() => {
                    const rect = componentEl.getBoundingClientRect();
                    setInspecting({
                        name: componentEl.dataset.component || 'Unknown Component',
                        file: componentEl.dataset.file,
                        rect
                    });
                }, 2000);
            } else if (!componentEl) {
                currentTarget.current = null;
                if (hoverTimer.current) clearTimeout(hoverTimer.current);
                setInspecting(null);
            }
        };

        // Add click listener to copy path
        const handleClick = (e: MouseEvent) => {
            if (!inspecting || !inspecting.file) return;

            // Check if clicking within the highlighted area
            const clientX = e.clientX;
            const clientY = e.clientY;
            const { left, right, top, bottom } = inspecting.rect;

            if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) {
                e.preventDefault();
                e.stopPropagation();

                // Format for chat mention
                const mentionText = `@${inspecting.file.replace('src/', '')} `;
                navigator.clipboard.writeText(mentionText);

                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        };

        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('click', handleClick, true); // Capture phase to intercept clicks

        return () => {
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('click', handleClick, true);
            if (hoverTimer.current) clearTimeout(hoverTimer.current);
        };
    }, [enabled, inspecting]);

    return (
        <>
            <div className="fixed bottom-4 left-4 z-50">
                <button
                    onClick={() => setEnabled(!enabled)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-bold shadow-lg transition-all ${enabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 opacity-50 hover:opacity-100'
                        }`}
                >
                    <Code className="w-4 h-4" />
                    {enabled ? 'Inspector ON' : 'Inspector OFF'}
                </button>
            </div>

            {enabled && inspecting && (
                <>
                    <div
                        className="fixed pointer-events-none z-40 border-2 border-indigo-500 bg-indigo-500/10 transition-all duration-200"
                        style={{
                            top: inspecting.rect.top,
                            left: inspecting.rect.left,
                            width: inspecting.rect.width,
                            height: inspecting.rect.height,
                        }}
                    />

                    <div
                        className="fixed z-50 bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-slate-700 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 pointer-events-none"
                        style={{
                            top: Math.max(10, inspecting.rect.top - 60),
                            left: Math.max(10, inspecting.rect.left),
                        }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-indigo-400 font-bold font-mono text-sm">
                                    <Zap className="w-3 h-3" />
                                    {inspecting.name}
                                </div>
                                {inspecting.file && (
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mt-1">
                                        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'Copied to clipboard!' : 'Click element to copy path @mention'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
