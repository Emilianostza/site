import React, { useState, useEffect } from 'react';
import {
  Users,
  Box,
  TrendingUp,
  Shield,
  Activity,
  Server,
  Settings,
  Search,
  Filter,
  MoreVertical,
  Briefcase,
} from 'lucide-react';
import { AssetAnalyticsBoard } from '@/components/portal/AssetAnalyticsBoard';
import { AssetsProvider, ProjectsProvider } from '@/services/dataProvider';
import { getUsers } from '@/services/api/auth';
import { Asset, Project } from '@/types';
import { User } from '@/types/auth';

const SuperAdmin: React.FC = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                Super Admin
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Global Control Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              System Healthy
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-slate-300 dark:border-slate-600">
              <img
                src="https://ui-avatars.com/api/?name=Emiliano&background=0ea5e9&color=fff"
                alt="Profile"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl max-w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'projects', label: 'All Projects', icon: Briefcase },
            { id: 'system', label: 'System Health', icon: Server },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                      <Box className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Total Assets
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {assets.length}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Total Projects
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {projects.length}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Active Users
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">1,248</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Revenue (MRR)
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$48.2k</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Global Analytics */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Platform-wide Analytics
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Aggregated view of all client assets
                  </p>
                </div>
                <AssetAnalyticsBoard assets={assets} />
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    User Management
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Total Users: {users.length}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                    {(['all', 'employee', 'customer'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setUserFilter(filter)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                          userFilter === filter
                            ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
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
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-9 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border-none text-sm focus:ring-2 focus:ring-brand-500 w-64"
                    />
                  </div>
                </div>
              </div>
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Org / Company</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
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
                      const roleLabel = isCustomer ? 'Client' : 'Team Member';

                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
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
                                <div className="font-medium text-slate-900 dark:text-white">
                                  {user.name}
                                </div>
                                <div className="text-xs text-slate-400">{user.email}</div>
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
                            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              {(user as any).customerId || user.orgId}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                                user.status === 'active'
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-slate-500'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  user.status === 'active' ? 'bg-green-500' : 'bg-slate-400'
                                }`}
                              ></span>
                              <span className="capitalize">{user.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
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
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
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
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Server className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700 dark:text-slate-200">
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
