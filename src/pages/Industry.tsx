import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { INDUSTRIES } from '@/constants';
import { Check, Shield, ArrowRight } from 'lucide-react';

const Industry: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const config = type ? INDUSTRIES[type] : null;

  if (!config) {
    return <Navigate to="/industries" replace />;
  }

  return (
    <div>
      {/* Industry Hero */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-brand-900/50 text-brand-200 text-sm font-semibold mb-6 border border-brand-700">
              For {config.id.charAt(0).toUpperCase() + config.id.slice(1)}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{config.title}</h1>
            <p className="text-lg text-slate-300 mb-8">{config.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={`/request?industry=${config.id}`}
                className="px-6 py-3 rounded-lg bg-brand-600 font-bold hover:bg-brand-500 transition-colors text-center"
              >
                Request Capture
              </Link>
              <Link
                to={`/gallery?industry=${config.id}`}
                className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 font-bold hover:bg-white/20 transition-colors text-center"
              >
                See Examples
              </Link>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <img src={config.heroImage} alt={config.title} className="w-full h-auto object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Why Managed Capture?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {config.outcomes.map((outcome, idx) => (
              <div key={idx} className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                  <Check className="w-5 h-5" />
                </div>
                <p className="font-semibold text-slate-800 text-lg">{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Permissions / Features */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <img src={config.demoImage} alt="Demo 3D Model" className="rounded-xl shadow-lg" />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-xl border border-slate-100 max-w-xs">
              <div className="text-sm font-bold text-slate-900 mb-1">Interactive Viewer</div>
              <div className="text-xs text-slate-500">
                Customers can rotate, zoom, and explore every detail.
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">What your team can do</h2>
            <p className="text-slate-600 mb-8">
              We manage the capture, you control the distribution. Our portal gives you specific
              permissions tailored to the {config.id} workflow.
            </p>
            <ul className="space-y-4">
              {config.permissions.map((perm, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-brand-600 mt-1 flex-shrink-0" />
                  <span className="text-slate-700">{perm}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Link
                to="/request"
                className="text-brand-600 font-bold hover:text-brand-700 flex items-center gap-2"
              >
                Start a project <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Placeholder */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="group border border-slate-200 rounded-lg open:bg-slate-50">
              <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-slate-900">
                How long does capture take?
              </summary>
              <div className="p-4 pt-0 text-slate-600">
                On-site capture typically takes 1-2 hours per 10 objects. Processing and QA take 3-5
                business days.
              </div>
            </details>
            <details className="group border border-slate-200 rounded-lg open:bg-slate-50">
              <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-slate-900">
                Do I need to prepare the objects?
              </summary>
              <div className="p-4 pt-0 text-slate-600">
                Yes, items should be clean and staged. For reflective items, our team will bring
                specialized scanning sprays if permitted.
              </div>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Industry;
