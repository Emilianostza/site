import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PortalRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: PortalRole[];
}

/**
 * ProtectedRoute guards routes from unauthenticated access.
 *
 * Usage:
 * <ProtectedRoute requiredRoles={[PortalRole.Admin, PortalRole.Approver]}>
 *   <AdminPage />
 * </ProtectedRoute>
 *
 * If user is not authenticated, redirects to /app/login.
 * If user lacks required role, redirects to /.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { user, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/app/login" replace />;
  }

  // Role check (if required roles specified)
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
