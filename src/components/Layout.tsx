import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@/constants';
import { Menu, X, Box, ShieldCheck, ArrowRight, ChevronDown } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Force dark mode on public pages without touching localStorage
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Track scroll for header shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Don't show public nav on app routes
  const isAppRoute =
    location.pathname.startsWith('/app') || location.pathname.startsWith('/portal');

  if (isAppRoute) {
    return <>{children}</>;
  }

  const isActive = (path: string) => path !== '/industries' && location.pathname.startsWith(path);

  return (
    <div
      className="flex flex-col min-h-screen"
      {...(import.meta.env.DEV && {
        'data-component': 'Layout',
        'data-file': 'src/components/Layout.tsx',
      })}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl shadow-xs border-b border-zinc-200/60 dark:border-zinc-800/60'
            : 'bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-display font-bold text-lg text-zinc-900 dark:text-white hover:opacity-80 transition-opacity shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-glow/40">
              <Box className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span>
              Managed<span className="text-brand-600 dark:text-brand-400">3D</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_ITEMS.map((item) => (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                  {...(isActive(item.path) ? { 'aria-current': 'page' as const } : {})}
                  {...(item.children ? { 'aria-haspopup': 'true' as const, 'aria-expanded': false } : {})}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" aria-hidden="true" />
                  )}
                </Link>

                {/* Dropdown */}
                {item.children && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 translate-y-1 group-hover:translate-y-0 z-50">
                    <div className="w-44 bg-white dark:bg-zinc-900 rounded-xl shadow-hover border border-zinc-100 dark:border-zinc-800 overflow-hidden py-1" role="menu">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          role="menuitem"
                          className="flex items-center px-4 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              to="/app/login"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/request"
              className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-all shadow-xs hover:shadow-glow hover:-translate-y-px active:translate-y-0"
            >
              Request Capture
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 animate-slide-down">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    }`}
                    {...(isActive(item.path) ? { 'aria-current': 'page' as const } : {})}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-4 mt-1 mb-2 pl-3 border-l-2 border-zinc-100 dark:border-zinc-800 flex flex-col gap-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="px-2 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2" />

              <Link
                to="/app/login"
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/request"
                className="mt-1 px-4 py-3 rounded-full bg-brand-600 text-white text-sm font-semibold text-center hover:bg-brand-700 transition-colors shadow-xs"
              >
                Request Capture
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">{children}</main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800/60">
        <div className="container mx-auto px-4 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
            {/* Brand col */}
            <div className="space-y-4 md:col-span-1">
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 font-display font-bold text-base text-white hover:opacity-80 transition-opacity"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
                  <Box className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
                Managed<span className="text-brand-500">3D</span>
              </Link>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-[220px]">
                Professional 3D capture for restaurants. We photograph your dishes and deliver AR-ready
                3D models.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-500">
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                SOC 2 Type II Compliant
              </div>
              <div className="pt-2 space-y-1.5 text-xs text-zinc-500">
                <a
                  href="mailto:hello@managedcapture.com"
                  className="block hover:text-zinc-300 transition-colors"
                >
                  hello@managedcapture.com
                </a>
              </div>
            </div>

            {/* Industries */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Industries</h4>
              <ul className="space-y-2.5 text-sm">
                {[{ label: 'Restaurants', path: '/industries/restaurants' }].map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="hover:text-zinc-200 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: 'How it Works', path: '/how-it-works' },
                  { label: 'Gallery', path: '/gallery' },
                  { label: 'Pricing', path: '/pricing' },
                  { label: 'Trust Center', path: '/security' },
                ].map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="hover:text-zinc-200 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: 'Privacy Policy', path: '/privacy' },
                  { label: 'Terms of Service', path: '/terms' },
                ].map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="hover:text-zinc-200 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-zinc-600">© 2026 Managed Capture 3D. All rights reserved.</p>
            <p className="text-xs text-zinc-700">
              Bringing the physical world into the digital age.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
