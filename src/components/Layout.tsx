import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@/constants';
import { Menu, X, Box, ShieldCheck } from 'lucide-react';
import DarkModeToggle from '@/DarkModeToggle';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Don't show public nav on app routes
  const isAppRoute = location.pathname.startsWith('/app') || location.pathname.startsWith('/portal');

  if (isAppRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen" {...(import.meta.env.DEV && { 'data-component': 'Layout', 'data-file': 'src/components/Layout.tsx' })}>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-slate-900 dark:text-white">
            <Box className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            <span>Managed Capture</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {NAV_ITEMS.map((item) => (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`text-sm font-medium transition-colors py-2 block ${location.pathname.startsWith(item.path) && item.path !== '/industries' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400'}`}
                  {...(location.pathname.startsWith(item.path) && item.path !== '/industries' ? { 'aria-current': 'page' as const } : {})}
                >
                  {item.label}
                </Link>

                {/* Dropdown Menu */}
                {item.children && (
                  <div className="absolute top-full left-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link to="/app/login" className="text-sm font-medium text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400">
              Log in
            </Link>
            <DarkModeToggle />
            <Link
              to="/request"
              className="px-4 py-2 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Request Capture
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <DarkModeToggle />
            <button
              className="p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex flex-col p-4 space-y-4">
              {NAV_ITEMS.map((item) => (
                <div key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-base font-medium block ${location.pathname.startsWith(item.path) && item.path !== '/industries' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300'}`}
                    {...(location.pathname.startsWith(item.path) && item.path !== '/industries' ? { 'aria-current': 'page' as const } : {})}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 ml-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 block"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="h-px bg-slate-100 dark:bg-slate-700 my-2" />
              <Link to="/app/login" className="text-base font-medium text-slate-900 dark:text-white">
                Log in
              </Link>
              <Link
                to="/request"
                className="text-base font-medium text-brand-600 dark:text-brand-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Request Capture
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 font-bold text-xl text-white">
                <Box className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                <span>Managed Capture</span>
              </div>
              <p className="text-sm text-slate-400">
                Professional 3D capture services for enterprise. We digitize the physical world.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Industries</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/industries/restaurants" className="hover:text-white transition-colors">Restaurants</Link></li>
                <li><Link to="/industries/museums" className="hover:text-white transition-colors">Museums</Link></li>
                <li><Link to="/industries/ecommerce" className="hover:text-white transition-colors">E-commerce</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-white transition-colors">Trust Center</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><div className="flex items-center gap-2 mt-4"><ShieldCheck className="w-4 h-4" /> SOC 2 Compliant</div></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 dark:border-slate-700 mt-12 pt-8 text-center text-sm text-slate-500">
            © 2026 Managed Capture 3D Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;