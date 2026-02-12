import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Box,
  Settings as SettingsIcon,
  User,
  Bell,
  Moon,
  Sun,
  AlertCircle,
} from 'lucide-react';
import { Asset, Project } from '@/types';
import { NewProjectModal } from '@/components/portal/NewProjectModal';
import { ProjectTable } from '@/components/portal/ProjectTable';
import { AssetGrid } from '@/components/portal/AssetGrid';
import { ProjectProgress } from '@/components/portal/ProjectProgress';
import { ActivityFeed } from '@/components/portal/ActivityFeed';
import { ProjectsProvider, AssetsProvider } from '@/services/dataProvider';
import DarkModeToggle from '@/components/DarkModeToggle';
import { AssetAnalyticsBoard } from '@/components/portal/AssetAnalyticsBoard';
import { AssetListTable } from '@/components/portal/AssetListTable';
import { useAuth } from '@/contexts/AuthContext';

const Portal: React.FC<{ role: 'employee' | 'customer' }> = ({ role }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'customers' | 'settings'>(
    'dashboard'
  );

  const handleLogout = async () => {
    await logout();
    navigate('/app/login');
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [projectSearchTerm, setProjectSearchTerm] = useState('');

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = async (data: {
    name: string;
    client: string;
    address?: string;
    phone?: string;
  }) => {
    try {
      await ProjectsProvider.create({ ...data, type: 'standard' });
      const projData = await ProjectsProvider.list();
      setProjects(projData);
      setActiveTab('projects');
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setError(null);
        const [projData, assetData] = await Promise.all([
          ProjectsProvider.list(),
          AssetsProvider.list(),
        ]);
        if (!cancelled) {
          setProjects(projData);
          setAssets(assetData);
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load portal data';
          console.error('Failed to fetch data', err);
          setError(errorMessage);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
        Loading Portal...
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen bg-slate-50 dark:bg-slate-900"
      {...(import.meta.env.DEV && {
        'data-component': 'Portal Dashboard',
        'data-file': 'src/pages/Portal.tsx',
      })}
    >
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateProject}
      />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                  Error Loading Portal
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:opacity-70 transition-opacity"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        )}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-3 bg-brand-600 rounded-xl text-white hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
              title="Back to Dashboard"
            >
              <Box className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Welcome back, {role === 'employee' ? 'Admin' : 'Client'}.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {role === 'employee' && (
              <button
                onClick={() => setActiveTab('projects')}
                className={`font-medium transition-colors ${
                  activeTab === 'projects'
                    ? 'text-brand-600 dark:text-brand-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Projects
              </button>
            )}
            {role === 'employee' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> New Project
              </button>
            )}
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-medium no-underline bg-transparent border-none cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {role === 'customer' ? (
              // Client Dashboard View
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <ProjectProgress
                      currentStatus={projects[0]?.status || 'Intake'}
                      projectName={projects[0]?.name || 'New Project'}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <AssetAnalyticsBoard assets={assets} />
                  </div>
                  {/* Activity feed moved down or kept if layout permits */}
                </div>

                {/* Secondary Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <ActivityFeed />
                  </div>
                  {/* Placeholder for future widget */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                      Request New Capture
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                      Ready to scan more items? Start a new project request.
                    </p>
                    <Link to="/request">
                      <button className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-bold text-sm w-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        Start Request
                      </button>
                    </Link>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                      Support
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                      Need help with your models or the portal?
                    </p>
                    <button className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-bold text-sm w-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      Contact Us
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Employee Dashboard View (Stats)
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-xl shadow-lg text-white">
                    <h3 className="font-bold text-lg mb-2">Upload Product Images</h3>
                    <p className="text-indigo-100 text-sm mb-4">
                      Upload photos to generate high-quality 3D models.
                    </p>
                    <Link to="/app/editor/new">
                      <button className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-bold text-sm w-full hover:bg-indigo-50 transition-colors">
                        Upload Images
                      </button>
                    </Link>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
                      Active Projects
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">12</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
                      Assets in Review
                    </div>
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">5</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
                      Published Assets
                    </div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">148</div>
                  </div>
                </div>

                {/* Recent Projects Table */}
                {/* Recent Projects Table - Employee Only */}
                {role === 'employee' && (
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Recent Projects
                      </h2>
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          placeholder="Search projects..."
                          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64 text-slate-900 dark:text-slate-200"
                          value={projectSearchTerm}
                          onChange={(e) => setProjectSearchTerm(e.target.value)}
                        />
                        <button
                          onClick={() => setActiveTab('projects')}
                          className="text-brand-600 hover:text-brand-800 text-sm font-bold"
                        >
                          View All
                        </button>
                      </div>
                    </div>
                    <AssetListTable
                      assets={assets
                        .filter(
                          (a) =>
                            a.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                            a.type?.toLowerCase().includes(projectSearchTerm.toLowerCase())
                        )
                        .slice(0, 5)}
                    />
                  </div>
                )}
              </>
            )}

            {/* Recent Assets (Shared) */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Assets</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search scenes..."
                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-64 text-slate-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <AssetGrid assets={filteredAssets} role={role} />
            </div>
          </div>
        )}

        {/* Projects Table */}
        {(activeTab === 'projects' || activeTab === 'customers') && (
          <ProjectTable projects={projects} />
        )}

        {/* Settings View */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-600" />
                  Profile Settings
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Manage your account information and preferences.
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={role === 'employee' ? 'Admin User' : 'Valued Client'}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={
                        role === 'employee' ? 'admin@example.com' : 'client@example.com'
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-brand-600" />
                  App Preferences
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Customize your dashboard experience.
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <Sun className="w-5 h-5 text-amber-500 hidden dark:block" />
                      <Moon className="w-5 h-5 text-slate-500 dark:hidden" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">Appearance</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Toggle between light and dark themes
                      </div>
                    </div>
                  </div>
                  <DarkModeToggle />
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 my-4"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <Bell className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        Notifications
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Receive email updates about project status
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors mr-3"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Portal;
