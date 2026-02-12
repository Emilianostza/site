import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Box, Utensils, Landmark, ShoppingBag } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '@/constants';
import Accordion from '@/components/Accordion';

const Home: React.FC = () => {
  return (
    <div
      {...(import.meta.env.DEV && {
        'data-component': 'Home Page',
        'data-file': 'src/pages/Home.tsx',
      })}
    >
      {/* Hero */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/hero_bg/1600/900')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>

        <div className="relative container mx-auto px-4 py-24 md:py-40 max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Expert 3D capture, delivered to your door
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
            Our team captures your objects on-site. We deliver production-ready 3D models, AR
            assets, and web viewers in 24–48 hours.
          </p>
          <p className="text-sm md:text-base text-slate-400 mb-12 max-w-2xl mx-auto">
            Perfect for e-commerce, museums, restaurants, and brands that need photorealistic 3D
            without the expertise.
          </p>

          {/* Primary CTA only */}
          <div className="flex flex-col items-center gap-6">
            <Link
              to="/request"
              className="px-8 py-4 rounded-full bg-brand-600 font-bold text-lg hover:bg-brand-500 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Start Your Capture Request <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Secondary CTA below */}
            <Link
              to="/gallery"
              className="text-slate-300 font-semibold hover:text-white transition-colors text-sm flex items-center gap-1"
            >
              View examples →
            </Link>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Built for your industry
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We specialize in verticals that benefit most from 3D—and we understand your specific
              needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/industries/restaurants"
              className="group flex flex-col p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-xl transition-all hover:bg-orange-50/30"
            >
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform flex-shrink-0">
                <Utensils className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Restaurants & QSR</h3>
              <p className="text-slate-600 mb-4 flex-grow">
                Turn dishes into interactive menus. Boost delivery platform listings with 3D photos
                of signature items.
              </p>
              <span className="text-brand-600 font-semibold text-sm flex items-center gap-1 inline-flex">
                Explore use case <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link
              to="/industries/museums"
              className="group flex flex-col p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-xl transition-all hover:bg-purple-50/30"
            >
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform flex-shrink-0">
                <Landmark className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Museums & Culture</h3>
              <p className="text-slate-600 mb-4 flex-grow">
                Preserve heritage and engage remote visitors with archival-quality digitization and
                access-controlled exhibitions.
              </p>
              <span className="text-brand-600 font-semibold text-sm flex items-center gap-1 inline-flex">
                Explore use case <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link
              to="/industries/ecommerce"
              className="group flex flex-col p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-xl transition-all hover:bg-blue-50/30"
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform flex-shrink-0">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">E-commerce & Retail</h3>
              <p className="text-slate-600 mb-4 flex-grow">
                Reduce returns. Increase confidence. Let customers rotate, zoom, and interact with
                your products before buying.
              </p>
              <span className="text-brand-600 font-semibold text-sm flex items-center gap-1 inline-flex">
                Explore use case <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How our managed service works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From your first request to deliverable 3D models—we manage every step. No learning
              curve, no equipment, no risk.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <div key={idx} className="relative">
                {/* Step number badge */}
                <div className="absolute -top-6 -left-3 w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {idx + 1}
                </div>

                <div className="flex flex-col items-center text-center pt-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-brand-600 mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
                {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-px bg-slate-300 -z-10"></div>
                )}
              </div>
            ))}
          </div>

          {/* CTA after process */}
          <div className="mt-16 text-center">
            <p className="text-slate-600 mb-6">Ready to get started? No credit card required.</p>
            <Link
              to="/request"
              className="inline-flex px-8 py-3 rounded-full bg-brand-600 text-white font-semibold hover:bg-brand-500 transition-all shadow-lg hover:shadow-xl items-center gap-2"
            >
              Request a Capture Today <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Common Questions
          </h2>
          <Accordion
            items={[
              {
                title: 'How does the capture process work?',
                content: (
                  <p>
                    We handle everything from logistics to processing. You simply request a capture,
                    our team comes to your location (or you ship items to us), we scan your objects,
                    and deliver web-ready 3D models within days.
                  </p>
                ),
              },
              {
                title: 'What is the quality of the 3D models?',
                content: (
                  <p>
                    We provide high-fidelity, photorealistic 3D models optimized for web and AR. Our
                    pipelines use advanced photogrammetry and laser scanning to ensure
                    sub-millimeter accuracy and realistic textures.
                  </p>
                ),
              },
              {
                title: 'Do I need an app to view the models?',
                content: (
                  <p>
                    No app required! Our 3D viewer runs directly in any modern web browser. For AR
                    experiences on mobile, it uses native iOS (QuickLook) and Android (Scene Viewer)
                    capabilities.
                  </p>
                ),
              },
              {
                title: 'Can I integrate this into my existing website?',
                content: (
                  <p>
                    Yes, we provide a simple generic embed code (iframe) or a React component that
                    you can drop into any website. It works with Shopify, WordPress, Squarespace,
                    and custom stacks.
                  </p>
                ),
              },
            ]}
          />
          <div className="mt-10 text-center">
            <Link
              to="/pricing"
              className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
            >
              See more FAQs on our Pricing page
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Social Proof - Moved higher for visibility */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
            Trusted by 50+ companies globally
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-5xl">
            {/* Mock Logos */}
            <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-xl md:text-2xl font-bold font-serif">
                Louvre<span className="text-brand-600">Digital</span>
              </div>
            </div>
            <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-xl md:text-2xl font-bold font-sans tracking-tighter">
                NIKE<span className="italic font-light">LAB</span>
              </div>
            </div>
            <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-xl md:text-2xl font-bold font-mono">
                UBER<span className="text-green-600">EATS</span>
              </div>
            </div>
            <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
              <div className="text-xl md:text-2xl font-bold">
                Shopify<span className="font-light">Plus</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
