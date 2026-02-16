import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';
import { SEO } from '@/components/common/SEO';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-12">
      <SEO title="Privacy Policy" description="Our commitment to protecting your privacy." />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            We are committed to protecting your personal information and your right to privacy.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 md:p-12 space-y-8 border border-slate-200 dark:border-slate-700">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                1. Information We Collect
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              We collect personal information that you voluntarily provide to us when you register
              on the Services, express an interest in obtaining information about us or our products
              and services, when you participate in activities on the Services, or otherwise when
              you contact us.
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 ml-4">
              <li>Names and Contact Data (email addresses, phone numbers)</li>
              <li>Credentials (passwords, hints, and similar security information)</li>
              <li>Payment Data (stored securely by our payment processor)</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                2. How We Use Your Information
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We use personal information collected via our Services for a variety of business
              purposes described below. We process your personal information for these purposes in
              reliance on our legitimate business interests, in order to enter into or perform a
              contract with you, with your consent, and/or for compliance with our legal
              obligations.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                3. How We Share Your Information
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We only share information with your consent, to comply with laws, to provide you with
              services, to protect your rights, or to fulfill business obligations. We may process
              or share your data that we hold based on the following legal basis: Consent,
              Legitimate Interests, Performance of a Contract, or Legal Obligations.
            </p>
          </section>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Last updated: February 15, 2026. If you have questions or comments about this policy,
              you may email us at privacy@managedcapture.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
