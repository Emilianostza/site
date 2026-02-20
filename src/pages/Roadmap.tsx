import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Scan,
  QrCode,
  LayoutDashboard,
  Users,
  Sparkles,
  BarChart3,
  CreditCard,
  Building2,
  Smartphone,
  Code2,
  CalendarRange,
  Languages,
  Globe,
  Webhook,
  Monitor,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import { SEO } from '@/components/common/SEO';

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Status = 'live' | 'in-progress' | 'coming-soon' | 'planned';

interface Feature {
  icon: React.ElementType;
  title: string;
  desc: string;
}

interface Phase {
  number: string;
  quarter: string;
  year: string;
  status: Status;
  headline: string;
  sub: string;
  color: {
    glow: string;
    border: string;
    leftBorder: string;
    badge: string;
    badgeText: string;
    badgeBorder: string;
    dot: string;
    iconBg: string;
    iconText: string;
    phaseLabel: string;
  };
  features: Feature[];
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

const STATUS_LABELS: Record<Status, string> = {
  live: 'Live Now',
  'in-progress': 'In Progress',
  'coming-soon': 'Coming Soon',
  planned: 'Planned',
};

const PHASES: Phase[] = [
  {
    number: '01',
    quarter: 'Q1',
    year: '2025',
    status: 'live',
    headline: 'Foundation',
    sub: 'The core platform is live — restaurants can capture, deliver, and showcase 3D dish assets today.',
    color: {
      glow: 'bg-emerald-500/20',
      border: 'border-emerald-500/20',
      leftBorder: 'border-l-emerald-500',
      badge: 'bg-emerald-500/15',
      badgeText: 'text-emerald-300',
      badgeBorder: 'border-emerald-500/30',
      dot: 'bg-emerald-400',
      iconBg: 'bg-emerald-500/10',
      iconText: 'text-emerald-400',
      phaseLabel: 'text-emerald-400',
    },
    features: [
      {
        icon: Scan,
        title: '3D Food Capture',
        desc: 'On-site professional photography converted into web-ready 3D/GLB assets — optimised for fast loading on any device.',
      },
      {
        icon: QrCode,
        title: 'Interactive AR Dish Viewer',
        desc: 'Customers scan a QR code and instantly see any dish at real-world scale, directly on their table — no app required.',
      },
      {
        icon: LayoutDashboard,
        title: 'Restaurant Owner Portal',
        desc: 'Manage all your capture projects, review delivered assets, approve or request revisions, and share links — in one place.',
      },
      {
        icon: Users,
        title: 'Photographer Network',
        desc: 'Vetted capture professionals operating across Estonia, Greece & France — with consistent quality and fast turnaround.',
      },
    ],
  },
  {
    number: '02',
    quarter: 'Q2',
    year: '2025',
    status: 'in-progress',
    headline: 'Intelligence',
    sub: "We're adding smart tools to save time, surface insights, and connect your 3D assets to the rest of your restaurant stack.",
    color: {
      glow: 'bg-amber-500/20',
      border: 'border-amber-500/20',
      leftBorder: 'border-l-amber-500',
      badge: 'bg-amber-500/15',
      badgeText: 'text-amber-300',
      badgeBorder: 'border-amber-500/30',
      dot: 'bg-amber-400',
      iconBg: 'bg-amber-500/10',
      iconText: 'text-amber-400',
      phaseLabel: 'text-amber-400',
    },
    features: [
      {
        icon: Sparkles,
        title: 'AI Quality Control',
        desc: 'Automatic detection of blurry, poorly-lit, or incomplete captures — flagged before delivery so you never receive a subpar asset.',
      },
      {
        icon: BarChart3,
        title: 'Restaurant Analytics',
        desc: 'Track dish view counts, AR opens, QR scans, and conversion rates per item — so you know which dishes are driving the most interest.',
      },
      {
        icon: CreditCard,
        title: 'POS Integrations',
        desc: 'Connect with Square, Toast, and Lightspeed. When you update your menu, your 3D assets sync automatically — zero manual work.',
      },
      {
        icon: Building2,
        title: 'Multi-location Management',
        desc: 'Manage all your restaurant branches under a single organisation — separate asset libraries, unified billing and reporting.',
      },
    ],
  },
  {
    number: '03',
    quarter: 'Q3',
    year: '2025',
    status: 'coming-soon',
    headline: 'Reach',
    sub: 'Put your 3D assets everywhere your customers are — your app, your website, your whole menu.',
    color: {
      glow: 'bg-brand-600/20',
      border: 'border-brand-500/20',
      leftBorder: 'border-l-brand-500',
      badge: 'bg-brand-500/15',
      badgeText: 'text-brand-300',
      badgeBorder: 'border-brand-500/30',
      dot: 'bg-brand-400',
      iconBg: 'bg-brand-500/10',
      iconText: 'text-brand-400',
      phaseLabel: 'text-brand-400',
    },
    features: [
      {
        icon: Smartphone,
        title: 'iOS & Android App',
        desc: 'Manage your entire asset library, approve capture jobs, and share AR previews directly from your phone — no browser needed.',
      },
      {
        icon: Code2,
        title: 'Embeddable 3D Widget',
        desc: 'Drop one script tag onto your website and your dishes appear as interactive 3D models — no developer experience required.',
      },
      {
        icon: CalendarRange,
        title: 'Bulk Menu Campaigns',
        desc: 'Book a single session and capture your entire menu in one go — our team handles the scheduling, logistics, and delivery.',
      },
      {
        icon: Languages,
        title: 'Multi-language Menus',
        desc: 'Automatically translate dish names, descriptions, and allergen labels into the local language of each market you serve.',
      },
    ],
  },
  {
    number: '04',
    quarter: 'Q4',
    year: '2025',
    status: 'planned',
    headline: 'Scale',
    sub: 'Enterprise-grade tools and geographic expansion — built for restaurant groups, chains, and franchises operating across Europe.',
    color: {
      glow: 'bg-zinc-500/10',
      border: 'border-zinc-700/40',
      leftBorder: 'border-l-zinc-600',
      badge: 'bg-zinc-700/30',
      badgeText: 'text-zinc-400',
      badgeBorder: 'border-zinc-600/40',
      dot: 'bg-zinc-500',
      iconBg: 'bg-zinc-700/30',
      iconText: 'text-zinc-400',
      phaseLabel: 'text-zinc-400',
    },
    features: [
      {
        icon: Globe,
        title: 'EU Geographic Expansion',
        desc: 'Expanding our professional capture network to Spain, Italy, Germany, and the Netherlands — more cities, same quality standard.',
      },
      {
        icon: Webhook,
        title: 'Restaurant Chain API',
        desc: 'A full REST API for franchises managing 10+ locations — programmatic asset management, webhooks, and bulk operations.',
      },
      {
        icon: Monitor,
        title: 'Digital Menu Board Integration',
        desc: 'Display your 3D dish assets on in-restaurant screens and kiosks — loop animations, seasonal specials, and real-time updates.',
      },
      {
        icon: Leaf,
        title: 'Allergen & Nutrition Overlays',
        desc: 'Auto-tag common allergens and nutritional information directly on 3D dish assets — one-click compliance with EU labelling rules.',
      },
    ],
  },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */

const StatusBadge: React.FC<{ status: Status; color: Phase['color'] }> = ({ status, color }) => (
  <span
    className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${color.badge} ${color.badgeText} ${color.badgeBorder}`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${color.dot} ${status === 'live' ? 'animate-pulse' : ''}`}
    />
    {STATUS_LABELS[status]}
  </span>
);

const PhaseProgressBar: React.FC = () => {
  const steps: { label: string; status: Status }[] = [
    { label: 'Q1 · Foundation', status: 'live' },
    { label: 'Q2 · Intelligence', status: 'in-progress' },
    { label: 'Q3 · Reach', status: 'coming-soon' },
    { label: 'Q4 · Scale', status: 'planned' },
  ];
  const colors: Record<Status, string> = {
    live: 'bg-emerald-500 text-emerald-300',
    'in-progress': 'bg-amber-500 text-amber-300',
    'coming-soon': 'bg-brand-500 text-brand-300',
    planned: 'bg-zinc-600 text-zinc-400',
  };
  const dotColors: Record<Status, string> = {
    live: 'bg-emerald-400 ring-emerald-400/30',
    'in-progress': 'bg-amber-400 ring-amber-400/30',
    'coming-soon': 'bg-brand-400 ring-brand-400/30',
    planned: 'bg-zinc-600 ring-zinc-600/30',
  };
  return (
    <div className="flex items-center justify-center gap-0 flex-wrap sm:flex-nowrap">
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ring-4 ring-offset-2 ring-offset-zinc-950 ${dotColors[step.status]} ${step.status === 'live' ? 'animate-pulse' : ''}`}
            />
            <span
              className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${colors[step.status].split(' ')[1]}`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="h-px flex-1 min-w-[32px] max-w-[80px] bg-zinc-700 mx-2 mb-5" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

const Roadmap: React.FC = () => (
  <div className="bg-zinc-950 min-h-screen">
    <SEO
      title="Roadmap"
      description="See what we're building next for restaurants — four phases of features, tools, and expansion."
    />

    {/* ── Hero ──────────────────────────────────────────────────────────── */}
    <section className="relative overflow-hidden pt-24 pb-20 border-b border-zinc-800">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-brand-700/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-emerald-700/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[350px] h-[350px] bg-amber-700/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative container mx-auto px-4 max-w-4xl text-center">
        <p className="inline-block text-xs font-bold uppercase tracking-widest text-brand-400 mb-5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
          Product Roadmap · 2025
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          The future of
          <br />
          <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            restaurant presentation
          </span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          Four phases. Dozens of features. Every single one built exclusively for restaurants.
        </p>
        <PhaseProgressBar />
      </div>
    </section>

    {/* ── Phases ────────────────────────────────────────────────────────── */}
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/40 via-amber-500/20 to-zinc-800/0 pointer-events-none hidden md:block" />

      {PHASES.map((phase, phaseIndex) => (
        <section
          key={phase.number}
          className={`relative py-20 border-b border-zinc-800/60 overflow-hidden ${phaseIndex % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/30'}`}
        >
          {/* Ambient glow */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] ${phase.color.glow} blur-[100px] rounded-full pointer-events-none opacity-60`}
          />

          <div className="relative container mx-auto px-4 max-w-5xl">
            {/* Phase header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-12">
              <div className="flex items-center gap-5">
                {/* Phase number circle */}
                <div
                  className={`w-14 h-14 rounded-2xl border ${phase.color.border} ${phase.color.iconBg} flex items-center justify-center flex-shrink-0`}
                >
                  <span className={`font-display text-lg font-bold ${phase.color.phaseLabel}`}>
                    {phase.number}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                      {phase.quarter} {phase.year}
                    </span>
                    <StatusBadge status={phase.status} color={phase.color} />
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                    Phase {phase.number} — {phase.headline}
                  </h2>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed md:max-w-xs md:text-right">
                {phase.sub}
              </p>
            </div>

            {/* Feature cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {phase.features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`group relative p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 border-l-4 ${phase.color.leftBorder} backdrop-blur-sm hover:bg-zinc-900/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl ${phase.color.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <Icon className={`w-5 h-5 ${phase.color.iconText}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="font-bold text-white text-sm leading-snug">
                            {feature.title}
                          </h3>
                          {phase.status === 'live' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </div>

    {/* ── CTA ───────────────────────────────────────────────────────────── */}
    <section className="relative py-20 overflow-hidden border-t border-zinc-800">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-brand-700/15 blur-[80px] rounded-full pointer-events-none" />
      <div className="relative container mx-auto px-4 max-w-2xl text-center">
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">
          Shape what we build
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
          Have a feature request?
        </h2>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          Our roadmap is driven by restaurant owners. If there&apos;s a tool that would make a real
          difference to your business, we want to hear it.
        </p>
        <Link
          to="/request"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-all shadow-xs hover:shadow-glow hover:-translate-y-px active:translate-y-0"
        >
          Get in touch
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  </div>
);

export default Roadmap;
