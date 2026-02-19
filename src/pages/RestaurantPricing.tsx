import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  ArrowRight,
  ChevronRight,
  Zap,
  Shield,
  BarChart2,
  CreditCard,
  Users,
  Globe,
  Box,
  MapPin,
  Plus,
} from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Accordion from '@/components/Accordion';

// ─── Plans ────────────────────────────────────────────────────────────────────

interface RestaurantPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  quality: string;
  qualityLevel: 'A' | 'B' | 'C';
  storage: string;
  includedViews: number;
  features: string[];
  highlighted?: boolean;
}

const PLANS: RestaurantPlan[] = [
  {
    id: 'standard',
    name: 'Standard',
    tagline: 'Perfect for small menus',
    monthlyPrice: 18,
    annualPrice: 180,
    quality: 'Level A — Minimum',
    qualityLevel: 'A',
    storage: '2 GB',
    includedViews: 1000,
    features: [
      'Unlimited 3D items (within storage)',
      'QR code for every item',
      'Printable QR sheets (PDF)',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Best for most restaurants',
    monthlyPrice: 35,
    annualPrice: 350,
    quality: 'Level B — Medium',
    qualityLevel: 'B',
    storage: '8 GB',
    includedViews: 2000,
    highlighted: true,
    features: [
      'Everything in Standard',
      'Higher-detail 3D models',
      'QR code for every item',
      'Printable QR sheets (PDF)',
      'Basic analytics',
      'Priority email support',
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    tagline: 'Signature dining experience',
    monthlyPrice: 48,
    annualPrice: 480,
    quality: 'Level C — Best / Premium',
    qualityLevel: 'C',
    storage: '25 GB',
    includedViews: 5000,
    features: [
      'Everything in Pro',
      'Highest-detail premium 3D models',
      'QR code for every item',
      'Printable QR sheets (PDF)',
      'Basic analytics',
      'Priority email support',
    ],
  },
];

// ─── Overage tiers ────────────────────────────────────────────────────────────

const OVERAGE_TIERS = [
  { band: 'Next 10,000 views', standard: '€3 / 1,000', pro: '€4 / 1,000', ultra: '€5 / 1,000' },
  {
    band: 'Next 50,000 views',
    standard: '€1.50 / 1,000',
    pro: '€2.00 / 1,000',
    ultra: '€2.50 / 1,000',
  },
  {
    band: 'Above 60,000 overage views',
    standard: '€1.50 / 1,000',
    pro: '€2.00 / 1,000',
    ultra: '€2.50 / 1,000',
  },
];

// ─── Add-ons ──────────────────────────────────────────────────────────────────

const ADDONS = [
  { name: 'Ingredients', detail: 'Per-item fields + display', setup: 30, monthly: 2 },
  { name: 'Calories & nutrition', detail: 'Per-item fields + display', setup: 30, monthly: 2 },
  {
    name: 'Allergens & dietary tags',
    detail: 'Icons, filters, compliance fields',
    setup: 40,
    monthly: 2,
  },
  { name: 'Spice level / portion size', detail: 'Icons', setup: 20, monthly: 2 },
  { name: 'Categories & promotions', detail: 'Featured items, highlights', setup: 30, monthly: 5 },
  {
    name: 'Menu scheduling',
    detail: 'Breakfast / lunch / dinner availability',
    setup: 30,
    monthly: 5,
  },
  { name: '3D animations', detail: 'Auto-rotate + simple animation loop', setup: 50, monthly: 5 },
  { name: 'AR "view on table"', detail: 'Place item in space', setup: 50, monthly: 5 },
  { name: 'Reservation / ordering links', detail: 'Buttons + tracking', setup: 20, monthly: 2 },
  { name: 'Customer feedback link', detail: 'QR + tracking', setup: 20, monthly: 2 },
  { name: 'Analytics export', detail: 'CSV + scheduled report', setup: 50, monthly: 10 },
  {
    name: 'Multi-language menu',
    detail: 'Language switcher (per language)',
    setup: 40,
    monthly: 2,
  },
  { name: 'Custom branding / theme', detail: 'Logo, colors, styling', setup: 60, monthly: 5 },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    question: 'What counts as a view?',
    answer:
      '1 view = one session load of a 3D item. We count once per device, per item, per 30 minutes — so refreshing within 30 minutes counts as 1 view. Opening a different item counts as a new view. Bots, crawlers, and your internal QA traffic are excluded.',
  },
  {
    question: 'Do you stop service if I exceed my included views?',
    answer:
      'Never. Overage views are billed monthly using a tiered ladder starting at the first view beyond your included allowance. Your menu stays live.',
  },
  {
    question: 'How does on-site 3D capture work?',
    answer:
      'We send our team to your restaurant. Each visit has a flat €100 fee covering travel and setup, then €20 per 3D model captured. The model quality (A, B, or C) is determined by your plan. Models are published to your menu within 48 hours.',
  },
  {
    question: 'What is the difference between quality levels A, B, and C?',
    answer:
      'Level A (Standard) produces clean, web-ready models suitable for most dishes. Level B (Pro) adds extra detail passes for a sharper, more realistic result. Level C (Ultra) uses our full production pipeline — maximum texture resolution, multi-angle refinement, and premium retouching — ideal for signature dishes.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer:
      'Yes. Plan changes are prorated and take effect at the start of your next billing cycle. Models already captured are not affected by a plan change.',
  },
  {
    question: 'How does storage work?',
    answer:
      "Storage counts the 3D models and textures for your menu. If you exceed your plan's included storage, you can add a €10/month block for an additional +10 GB at any time.",
  },
  {
    question: 'Can I add features like allergens or AR after I start?',
    answer:
      'Yes. All add-ons can be purchased at any time. There is a one-time setup fee to enable the feature on your menu, plus a small ongoing monthly fee to keep it active.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const RestaurantPricing: React.FC = () => {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Hero */}
      <section className="relative bg-stone-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-600/15 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative container mx-auto px-4 max-w-4xl text-center">
          <p className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400 mb-5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            Restaurant Pricing
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-5 text-white">
            3D menus for restaurants
          </h1>
          <p className="text-lg text-stone-400 max-w-xl mx-auto">
            Per-menu subscription. Unlimited 3D items within your storage. No hard view caps —
            overages billed by usage. On-site capture available.
          </p>

          {/* Toggle */}
          <div className="mt-10 inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                !annual ? 'bg-amber-600 text-white shadow' : 'text-stone-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                annual ? 'bg-amber-600 text-white shadow' : 'text-stone-400 hover:text-white'
              }`}
            >
              Annual
              <span className="ml-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                −2 months
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Section 1: Plans ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-800/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
              Choose your plan
            </p>
            <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white">
              Per-menu subscription
            </h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm">
              All plans include unlimited 3D items (within storage), a QR code per item, printable
              QR sheets, and basic analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {PLANS.map((plan) => {
              const price = annual ? plan.annualPrice : plan.monthlyPrice;
              const period = annual ? '/year' : '/month';
              const accentClass = plan.highlighted
                ? 'ring-2 ring-amber-500 dark:ring-amber-400 md:scale-105 shadow-2xl bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/30 dark:to-zinc-900'
                : 'bg-white dark:bg-zinc-900';
              return (
                <Card
                  key={plan.id}
                  hover={false}
                  className={`p-7 relative flex flex-col h-full transition-all ${accentClass}`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  {/* Quality badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 w-fit ${
                      plan.qualityLevel === 'C'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        : plan.qualityLevel === 'B'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    <Box className="w-3 h-3" />
                    {plan.quality}
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">{plan.tagline}</p>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span
                      className={`text-4xl font-bold ${plan.highlighted ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-900 dark:text-white'}`}
                    >
                      €{price}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {period} / menu
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono mb-1">
                    {plan.includedViews.toLocaleString()} views included
                  </p>
                  <p className="text-[11px] text-zinc-400 font-mono mb-6">{plan.storage} storage</p>

                  <ul className="space-y-2.5 mb-8 flex-grow">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/request">
                    <Button
                      variant={plan.highlighted ? 'primary' : 'outline'}
                      className={`w-full ${plan.highlighted ? 'bg-amber-600 hover:bg-amber-500 border-amber-600' : ''}`}
                    >
                      Get started <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 2: View Metering ──────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
              View metering
            </p>
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
              No hard caps — billed by usage
            </h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm">
              Overage views beyond your included allowance are billed monthly using the tiered
              ladder below. Service never stops.
            </p>
          </div>

          {/* Overage table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700 mb-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left px-6 py-4 font-semibold text-zinc-700 dark:text-zinc-300">
                    Monthly overage band
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-zinc-700 dark:text-zinc-300">
                    Standard
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-amber-600 dark:text-amber-400">
                    Pro
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-zinc-700 dark:text-zinc-300">
                    Ultra
                  </th>
                </tr>
                <tr className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700">
                  <td className="px-6 py-3 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    Included views
                  </td>
                  <td className="text-center px-4 py-3 text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    1,000
                  </td>
                  <td className="text-center px-4 py-3 text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
                    2,000
                  </td>
                  <td className="text-center px-4 py-3 text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    5,000
                  </td>
                </tr>
              </thead>
              <tbody>
                {OVERAGE_TIERS.map((tier, i) => (
                  <tr
                    key={tier.band}
                    className={`border-b border-zinc-100 dark:border-zinc-800 last:border-0 ${i % 2 === 0 ? '' : 'bg-zinc-50/50 dark:bg-zinc-800/20'}`}
                  >
                    <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{tier.band}</td>
                    <td className="text-center px-4 py-4 font-mono text-zinc-600 dark:text-zinc-400">
                      {tier.standard}
                    </td>
                    <td className="text-center px-4 py-4 font-mono font-semibold text-amber-600 dark:text-amber-400">
                      {tier.pro}
                    </td>
                    <td className="text-center px-4 py-4 font-mono text-zinc-600 dark:text-zinc-400">
                      {tier.ultra}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View definition tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Zap,
                title: '1 view = 1 session load',
                body: 'Counted once per device, per item, per 30-minute window. Refreshing within 30 min = 1 view.',
              },
              {
                icon: Shield,
                title: 'Bots & QA excluded',
                body: 'Known crawlers, uptime monitors, and your internal QA traffic are never billed.',
              },
              {
                icon: BarChart2,
                title: 'Monthly reset',
                body: 'Included views reset on your billing date. Overage is billed in arrears on the same invoice.',
              },
              {
                icon: CreditCard,
                title: 'Subscription in advance',
                body: 'Your plan fee is billed at the start of the cycle; overage appears at the end.',
              },
              {
                icon: Globe,
                title: 'Dashboard visibility',
                body: 'See total, billable, excluded, and remaining views — plus a projected bill — in real time.',
              },
              {
                icon: Users,
                title: 'Per-menu counting',
                body: 'Views are counted and reported per menu. Each menu has its own included allowance.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-3 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-zinc-900 dark:text-white mb-1">
                    {title}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: On-site Production ────────────────────────────────────── */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
              3D model production
            </p>
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
              On-site capture
            </h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm">
              We come to your restaurant and capture every dish you need. One-time per item, billed
              separately from the subscription.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-7">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-5">
                <MapPin className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                On-site visit fee
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
                Covers travel, equipment, and our capture specialist. Applied once per visit.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">€100</span>
                <span className="text-sm text-zinc-500">/visit</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-amber-200 dark:border-amber-900/40 p-7">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5">
                <Box className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Per 3D model</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
                Each dish captured and produced as a web-ready 3D model matching your plan's quality
                level.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">€20</span>
                <span className="text-sm text-zinc-500">/model</span>
              </div>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
              Example production cost
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: '10 models', formula: '€100 + 10 × €20', total: 300 },
                { label: '20 models', formula: '€100 + 20 × €20', total: 500 },
                { label: '40 models', formula: '€100 + 40 × €20', total: 900 },
              ].map(({ label, formula, total }) => (
                <div key={label} className="rounded-xl bg-zinc-50 dark:bg-zinc-800 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
                    {label}
                  </p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">€{total}</p>
                  <p className="text-[11px] font-mono text-zinc-400">{formula}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-400 mt-4 text-center">
              Model quality is determined by your subscription plan (Standard = Level A · Pro =
              Level B · Ultra = Level C).
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 4: 3D Quality Levels ─────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
              3D quality levels
            </p>
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
              What you get
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(
              [
                {
                  level: 'A',
                  name: 'Minimum',
                  plan: 'Standard',
                  color: 'zinc' as const,
                  desc: 'Clean, web-ready models suitable for everyday dishes. Optimized for fast load and smooth interaction.',
                },
                {
                  level: 'B',
                  name: 'Medium',
                  plan: 'Pro',
                  color: 'blue' as const,
                  desc: 'Extra detail passes for a sharper, more realistic result. Great for featured dishes and regular menus.',
                },
                {
                  level: 'C',
                  name: 'Best / Premium',
                  plan: 'Ultra',
                  color: 'amber' as const,
                  desc: 'Maximum texture resolution, multi-angle refinement, and premium retouching. Ideal for signature dishes.',
                },
              ] as const
            ).map(({ level, name, plan, color, desc }) => (
              <div
                key={level}
                className={`rounded-2xl border p-6 ${
                  color === 'amber'
                    ? 'border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20'
                    : color === 'blue'
                      ? 'border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/20'
                      : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                      color === 'amber'
                        ? 'bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'
                        : color === 'blue'
                          ? 'bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                          : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {level}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-zinc-900 dark:text-white">
                      Level {level} — {name}
                    </p>
                    <p className="text-xs text-zinc-500">{plan} plan</p>
                  </div>
                </div>

                {/* Placeholder for 3D model preview */}
                <div className="aspect-square rounded-xl bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center mb-4 border border-zinc-300 dark:border-zinc-600">
                  <div className="text-center">
                    <Box
                      className={`w-10 h-10 mx-auto mb-2 ${color === 'amber' ? 'text-amber-400' : color === 'blue' ? 'text-blue-400' : 'text-zinc-400'}`}
                    />
                    <p className="text-xs text-zinc-400 font-mono">3D model preview</p>
                    <p className="text-[10px] text-zinc-500">coming soon</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Add-ons ────────────────────────────────────────────────── */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
              Add-ons
            </p>
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
              Extend your menu
            </h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm">
              Available on any plan. Each add-on has a one-time setup fee and an ongoing monthly
              fee.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left px-6 py-4 font-semibold text-zinc-700 dark:text-zinc-300">
                    Add-on
                  </th>
                  <th className="text-right px-4 py-4 font-semibold text-zinc-700 dark:text-zinc-300">
                    One-time setup
                  </th>
                  <th className="text-right px-6 py-4 font-semibold text-zinc-700 dark:text-zinc-300">
                    Monthly
                  </th>
                </tr>
              </thead>
              <tbody>
                {ADDONS.map((addon, i) => (
                  <tr
                    key={addon.name}
                    className={`border-b border-zinc-100 dark:border-zinc-800 last:border-0 ${i % 2 === 0 ? '' : 'bg-zinc-50/50 dark:bg-zinc-800/20'}`}
                  >
                    <td className="px-6 py-3">
                      <p className="font-medium text-zinc-900 dark:text-white">{addon.name}</p>
                      <p className="text-xs text-zinc-400">{addon.detail}</p>
                    </td>
                    <td className="text-right px-4 py-3 font-mono text-zinc-600 dark:text-zinc-400">
                      €{addon.setup}
                    </td>
                    <td className="text-right px-6 py-3 font-mono font-semibold text-zinc-900 dark:text-white">
                      €{addon.monthly}/mo
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Storage add-on */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <Plus className="w-5 h-5 text-zinc-500" />
              </div>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Extra storage</p>
                <p className="text-xs text-zinc-500">
                  +10 GB per menu · hosted 3D models &amp; textures
                </p>
              </div>
            </div>
            <p className="font-bold text-xl text-zinc-900 dark:text-white font-mono whitespace-nowrap">
              €10/mo
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 6: FAQ ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-4 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
              FAQ
            </p>
            <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white">
              Frequently asked questions
            </h2>
          </div>
          <Accordion
            items={FAQ_ITEMS.map((item) => ({
              title: item.question,
              content: <p>{item.answer}</p>,
            }))}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-stone-950 text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-display text-3xl font-bold mb-5">
            Ready to bring your menu to life?
          </h2>
          <p className="text-lg mb-8 text-stone-400">
            Start with a plan and schedule your first on-site capture session.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/request">
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-500 border-amber-600 text-white"
              >
                Request capture <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/pricing/platform">
              <Button
                variant="outline"
                size="lg"
                className="border-stone-600 text-stone-300 hover:bg-stone-800"
              >
                See platform pricing <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RestaurantPricing;
