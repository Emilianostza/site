import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Box, Utensils, Landmark, ShoppingBag } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../constants';
import Accordion from '../components/Accordion';

const Home: React.FC = () => {
  return (
    <div {...(import.meta.env.DEV && { 'data-component': 'Home Page', 'data-file': 'src/pages/Home.tsx' })}>
      {/* Hero */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/hero_bg/1600/900')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>

        <div className="relative container mx-auto px-4 py-24 md:py-32 max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            We send experts to capture your objects in 3D
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Get web and AR-ready 3D models delivered by our managed service.
            Publish instantly via links, embeds, and QR codes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/request"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-600 font-bold text-lg hover:bg-brand-500 transition-all flex items-center justify-center gap-2"
            >
              Request Capture <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/gallery"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-800 border border-slate-700 font-bold text-lg hover:bg-slate-700 transition-all"
            >
              See Demos
            </Link>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tailored for your industry</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our capture pipelines are optimized for the specific needs of different sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/industries/restaurants" className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Restaurants</h3>
              <p className="text-slate-600 mb-4">
                Interactive menus and 3D food delivery assets.
              </p>
              <span className="text-brand-600 font-semibold text-sm flex items-center gap-1">
                Learn more <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link to="/industries/museums" className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Museums</h3>
              <p className="text-slate-600 mb-4">
                Archival quality digitization with access control.
              </p>
              <span className="text-brand-600 font-semibold text-sm flex items-center gap-1">
                Learn more <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link to="/industries/ecommerce" className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">E-commerce</h3>
              <p className="text-slate-600 mb-4">
                High-fidelity product models for increased conversion.
              </p>
              <span className="text-brand-600 font-semibold text-sm flex items-center gap-1">
                Learn more <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Managed Capture Process</h2>
            <p className="text-slate-600">We handle the complexity of 3D creation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-brand-600 mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </div>
                {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-px bg-slate-300 -z-10"></div>
                )}
              </div>
            ))}
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
                title: "How does the capture process work?",
                content: <p>We handle everything from logistics to processing. You simply request a capture, our team comes to your location (or you ship items to us), we scan your objects, and deliver web-ready 3D models within days.</p>
              },
              {
                title: "What is the quality of the 3D models?",
                content: <p>We provide high-fidelity, photorealistic 3D models optimized for web and AR. Our pipelines use advanced photogrammetry and laser scanning to ensure sub-millimeter accuracy and realistic textures.</p>
              },
              {
                title: "Do I need an app to view the models?",
                content: <p>No app required! Our 3D viewer runs directly in any modern web browser. For AR experiences on mobile, it uses native iOS (QuickLook) and Android (Scene Viewer) capabilities.</p>
              },
              {
                title: "Can I integrate this into my existing website?",
                content: <p>Yes, we provide a simple generic embed code (iframe) or a React component that you can drop into any website. It works with Shopify, WordPress, Squarespace, and custom stacks.</p>
              }
            ]}
          />
          <div className="mt-10 text-center">
            <Link to="/pricing" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              See more FAQs on our Pricing page
            </Link>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Mock Logos */}
            <div className="text-2xl font-bold font-serif">Louvre<span className="text-brand-600">Digital</span></div>
            <div className="text-2xl font-bold font-sans tracking-tighter">NIKE<span className="italic font-light">LAB</span></div>
            <div className="text-2xl font-bold font-mono">UBER<span className="text-green-600">EATS</span></div>
            <div className="text-2xl font-bold">Shopify<span className="font-light">Plus</span></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;