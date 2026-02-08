import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, FileQuestion } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../constants';
import Button from '../components/Button';
import Card from '../components/Card';

const HowItWorks: React.FC = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-900 to-brand-900 dark:from-slate-950 dark:to-brand-950 text-white py-20">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        How Our Managed 3D Capture Works
                    </h1>
                    <p className="text-xl text-slate-300 mb-8">
                        From request to delivery, we handle every step of the 3D capture process
                    </p>
                </div>
            </section>

            {/* Process Steps */}
            <section className="py-20 bg-slate-50 dark:bg-slate-800">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {HOW_IT_WORKS_STEPS.map((step, idx) => (
                            <Card key={idx} hover={false} className="p-6">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6">
                                        {step.icon}
                                    </div>
                                    <div className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-2">
                                        Step {idx + 1}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detailed Timeline */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">
                        Typical Timeline
                    </h2>

                    <div className="space-y-8">
                        <TimelineItem
                            day="Day 1"
                            title="Submit Request"
                            description="Fill out our simple form with details about your objects and requirements."
                            icon={<FileQuestion className="w-6 h-6" />}
                        />
                        <TimelineItem
                            day="Day 2-3"
                            title="Scheduling & Prep"
                            description="We coordinate logistics and prepare our equipment based on your specific needs."
                        />
                        <TimelineItem
                            day="Day 4"
                            title="On-Site Capture"
                            description="Our expert team arrives and captures your objects using professional equipment."
                        />
                        <TimelineItem
                            day="Day 5-7"
                            title="Processing & Quality Check"
                            description="We process the raw data into web-ready 3D models and ensure quality standards."
                        />
                        <TimelineItem
                            day="Day 8"
                            title="Delivery"
                            description="Receive your 3D models with embeddable links, QR codes, and AR capabilities."
                            icon={<CheckCircle className="w-6 h-6" />}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-brand-600 to-brand-700 dark:from-brand-700 dark:to-brand-800 text-white">
                <div className="container mx-auto px-4 text-center max-w-2xl">
                    <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-xl mb-8 text-brand-100">
                        Submit a capture request and we'll handle the rest
                    </p>
                    <Link to="/request">
                        <Button variant="secondary" size="lg">
                            Request Capture <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

interface TimelineItemProps {
    day: string;
    title: string;
    description: string;
    icon?: React.ReactNode;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ day, title, description, icon }) => {
    return (
        <div className="flex gap-6">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0">
                    {icon || <div className="w-3 h-3 rounded-full bg-brand-600 dark:bg-brand-400" />}
                </div>
                <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 mt-2" />
            </div>
            <div className="flex-1 pb-8">
                <div className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-1">{day}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{description}</p>
            </div>
        </div>
    );
};

export default HowItWorks;
