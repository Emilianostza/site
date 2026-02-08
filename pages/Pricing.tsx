import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Accordion from '../components/Accordion';

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
        description: 'Perfect for small projects and testing',
        features: [
            'Up to 5 objects captured',
            '1 on-site visit',
            'Basic 3D models (web-ready)',
            'Embed codes & QR codes',
            'Email support',
            '48-hour turnaround',
        ],
        notIncluded: ['AR capabilities', 'Custom branding', 'Priority support'],
    },
    {
        name: 'Professional',
        price: '$899',
        description: 'Most popular for businesses',
        features: [
            'Up to 20 objects captured',
            '2 on-site visits',
            'High-fidelity 3D models',
            'AR-ready assets',
            'Embed codes & QR codes',
            'Custom branding',
            'Priority email support',
            '24-hour turnaround',
        ],
        highlighted: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For large-scale projects',
        features: [
            'Unlimited objects',
            'Multiple on-site visits',
            'Premium 3D models',
            'AR & VR capabilities',
            'White-label solution',
            'API access',
            'Dedicated account manager',
            'Custom integrations',
            '12-hour turnaround',
        ],
    },
];

const FAQ_ITEMS = [
    {
        question: 'What types of objects can you capture?',
        answer: 'We can capture virtually any physical object, from small items like jewelry to large installations like sculptures. The only limitations are accessibility and size constraints for our equipment.',
    },
    {
        question: 'How long does the capture process take?',
        answer: 'The on-site capture typically takes 1-4 hours depending on the number and complexity of objects. Total turnaround from request to delivery ranges from 24-48 hours depending on your plan.',
    },
    {
        question: 'Can I use the 3D models on my own website?',
        answer: 'Absolutely! You receive embed codes, direct links, and downloadable assets that you can use on any website or platform. We also provide AR-ready formats for mobile experiences.',
    },
    {
        question: 'Do you travel internationally?',
        answer: 'Yes, for Enterprise plans we can arrange international capture sessions. Contact us for pricing and logistics details.',
    },
    {
        question: 'What if I need revisions?',
        answer: 'All plans include one round of revisions. Additional revisions can be purchased separately. Enterprise plans include unlimited revisions.',
    },
];

const Pricing: React.FC = () => {

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-slate-900 to-brand-900 dark:from-slate-950 dark:to-brand-950 text-white py-20">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-slate-300">
                        Choose the plan that fits your needs. No hidden fees.
                    </p>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="py-20 bg-slate-50 dark:bg-slate-800">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PRICING_TIERS.map((tier, idx) => (
                            <Card
                                key={idx}
                                hover={false}
                                className={`p-8 relative ${tier.highlighted
                                    ? 'ring-2 ring-brand-500 dark:ring-brand-400 scale-105'
                                    : ''
                                    }`}
                            >
                                {tier.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                        Most Popular
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                        {tier.name}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                                        {tier.description}
                                    </p>
                                    <div className="text-4xl font-bold text-brand-600 dark:text-brand-400">
                                        {tier.price}
                                        {tier.price !== 'Custom' && (
                                            <span className="text-lg text-slate-500 dark:text-slate-400 font-normal">
                                                /project
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                                        </li>
                                    ))}
                                    {tier.notIncluded?.map((feature, fIdx) => (
                                        <li key={`not-${fIdx}`} className="flex items-start gap-3 opacity-50">
                                            <X className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-500 dark:text-slate-400">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link to="/request" className="block">
                                    <Button
                                        variant={tier.highlighted ? 'primary' : 'outline'}
                                        className="w-full"
                                    >
                                        {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </Card>
                        ))}
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
                        items={FAQ_ITEMS.map(item => ({
                            title: item.question,
                            content: <p>{item.answer}</p>
                        }))}
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-brand-600 to-brand-700 dark:from-brand-700 dark:to-brand-800 text-white">
                <div className="container mx-auto px-4 text-center max-w-2xl">
                    <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
                    <p className="text-xl mb-8 text-brand-100">
                        Our team is here to help you find the perfect solution
                    </p>
                    <Link to="/request">
                        <Button variant="secondary" size="lg">
                            Contact Us <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Pricing;
