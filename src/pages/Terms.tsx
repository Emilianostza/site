import React from 'react';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { SEO } from '@/components/common/SEO';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-12">
      <SEO title="Terms of Service" description="Our terms and conditions." />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Please read these terms carefully before using our services.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 md:p-12 space-y-8 border border-slate-200 dark:border-slate-700">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                1. Agreement to Terms
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              These Terms of Service constitute a legally binding agreement made between you,
              whether personally or on behalf of an entity ("you") and Managed Capture 3D ("we,"
              "us" or "our"), concerning your access to and use of the managedcapture.com website as
              well as any other media form, media channel, mobile website or mobile application
              related, linked, or otherwise connected thereto (collectively, the "Site").
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                2. Intellectual Property Rights
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Unless otherwise indicated, the Site is our proprietary property and all source code,
              databases, functionality, software, website designs, audio, video, text, photographs,
              and graphics on the Site (collectively, the "Content") and the trademarks, service
              marks, and logos contained therein (the "Marks") are owned or controlled by us or
              licensed to us, and are protected by copyright and trademark laws.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                3. User Representations
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              By using the Site, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 ml-4">
              <li>
                All registration information you submit will be true, accurate, current, and
                complete.
              </li>
              <li>
                You will maintain the accuracy of such information and promptly update such
                registration information as necessary.
              </li>
              <li>
                You have the legal capacity and you agree to comply with these Terms of Service.
              </li>
              <li>You are not a minor in the jurisdiction in which you reside.</li>
            </ul>
          </section>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Last updated: February 15, 2026. Questions about these terms? Email{' '}
              <a href="mailto:legal@managedcapture.com" className="text-brand-600 dark:text-brand-400 underline underline-offset-2 hover:text-brand-700">legal@managedcapture.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
