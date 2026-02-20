import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PortalRole } from '@/types';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'employee'>('employee');
  const navigate = useNavigate();
  const { login, loading, error, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Fix: user.role is an object (UserRole), so we must check .type property
      const roleType = user.role.type as PortalRole;
      if (roleType === PortalRole.SuperAdmin) {
        navigate('/app/super-admin');
      } else if ([PortalRole.CustomerOwner, PortalRole.CustomerViewer].includes(roleType)) {
        navigate('/portal/dashboard');
      } else {
        navigate('/app/dashboard');
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  // Mock user suggestions for demo
  const mockUsers = [
    { email: 'admin@company.com', role: 'employee', name: 'Admin' },
    { email: 'approver@company.com', role: 'employee', name: 'Approver' },
    { email: 'tech@company.com', role: 'employee', name: 'Technician' },
    { email: 'emilianostza@gmail.com', role: 'employee', name: 'Emiliano (Admin)' },
    { email: 'client@bistro.com', role: 'customer', name: 'Restaurant Owner' },
    { email: 'emilianostza+customer@gmail.com', role: 'customer', name: 'Emiliano (Customer)' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-center mb-8">
            <Link
              to="/"
              className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white hover:bg-brand-700 transition-colors"
            >
              <Box className="w-8 h-8" />
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Access your account to manage 3D capture projects
          </p>

          {/* Role Toggle with Descriptions */}
          <div className="space-y-2 mb-8">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Your Role
            </label>
            <div
              className="bg-slate-100 dark:bg-slate-700 p-1 rounded-lg flex"
              role="group"
              aria-label="Login role selection"
            >
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectedRole === 'customer' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white ring-1 ring-brand-200 dark:ring-brand-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'}`}
                aria-pressed={selectedRole === 'customer'}
              >
                Project Owner
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('employee')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectedRole === 'employee' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white ring-1 ring-brand-200 dark:ring-brand-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'}`}
                aria-pressed={selectedRole === 'employee'}
              >
                Team Member
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {selectedRole === 'customer'
                ? 'View your submitted projects, access 3D models, and manage requests'
                : 'Manage captures, reviews, and coordinate operations'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                disabled={loading}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                disabled={loading}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-brand-600 text-white py-3.5 rounded-lg font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:scale-105 active:scale-100 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In{' '}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Demo User Quick Links — only shown in development */}
          {import.meta.env.DEV && (
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
              Demo Users (Dev Only)
            </p>
            <div className="space-y-2">
              {mockUsers
                .filter((u) => u.role === selectedRole)
                .map((user, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setEmail(user.email);
                      setPassword('demo');
                    }}
                    disabled={loading}
                    className="w-full text-left p-2 text-sm rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-brand-400 dark:hover:border-brand-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                  </button>
                ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              Click any user to auto-fill credentials, then press Sign In
            </p>
          </div>
          )}

          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {selectedRole === 'customer' ? (
              <p>No account? Contact your project manager for an invite.</p>
            ) : (
              <p>Employee access only. Unauthorized access is prohibited.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
