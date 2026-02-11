import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { ToastContainer } from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import { PortalRole } from './types';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Industry = lazy(() => import('./pages/Industry'));
const Gallery = lazy(() => import('./pages/Gallery'));
const RequestForm = lazy(() => import('./pages/RequestForm'));
const Login = lazy(() => import('./pages/Login'));
const Portal = lazy(() => import('./pages/Portal'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Pricing = lazy(() => import('./pages/Pricing'));
const NotFound = lazy(() => import('./pages/NotFound'));
const RestaurantMenu = lazy(() => import('./pages/templates/RestaurantMenu'));
const ModelEditor = lazy(() => import('./pages/editor/ModelEditor'));
const SceneDashboard = lazy(() => import('./pages/editor/SceneDashboard'));

// Loading component
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-600 dark:text-slate-400">Loading...</p>
    </div>
  </div>
);

import { CodeInspector } from './components/devtools/CodeInspector';

const AppContent: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Router>
        <ScrollToTop />
        <CodeInspector />
        <Layout>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/industries" element={<Navigate to="/" replace />} />
              <Route path="/industries/:type" element={<Industry />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/request" element={<RequestForm />} />
              <Route path="/security" element={<div className="container mx-auto py-20 px-4 text-center"><h1 className="text-3xl font-bold dark:text-white">Trust & Security</h1></div>} />
              <Route path="/privacy" element={<div className="container mx-auto py-20 px-4 text-center"><h1 className="text-3xl font-bold dark:text-white">Privacy Policy</h1></div>} />
              <Route path="/terms" element={<div className="container mx-auto py-20 px-4 text-center"><h1 className="text-3xl font-bold dark:text-white">Terms of Service</h1></div>} />

              {/* Auth Routes (public) */}
              <Route path="/app/login" element={<Login />} />

              {/* Protected Employee Routes */}
              <Route
                path="/app/dashboard"
                element={
                  <ProtectedRoute requiredRoles={[PortalRole.Technician, PortalRole.Approver, PortalRole.SalesLead, PortalRole.Admin]}>
                    <Portal role="employee" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/editor/:assetId"
                element={
                  <ProtectedRoute requiredRoles={[PortalRole.Technician, PortalRole.Approver, PortalRole.Admin]}>
                    <SceneDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/editor/:assetId/3d"
                element={
                  <ProtectedRoute requiredRoles={[PortalRole.Technician, PortalRole.Approver, PortalRole.Admin]}>
                    <ModelEditor />
                  </ProtectedRoute>
                }
              />

              {/* Protected Customer Routes */}
              <Route
                path="/portal/dashboard"
                element={
                  <ProtectedRoute requiredRoles={[PortalRole.CustomerOwner, PortalRole.CustomerViewer]}>
                    <Portal role="customer" />
                  </ProtectedRoute>
                }
              />

              {/* Templates (public) */}
              <Route path="/project/:id/menu" element={<RestaurantMenu />} />

              {/* Editor (public route exists for demo, protected version above) */}
              <Route path="/editor/:assetId" element={<ModelEditor />} />

              {/* 404 Catch all */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Layout>
      </Router>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;