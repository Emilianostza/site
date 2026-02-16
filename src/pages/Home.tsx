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
      <section className="relative bg-slate-900 text-white overflow-hidden pt-10 min-h-[90vh] flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

        <div className="relative container mx-auto px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-left z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm text-sm font-semibold text-brand-300 mb-8 animate-fade-in-up">
              🚀 Now serving all major cities
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white animate-slide-up leading-tight">
              Expert 3D capture,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
                delivered to your door
              </span>
            </h1>
            <p
              className="text-xl md:text-2xl text-slate-300 mb-8 max-w-lg leading-relaxed animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              We capture your objects on-site and deliver production-ready 3D assets in 24 hrs.
              Perfect for e-commerce & styling.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <Link
                to="/request"
                className="group px-8 py-4 rounded-full bg-brand-600 text-white font-bold text-lg hover:bg-brand-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] hover:-translate-y-1 hover:scale-105"
              >
                Start Request{' '}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/gallery"
                className="group px-8 py-4 rounded-full bg-white/10 text-white font-bold text-lg border border-white/20 hover:bg-white/20 hover:border-white/40 backdrop-blur-md transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                View Gallery{' '}
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
              </Link>
            </div>
          </div>

          {/* 3D Model Animation */}
          <div
            className="relative h-[500px] w-full flex items-center justify-center animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            {/* 3D Model Viewer */}
            <model-viewer
              src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
              ios-src="https://modelviewer.dev/shared-assets/models/Astronaut.usdz"
              poster="https://modelviewer.dev/shared-assets/models/Astronaut.png"
              alt="A 3D model of an astronaut"
              shadow-intensity="1"
              camera-controls
              auto-rotate
              ar
              style={{ width: '100%', height: '100%', minHeight: '500px' } as any}
            ></model-viewer>

            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/20 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Built for your industry
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Specialized workflows for every vertical.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Utensils,
                bgColor: 'bg-orange-50 dark:bg-orange-900/20',
                iconColor: 'text-orange-600 dark:text-orange-400',
                borderColor: 'hover:border-orange-200 dark:hover:border-orange-800',
                title: 'Restaurants',
                desc: 'Interactive menus that boost conversion.',
                link: '/industries/restaurants',
              },
              {
                icon: Landmark,
                bgColor: 'bg-purple-50 dark:bg-purple-900/20',
                iconColor: 'text-purple-600 dark:text-purple-400',
                borderColor: 'hover:border-purple-200 dark:hover:border-purple-800',
                title: 'Museums',
                desc: 'Archival-quality digitization for everyone.',
                link: '/industries/museums',
              },
              {
                icon: ShoppingBag,
                bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                iconColor: 'text-blue-600 dark:text-blue-400',
                borderColor: 'hover:border-blue-200 dark:hover:border-blue-800',
                title: 'E-commerce',
                desc: 'Reduce returns with true-to-life 3D/AR.',
                link: '/industries/ecommerce',
              },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className={`group p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 ${item.borderColor} shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105`}
              >
                <div
                  className={`w-14 h-14 rounded-xl ${item.bgColor} flex items-center justify-center ${item.iconColor} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
                  {item.desc}
                </p>
                <div className="flex items-center text-slate-900 dark:text-white font-bold text-sm group-hover:gap-2 transition-all group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  Learn more{' '}
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
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
              <div key={idx} className="relative group">
                {/* Step number badge */}
                <div className="absolute -top-6 -left-3 w-12 h-12 rounded-full bg-brand-600 dark:bg-brand-500 text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                  {idx + 1}
                </div>

                <div className="flex flex-col items-center text-center pt-4 h-full p-6 rounded-2xl border border-transparent hover:border-brand-200 dark:hover:border-brand-800 hover:bg-white dark:hover:bg-slate-800/50 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-slate-300 via-brand-300 to-slate-300 dark:from-slate-700 dark:via-brand-700 dark:to-slate-700 -z-10"></div>
                )}
              </div>
            ))}
          </div>

          {/* CTA after process */}
          <div className="mt-16 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
              Ready to get started? No credit card required.
            </p>
            <Link
              to="/request"
              className="group inline-flex px-8 py-4 rounded-full bg-brand-600 text-white font-bold text-lg hover:bg-brand-500 transition-all shadow-lg hover:shadow-2xl items-center gap-2 hover:scale-105 hover:-translate-y-1"
            >
              Request a Capture Today{' '}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
              Trusted by Industry Leaders
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Join 50+ companies worldwide
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-20 w-full max-w-6xl">
            {/* Mock Logos with enhanced hover states */}
            <div className="group flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-300 hover:scale-110">
              <div className="text-xl md:text-2xl font-bold font-serif text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                Louvre<span className="text-brand-600 dark:text-brand-400">Digital</span>
              </div>
            </div>
            <div className="group flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-300 hover:scale-110">
              <div className="text-xl md:text-2xl font-bold font-sans tracking-tighter text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                NIKE<span className="italic font-light">LAB</span>
              </div>
            </div>
            <div className="group flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-300 hover:scale-110">
              <div className="text-xl md:text-2xl font-bold font-mono text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                UBER<span className="text-green-600 dark:text-green-400">EATS</span>
              </div>
            </div>
            <div className="group flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-300 hover:scale-110">
              <div className="text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
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
