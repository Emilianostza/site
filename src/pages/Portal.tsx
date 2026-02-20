import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  User,
  Bell,
  Moon,
  Sun,
  AlertCircle,
  Shield,
  CreditCard,
  Check,
  Layers,
  ArrowUpRight,
  Clock,
  Camera,
  LifeBuoy,
  MapPin,
  CheckCircle2,
  XCircle,
  ChefHat,
  UtensilsCrossed,
  BookOpen,
  X,
  Star,
  Crown,
  ArrowRight,
  Box,
} from 'lucide-react';
import { Asset, Project } from '@/types';
import { NewProjectModal } from '@/components/portal/NewProjectModal';
import { ProjectTable } from '@/components/portal/ProjectTable';
import { AssetGrid } from '@/components/portal/AssetGrid';
import { ProjectsProvider, AssetsProvider } from '@/services/dataProvider';
import DarkModeToggle from '@/components/DarkModeToggle';
import { AssetAnalyticsBoard } from '@/components/portal/AssetAnalyticsBoard';
import { RecentAssetsStrip } from '@/components/portal/RecentAssetsStrip';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useTheme } from '@/contexts/ThemeContext';
import { SEO } from '@/components/common/SEO';
import Skeleton, { SkeletonCard, SkeletonRow } from '@/components/Skeleton';

const Portal: React.FC<{ role: 'employee' | 'customer' }> = ({ role }) => {
  const { logout } = useAuth();
  const { success, error: toastError } = useToast();
  const { theme } = useTheme();

  // Re-apply portal theme preference when entering the authenticated area
  // (public Layout.tsx forces light mode; this restores the user's saved choice)
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'projects' | 'customers' | 'settings' | 'billing'
  >('dashboard');
  const [activeSettingsTab, setActiveSettingsTab] = useState<
    'profile' | 'security' | 'notifications' | 'billing'
  >('profile');

  const [showUpgradePlanModal, setShowUpgradePlanModal] = useState(false);
  const [selectedUpgradeTier, setSelectedUpgradeTier] = useState<'ultra' | 'enterprise'>('ultra');

  // Password Update State
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleLogout = async () => {
    await logout();
    navigate('/app/login');
  };

  const handleUpdatePassword = () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      toastError('Please fill in all password fields.');
      return;
    }

    if (passwordForm.new !== passwordForm.confirm) {
      toastError('New passwords do not match.');
      return;
    }

    if (passwordForm.new.length < 8) {
      toastError('Password must be at least 8 characters.');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      success('Password updated successfully.');
      setPasswordForm({ current: '', new: '', confirm: '' });
    }, 1000);
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Derived stats from real data
  const activeProjectCount = projects.filter(
    (p) => p.status !== 'archived' && p.status !== 'delivered'
  ).length;
  const assetsInReviewCount = assets.filter(
    (a) => a.status === 'In Review' || a.status === 'Processing'
  ).length;
  const publishedAssetCount = assets.filter((a) => a.status === 'Published').length;

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
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12" rounded="xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-32" rounded="lg" />
              <Skeleton className="h-9 w-20" rounded="lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-1">
            {[...Array(6)].map((_, i) => (
              <SkeletonRow key={i} cols={6} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950"
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

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-20 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-sm">
              <Box className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-zinc-900 dark:text-white text-base leading-tight">
                Managed<span className="text-brand-600 dark:text-brand-400">3D</span>
              </div>
              <div className="text-xs leading-tight">
                Welcome back,{' '}
                <span className="font-bold text-sm text-zinc-900 dark:text-white">
                  Bistro Owner
                </span>
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 flex-1 justify-center overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'dashboard', label: 'Dashboard' },
                ...(role === 'employee' ? [{ id: 'customers', label: 'Customers' }] : []),
                ...(role === 'customer' ? [{ id: 'billing', label: 'Billing' }] : []),
                { id: 'settings', label: 'Settings' },
              ] as { id: typeof activeTab; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={activeTab === item.id ? 'page' : undefined}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-brand-400 focus:outline-none ${
                  activeTab === item.id
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {role === 'customer' && (
              <>
                <Link to="/request">
                  <button className="bg-brand-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 flex items-center gap-1.5 transition-colors">
                    <Camera className="w-4 h-4" />
                    <span className="hidden sm:inline">Request Capture</span>
                  </button>
                </Link>
                <button
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors"
                  title="Help & Support"
                >
                  <LifeBuoy className="w-4 h-4" />
                  <span>Help</span>
                </button>
              </>
            )}
            {role === 'employee' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-brand-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Menu</span>
              </button>
            )}
            <DarkModeToggle />
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-lg text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-screen-xl mx-auto w-full">
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
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {role === 'customer' ? (
              // Client Dashboard View
              <>
                {/* Assets Grid (Customer) */}
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Project</h2>
                  <AssetGrid assets={assets} role={role} />
                </div>
              </>
            ) : (
              // Employee Dashboard — Command Center
              <>
                {/* KPI Strip + Quick Actions */}
                <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                  {/* KPI Chips */}
                  <div className="flex flex-wrap gap-3 flex-1">
                    <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow min-w-[140px]">
                      <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-zinc-900 dark:text-white leading-none">
                          {activeProjectCount}
                        </div>
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider mt-0.5">
                          Active Menus
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow min-w-[140px]">
                      <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 leading-none">
                          {assetsInReviewCount}
                        </div>
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider mt-0.5">
                          In Review
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow min-w-[140px]">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                        <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                          {publishedAssetCount}
                        </div>
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider mt-0.5">
                          Live Menus
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <Plus className="w-4 h-4" />
                      New Menu
                    </button>
                  </div>
                </div>

                {/* New Customer Requests */}
                {(() => {
                  const pendingRequests = projects.filter((p) => p.status === 'pending');
                  if (pendingRequests.length === 0) return null;

                  const timeAgo = (iso: string) => {
                    const diff = Date.now() - new Date(iso).getTime();
                    const h = Math.floor(diff / 3600000);
                    const m = Math.floor(diff / 60000);
                    if (h >= 24) return `${Math.floor(h / 24)}d ago`;
                    if (h >= 1) return `${h}h ago`;
                    return `${m}m ago`;
                  };

                  return (
                    <div className="mt-6">
                      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-amber-200 dark:border-amber-800/50 overflow-hidden shadow-sm shadow-amber-100 dark:shadow-amber-900/10">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100 dark:border-amber-800/40 bg-amber-50/60 dark:bg-amber-900/10">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                              <ChefHat className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                              New Menu Requests
                            </h3>
                            <span className="text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                              {pendingRequests.length}
                            </span>
                          </div>
                          <button
                            onClick={() => setActiveTab('customers')}
                            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1 transition-colors"
                          >
                            View all <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Request rows */}
                        <div className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
                          {pendingRequests.map((req, i) => {
                            const avatarColors = [
                              'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
                              'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
                              'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
                            ];
                            const initials = req.client
                              .split(' ')
                              .map((w: string) => w[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase();
                            return (
                              <div
                                key={req.id}
                                className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors group"
                              >
                                {/* Avatar */}
                                <div
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm ${avatarColors[i % avatarColors.length]}`}
                                >
                                  {initials}
                                </div>

                                {/* Client + project name */}
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-zinc-900 dark:text-white text-sm truncate">
                                    {req.client}
                                  </div>
                                  <div className="text-xs text-zinc-400 truncate mt-0.5">
                                    {req.name}
                                  </div>
                                </div>

                                {/* Address */}
                                {req.address && (
                                  <div className="hidden md:flex items-center gap-1 text-zinc-400 min-w-0 max-w-[180px]">
                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                    <span className="text-xs truncate">{req.address}</span>
                                  </div>
                                )}

                                {/* Dishes */}
                                <div className="hidden lg:flex items-center gap-1 flex-shrink-0 text-zinc-400">
                                  <UtensilsCrossed className="w-3.5 h-3.5" />
                                  <span className="text-xs font-medium">{req.items} dishes</span>
                                </div>

                                {/* Time */}
                                <span className="hidden sm:block text-xs text-zinc-400 flex-shrink-0">
                                  {timeAgo(req.created_at ?? '')}
                                </span>

                                {/* Actions */}
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors border border-emerald-200 dark:border-emerald-800/50">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Accept
                                  </button>
                                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-zinc-200 dark:border-zinc-700">
                                    <XCircle className="w-3.5 h-3.5" />
                                    Decline
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Performance Analytics - Moved to Top */}
                <div className="mt-6">
                  <AssetAnalyticsBoard assets={assets} />
                </div>

                {/* Recent Assets Strip */}
                <div className="mt-6">
                  <RecentAssetsStrip assets={assets} />
                </div>

                {/* Customers List */}
                <div className="mt-6">
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                          Customers
                        </h3>
                        <span className="text-xs font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                          {projects.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <svg
                            className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <circle cx="11" cy="11" r="8" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 21l-4.35-4.35"
                            />
                          </svg>
                          <input
                            type="text"
                            placeholder="Search..."
                            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg pl-7 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 w-36 text-zinc-900 dark:text-zinc-100"
                            value={projectSearchTerm}
                            onChange={(e) => setProjectSearchTerm(e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => setActiveTab('customers')}
                          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 transition-colors"
                        >
                          View All <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
                      {(() => {
                        const avatarColors = [
                          'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
                          'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
                          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
                          'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
                          'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
                        ];
                        const statusMap: Record<string, { label: string; cls: string }> = {
                          approved: {
                            label: 'Approved',
                            cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                          },
                          processing: {
                            label: 'Processing',
                            cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                          },
                          qa: {
                            label: 'QA',
                            cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
                          },
                          pending: {
                            label: 'Pending',
                            cls: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400',
                          },
                          delivered: {
                            label: 'Delivered',
                            cls: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
                          },
                          archived: {
                            label: 'Archived',
                            cls: 'bg-zinc-100 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500',
                          },
                        };

                        const filtered = projects
                          .filter(
                            (p) =>
                              !projectSearchTerm ||
                              p.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
                              p.client.toLowerCase().includes(projectSearchTerm.toLowerCase())
                          )
                          .slice(0, 5);

                        if (filtered.length === 0)
                          return (
                            <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-600">
                              <ChefHat className="w-6 h-6 mb-2 opacity-40" />
                              <span className="text-sm">No restaurant clients found</span>
                            </div>
                          );

                        return filtered.map((p, i) => {
                          const projectAssets = assets.filter((a) => a.project_id === p.id);
                          const initials = p.client
                            .split(' ')
                            .map((w) => w[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase();
                          const colorCls = avatarColors[i % avatarColors.length];
                          const st = statusMap[p.status] ?? {
                            label: p.status,
                            cls: 'bg-zinc-100 text-zinc-600',
                          };

                          return (
                            <div
                              key={p.id}
                              className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors group"
                            >
                              {/* Avatar */}
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm ${colorCls}`}
                              >
                                {initials}
                              </div>

                              {/* Client + project */}
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-zinc-900 dark:text-white text-sm truncate">
                                  {p.client}
                                </div>
                                <div className="text-xs text-zinc-400 truncate mt-0.5">
                                  {p.name}
                                </div>
                              </div>

                              {/* Status */}
                              <span
                                className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0 ${st.cls}`}
                              >
                                {st.label}
                              </span>

                              {/* Asset thumbs */}
                              <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
                                {projectAssets.length === 0 ? (
                                  <span className="text-[11px] text-zinc-300 dark:text-zinc-600 italic">
                                    No assets
                                  </span>
                                ) : (
                                  <>
                                    <div className="flex -space-x-1.5">
                                      {projectAssets.slice(0, 4).map((a) => (
                                        <img
                                          key={a.id}
                                          src={a.thumb}
                                          alt={a.name}
                                          className="w-7 h-7 rounded-lg object-cover border-2 border-white dark:border-zinc-900 shadow-sm"
                                        />
                                      ))}
                                    </div>
                                    {projectAssets.length > 4 && (
                                      <span className="text-[11px] font-medium text-zinc-400">
                                        +{projectAssets.length - 4}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>

                              {/* Dishes */}
                              <div className="hidden lg:flex items-center gap-1 flex-shrink-0 text-zinc-400">
                                <UtensilsCrossed className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">{p.items} dishes</span>
                              </div>

                              {/* Edit */}
                              <button
                                onClick={() => {
                                  const proj = projects.find((x) => x.id === p.id);
                                  if (proj) setEditingProject(proj);
                                }}
                                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-zinc-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 dark:hover:text-brand-400"
                                title="Edit"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                                  />
                                </svg>
                              </button>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Billing Tab (Customer only) */}
        {activeTab === 'billing' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Current Plan */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Current Plan</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    You are on the{' '}
                    <span className="font-bold text-amber-600 dark:text-amber-400">Pro Plan</span> ·
                    Level B — Medium quality
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  Active
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">€35</span>
                  <span className="text-zinc-500 dark:text-zinc-400 mb-1">/month · per menu</span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mb-1">
                  2,000 views included · 8 GB storage
                </p>
                <p className="text-xs text-zinc-400 font-mono mb-4">
                  Overage: €4 / 1,000 views (next 10k) · €2 / 1,000 thereafter
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                  Next billing date:{' '}
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    March 15, 2026
                  </span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {[
                    'Unlimited 3D items (within 8 GB)',
                    'Higher-detail 3D models (Level B)',
                    'QR code for every item',
                    'Printable QR sheets (PDF)',
                    'Basic analytics',
                    'Priority email support',
                  ].map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 rounded-xl border border-zinc-100 dark:border-zinc-700"
                    >
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUpgradePlanModal(true)}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                  >
                    Upgrade to Ultra
                  </button>
                  <button className="px-5 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                    Change Plan
                  </button>
                  <button className="px-5 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* View Usage */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">View Usage</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Current billing cycle · Resets March 15, 2026
                </p>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Views used
                    </span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white font-mono">
                      1,643 <span className="text-zinc-400 font-normal">/ 2,000</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '82.15%' }} />
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5">
                    357 views remaining · No overage charges this cycle
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Total views', value: '1,643' },
                    { label: 'Billable views', value: '1,643' },
                    { label: 'Bots excluded', value: '38' },
                    { label: 'Projected bill', value: '€35' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl px-4 py-3 border border-zinc-100 dark:border-zinc-700"
                    >
                      <div className="text-lg font-bold text-zinc-900 dark:text-white font-mono">
                        {stat.value}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Payment Method</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm">
                      <CreditCard className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white text-sm">
                        •••• •••• •••• 4242
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Visa · Expires 12/28
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Default
                    </span>
                    <button className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 px-1 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </button>
              </div>
            </div>

            {/* Invoice History */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Invoice History</h2>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {[
                  {
                    date: 'Feb 15, 2026',
                    amount: '€35.00',
                    status: 'Paid',
                    invoice: 'INV-2026-02',
                  },
                  {
                    date: 'Jan 15, 2026',
                    amount: '€75.00',
                    status: 'Paid',
                    invoice: 'INV-2026-01',
                    note: '€35 plan + €40 overage (10k views)',
                  },
                  {
                    date: 'Dec 15, 2025',
                    amount: '€135.00',
                    status: 'Paid',
                    invoice: 'INV-2025-12',
                    note: '€35 plan + €100 on-site capture (1 visit + 5 models)',
                  },
                  {
                    date: 'Nov 15, 2025',
                    amount: '€35.00',
                    status: 'Paid',
                    invoice: 'INV-2025-11',
                  },
                  {
                    date: 'Oct 15, 2025',
                    amount: '€35.00',
                    status: 'Paid',
                    invoice: 'INV-2025-10',
                  },
                ].map((inv) => (
                  <div
                    key={inv.invoice}
                    className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {inv.invoice}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {inv.date}
                        {inv.note ? ` · ${inv.note}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white font-mono">
                        {inv.amount}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {inv.status}
                      </span>
                      <button className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-card border border-zinc-200 dark:border-zinc-800 overflow-hidden sticky top-8">
                  <nav className="flex flex-col p-2 space-y-1">
                    <button
                      onClick={() => setActiveSettingsTab('profile')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeSettingsTab === 'profile'
                          ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveSettingsTab('security')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeSettingsTab === 'security'
                          ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      Security
                    </button>
                    <button
                      onClick={() => setActiveSettingsTab('notifications')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeSettingsTab === 'notifications'
                          ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                      Notifications
                    </button>
                    <button
                      onClick={() => setActiveSettingsTab('billing')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeSettingsTab === 'billing'
                          ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
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
                  <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        Profile Information
                      </h2>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                        Update your personal details and company information.
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-700">
                        <div className="w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 text-2xl font-bold border-4 border-white dark:border-zinc-900 shadow-sm">
                          {role === 'employee' ? 'AD' : 'CL'}
                        </div>
                        <div>
                          <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                            Change Avatar
                          </button>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                            JPG, GIF or PNG. Max size of 800K
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            defaultValue={role === 'employee' ? 'Admin User' : 'Valued Client'}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            defaultValue={
                              role === 'employee' ? 'admin@example.com' : 'client@example.com'
                            }
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            defaultValue="+1 (555) 000-0000"
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            defaultValue="Acme Corp"
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
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
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                      <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                          Password & Security
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                          Manage your password and security settings.
                        </p>
                      </div>
                      <div className="p-6 space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.current}
                            onChange={(e) =>
                              setPasswordForm({ ...passwordForm, current: e.target.value })
                            }
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={passwordForm.new}
                              onChange={(e) =>
                                setPasswordForm({ ...passwordForm, new: e.target.value })
                              }
                              className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={passwordForm.confirm}
                              onChange={(e) =>
                                setPasswordForm({ ...passwordForm, confirm: e.target.value })
                              }
                              className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={handleUpdatePassword}
                            className="px-6 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-lg font-bold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                          >
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-zinc-900 dark:text-white">
                              Two-Factor Authentication
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                              Add an extra layer of security to your account.
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeSettingsTab === 'notifications' && (
                  <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                        Notification Preferences
                      </h2>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
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
                            className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-700 last:border-0 last:pb-0"
                          >
                            <div>
                              <div className="font-medium text-zinc-900 dark:text-white">
                                {item.title}
                              </div>
                              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                {item.desc}
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked={item.default}
                              />
                              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-sm">
                            <Sun className="w-5 h-5 text-amber-500 hidden dark:block" />
                            <Moon className="w-5 h-5 text-zinc-500 dark:hidden" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-zinc-900 dark:text-white mb-1">
                              Interface Theme
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
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
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                      <div className="p-6 border-b border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                            Current Plan
                          </h2>
                          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                            You are currently on the{' '}
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                              Pro Plan
                            </span>{' '}
                            · Level B — Medium quality
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">
                          Active
                        </span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-end gap-2 mb-1">
                          <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                            €35
                          </span>
                          <span className="text-zinc-500 dark:text-zinc-400 mb-1">
                            /month · per menu
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-mono mb-1">
                          2,000 views included · 8 GB storage
                        </p>
                        <p className="text-xs text-zinc-400 font-mono mb-4">
                          Overage: €4 / 1,000 views (next 10k) · €2 / 1,000 thereafter
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                          Next billing date: March 15, 2026
                        </p>
                        <div className="space-y-3">
                          {[
                            'Unlimited 3D items (within 8 GB)',
                            'Higher-detail 3D models (Level B)',
                            'QR code for every item',
                            'Printable QR sheets (PDF)',
                            'Basic analytics',
                            'Priority email support',
                          ].map((feat) => (
                            <div
                              key={feat}
                              className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                            >
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 flex gap-3">
                          <button
                            onClick={() => setShowUpgradePlanModal(true)}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                          >
                            Upgrade to Ultra
                          </button>
                          <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                            Change Plan
                          </button>
                          <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                            Cancel Subscription
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                      <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                          Payment Methods
                        </h2>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-zinc-500" />
                            </div>
                            <div>
                              <div className="font-medium text-zinc-900 dark:text-white">
                                •••• •••• •••• 4242
                              </div>
                              <div className="text-sm text-zinc-500">Expires 12/28</div>
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

      {/* ── Upgrade Plan Modal ─────────────────────────────── */}
      {showUpgradePlanModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowUpgradePlanModal(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Upgrade your plan
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  You are currently on the{' '}
                  <span className="font-semibold text-amber-600 dark:text-amber-400">Pro Plan</span>
                  . Choose your next tier below.
                </p>
              </div>
              <button
                onClick={() => setShowUpgradePlanModal(false)}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tier cards */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ultra */}
              <button
                onClick={() => setSelectedUpgradeTier('ultra')}
                className={`relative text-left p-5 rounded-xl border-2 transition-all focus:outline-none ${
                  selectedUpgradeTier === 'ultra'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-amber-300 dark:hover:border-amber-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-500 text-white whitespace-nowrap">
                  Recommended
                </span>
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                    selectedUpgradeTier === 'ultra'
                      ? 'bg-amber-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </div>
                <p className="font-bold text-zinc-900 dark:text-white text-sm mb-0.5">Ultra</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-snug">
                  Level A quality · Full analytics · White-label viewer
                </p>
                <div className="flex items-baseline gap-0.5 mb-3">
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">€59</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">/mo · per menu</span>
                </div>
                <ul className="space-y-1.5">
                  {[
                    'Everything in Pro',
                    'Level A (high-detail) 3D models',
                    'Full performance analytics',
                    'White-label viewer',
                    'Dedicated account manager',
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-400"
                    >
                      <Check className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {selectedUpgradeTier === 'ultra' && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </button>

              {/* Enterprise */}
              <button
                onClick={() => setSelectedUpgradeTier('enterprise')}
                className={`relative text-left p-5 rounded-xl border-2 transition-all focus:outline-none ${
                  selectedUpgradeTier === 'enterprise'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                    selectedUpgradeTier === 'enterprise'
                      ? 'bg-purple-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                </div>
                <p className="font-bold text-zinc-900 dark:text-white text-sm mb-0.5">Enterprise</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-snug">
                  API access · Custom SLA · Fully bespoke
                </p>
                <div className="flex items-baseline gap-0.5 mb-3">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    Custom
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {[
                    'Everything in Ultra',
                    'API access & webhooks',
                    'Custom integrations',
                    'Dedicated SLA & uptime guarantee',
                    'Volume pricing',
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-400"
                    >
                      <Check className="w-3.5 h-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {selectedUpgradeTier === 'enterprise' && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </button>
            </div>

            {/* CTA footer */}
            <div className="px-6 pb-6">
              <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {selectedUpgradeTier === 'ultra'
                      ? 'Ultra — €59/month per menu'
                      : 'Enterprise — custom pricing'}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {selectedUpgradeTier === 'ultra'
                      ? 'Billed monthly · cancel anytime · upgrade takes effect immediately'
                      : 'Our team will reach out within 1 business day to discuss your needs'}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setShowUpgradePlanModal(false)}
                    className="px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Not now
                  </button>
                  <button
                    onClick={() => {
                      setShowUpgradePlanModal(false);
                      success(
                        selectedUpgradeTier === 'ultra'
                          ? 'Upgrade request sent! Our team will confirm within 24 h.'
                          : 'Enterprise request sent! A specialist will contact you shortly.'
                      );
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                  >
                    {selectedUpgradeTier === 'ultra' ? 'Upgrade to Ultra' : 'Contact Sales'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portal;
