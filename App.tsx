import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import ScrollToTop from './components/ScrollToTop';

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

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <CodeInspector />
          <Layout>
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

                {/* App / Auth Routes */}
                <Route path="/app/login" element={<Login />} />

                {/* Simulated Protected Routes */}
                <Route path="/app/dashboard" element={<Portal role="employee" />} />
                <Route path="/portal/dashboard" element={<Portal role="customer" />} />

                {/* Templates */}
                <Route path="/project/:id/menu" element={<RestaurantMenu />} />

                {/* Editor */}
                <Route path="/editor/:assetId" element={<ModelEditor />} />
                <Route path="/app/editor/:assetId" element={<ModelEditor />} />

                {/* 404 Catch all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;