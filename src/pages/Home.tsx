import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '@/constants';
import Accordion from '@/components/Accordion';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const Home: React.FC = () => {
  const howItWorksRef = useScrollReveal<HTMLDivElement>();
  const howItWorksGridRef = useScrollReveal<HTMLDivElement>();
  const faqRef = useScrollReveal<HTMLDivElement>();
  const trustRef = useScrollReveal<HTMLDivElement>();

  return (
    <div
      {...(import.meta.env.DEV && {
        'data-component': 'Home Page',
        'data-file': 'src/pages/Home.tsx',
      })}
    >
      {/* Hero */}
      <section className="relative bg-zinc-950 text-white overflow-hidden min-h-[92vh] flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid opacity-[0.35] pointer-events-none" />
        {/* Ambient glow orbs */}
        <div className="absolute -top-40 -left-32 w-[500px] h-[500px] bg-brand-700/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 -right-24 w-[400px] h-[400px] bg-purple-700/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-[300px] h-[300px] bg-cyan-700/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative container mx-auto px-4 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* ── Left: Copy ─────────────────────── */}
          <div className="flex flex-col gap-7 z-10">
            {/* Announcement badge */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-semibold text-zinc-300 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
              </span>
              Now serving EU — Estonia · Greece · France
            </div>

            {/* Headline */}
            <div className="animate-slide-up">
              <h1 className="font-display text-5xl md:text-[4.5rem] font-bold tracking-tight leading-[1.08] text-white">
                Expert 3D capture,
                <br />
                <span className="text-gradient">delivered to you.</span>
              </h1>
            </div>

            {/* Subheading */}
            <p
              className="text-lg md:text-xl text-zinc-400 max-w-md leading-relaxed animate-fade-in-up"
              style={{ animationDelay: '150ms' }}
            >
              We come to your location, capture your objects, and deliver production-ready 3D &amp;
              AR assets in under a week. No equipment. No expertise needed.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 animate-fade-in-up"
              style={{ animationDelay: '250ms' }}
            >
              <Link
                to="/request"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-base transition-all duration-200 hover:-translate-y-px hover:shadow-glow shadow-xs"
              >
                Start a Request
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/industries/restaurants"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-base transition-all duration-200 backdrop-blur-sm"
              >
                See Examples
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-200" />
              </Link>
            </div>

            {/* Stats strip */}
            <div
              className="flex flex-wrap gap-6 pt-2 animate-fade-in-up"
              style={{ animationDelay: '350ms' }}
            >
              {[
                { value: '500+', label: 'Photographers' },
                { value: '10k+', label: 'Projects delivered' },
                { value: '3', label: 'EU countries' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="font-display text-2xl font-bold text-white">{s.value}</span>
                  <span className="text-xs text-zinc-500 mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: 3D Viewer ───────────────── */}
          <div
            className="relative h-[520px] w-full flex items-center justify-center animate-blur-in"
            style={{ animationDelay: '200ms' }}
          >
            {/* Viewer frame */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/8 shadow-modal bg-zinc-900/40 backdrop-blur-sm">
              <model-viewer
                src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                ios-src="https://modelviewer.dev/shared-assets/models/Astronaut.usdz"
                poster="https://modelviewer.dev/shared-assets/models/Astronaut.png"
                alt="Interactive 3D model — rotate to explore"
                shadow-intensity="1"
                camera-controls
                auto-rotate
                ar
                style={{ width: '100%', height: '100%' } as React.CSSProperties}
              />

              {/* Viewer UI chrome */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/70" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs text-zinc-400 whitespace-nowrap">
                Drag to rotate · Pinch to zoom · Tap AR to view in your space
              </div>
            </div>

            {/* Floating glow behind the viewer */}
            <div className="absolute inset-0 -z-10 rounded-3xl bg-brand-600/10 blur-[60px]" />
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent pointer-events-none" />
      </section>

      {/* How it Works */}
      <section className="relative py-28 bg-zinc-950 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        {/* Gradient glow top-center */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-600/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div ref={howItWorksRef} className="reveal text-center mb-20">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-brand-400 mb-4 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
              The Process
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
              From request to <span className="text-gradient">live 3D asset</span>
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              We manage every step — no learning curve, no equipment, no risk. You get
              production-ready 3D in days.
            </p>
          </div>

          {/* Steps grid */}
          <div
            ref={howItWorksGridRef}
            className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative"
          >
            {/* Connecting line — desktop only */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-brand-700/50 to-transparent pointer-events-none" />

            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <div key={idx} className="relative group flex flex-col items-center text-center">
                {/* Icon bubble */}
                <div className="relative mb-6 z-10">
                  <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-700/60 group-hover:border-brand-600/60 flex items-center justify-center text-brand-400 group-hover:text-brand-300 group-hover:bg-brand-950/60 transition-all duration-300 shadow-lg group-hover:shadow-glow">
                    <span className="[&>svg]:w-7 [&>svg]:h-7">{step.icon}</span>
                  </div>
                  {/* Step number chip */}
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {idx + 1}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-[180px]">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 flex flex-col items-center gap-3">
            <p className="text-zinc-500 text-sm">
              Typical turnaround:{' '}
              <span className="text-zinc-300 font-medium">5–8 business days</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-1">
              <Link
                to="/request"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-base transition-all duration-200 hover:-translate-y-px hover:shadow-glow"
              >
                Request a Capture
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/how-it-works"
                className="text-sm text-zinc-500 hover:text-zinc-300 underline underline-offset-4 transition-colors"
              >
                See full process breakdown
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <div ref={faqRef} className="reveal text-center mb-12">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-4 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
              FAQ
            </p>
            <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white">
              Common questions
            </h2>
          </div>
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
                    Yes, we provide a simple embed code (iframe) or a React component that you can
                    drop into any website. It works with Shopify, WordPress, Squarespace, and custom
                    stacks.
                  </p>
                ),
              },
            ]}
          />
          <div className="mt-10 text-center">
            <Link
              to="/pricing"
              className="text-sm text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 underline underline-offset-4 transition-colors"
            >
              See more FAQs on our Pricing page →
            </Link>
          </div>
        </div>
      </section>

      {/* Roadmap teaser */}
      <section className="py-16 bg-zinc-950 relative overflow-hidden border-t border-zinc-800">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[160px] bg-brand-700/15 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative container mx-auto px-4 max-w-3xl text-center">
          <p className="inline-block text-xs font-bold uppercase tracking-widest text-brand-400 mb-4 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
            Roadmap
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
            Four phases. Dozens of features.
            <br className="hidden sm:block" /> All built for restaurants.
          </h2>
          <p className="text-zinc-400 text-sm mb-8 max-w-lg mx-auto">
            From AI quality control to POS integrations, mobile apps, and EU expansion — see
            everything we&apos;re building next.
          </p>
          <Link
            to="/roadmap"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-all shadow-xs hover:shadow-glow hover:-translate-y-px active:translate-y-0"
          >
            View full roadmap
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
        <div className="container mx-auto px-4 max-w-2xl">
          <div ref={trustRef} className="reveal">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-10">
              What our clients say
            </p>
            <div className="flex flex-col p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 border-t-2 border-t-orange-500/30 dark:border-t-orange-500/20 hover:shadow-hover transition-shadow duration-300">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic flex-1">
                &ldquo;The 3D models they delivered boosted our online menu conversion by over a
                third. Guests interact with the food before they order — it makes a real
                difference.&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Marie-Claire D.
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">Head of Digital</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
                  Restaurant Group · Paris, FR
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
