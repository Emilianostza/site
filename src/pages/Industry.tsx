import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { INDUSTRIES } from '@/constants';
import { Check, Shield, ArrowRight, Eye } from 'lucide-react';
import { SEO } from '@/components/common/SEO';
import Accordion from '@/components/Accordion';

const Industry: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const config = type ? INDUSTRIES[type] : null;

  if (!config) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <SEO
        title={config.title}
        description={config.subtitle}
      />
      {/* Industry Hero */}
      <section className="bg-zinc-900 text-white py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-brand-900/50 text-brand-200 text-sm font-semibold mb-6 border border-brand-700">
              For {config.id.charAt(0).toUpperCase() + config.id.slice(1)}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{config.title}</h1>
            <p className="text-lg text-zinc-300 mb-8">{config.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={`/request?industry=${config.id}`}
                className="px-6 py-3 rounded-lg bg-brand-600 font-bold hover:bg-brand-500 transition-colors text-center"
              >
                Request Capture
              </Link>
              <a
                href="#gallery"
                className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 font-bold hover:bg-white/20 transition-colors text-center"
              >
                See Examples
              </a>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-700">
            <img src={config.heroImage} alt={config.title} className="w-full h-auto object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Why Managed Capture?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {config.outcomes.map((outcome, idx) => (
              <div
                key={idx}
                className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                  <Check className="w-5 h-5" />
                </div>
                <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-lg">{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Gallery */}
      <section
        id="gallery"
        className="py-20 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-widest mb-4">
              Sample Work
            </span>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Models we've delivered
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl mx-auto">
              Browse real assets captured for restaurant clients — rotate, zoom, and explore
              every detail.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {config.samples.map((sample, idx) => (
              <div
                key={idx}
                role="img"
                aria-label={`${sample.name} — ${sample.tag}`}
                className="group relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={sample.thumb}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/40 transition-colors duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Eye className="w-4 h-4 text-zinc-800" />
                  </div>
                </div>
                {/* Caption */}
                <div className="px-3 py-2.5">
                  <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                    {sample.name}
                  </div>
                  <span className="inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
                    {sample.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to={`/request?industry=${config.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
            >
              Get your own assets captured
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Permissions / Features */}
      <section className="py-20 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <img src={config.demoImage} alt="Interactive 3D model demo" className="rounded-xl shadow-lg" loading="lazy" />
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-xl border border-zinc-100 dark:border-zinc-700 max-w-xs">
              <div className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                Interactive Viewer
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Customers can rotate, zoom, and explore every detail.
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
              What your team can do
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">
              We manage the capture, you control the distribution. Our portal gives you
              permissions tailored to your restaurant workflow.
            </p>
            <ul className="space-y-4">
              {config.permissions.map((perm, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-brand-600 mt-1 flex-shrink-0" />
                  <span className="text-zinc-700 dark:text-zinc-300">{perm}</span>
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

      {/* FAQ */}
      <section className="py-16 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion
            items={[
              {
                title: 'How long does capture take?',
                content: (
                  <p>
                    On-site capture typically takes 1–2 hours per 10 dishes. Processing and QA take 3–5
                    business days, with total delivery in 5–8 business days.
                  </p>
                ),
              },
              {
                title: 'Do I need to prepare the dishes?',
                content: (
                  <p>
                    Yes, dishes should be freshly plated and presented as you would serve them.
                    Our team handles all the photography equipment and lighting.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
};

export default Industry;
