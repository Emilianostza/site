
import React from 'react';
import { X, Download, Copy, ExternalLink, QrCode } from 'lucide-react';
import { Asset } from '@/types';

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    asset: Asset | null;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, asset }) => {
    if (!isOpen || !asset) return null;

    // Generate the URL for the asset (Scene Dashboard)
    const assetUrl = `${window.location.origin}/#/app/editor/${asset.id}`;

    // QR Code API (using goqr.me or qrserver)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(assetUrl)}&bgcolor=ffffff`;

    const handleDownload = async () => {
        try {
            const response = await fetch(qrCodeUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qr-${asset.name.toLowerCase().replace(/\s+/g, '-')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download QR code', error);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(assetUrl);
        // Could add a toast here
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
                            <QrCode className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Scan QR Code</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Share this scene instantly</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-100">
                        <img
                            src={qrCodeUrl}
                            alt={`QR Code for ${asset.name}`}
                            className="w-48 h-48 object-contain"
                        />
                    </div>

                    <h4 className="mt-4 font-bold text-slate-900 dark:text-white text-lg">{asset.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                        Scan to view 3D scene on mobile
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={handleDownload}
                            className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-lg font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            <Download className="w-4 h-4" /> Download
                        </button>
                        <button
                            onClick={handleCopyLink}
                            className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            <Copy className="w-4 h-4" /> Copy Link
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl border-t border-slate-100 dark:border-slate-700 text-center">
                    <a
                        href={assetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center justify-center gap-1"
                    >
                        Open in new tab <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </div>
    );
};
