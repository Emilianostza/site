import React, { useState, useEffect } from 'react';
import { X, Save, Palette, Type, Globe, DollarSign } from 'lucide-react';

interface MenuSettings {
  title: string;
  brandColor: string;
  font: string;
  showPrices: boolean;
  currency: string;
}

interface MenuSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: MenuSettings;
  onSave: (settings: MenuSettings) => void;
}

export const MenuSettingsModal: React.FC<MenuSettingsModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
}) => {
  const [settings, setSettings] = useState<MenuSettings>(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-stone-800">
          <h2 className="text-xl font-bold font-serif text-amber-50">Menu Settings</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-stone-500 flex items-center gap-2">
              <Type className="w-4 h-4" /> General
            </h3>
            <div>
              <label className="block text-sm font-medium text-stone-400 mb-1">Menu Title</label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-lg text-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-stone-500 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Appearance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-400 mb-1">Brand Color</label>
                <div className="flex items-center gap-2 bg-stone-800 p-2 rounded-lg border border-stone-700">
                  <input
                    type="color"
                    value={settings.brandColor}
                    onChange={(e) => setSettings({ ...settings, brandColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-stone-300 font-mono text-sm">{settings.brandColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-400 mb-1">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-lg text-white focus:border-amber-500 outline-none"
                >
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="¥">JPY (¥)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-stone-300 font-medium">Show Prices</span>
                <span className="text-stone-500 text-xs">Display prices on menu cards</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showPrices}
                  onChange={(e) => setSettings({ ...settings, showPrices: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-400 font-medium hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-500 flex items-center gap-2 shadow-lg shadow-amber-900/40"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
