import React, { useState, useEffect } from 'react';
import {
  Users,
  Box,
  TrendingUp,
  Shield,
  Activity,
  Server,
  Search,
  MoreVertical,
  Briefcase,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AssetAnalyticsBoard } from '@/components/portal/AssetAnalyticsBoard';
import Skeleton, { SkeletonCard, SkeletonRow } from '@/components/Skeleton';
import { AssetsProvider, ProjectsProvider } from '@/services/dataProvider';
import { getUsers } from '@/services/api/auth';
import { Asset, Project } from '@/types';
import { User } from '@/types/auth';

const SuperAdmin: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'projects' | 'system'>(
    'overview'
  );
  const [userFilter, setUserFilter] = useState<'all' | 'employee' | 'customer'>('all');

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
            { id: 'projects', label: 'All Projects', icon: Briefcase },
            { id: 'system', label: 'System Health', icon: Server },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'users' | 'projects' | 'system')}
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
                </div>
              </div>
              <table className="w-full text-left text-sm text-zinc-700 dark:text-zinc-300">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Org / Company</th>
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
                      const roleColor = isCustomer ? 'blue' : 'purple';

                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                  isCustomer
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-purple-100 text-purple-700'
                                }`}
                              >
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-zinc-900 dark:text-white">
                                  {user.name}
                                </div>
                                <div className="text-xs text-zinc-400">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${roleColor}-100 text-${roleColor}-800 dark:bg-${roleColor}-900/30 dark:text-${roleColor}-300 capitalize`}
                            >
                              {user.role.type.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-medium text-zinc-800 dark:text-zinc-300">
                              {(user as { customerId?: string }).customerId || user.orgId}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                                user.status === 'active'
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-zinc-500'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  user.status === 'active' ? 'bg-green-500' : 'bg-zinc-400'
                                }`}
                              ></span>
                              <span className="capitalize">{user.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

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
    </div>
  );
};

export default SuperAdmin;
