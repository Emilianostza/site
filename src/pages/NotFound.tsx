import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[80px] sm:text-[120px] md:text-[180px] font-bold leading-none bg-gradient-to-br from-brand-400 via-purple-400 to-brand-600 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
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
        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-8">
          <p className="text-sm text-zinc-500 dark:text-slate-400 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              to="/industries/restaurants"
              className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
            >
              Restaurants
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
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
