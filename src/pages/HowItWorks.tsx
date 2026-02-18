import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  CalendarClock,
  ScanFace,
  Cpu,
  Eye,
  Rocket,
} from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '@/constants';

/* ─── Timeline data ─────────────────────────────────────── */
const TIMELINE = [
  {
    day: 'Day 1',
    label: 'Submit Request',
    description:
      'Fill out our intake form with object details, logistics preferences, and delivery goals. A dedicated project coordinator confirms within 2 hours.',
    icon: ClipboardList,
    color: 'brand',
  },
  {
    day: 'Days 2–3',
    label: 'Scheduling & Prep',
    description:
      'We coordinate on-site access (or shipping logistics), prepare our specialist equipment, and assign the right capture crew for your vertical.',
    icon: CalendarClock,
    color: 'cyan',
  },
  {
    day: 'Day 4',
    label: 'On-Site Capture',
    description:
      'Our expert team arrives, sets up a calibrated studio environment, and captures your objects using photogrammetry and/or structured-light scanning.',
    icon: ScanFace,
    color: 'purple',
  },
  {
    day: 'Days 5–6',
    label: 'Processing & QA',
    description:
      'Raw scan data is processed into optimized GLB/USDZ files. Our QA approvers review geometry, textures, and AR compatibility before sign-off.',
    icon: Cpu,
    color: 'orange',
  },
  {
    day: 'Day 7',
    label: 'Your Review',
    description:
      'Assets land in your portal. Inspect them in the 3D viewer, leave feedback, or approve directly. One revision round is included.',
    icon: Eye,
    color: 'green',
  },
  {
    day: 'Day 8',
    label: 'Published & Live',
    description:
      'Approved assets publish instantly. Grab embeddable links, QR codes, or download GLB/USDZ bundles — ready for your website, app, or campaign.',
    icon: Rocket,
    color: 'brand',
  },
];

const colorMap: Record<string, { icon: string; ring: string; label: string }> = {
  brand: {
    icon: 'text-brand-400',
    ring: 'group-hover:ring-brand-500/10',
    label: 'bg-brand-500/10 text-brand-300 border-brand-500/20',
  },
  cyan: {
    icon: 'text-cyan-400',
    ring: 'group-hover:ring-cyan-500/10',
    label: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  },
  purple: {
    icon: 'text-purple-400',
    ring: 'group-hover:ring-purple-500/10',
    label: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  },
  orange: {
    icon: 'text-orange-400',
    ring: 'group-hover:ring-orange-500/10',
    label: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  },
  green: {
    icon: 'text-emerald-400',
    ring: 'group-hover:ring-emerald-500/10',
    label: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
};

/* ─── Component ─────────────────────────────────────────── */
const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-zinc-950 overflow-hidden pt-24 pb-28">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-brand-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative container mx-auto px-4 max-w-3xl text-center">
          <p className="inline-block text-xs font-bold uppercase tracking-widest text-brand-400 mb-5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
            Our Process
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            How our managed
            <br />
            <span className="text-gradient">3D capture works</span>
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl mx-auto">
            From your first request to live, embeddable 3D assets — we handle every step. No
            equipment, no expertise, no risk on your end.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/request"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all hover:-translate-y-px hover:shadow-glow"
            >
              Start a Request
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
            >
              View Sample Assets
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4-step overview ──────────────────────────────── */}
      <section className="relative py-20 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-hover transition-all duration-300"
              >
                {/* Large ghost step number */}
                <span className="text-4xl font-display font-bold text-zinc-100 dark:text-zinc-800 select-none absolute top-4 right-5 group-hover:text-brand-100 dark:group-hover:text-brand-950 transition-colors leading-none">
                  0{idx + 1}
                </span>

                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/40 transition-colors relative z-10">
                  <span className="[&>svg]:w-5 [&>svg]:h-5">{step.icon}</span>
                </div>

                <h3 className="font-semibold text-zinc-900 dark:text-white mb-2 relative z-10">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed relative z-10">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Detailed Timeline ─────────────────────────────── */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Day-by-day timeline
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              A typical project ships in 8 business days. Complex or high-volume batches are
              scheduled with a custom timeline.
            </p>
          </div>

          <div className="relative">
            {/* Vertical spine */}
            <div className="absolute left-[21px] top-3 bottom-3 w-px bg-gradient-to-b from-brand-500/60 via-brand-400/20 to-transparent pointer-events-none" />

            <div className="space-y-0">
              {TIMELINE.map((item, idx) => {
                const c = colorMap[item.color];
                const Icon = item.icon;
                const isLast = idx === TIMELINE.length - 1;

                return (
                  <div key={idx} className="relative flex gap-6 group">
                    {/* Icon dot */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`relative z-10 w-11 h-11 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 group-hover:border-brand-400 flex items-center justify-center ring-4 ring-transparent ${c.ring} transition-all duration-300 shadow-card`}
                      >
                        <Icon className={`w-5 h-5 ${c.icon} transition-colors`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-10'}`}>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${c.label}`}
                        >
                          {item.day}
                        </span>
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                          {item.label}
                        </h3>
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {item.description}
                      </p>

                      {isLast && (
                        <div className="mt-4 inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm font-medium">Assets live and embeddable</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── What's included ───────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white text-center mb-12">
            Every project includes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Dedicated project coordinator',
              'Professional on-site capture crew',
              'Photogrammetry & structured-light scanning',
              'Optimised GLB & USDZ export formats',
              'Web-ready 3D viewer — no app needed',
              'AR support for iOS & Android',
              'One revision round included',
              'Embeddable links & QR code generation',
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
              >
                <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="relative py-24 bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute inset-0 gradient-mesh opacity-60 pointer-events-none" />

        <div className="relative container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-zinc-400 text-lg mb-10">
            Submit a capture request — we&apos;ll confirm within 2 hours. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/request"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-base transition-all hover:-translate-y-px hover:shadow-glow"
            >
              Request a Capture
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
