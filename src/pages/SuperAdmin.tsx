import React, { useState, useEffect } from 'react';
import {
  Users,
  Box,
  TrendingUp,
  Shield,
  Activity,
  Server,
  Search,
  Briefcase,
  LogOut,
  BarChart2,
  FolderOpen,
  Image,
  ChevronRight,
  DollarSign,
  CreditCard,
  Receipt,
  AlertTriangle,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AssetAnalyticsBoard } from '@/components/portal/AssetAnalyticsBoard';
import { ActivityFeed } from '@/components/portal/ActivityFeed';
import Skeleton, { SkeletonCard, SkeletonRow } from '@/components/Skeleton';
import { AssetsProvider, ProjectsProvider } from '@/services/dataProvider';
import { getUsers, createUser, deleteUser } from '@/services/api/auth';
import { Asset, Project } from '@/types';
import { User } from '@/types/auth';

const SuperAdmin: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'projects' | 'assets' | 'system' | 'analytics'
  >('overview');
  const [userFilter, setUserFilter] = useState<'all' | 'employee' | 'customer'>('all');
  const [analyticsView, setAnalyticsView] = useState<'customers' | 'team'>('customers');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [assetSearch, setAssetSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    roleType: 'customer_owner',
    orgId: '',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const handleAddUser = async () => {
    if (!addForm.name.trim() || !addForm.email.trim()) {
      setAddError('Name and email are required.');
      return;
    }
    setAddLoading(true);
    setAddError('');
    try {
      const newUser = await createUser(addForm);
      setUsers((prev) => [...prev, newUser]);
      setShowAddModal(false);
      setAddForm({ name: '', email: '', roleType: 'customer_owner', orgId: '' });
    } catch {
      setAddError('Failed to create user. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Remove this user? This cannot be undone.')) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Failed to remove user.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsData, projectsData, usersData] = await Promise.all([
          AssetsProvider.list(),
          ProjectsProvider.list(),
          getUsers(),
        ]);
        setAssets(assetsData as Asset[]);
        setProjects(projectsData as Project[]);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to load super admin data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/app/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="w-10 h-10" rounded="xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-3.5 w-36" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-1">
            {[...Array(8)].map((_, i) => (
              <SkeletonRow key={i} cols={5} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white leading-none">
                Super Admin
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Global Control Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              System Healthy
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden border-2 border-zinc-300 dark:border-zinc-700">
              <img
                src="https://ui-avatars.com/api/?name=Emiliano&background=0ea5e9&color=fff"
                alt="Profile"
              />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-zinc-200/50 dark:bg-zinc-900/50 p-1 rounded-xl max-w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'assets', label: 'All Assets', icon: Image },
            { id: 'projects', label: 'All Projects', icon: Briefcase },
            { id: 'analytics', label: 'Performance Analytics', icon: BarChart2 },
            { id: 'system', label: 'System Health', icon: Server },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as 'overview' | 'users' | 'projects' | 'assets' | 'system' | 'analytics'
                )
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Key Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                      <Box className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        Total Assets
                      </p>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {assets.length}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        Total Projects
                      </p>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {projects.length}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        Active Users
                      </p>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">1,248</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        Revenue (MRR)
                      </p>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">$48.2k</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <ActivityFeed />

              {/* Global Analytics */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                    Platform-wide Analytics
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Aggregated view of all client assets
                  </p>
                </div>
                <AssetAnalyticsBoard assets={assets} />
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                    User Management
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Total Users: {users.length}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                    {(['all', 'employee', 'customer'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setUserFilter(filter)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                          userFilter === filter
                            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300'
                        }`}
                      >
                        {filter === 'all'
                          ? 'All Users'
                          : filter === 'employee'
                            ? 'Team'
                            : 'Clients'}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-9 pr-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none text-sm focus:ring-2 focus:ring-brand-500 w-64"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setAddError('');
                      setShowAddModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add User
                  </button>
                </div>
              </div>
              <table className="w-full text-left text-sm text-zinc-700 dark:text-zinc-300">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Org / Company</th>
                    <th className="px-6 py-4">Projects</th>
                    <th className="px-6 py-4">Assets</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {users
                    .filter((u) => {
                      if (userFilter === 'all') return true;
                      const isCustomer = ['customer_owner', 'customer_viewer'].includes(
                        u.role.type
                      );
                      return userFilter === 'customer' ? isCustomer : !isCustomer;
                    })
                    .map((user) => {
                      const isCustomer = ['customer_owner', 'customer_viewer'].includes(
                        user.role.type
                      );
                      const isExpanded = expandedUserId === user.id;

                      const userProjects = projects.filter(
                        (p) => p.client === user.name || p.client === user.orgId
                      );
                      const userProjectIds = new Set(userProjects.map((p) => p.id));
                      const userAssets = assets.filter((a) =>
                        userProjectIds.has(a.project_id ?? '')
                      );

                      const roleColors: Record<string, string> = {
                        admin:
                          'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
                        approver:
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                        technician:
                          'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
                        sales_lead:
                          'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
                        super_admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                        customer_owner:
                          'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
                        customer_viewer:
                          'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
                      };

                      return (
                        <React.Fragment key={user.id}>
                          <tr
                            className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer ${isExpanded ? 'bg-brand-50/40 dark:bg-brand-900/10' : ''}`}
                            onClick={() => setExpandedUserId(isExpanded ? null : user.id)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${isCustomer ? 'bg-sky-100 text-sky-700' : 'bg-purple-100 text-purple-700'}`}
                                >
                                  {user.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-semibold text-zinc-900 dark:text-white">
                                    {user.name}
                                  </div>
                                  <div className="text-xs text-zinc-400">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[user.role.type] ?? ''}`}
                              >
                                {user.role.type.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                              {(user as any).customerId || user.orgId}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                {userProjects.length}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                  {userAssets.length}
                                </span>
                                {userAssets.slice(0, 3).map((a) => (
                                  <img
                                    key={a.id}
                                    src={a.thumb}
                                    alt={a.name}
                                    className="w-7 h-7 rounded-md object-cover border border-zinc-200 dark:border-zinc-700"
                                  />
                                ))}
                                {userAssets.length > 3 && (
                                  <span className="text-xs text-zinc-400">
                                    +{userAssets.length - 3}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${user.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-zinc-500'}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-zinc-400'}`}
                                />
                                <span className="capitalize">{user.status}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <ChevronRight
                                  className={`w-4 h-4 text-zinc-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(user.id);
                                  }}
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                  title="Remove user"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded detail panel */}
                          {isExpanded && (
                            <tr className="bg-zinc-50/80 dark:bg-zinc-800/30">
                              <td colSpan={7} className="px-6 py-5">
                                <div className="space-y-4">
                                  {/* Info grid */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                      { label: 'User ID', value: user.id },
                                      { label: 'Org', value: user.orgId },
                                      {
                                        label: 'Created',
                                        value: new Date(user.createdAt).toLocaleDateString(),
                                      },
                                      {
                                        label: 'MFA',
                                        value: user.mfaEnabled ? 'Enabled' : 'Disabled',
                                      },
                                    ].map((item) => (
                                      <div
                                        key={item.label}
                                        className="bg-white dark:bg-zinc-900 rounded-lg px-3 py-2 border border-zinc-200 dark:border-zinc-700"
                                      >
                                        <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">
                                          {item.label}
                                        </div>
                                        <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 truncate">
                                          {item.value}
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Projects */}
                                  {userProjects.length > 0 && (
                                    <div>
                                      <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                                        Projects ({userProjects.length})
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {userProjects.map((p) => (
                                          <div
                                            key={p.id}
                                            className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2"
                                          >
                                            <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                                            <div>
                                              <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                                {p.name}
                                              </div>
                                              <div className="text-[10px] text-zinc-400">
                                                {p.status} · {p.items} items
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Assets grid */}
                                  {userAssets.length > 0 ? (
                                    <div>
                                      <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                                        Assets ({userAssets.length})
                                      </div>
                                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                        {userAssets.map((asset) => (
                                          <div key={asset.id} className="group">
                                            <div className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shadow-sm">
                                              <img
                                                src={asset.thumb}
                                                alt={asset.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                              />
                                              <div className="absolute top-1.5 left-1.5">
                                                <span
                                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${asset.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : asset.status === 'In Review' ? 'bg-orange-100 text-orange-700' : 'bg-zinc-100 text-zinc-600'}`}
                                                >
                                                  {asset.status}
                                                </span>
                                              </div>
                                            </div>
                                            <p className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 mt-1 truncate">
                                              {asset.name}
                                            </p>
                                            <p className="text-[9px] text-zinc-400">{asset.type}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-zinc-400 italic">
                                      No assets linked to this user's projects.
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

          {/* All Assets Tab */}
          {activeTab === 'assets' &&
            (() => {
              const filtered = assets.filter(
                (a) =>
                  !assetSearch ||
                  a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
                  (a.type ?? '').toLowerCase().includes(assetSearch.toLowerCase())
              );

              // Group assets by project, then by customer
              const projectMap = new Map(projects.map((p) => [p.id, p]));
              const grouped: {
                customer: string;
                projectName: string;
                projectId: string;
                assets: Asset[];
              }[] = [];
              const seen = new Set<string>();
              filtered.forEach((a) => {
                const proj = projectMap.get(a.project_id ?? '');
                const key = proj?.id ?? 'unknown';
                if (!seen.has(key)) {
                  seen.add(key);
                  grouped.push({
                    customer: proj?.client ?? 'Unknown',
                    projectName: proj?.name ?? 'Unknown Project',
                    projectId: key,
                    assets: [],
                  });
                }
                grouped.find((g) => g.projectId === key)?.assets.push(a);
              });

              return (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                        All Assets
                      </h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {assets.length} total assets across all customers
                      </p>
                    </div>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search assets..."
                        value={assetSearch}
                        onChange={(e) => setAssetSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-none text-sm focus:ring-2 focus:ring-brand-500 w-56"
                      />
                    </div>
                  </div>

                  {grouped.length === 0 && (
                    <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
                      No assets found.
                    </div>
                  )}

                  {grouped.map((group) => (
                    <div
                      key={group.projectId}
                      className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
                            <FolderOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-white text-sm">
                              {group.projectName}
                            </div>
                            <div className="text-xs text-zinc-400">
                              Client:{' '}
                              <span className="font-medium text-zinc-600 dark:text-zinc-300">
                                {group.customer}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                          {group.assets.length} asset{group.assets.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {group.assets.map((asset) => (
                          <div key={asset.id} className="group">
                            <div className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                              <img
                                src={asset.thumb}
                                alt={asset.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                              />
                              <div className="absolute top-2 left-2">
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm ${asset.status === 'Published' ? 'bg-emerald-100/90 text-emerald-700' : asset.status === 'In Review' ? 'bg-orange-100/90 text-orange-700' : 'bg-zinc-100/90 text-zinc-600'}`}
                                >
                                  {asset.status}
                                </span>
                              </div>
                              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[9px] font-mono bg-black/60 text-white px-1.5 py-0.5 rounded">
                                  {asset.id}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-2 truncate">
                              {asset.name}
                            </p>
                            <div className="flex items-center justify-between mt-0.5">
                              <p className="text-[10px] text-zinc-400">
                                {asset.type ?? '3D Model'}
                              </p>
                              {(asset.viewCount ?? 0) > 0 && (
                                <p className="text-[10px] text-zinc-400">
                                  {asset.viewCount?.toLocaleString()} views
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

          {/* All Projects Tab */}
          {activeTab === 'projects' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">All Projects</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {projects.length} projects across all customers
                </p>
              </div>
              <table className="w-full text-sm text-left text-zinc-700 dark:text-zinc-300">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="px-6 py-4">Project</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Assets</th>
                    <th className="px-6 py-4">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {projects.map((project) => {
                    const projectAssets = assets.filter((a) => a.project_id === project.id);
                    const statusColors: Record<string, string> = {
                      approved:
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                      processing:
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                      qa: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
                      pending: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400',
                      delivered: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
                      archived: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-500',
                    };
                    return (
                      <tr
                        key={project.id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0">
                              <Briefcase className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div>
                              <div className="font-semibold text-zinc-900 dark:text-white">
                                {project.name}
                              </div>
                              <div className="text-xs font-mono text-zinc-400">{project.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-zinc-800 dark:text-zinc-200">
                          {project.client}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[project.status] ?? 'bg-zinc-100 text-zinc-600'}`}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-zinc-800 dark:text-zinc-200">
                          {project.items}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                              {projectAssets.length}
                            </span>
                            <div className="flex -space-x-1">
                              {projectAssets.slice(0, 4).map((a) => (
                                <img
                                  key={a.id}
                                  src={a.thumb}
                                  alt={a.name}
                                  className="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-zinc-900"
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400">
                          {project.created_at
                            ? new Date(project.created_at).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'analytics' &&
            (() => {
              const customers = users.filter((u) =>
                ['customer_owner', 'customer_viewer'].includes(u.role.type)
              );
              const teamMembers = users.filter((u) =>
                ['admin', 'approver', 'technician', 'sales_lead'].includes(u.role.type)
              );

              const projectsForClient = (user: User) =>
                projects.filter((p) => p.client === user.name || p.client === user.orgId);

              const assetsForProjects = (clientProjects: typeof projects) => {
                const ids = new Set(clientProjects.map((p) => p.id));
                return assets.filter((a) => ids.has((a as { projectId?: string }).projectId ?? ''));
              };

              const assignedProjects = (user: User) => {
                if (user.role.type === 'technician') {
                  const ids = new Set(user.role.assignedProjectIds);
                  return projects.filter((p) => ids.has(p.id));
                }
                return [];
              };

              const maxProjects = Math.max(
                1,
                ...(analyticsView === 'customers' ? customers : teamMembers).map((u) =>
                  analyticsView === 'customers'
                    ? projectsForClient(u).length
                    : assignedProjects(u).length
                )
              );

              const roleColors: Record<string, string> = {
                admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
                approver: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                technician: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
                sales_lead:
                  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
                customer_owner: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
                customer_viewer:
                  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
              };

              const displayList = analyticsView === 'customers' ? customers : teamMembers;

              return (
                <div className="space-y-6">
                  {/* Header + sub-toggle */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                        Performance Analytics
                      </h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Projects, assets, and activity broken down per entity
                      </p>
                    </div>
                    <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 self-start sm:self-auto">
                      {(['customers', 'team'] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setAnalyticsView(v)}
                          className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${
                            analyticsView === v
                              ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                          }`}
                        >
                          {v === 'customers' ? 'Customers' : 'Team Members'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary strip */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      {
                        label: analyticsView === 'customers' ? 'Total Customers' : 'Team Size',
                        value: displayList.length,
                        icon: Users,
                        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                      },
                      {
                        label: 'Active',
                        value: displayList.filter((u) => u.status === 'active').length,
                        icon: Activity,
                        color:
                          'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                      },
                      {
                        label:
                          analyticsView === 'customers' ? 'Projects Linked' : 'Projects Assigned',
                        value:
                          analyticsView === 'customers'
                            ? customers.reduce((sum, u) => sum + projectsForClient(u).length, 0)
                            : teamMembers.reduce((sum, u) => sum + assignedProjects(u).length, 0),
                        icon: FolderOpen,
                        color:
                          'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 flex items-center gap-4"
                      >
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Per-entity table */}
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <table className="w-full text-sm text-left text-zinc-700 dark:text-zinc-300">
                      <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                        <tr>
                          <th className="px-6 py-4">
                            {analyticsView === 'customers' ? 'Customer' : 'Team Member'}
                          </th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">
                            {analyticsView === 'customers' ? 'Projects' : 'Assigned'}
                          </th>
                          <th className="px-6 py-4">
                            {analyticsView === 'customers' ? 'Assets' : 'Completion'}
                          </th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {displayList.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-6 py-12 text-center text-zinc-400 dark:text-zinc-500"
                            >
                              No {analyticsView === 'customers' ? 'customers' : 'team members'}{' '}
                              found.
                            </td>
                          </tr>
                        )}
                        {displayList.map((user) => {
                          const clientProjects = projectsForClient(user);
                          const clientAssets = assetsForProjects(clientProjects);
                          const assigned = assignedProjects(user);
                          const projectCount =
                            analyticsView === 'customers' ? clientProjects.length : assigned.length;
                          const barWidth =
                            maxProjects > 0 ? Math.round((projectCount / maxProjects) * 100) : 0;

                          const delivered =
                            analyticsView === 'team'
                              ? assigned.filter((p) => p.status === 'delivered').length
                              : 0;
                          const completionPct =
                            analyticsView === 'team' && assigned.length > 0
                              ? Math.round((delivered / assigned.length) * 100)
                              : null;

                          return (
                            <tr
                              key={user.id}
                              className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                            >
                              {/* Identity */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                                      analyticsView === 'customers'
                                        ? 'bg-sky-100 text-sky-700'
                                        : 'bg-purple-100 text-purple-700'
                                    }`}
                                  >
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-medium text-zinc-900 dark:text-white truncate">
                                      {user.name}
                                    </div>
                                    <div className="text-xs text-zinc-400 truncate">
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Role */}
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                    roleColors[user.role.type] ?? ''
                                  }`}
                                >
                                  {user.role.type.replace('_', ' ')}
                                </span>
                              </td>

                              {/* Projects / bar */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3 min-w-[120px]">
                                  <div className="flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="h-full bg-brand-500 rounded-full transition-all"
                                      style={{ width: `${barWidth}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 w-6 text-right">
                                    {projectCount}
                                  </span>
                                </div>
                              </td>

                              {/* Assets / Completion */}
                              <td className="px-6 py-4">
                                {analyticsView === 'customers' ? (
                                  <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                                    <Image className="w-3.5 h-3.5" />
                                    <span className="font-medium">{clientAssets.length}</span>
                                  </div>
                                ) : completionPct !== null ? (
                                  <div className="flex items-center gap-2 min-w-[100px]">
                                    <div className="flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all ${
                                          completionPct >= 75
                                            ? 'bg-green-500'
                                            : completionPct >= 40
                                              ? 'bg-amber-500'
                                              : 'bg-zinc-400'
                                        }`}
                                        style={{ width: `${completionPct}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                      {completionPct}%
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-zinc-400">—</span>
                                )}
                              </td>

                              {/* Status */}
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                                    user.status === 'active'
                                      ? 'text-green-600 dark:text-green-400'
                                      : user.status === 'suspended'
                                        ? 'text-amber-600 dark:text-amber-400'
                                        : 'text-zinc-400'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      user.status === 'active'
                                        ? 'bg-green-500'
                                        : user.status === 'suspended'
                                          ? 'bg-amber-500'
                                          : 'bg-zinc-400'
                                    }`}
                                  />
                                  <span className="capitalize">{user.status}</span>
                                </span>
                              </td>

                              {/* Action */}
                              <td className="px-6 py-4 text-right">
                                <button
                                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
                                  onClick={() => {
                                    setActiveTab('users');
                                  }}
                                >
                                  View
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Customer Payroll / Billing — only shown in customers view */}
                  {analyticsView === 'customers' &&
                    (() => {
                      // Deterministic mock billing per customer derived from their id
                      const seed = (s: string) =>
                        s.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

                      type PayStatus = 'Paid' | 'Partial' | 'Overdue' | 'Pending';

                      const billing = customers.map((u, i) => {
                        const n = seed(u.id) + i * 137;
                        const total = 800 + (n % 9) * 350;
                        const paidPct = [100, 100, 50, 0, 75, 100, 0, 50][n % 8];
                        const paid = Math.round((total * paidPct) / 100);
                        const outstanding = total - paid;
                        const daysAgo = (n % 45) - 5; // negative = overdue
                        const dueDate = new Date(Date.now() + daysAgo * 86_400_000);
                        const status: PayStatus =
                          paidPct === 100
                            ? 'Paid'
                            : daysAgo < 0
                              ? 'Overdue'
                              : paidPct === 0
                                ? 'Pending'
                                : 'Partial';
                        const invoice = `INV-${2025000 + (seed(u.id) % 999)}`;
                        return { user: u, total, paid, outstanding, status, dueDate, invoice };
                      });

                      const totalBilled = billing.reduce((s, b) => s + b.total, 0);
                      const totalPaid = billing.reduce((s, b) => s + b.paid, 0);
                      const totalOutstanding = billing.reduce((s, b) => s + b.outstanding, 0);
                      const overdueCount = billing.filter((b) => b.status === 'Overdue').length;

                      const fmt = (n: number) =>
                        n.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        });

                      const statusStyle: Record<PayStatus, string> = {
                        Paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                        Partial:
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                        Overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                        Pending: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400',
                      };

                      return (
                        <div className="space-y-4">
                          {/* Payroll header */}
                          <div className="flex items-center gap-2 pt-2">
                            <Receipt className="w-4 h-4 text-zinc-400" />
                            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                              Customer Payroll
                            </h3>
                            {overdueCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                <AlertTriangle className="w-3 h-3" />
                                {overdueCount} overdue
                              </span>
                            )}
                          </div>

                          {/* Payroll summary strip */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                              {
                                label: 'Total Billed',
                                value: fmt(totalBilled),
                                icon: Receipt,
                                color:
                                  'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                              },
                              {
                                label: 'Collected',
                                value: fmt(totalPaid),
                                icon: CreditCard,
                                color:
                                  'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                              },
                              {
                                label: 'Outstanding',
                                value: fmt(totalOutstanding),
                                icon: DollarSign,
                                color:
                                  totalOutstanding > 0
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                    : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                              },
                            ].map((s) => (
                              <div
                                key={s.label}
                                className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3"
                              >
                                <div className={`p-2.5 rounded-lg ${s.color}`}>
                                  <s.icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {s.label}
                                  </p>
                                  <p className="text-lg font-bold text-zinc-900 dark:text-white">
                                    {s.value}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Payroll table */}
                          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                            <table className="w-full text-sm text-left text-zinc-700 dark:text-zinc-300">
                              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                                <tr>
                                  <th className="px-6 py-3">Customer</th>
                                  <th className="px-6 py-3">Invoice</th>
                                  <th className="px-6 py-3">Total</th>
                                  <th className="px-6 py-3">Paid</th>
                                  <th className="px-6 py-3">Outstanding</th>
                                  <th className="px-6 py-3">Due Date</th>
                                  <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {billing.length === 0 && (
                                  <tr>
                                    <td
                                      colSpan={7}
                                      className="px-6 py-10 text-center text-zinc-400"
                                    >
                                      No billing records found.
                                    </td>
                                  </tr>
                                )}
                                {billing.map(
                                  ({
                                    user: u,
                                    total,
                                    paid,
                                    outstanding,
                                    status,
                                    dueDate,
                                    invoice,
                                  }) => (
                                    <tr
                                      key={u.id}
                                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                                    >
                                      <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                          <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {u.name.charAt(0).toUpperCase()}
                                          </div>
                                          <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[140px]">
                                            {u.name}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                                        {invoice}
                                      </td>
                                      <td className="px-6 py-3 font-semibold">{fmt(total)}</td>
                                      <td className="px-6 py-3 text-green-700 dark:text-green-400 font-medium">
                                        {fmt(paid)}
                                      </td>
                                      <td className="px-6 py-3">
                                        {outstanding > 0 ? (
                                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                                            {fmt(outstanding)}
                                          </span>
                                        ) : (
                                          <span className="text-zinc-400">—</span>
                                        )}
                                      </td>
                                      <td className="px-6 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                                        {dueDate.toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                        })}
                                      </td>
                                      <td className="px-6 py-3 text-right">
                                        <span
                                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle[status]}`}
                                        >
                                          {status}
                                        </span>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()}
                </div>
              );
            })()}

          {activeTab === 'system' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-lg mb-4 text-zinc-900 dark:text-white">
                  System Status
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'API Gateway', status: 'Operational', color: 'green' },
                    { name: 'Database (Main)', status: 'Operational', color: 'green' },
                    { name: 'Storage (S3)', status: 'Operational', color: 'green' },
                    { name: 'Rendering Engine', status: 'Processing', color: 'blue' },
                  ].map((sys, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Server className="w-4 h-4 text-zinc-400" />
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {sys.name}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-md bg-${sys.color}-100 text-${sys.color}-700 dark:bg-${sys.color}-900/30 dark:text-${sys.color}-400`}
                      >
                        {sys.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">Add User</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {addError && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {addError}
                </p>
              )}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Doe"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="jane@example.com"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Role
                </label>
                <select
                  value={addForm.roleType}
                  onChange={(e) => setAddForm((f) => ({ ...f, roleType: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <optgroup label="Employees">
                    <option value="admin">Admin</option>
                    <option value="approver">Approver</option>
                    <option value="technician">Technician</option>
                    <option value="sales_lead">Sales Lead</option>
                  </optgroup>
                  <optgroup label="Customers">
                    <option value="customer_owner">Customer Owner</option>
                    <option value="customer_viewer">Customer Viewer</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Org ID <span className="normal-case font-normal text-zinc-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={addForm.orgId}
                  onChange={(e) => setAddForm((f) => ({ ...f, orgId: e.target.value }))}
                  placeholder="org-1 (auto-assigned if blank)"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={addLoading}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {addLoading ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
