import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Accordion from '@/components/Accordion';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  highlighted?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    price: '$299',
    description: 'Test the magic with a small batch',
    features: [
      'Up to 5 objects',
      '1 on-site visit',
      'Web-ready 3D models',
      'Embed codes & QR codes',
      'Email support',
      '48-hour turnaround',
    ],
    notIncluded: ['AR capabilities', 'Custom branding', 'Priority support'],
  },
  {
    name: 'Professional',
    price: '$899',
    description: 'The plan most teams choose',
    features: [
      'Up to 20 objects',
      '2 on-site visits',
      'High-fidelity 3D models',
      'AR-ready assets',
      'Custom branding & white-label',
      'Priority email support',
      '24-hour turnaround',
      '1 round of free revisions',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Unlimited scale, dedicated partner',
    features: [
      'Unlimited objects & visits',
      'Premium 3D & VR assets',
      'White-label + API access',
      'Dedicated account manager',
      'Custom integrations',
      'Unlimited revisions',
      '12-hour turnaround',
      'Priority support (phone & Slack)',
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: 'What makes your service different from DIY 3D scanning?',
    answer:
      "Unlike DIY equipment, we bring professional-grade photogrammetry rigs, trained capture specialists, and post-processing expertise. You get AR-ready, web-optimized models in 24–48 hours without learning curves, equipment investment, or trial-and-error. We handle the complexity so you don't have to.",
  },
  {
    question: 'What types of objects can you capture?',
    answer:
      'We can capture virtually any physical object—from small jewelry to large installations, textured surfaces to reflective metals. Our equipment handles challenging materials that consumer 3D scanners struggle with.',
  },
  {
    question: 'How long does the full process take?',
    answer:
      'On-site capture typically takes 1–4 hours depending on object count and complexity. Total turnaround from your request to deliverables: 24–48 hours (Starter/Pro) or 12 hours (Enterprise). No lengthy production queues.',
  },
  {
    question: 'Can I use the models on my own website?',
    answer:
      'Yes—you own the models. We deliver embed codes, direct links, downloadable 3D files, and AR-ready formats. Use them on Shopify, WordPress, custom sites, or in your app with no licensing restrictions.',
  },
  {
    question: 'Do you offer international capture?',
    answer:
      'Yes, for Professional and Enterprise plans. We coordinate logistics and send our teams to your location (or you ship objects to our facility). Contact us for availability in your region.',
  },
  {
    question: 'What if I need changes or revisions?',
    answer:
      'Starter plans include 1 round of free revisions. Professional and higher include additional revision budgets. Enterprise includes unlimited revisions. Most changes are turned around in 24 hours.',
  },
  {
    question: 'Is there a trial or way to test before committing?',
    answer:
      'Yes. Start with our Starter plan ($299) to capture 5 objects and experience the full workflow. No long-term contracts. If you like it, upgrade to Professional and scale from there.',
  },
];

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 to-brand-900 dark:from-slate-950 dark:to-brand-950 text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-300">
            Choose the plan that fits your needs. No hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end">
            {PRICING_TIERS.map((tier, idx) => (
              <Card
                key={idx}
                hover={false}
                className={`p-8 relative flex flex-col h-full transition-all ${
                  tier.highlighted
                    ? 'ring-2 ring-brand-500 dark:ring-brand-400 md:scale-105 shadow-2xl bg-gradient-to-b from-brand-50 to-white dark:from-brand-950 dark:to-slate-900'
                    : 'bg-white dark:bg-slate-900'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-brand-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Most Popular
                  </div>
                )}

                <div className="text-center mb-8 pt-2">
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      tier.highlighted
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={`mb-6 text-sm ${
                      tier.highlighted
                        ? 'text-slate-700 dark:text-slate-300 font-medium'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {tier.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span
                      className={`text-5xl font-bold ${
                        tier.highlighted
                          ? 'text-brand-600 dark:text-brand-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {tier.price}
                    </span>
                    {tier.price !== 'Custom' && (
                      <span
                        className={`text-base font-normal ${
                          tier.highlighted
                            ? 'text-slate-700 dark:text-slate-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        /project
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-10 flex-grow">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                  {tier.notIncluded?.map((feature, fIdx) => (
                    <li key={`not-${fIdx}`} className="flex items-start gap-3 opacity-40">
                      <X className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={tier.price === 'Custom' ? '/#contact' : '/request'} className="block">
                  <Button variant={tier.highlighted ? 'primary' : 'outline'} className="w-full">
                    {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          {/* Comparison table for more details */}
          <div className="mt-16 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Full Feature Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-white">
                      Feature
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-900 dark:text-white">
                      Starter
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-brand-600 dark:text-brand-400">
                      Professional
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-900 dark:text-white">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                      Revisions included
                    </td>
                    <td className="text-center py-4 px-4">1 round</td>
                    <td className="text-center py-4 px-4 font-semibold">1 round</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">Model quality</td>
                    <td className="text-center py-4 px-4">Web-ready</td>
                    <td className="text-center py-4 px-4 font-semibold">High-fidelity</td>
                    <td className="text-center py-4 px-4">Premium + VR</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">Support tier</td>
                    <td className="text-center py-4 px-4">Email</td>
                    <td className="text-center py-4 px-4 font-semibold">Priority email</td>
                    <td className="text-center py-4 px-4">Phone + Slack</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>

          <Accordion
            items={FAQ_ITEMS.map((item) => ({
              title: item.question,
              content: <p>{item.answer}</p>,
            }))}
          />
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">
            Your journey starts with one request
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="group flex flex-col items-center p-6 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-105">
              <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all">
                1
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-center group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Submit Request
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                Tell us about your objects, location, and needs
              </p>
            </div>
            <div className="group flex flex-col items-center p-6 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-105">
              <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all">
                2
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-center group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Schedule Capture
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                We confirm date and send capture specialists
              </p>
            </div>
            <div className="group flex flex-col items-center p-6 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-105">
              <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all">
                3
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-center group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                We Capture
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                Professional photogrammetry scan (1–4 hours)
              </p>
            </div>
            <div className="group flex flex-col items-center p-6 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-105">
              <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all">
                4
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-center group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Receive Models
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                Ready-to-use 3D files, viewer, and AR assets
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
            <p className="text-center text-slate-800 dark:text-slate-200">
              <span className="font-semibold">💡 Pro tip:</span> Most teams start with our Starter
              plan ($299) to test the workflow. Once you see the results, upgrade to Professional
              for better quality and faster turnaround.
            </p>
          </div>

          <div className="text-center mt-12">
            <Link to="/request">
              <Button size="lg" className="inline-flex items-center gap-2">
                Start Your Request Now <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
              No credit card required. No long-term contracts.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA - Enterprise */}
      <section className="py-20 bg-gradient-to-br from-brand-600 to-brand-700 dark:from-brand-700 dark:to-brand-800 text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-6">Need a custom solution?</h2>
          <p className="text-xl mb-8 text-brand-100">
            Our Enterprise team handles unlimited scale, API integrations, and white-label options
          </p>
          <Link to="/#contact">
            <Button variant="secondary" size="lg">
              Contact Sales Team <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
