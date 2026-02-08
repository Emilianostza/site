import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'customer' | 'employee'>('customer');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    if (role === 'employee') {
      navigate('/app/dashboard');
    } else {
      navigate('/portal/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-slate-200">
        <div className="flex justify-center mb-8">
          <Link to="/" className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white hover:bg-brand-700 transition-colors">
            <Box className="w-8 h-8" />
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-center text-slate-500 mb-8">Sign in to the Managed Capture Platform</p>

        {/* Role Toggle */}
        <div className="bg-slate-100 p-1 rounded-lg flex mb-6">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'customer' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('employee')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'employee' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Employee
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {role === 'customer' ? (
            <p>No account? Contact your project manager for an invite.</p>
          ) : (
            <p>Employee access only. Unauthorized access is prohibited.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;