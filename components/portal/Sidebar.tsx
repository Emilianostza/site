import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Users, FileBox, LogOut, Settings } from 'lucide-react';

interface SidebarProps {
    role: 'employee' | 'customer';
    activeTab: 'dashboard' | 'projects' | 'customers';
    setActiveTab: (tab: 'dashboard' | 'projects' | 'customers') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab }) => {
    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10">
            <div className="p-6">
                <Link to="/" className="flex items-center gap-2 font-bold text-white text-lg">
                    <Box className="w-6 h-6 text-brand-500" />
                    <span>{role === 'employee' ? 'Console' : 'Portal'}</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'}`}
                >
                    <Box className="w-5 h-5" /> Dashboard
                </button>

                {role === 'employee' && (
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'customers' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'}`}
                    >
                        <Users className="w-5 h-5" /> Customers
                    </button>
                )}

                <button
                    onClick={() => setActiveTab('projects')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'projects' ? 'bg-brand-600 text-white' : 'hover:bg-slate-800'}`}
                >
                    <FileBox className="w-5 h-5" /> Projects
                </button>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-white w-full">
                    <Settings className="w-5 h-5" /> Settings
                </button>
                <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 w-full">
                    <LogOut className="w-5 h-5" /> Sign Out
                </Link>
            </div>
        </aside>
    );
};
