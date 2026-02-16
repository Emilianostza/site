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
  Shield,
  CreditCard,
  Check,
} from 'lucide-react';
import { Asset, Project } from '@/types';
import { NewProjectModal } from '@/components/portal/NewProjectModal';
import { ProjectTable } from '@/components/portal/ProjectTable';
import { AssetGrid } from '@/components/portal/AssetGrid';

import { ProjectsProvider, AssetsProvider } from '@/services/dataProvider';
import DarkModeToggle from '@/components/DarkModeToggle';
import { AssetAnalyticsBoard } from '@/components/portal/AssetAnalyticsBoard';
import { AssetListTable } from '@/components/portal/AssetListTable';
import { useAuth } from '@/contexts/AuthContext';
import { X } from 'lucide-react';
import { SEO } from '@/components/common/SEO';

const Portal: React.FC<{ role: 'employee' | 'customer' }> = ({ role }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'customers' | 'settings'>(
    'dashboard'
  );
  const [activeSettingsTab, setActiveSettingsTab] = useState<
    'profile' | 'security' | 'notifications' | 'billing'
  >('profile');

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
  const [expandedAssetId, setExpandedAssetId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = async (data: {
    name: string;
    client: string;
    type?: string;
    address?: string;
    phone?: string;
  }) => {
    try {
      await ProjectsProvider.create({ ...data, type: 'standard' });
      const projData = await ProjectsProvider.list();
      setProjects(projData as Project[]);
      setActiveTab('projects');
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  const handleUpdateProject = async (id: string, data: Partial<Project>) => {
    try {
      await ProjectsProvider.update(id, data);
      const projData = await ProjectsProvider.list();
      setProjects(projData as Project[]);
    } catch (error) {
      console.error('Failed to update project', error);
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
          setProjects(projData as Project[]);
          setAssets(assetData as Asset[]);
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
      <SEO
        title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} | Dashboard`}
        description="Manage your 3D assets and projects."
      />
      <NewProjectModal
        isOpen={isModalOpen || Boolean(editingProject)}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
        onSave={async (data) => {
          if (editingProject) {
            await handleUpdateProject(editingProject.id, data);
            setEditingProject(null);
          } else {
            await handleCreateProject(data);
            setIsModalOpen(false);
          }
        }}
      />

      {/* Project Assets Modal (Popup) */}

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
                onClick={() => setIsModalOpen(true)}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> New Customer
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
                {/* Expanded Analytics Board */}
                <div className="w-full">
                  <AssetAnalyticsBoard assets={assets} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      Request New Capture
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                      Ready to scan more items? Start a new project request.
                    </p>
                    <Link to="/request">
                      <button className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-lg font-bold text-sm w-full hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-300 transition-all hover:scale-105 active:scale-100">
                        Start Request
                      </button>
                    </Link>
                  </div>

                  <div className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Support
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                      Need help with your models or the portal?
                    </p>
                    <button className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-lg font-bold text-sm w-full hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-400 dark:hover:border-purple-600 hover:text-purple-700 dark:hover:text-purple-300 transition-all hover:scale-105 active:scale-100">
                      Contact Us
                    </button>
                  </div>
                </div>
                {/* Assets Grid (Customer) */}
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Assets</h2>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search scenes..."
                        className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-64 text-slate-900 dark:text-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <AssetGrid assets={filteredAssets} role={role} />
                </div>
              </>
            ) : (
              // Employee Dashboard View (Stats)
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="group bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-2xl shadow-lg hover:shadow-2xl text-white transition-all duration-300 hover:scale-105 border border-indigo-500/20">
                    <h3 className="font-bold text-lg mb-2">Upload Product Images</h3>
                    <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                      Upload photos to generate high-quality 3D models.
                    </p>
                    <Link to="/app/editor/new">
                      <button className="bg-white text-indigo-700 px-4 py-2.5 rounded-lg font-bold text-sm w-full hover:bg-indigo-50 transition-all hover:scale-105 active:scale-100 shadow-md">
                        Upload Images
                      </button>
                    </Link>
                  </div>
                  <div className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wide">
                      Active Projects
                    </div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      12
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      +3 this month
                    </div>
                  </div>
                  <div className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wide">
                      Assets in Review
                    </div>
                    <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 group-hover:text-orange-500 transition-colors">
                      5
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Needs attention
                    </div>
                  </div>
                  <div className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wide">
                      Published Assets
                    </div>
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400 group-hover:text-green-500 transition-colors">
                      148
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      +24 this week
                    </div>
                  </div>
                </div>

                {/* Performance Analytics (Employee View) */}
                <div className="mt-8">
                  <AssetAnalyticsBoard assets={assets} />
                </div>

                {/* Recent Projects Table */}
                {/* Recent Projects Table - Employee Only */}
                {role === 'employee' && (
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Customers
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

                    <ProjectTable
                      projects={projects
                        .filter(
                          (p) =>
                            p.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                            p.client.toLowerCase().includes(projectSearchTerm.toLowerCase())
                        )
                        .slice(0, 5)}
                      assets={assets}
                      onEditProject={(projectId) => {
                        const project = projects.find((p) => p.id === projectId);
                        if (project) {
                          setEditingProject(project);
                        }
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Projects Table */}
        {(activeTab === 'projects' || activeTab === 'customers') && (
          <ProjectTable
            projects={projects}
            assets={assets}
            onEditProject={(projectId) => {
              const project = projects.find((p) => p.id === projectId);
              if (project) {
                setEditingProject(project);
              }
            }}
          />
        )}

        {/* Settings View */}
        {activeTab === 'settings' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Settings Sidebar */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-8">
                  <nav className="flex flex-col p-2 space-y-1">
                    <button
                      onClick={() => setActiveSettingsTab('profile')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeSettingsTab === 'profile'
                          ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveSettingsTab('security')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeSettingsTab === 'security'
                          ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      Security
                    </button>
                    <button
                      onClick={() => setActiveSettingsTab('notifications')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeSettingsTab === 'notifications'
                          ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                      Notifications
                    </button>
                    <button
                      onClick={() => setActiveSettingsTab('billing')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeSettingsTab === 'billing'
                          ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Billing
                    </button>
                  </nav>
                </div>
              </div>

              {/* Settings Content */}
              <div className="flex-1 space-y-6">
                {/* Profile Settings */}
                {activeSettingsTab === 'profile' && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Profile Information
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Update your personal details and company information.
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                        <div className="w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 text-2xl font-bold border-4 border-white dark:border-slate-800 shadow-sm">
                          {role === 'employee' ? 'AD' : 'CL'}
                        </div>
                        <div>
                          <button className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                            Change Avatar
                          </button>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            JPG, GIF or PNG. Max size of 800K
                          </p>
                        </div>
                      </div>

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
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            defaultValue="+1 (555) 000-0000"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            defaultValue="Acme Corp"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button className="px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeSettingsTab === 'security' && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          Password & Security
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                          Manage your password and security settings.
                        </p>
                      </div>
                      <div className="p-6 space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end pt-2">
                          <button className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">
                              Two-Factor Authentication
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              Add an extra layer of security to your account.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeSettingsTab === 'notifications' && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Notification Preferences
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Choose what we contact you about.
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        {[
                          {
                            title: 'Project Updates',
                            desc: 'Get notified when project status changes',
                            default: true,
                          },
                          {
                            title: 'New Messages',
                            desc: 'Receive emails when you have new messages',
                            default: true,
                          },
                          {
                            title: 'Marketing Emails',
                            desc: 'Receive updates about new products and features',
                            default: false,
                          },
                          {
                            title: 'Security Alerts',
                            desc: 'Get notified about suspicious activity',
                            default: true,
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0"
                          >
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                {item.title}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {item.desc}
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked={item.default}
                              />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                            <Sun className="w-5 h-5 text-amber-500 hidden dark:block" />
                            <Moon className="w-5 h-5 text-slate-500 dark:hidden" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 dark:text-white mb-1">
                              Interface Theme
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                              Toggle between light and dark mode.
                            </p>
                            <DarkModeToggle />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Billing Settings */}
                {activeSettingsTab === 'billing' && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Current Plan
                          </h2>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            You are currently on the{' '}
                            <span className="font-bold text-brand-600">Business Plan</span>
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">
                          Active
                        </span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold text-slate-900 dark:text-white">
                            $49
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 mb-1">/month</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                          Next billing date: March 15, 2026
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>Unlimited Projects</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>Advanced Analytics</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>Priority Support</span>
                          </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                          <button className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                            Change Plan
                          </button>
                          <button className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                            Cancel Subscription
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          Payment Methods
                        </h2>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                •••• •••• •••• 4242
                              </div>
                              <div className="text-sm text-slate-500">Expires 12/28</div>
                            </div>
                          </div>
                          <button className="text-sm font-medium text-brand-600 hover:text-brand-700">
                            Edit
                          </button>
                        </div>
                        <button className="flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 px-1">
                          <Plus className="w-4 h-4" />
                          Add Payment Method
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Portal;
