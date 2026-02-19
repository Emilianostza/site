import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  ArrowRight,
  Box,
  Zap,
  Globe,
  Shield,
  Users,
  BarChart2,
  Package,
  CreditCard,
  ChevronRight,
  Video,
  Scan,
  Building2,
  Settings2,
} from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Accordion from '@/components/Accordion';

// ─── Platform Plans ───────────────────────────────────────────────────────────

interface PlatformPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  includedProducts: number;
  includedViews: string;
  storage: string;
  seats: number;
  overagePerK: number | null;
  features: string[];
  highlighted?: boolean;
  enterpriseCustom?: boolean;
}

const PLATFORM_PLANS: PlatformPlan[] = [
  {
    id: 'launch',
    name: 'Launch',
    tagline: 'Start publishing AR experiences',
    monthlyPrice: 59,
    annualPrice: 590,
    includedProducts: 25,
    includedViews: '50,000',
    storage: '10 GB',
    seats: 1,
    overagePerK: 1.5,
    features: [
      '25 active products / QR codes',
      '50,000 included views / month',
      '10 GB hosted assets',
      'Basic analytics (views, top items, referrers)',
      '1 team seat',
      'Email support',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'For growing brands',
    monthlyPrice: 199,
    annualPrice: 1990,
    includedProducts: 150,
    includedViews: '250,000',
    storage: '50 GB',
    seats: 3,
    overagePerK: 1.0,
    highlighted: true,
    features: [
      '150 active products / QR codes',
      '250,000 included views / month',
      '50 GB hosted assets',
      'Custom domain (CNAME)',
      'Advanced analytics export (CSV)',
      '3 team seats',
      'Priority support',
    ],
  },
  {
    id: 'whitelabel',
    name: 'White-label',
    tagline: 'Your brand, fully yours',
    monthlyPrice: 499,
    annualPrice: 4990,
    includedProducts: 500,
    includedViews: '1,000,000',
    storage: '200 GB',
    seats: 10,
    overagePerK: 0.6,
    features: [
      '500 active products / QR codes',
      '1,000,000 included views / month',
      '200 GB hosted assets',
      'White-label viewer (no platform branding)',
      'API access (publish / update / analytics)',
      '10 team seats',
      'SLA option available',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Custom scale & compliance',
    monthlyPrice: null,
    annualPrice: null,
    includedProducts: 5000,
    includedViews: 'Unlimited',
    storage: 'Custom',
    seats: 0,
    overagePerK: null,
    enterpriseCustom: true,
    features: [
      '5,000+ active items',
      'SSO & identity federation',
      'Dedicated infrastructure',
      'Multi-region hosting',
      'Compliance & data residency',
      'Bespoke SLA',
    ],
  },
];

// ─── Add-ons ──────────────────────────────────────────────────────────────────

const ADDONS = [
  {
    label: 'Extra active products',
    detail: '+25 products',
    price: '€15/mo (Launch)',
    price2: '€25/mo per +100 (Scale)',
  },
  { label: 'Extra storage', detail: '+50 GB', price: '€10/mo' },
  { label: 'Extra team seat', detail: 'Per seat', price: '€12/mo' },
  { label: 'SLA (response time & uptime)', detail: 'Scale+', price: 'from €99/mo' },
  { label: 'Additional custom domain', detail: 'Per domain', price: '€10/mo' },
];

const CREDIT_PACKS = [
  { views: '1,000,000', price: 900, effective: '€0.0009/view' },
  { views: '5,000,000', price: 4000, effective: '€0.0008/view' },
  { views: '10,000,000', price: 7000, effective: '€0.0007/view' },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    question: 'What counts as a view?',
    answer:
      '1 view = one session load of an AR/3D experience. We count once per device per 30 minutes per experience, even if the page is refreshed. Known bots, uptime monitors, and your internal QA traffic (IP allowlist / token flagging) are excluded.',
  },
  {
    question: 'Do you stop service if I exceed my included views?',
    answer:
      "Never. There are no hard caps. If you exceed your plan's included views, overage views are billed in arrears at your plan's per-1,000 rate on the same invoice. Your experience stays live.",
  },
  {
    question: 'Can I cap my spend to avoid surprises?',
    answer:
      'You can set budget alerts in the dashboard. The service continues even if an alert threshold is reached — we never interrupt your customer experiences mid-month. Prepaid View Credit Packs are also available if you want fully predictable invoicing.',
  },
  {
    question: 'Who can publish and edit experiences?',
    answer:
      'Your staff (with a team seat) can publish, update, and manage experiences. Your customers can only view or interact with content you have shared with them — they cannot modify it.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer:
      'Yes. Plan changes are prorated and take effect at the start of your next billing cycle. Contact support or change directly from your dashboard.',
  },
  {
    question: 'What are View Credit Packs?',
    answer:
      'Credit Packs are prepaid view credits you can purchase at any time. Credits draw down before overage kicks in, keeping invoices predictable. Credits are valid for 12 months and shared across all experiences in your account.',
  },
  {
    question: 'What is the difference between Standard and Complex capture?',
    answer:
      "Standard (€290) covers most objects with diffuse surfaces and normal geometry. Complex (€490) is for reflective, transparent, or high-detail objects that require extra retouching and QC passes. If you're unsure, send us a photo and we'll advise.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Hero */}
      <section className="relative bg-zinc-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-600/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative container mx-auto px-4 max-w-4xl text-center">
          <p className="inline-block text-xs font-bold uppercase tracking-widest text-brand-400 mb-5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
            Pricing
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-5 text-white">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            A platform subscription for hosting and AR delivery, plus optional managed capture to
            get your objects 3D-ready — handled by our team.
          </p>

          {/* Billing toggle */}
          <div className="mt-10 inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                !annual ? 'bg-brand-500 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                annual ? 'bg-brand-500 text-white shadow' : 'text-zinc-400 hover:text-white'
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

      {/* ── Section 1: Platform Plans ─────────────────────────────────────────── */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-800/40">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
              Platform subscription
            </p>
            <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white">
              Choose your platform plan
            </h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto text-sm">
              Recurring subscription — billed monthly or annually. No hard view caps; overages are
              billed per view at the end of each cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-end">
            {PLATFORM_PLANS.map((plan) => {
              const price = annual ? plan.annualPrice : plan.monthlyPrice;
              const period = annual ? '/year' : '/month';
              return (
                <Card
                  key={plan.id}
                  hover={false}
                  className={`p-7 relative flex flex-col h-full transition-all ${
                    plan.highlighted
                      ? 'ring-2 ring-brand-500 dark:ring-brand-400 md:scale-105 shadow-2xl bg-gradient-to-b from-brand-50 to-white dark:from-brand-950 dark:to-zinc-900'
                      : plan.enterpriseCustom
                        ? 'bg-zinc-900 text-white dark:bg-zinc-800'
                        : 'bg-white dark:bg-zinc-900'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-brand-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6 pt-2">
                    <h3
                      className={`text-xl font-bold mb-1 ${plan.enterpriseCustom ? 'text-white' : 'text-zinc-900 dark:text-white'}`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`text-xs ${plan.enterpriseCustom ? 'text-zinc-400' : 'text-zinc-500 dark:text-zinc-400'}`}
                    >
                      {plan.tagline}
                    </p>

                    <div className="mt-5">
                      {plan.enterpriseCustom ? (
                        <p className="text-3xl font-bold text-white">Custom</p>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span
                            className={`text-4xl font-bold ${plan.highlighted ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-900 dark:text-white'}`}
                          >
                            €{price?.toLocaleString()}
                          </span>
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">{period}</span>
                        </div>
                      )}
                      {!plan.enterpriseCustom && plan.overagePerK !== null && (
                        <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                          + €{plan.overagePerK.toFixed(2)} per 1,000 overage views
                        </p>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-grow">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.enterpriseCustom ? 'text-brand-400' : 'text-emerald-500'}`}
                        />
                        <span
                          className={`text-sm ${plan.enterpriseCustom ? 'text-zinc-300' : 'text-zinc-700 dark:text-zinc-300'}`}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {plan.enterpriseCustom ? (
                    <Link to="/#contact">
                      <Button
                        variant="outline"
                        className="w-full border-zinc-600 text-white hover:bg-zinc-700"
                      >
                        Contact Sales <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/request">
                      <Button variant={plan.highlighted ? 'primary' : 'outline'} className="w-full">
                        Get started <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Billing Examples ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
              Worked examples
            </p>
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
              What will my invoice look like?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Example A */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 bg-zinc-50 dark:bg-zinc-800">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3">
                Example A — Scale plan
              </p>
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 mb-5">
                <div className="flex justify-between">
                  <span>Scale subscription</span>
                  <span className="font-mono text-zinc-900 dark:text-white">€199</span>
                </div>
                <div className="flex justify-between">
                  <span>Included views</span>
                  <span className="font-mono text-zinc-900 dark:text-white">250,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Views used</span>
                  <span className="font-mono text-zinc-900 dark:text-white">400,000</span>
                </div>
                <div className="flex justify-between text-amber-600 dark:text-amber-400">
                  <span>Overage (150k × €0.001)</span>
                  <span className="font-mono">+€150</span>
                </div>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Invoice total
                </span>
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">€349</span>
              </div>
            </div>

            {/* Example B */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 bg-zinc-50 dark:bg-zinc-800">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3">
                Example B — Launch + Credit Pack
              </p>
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 mb-5">
                <div className="flex justify-between">
                  <span>Launch subscription</span>
                  <span className="font-mono text-zinc-900 dark:text-white">€59</span>
                </div>
                <div className="flex justify-between">
                  <span>Included views</span>
                  <span className="font-mono text-zinc-900 dark:text-white">50,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Views used</span>
                  <span className="font-mono text-zinc-900 dark:text-white">300,000</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>250k deducted from credit pack</span>
                  <span className="font-mono">€0</span>
                </div>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Invoice total
                </span>
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">€59</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2">
                Credits remaining updated in dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Managed Capture ────────────────────────────────────────── */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
              Managed capture &amp; 3D production
            </p>
            <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white">
              One-time, per-item pricing
            </h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto text-sm">
              We capture, process, and publish your physical objects as web-ready 3D &amp; AR
              experiences — QR generated and ready to embed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Standard */}
            <Card hover={false} className="p-8 bg-white dark:bg-zinc-900 flex flex-col">
              <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-5">
                <Box className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                Standard object
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 flex-grow">
                Diffuse surfaces, normal geometry. Includes capture, cleanup, optimization, publish
                to product page, and QR generation.
              </p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">€290</span>
                <span className="text-sm text-zinc-500">/item</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">48h turnaround · 1 QR per item</p>
            </Card>

            {/* Complex */}
            <Card
              hover={false}
              className="p-8 bg-white dark:bg-zinc-900 ring-2 ring-brand-500 dark:ring-brand-400 flex flex-col"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-brand-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap hidden" />
              <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center mb-5">
                <Package className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                Complex object
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 flex-grow">
                Reflective, transparent, high detail, or complex geometry. Includes extra
                retouching, QC passes, and multi-angle refinement.
              </p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-brand-600 dark:text-brand-400">€490</span>
                <span className="text-sm text-zinc-500">/item</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                48h turnaround · 2 revision rounds
              </p>
            </Card>
          </div>

          {/* Onsite + discounts row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                Onsite day rate
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                €900<span className="text-sm font-normal text-zinc-400">/day</span>
              </p>
              <p className="text-xs text-zinc-500 mt-1">+ travel expenses</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                Batch discounts
              </p>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li className="flex justify-between">
                  <span>10–24 items</span>
                  <span className="font-semibold text-emerald-600">−10%</span>
                </li>
                <li className="flex justify-between">
                  <span>25–99 items</span>
                  <span className="font-semibold text-emerald-600">−20%</span>
                </li>
                <li className="flex justify-between">
                  <span>100+ items</span>
                  <span className="font-semibold text-emerald-600">Custom</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                Rush turnaround
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">+30%</p>
              <p className="text-xs text-zinc-500 mt-1">per item (or a fixed rush fee)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── On-site Services ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
              On-site services
            </p>
            <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white">
              We come to you
            </h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto text-sm">
              Our team travels to your location and handles everything — from photogrammetry 3D
              capture to video, 360° tours, and spatial scanning, all in a single visit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: Box,
                title: 'Photogrammetry & 3D modelling',
                desc: 'High-accuracy 3D models captured from physical objects using multi-image photogrammetry. Web-ready, AR-ready, QR-linked.',
                tag: 'Core service',
                tagColor: 'brand',
              },
              {
                icon: Video,
                title: 'Video production',
                desc: 'Cinematic 4K product and space videos shot during the same visit. Colour-graded, edited, and delivered in short-form and long-form cuts.',
                tag: 'Add-on',
                tagColor: 'zinc',
              },
              {
                icon: Scan,
                title: '360° & virtual tour capture',
                desc: 'Full-room or full-space immersive walkthroughs. Ideal for showrooms, hotels, retail spaces, and venues.',
                tag: 'Add-on',
                tagColor: 'zinc',
              },
              {
                icon: Building2,
                title: 'Architectural & spatial scanning',
                desc: 'Point-cloud and high-detail spatial scans for interiors, buildings, and construction sites. BIM-compatible output on request.',
                tag: 'Add-on',
                tagColor: 'zinc',
              },
            ].map(({ icon: Icon, title, desc, tag, tagColor }) => (
              <div
                key={title}
                className="flex gap-5 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-sm transition-all"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tagColor === 'brand'
                      ? 'bg-brand-100 dark:bg-brand-900/40'
                      : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${tagColor === 'brand' ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-500 dark:text-zinc-400'}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{title}</h3>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        tagColor === 'brand'
                          ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                          : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {tag}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Settings2 className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-semibold">On-site setup & QC included</span> — equipment
                setup, lighting, and quality control are handled by our specialist on every visit.
              </p>
            </div>
            <Link to="/request" className="flex-shrink-0">
              <Button variant="outline" size="sm">
                Book a visit <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 3: How Views Are Counted ─────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
              View metering
            </p>
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
              How views are counted
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Zap,
                title: '1 view = 1 session load',
                body: 'Counted once per device, per experience, per 30-minute window — even if the page is refreshed.',
              },
              {
                icon: BarChart2,
                title: 'Monthly reset',
                body: 'Included views reset on your billing date. Unused included views do not roll over (credits are separate).',
              },
              {
                icon: Shield,
                title: 'Bots & QA excluded',
                body: 'Known crawlers, uptime monitors, and your QA traffic (IP allowlist / token flagging) are never billed.',
              },
              {
                icon: CreditCard,
                title: 'Overage billed in arrears',
                body: 'Subscription billed in advance. Overage views appear on the same invoice at the end of the cycle.',
              },
              {
                icon: Users,
                title: 'Full dashboard visibility',
                body: 'See total, billable, excluded, and remaining included views — plus a projected bill — in real time.',
              },
              {
                icon: Globe,
                title: 'Volume overage discounts',
                body: 'Large monthly overages attract automatic discounts: next 1M views −10%, next 3M −20%, above that negotiated.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-4 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-zinc-900 dark:text-white mb-1">
                    {title}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Add-ons ────────────────────────────────────────────────── */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
              Add-ons
            </p>
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
              Extend any plan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recurring add-ons */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-sm font-bold text-zinc-900 dark:text-white">Recurring add-ons</p>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {ADDONS.map((addon) => (
                    <tr
                      key={addon.label}
                      className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                    >
                      <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                        <p className="font-medium">{addon.label}</p>
                        <p className="text-xs text-zinc-400">{addon.detail}</p>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <p className="font-semibold text-zinc-900 dark:text-white font-mono">
                          {addon.price}
                        </p>
                        {addon.price2 && (
                          <p className="text-xs text-zinc-400 font-mono">{addon.price2}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* View Credit Packs */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  Prepaid View Credit Packs
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Buy once · Valid 12 months · Draw down before overage
                </p>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {CREDIT_PACKS.map((pack) => (
                    <tr
                      key={pack.views}
                      className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                    >
                      <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                        <p className="font-medium">{pack.views} views</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                          {pack.effective}
                        </p>
                      </td>
                      <td className="px-6 py-3 text-right font-semibold text-zinc-900 dark:text-white font-mono">
                        €{pack.price.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/60">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Credits shared across all experiences in the account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: FAQ ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <p className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-4 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
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

      {/* Final CTA */}
      <section className="py-20 bg-zinc-950 text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl relative">
          <h2 className="font-display text-3xl font-bold mb-5">Need a custom solution?</h2>
          <p className="text-lg mb-8 text-zinc-400">
            Enterprise covers 5,000+ active items, SSO, dedicated infrastructure, multi-region
            hosting, compliance, and bespoke SLA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/#contact">
              <Button variant="outline" size="lg">
                Contact Sales <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/request">
              <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-white">
                Start with a plan <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
