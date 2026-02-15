import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import Button from '@/components/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[80px] sm:text-[120px] md:text-[180px] font-bold text-gradient leading-none">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/">
            <Button variant="primary" size="lg">
              Go Home <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/gallery">
            <Button variant="secondary" size="lg">
              View Gallery
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              to="/industries/restaurants"
              className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
            >
              Restaurants
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              to="/industries/museums"
              className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
            >
              Museums
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              to="/industries/ecommerce"
              className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
            >
              E-commerce
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              to="/request"
              className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
            >
              Request Capture
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
