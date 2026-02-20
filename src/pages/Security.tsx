import React from 'react';
import { ShieldCheck, Server, Lock } from 'lucide-react';
import { SEO } from '@/components/common/SEO';

const Security: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-12">
      <SEO title="Trust & Security" description="How we keep your data safe." />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Trust & Security
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Security is at the core of everything we build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              SOC 2 Compliant
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              We adhere to strict security controls and audit procedures.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              Encryption at Rest
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              All your data is encrypted using AES-256 encryption.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Server className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              Secure Infrastructure
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Hosted on enterprise-grade cloud providers with 24/7 monitoring.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 md:p-12 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Data Protection
          </h2>
          <div className="space-y-6 text-slate-600 dark:text-slate-300">
            <p>
              We take the security of your data seriously. Our platform is built with security in
              mind from the ground up, utilizing industry-standard best practices to ensure your
              information remains safe.
            </p>
            <p>
              We employ continuous security monitoring, regular penetration testing, and automated
              vulnerability scanning to identify and address potential risks before they can affect
              our users.
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Report a Vulnerability
            </h3>
            <p>
              If you believe you have found a security vulnerability in our platform, please contact
              our security team immediately at{' '}
              <a href="mailto:security@managedcapture.com" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
                security@managedcapture.com
              </a>
              . We operate a bug bounty program for responsible disclosure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
