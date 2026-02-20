/**
 * Request Form - Lead Capture & Draft Management
 *
 * PHASE 3 Integration Points:
 * 1. Replace manual sessionStorage with useDraftRequest() hook
 * 2. On submit: POST to submitRequest() with idempotency key
 * 3. Error handling: Show retry + failure state UX
 * 4. Success: clearDraft() + show confirmation
 *
 * Example Phase 3 implementation:
 *
 * const { draft, saveDraft, clearDraft, isExpired } = useDraftRequest();
 * const [submitting, setSubmitting] = useState(false);
 * const [error, setError] = useState<string | null>(null);
 *
 * const handleSubmit = async () => {
 *   try {
 *     setSubmitting(true);
 *     const idempotencyKey = crypto.randomUUID();
 *     const response = await submitRequest({
 *       requester_name: formData.contact.full_name,
 *       requester_email: formData.contact.email,
 *       // ... map other fields
 *     }, idempotencyKey);
 *
 *     clearDraft(); // Only after success
 *     setSubmitted(true);
 *   } catch (err) {
 *     setError(err.message);
 *     // Show retry button
 *   } finally {
 *     setSubmitting(false);
 *   }
 * };
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Industry, RequestFormState } from '@/types';
import { ProjectStatus } from '@/types/domain';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  ArrowRight,
  Globe,
  Code2,
  Smartphone,
  Tablet,
  Package,
  QrCode,
  Receipt,
  MapPin,
  Camera,
  Sparkles,
} from 'lucide-react';
import { ProjectsProvider } from '@/services/dataProvider';

// ─── Pricing Engine ──────────────────────────────────────────────────────────
const QTY_RANGES: Record<string, [number, number]> = {
  '1-10': [1, 10],
  '11-50': [11, 50],
  '51-200': [51, 200],
  '200+': [200, 500],
};

const RESTAURANT_PLANS = [
  { name: 'Standard', monthly: 18, maxMid: 5, views: '1,000', storage: '2 GB' },
  { name: 'Pro', monthly: 35, maxMid: 30, views: '2,000', storage: '8 GB' },
  { name: 'Ultra', monthly: 48, maxMid: 9999, views: '5,000', storage: '25 GB' },
];

const CAPTURE_RATES = {
  restaurant: { perItem: 20, onSiteVisit: 100 },
  general: { standard: 290, complex: 490, onSitePerDay: 900, itemsPerDay: 8 },
};

const batchDiscount = (qty: number) => (qty >= 100 ? 0.25 : qty >= 25 ? 0.2 : qty >= 10 ? 0.1 : 0);

const fmtEur = (n: number) => `€${Math.round(n).toLocaleString('en')}`;

// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_STATE: RequestFormState = {
  industry: '',
  quantity_range: '',
  object_size_range: '',
  materials: [],
  location_mode: '',
  country: '',
  preferred_window: '',
  deliverables: [],
  contact: { full_name: '', email: '', company: '' },
};

const RequestForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RequestFormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initialize industry from URL param
  // Session Storage Key
  const STORAGE_KEY = 'managed_capture_request_draft';

  // Initialize from storage or URL
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch {
        console.error('Failed to parse saved draft');
      }
    }

    const params = new URLSearchParams(location.search);
    const ind = params.get('industry');
    if (ind === 'restaurants') {
      setFormData((prev) => ({ ...prev, industry: Industry.Restaurant }));
    }
  }, [location.search]);

  // Persist to storage on change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Generic Type Safe Update
  function updateField<K extends keyof RequestFormState>(field: K, value: RequestFormState[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  const updateContact = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  };

  const toggleArrayField = (field: 'materials' | 'deliverables', value: string) => {
    setFormData((prev) => {
      const arr = prev[field];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((i) => i !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.industry) {
        newErrors.industry = 'Please select an industry to continue.';
        isValid = false;
      }
    }

    if (currentStep === 2) {
      if (!formData.quantity_range) {
        newErrors.quantity_range = 'Please select a quantity range.';
        isValid = false;
      }
      if (!formData.object_size_range) {
        newErrors.object_size_range = 'Please select an approximate size.';
        isValid = false;
      }
    }

    if (currentStep === 3) {
      if (!formData.location_mode) {
        newErrors.location_mode = 'Please select a capture location preference.';
        isValid = false;
      }
      if (!formData.country.trim()) {
        newErrors.country = 'Please enter your country.';
        isValid = false;
      }
    }

    if (currentStep === 4) {
      if (formData.deliverables.length === 0) {
        newErrors.deliverables = 'Please select at least one deliverable.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Step 5
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!formData.contact.full_name.trim()) {
      newErrors.full_name = 'Full name is required.';
      isValid = false;
    }
    if (!formData.contact.email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }
    if (!formData.contact.company.trim()) {
      newErrors.company = 'Company name is required.';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    // Create Project via Provider
    try {
      setSubmitting(true);
      await ProjectsProvider.create({
        name: `${formData.industry} Capture Request`,
        client: formData.contact.company,
        type: 'standard',
        status: ProjectStatus.Pending,
        phone: '', // Optional
        address: formData.country, // Using country as address for now
      });

      sessionStorage.removeItem(STORAGE_KEY); // Clear draft
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Failed to click submit', error);
      // Fallback or error handling if needed
      setSubmitted(true); // For demo purposes, still show success
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 dark:text-green-400">
              <Check className="w-10 h-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Request Confirmed!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
              Thank you, <span className="font-semibold">{formData.contact.full_name}</span>.
              We&apos;ve received your {formData.industry} capture request.
            </p>

            <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">What happens next:</h3>
              <ul className="space-y-2 text-left text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 font-bold flex-shrink-0 mt-0.5">1.</span>
                  <span>Our operations team reviews your requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 font-bold flex-shrink-0 mt-0.5">2.</span>
                  <span>
                    We contact you at{' '}
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {formData.contact.email}
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-600 font-bold flex-shrink-0 mt-0.5">3.</span>
                  <span>We schedule your capture session within 24–48 hours</span>
                </li>
              </ul>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              💡 Keep an eye on your email for next steps. No spam, just updates about your project.
            </p>

            <button
              onClick={() => navigate('/')}
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-all shadow-lg hover:shadow-2xl hover:scale-105 active:scale-100"
            >
              Return Home{' '}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Estimate computation ──────────────────────────────────────────────────
  const qtyRange = QTY_RANGES[formData.quantity_range];
  const [qtyLo, qtyHi] = qtyRange ?? [0, 0];
  const qtyMid = qtyRange ? Math.round((qtyLo + qtyHi) / 2) : 0;
  const hasQty = Boolean(qtyRange);
  const isCustomQty = formData.quantity_range === '200+';
  const isRestaurant = formData.industry === Industry.Restaurant;
  const isGeneral = formData.industry === Industry.General;
  const isComplex = ['large', 'oversized'].includes(formData.object_size_range);
  const isOnSite = formData.location_mode === 'on_site';

  const captureRate = isRestaurant
    ? CAPTURE_RATES.restaurant.perItem
    : isComplex
      ? CAPTURE_RATES.general.complex
      : CAPTURE_RATES.general.standard;

  const captureLo = hasQty ? Math.round(qtyLo * captureRate * (1 - batchDiscount(qtyHi))) : 0;
  const captureHi = hasQty ? Math.round(qtyHi * captureRate * (1 - batchDiscount(qtyLo))) : 0;
  const captureDiscountPct = hasQty ? Math.round(batchDiscount(qtyMid) * 100) : 0;

  const onSiteLo = isRestaurant
    ? CAPTURE_RATES.restaurant.onSiteVisit
    : Math.ceil(qtyLo / CAPTURE_RATES.general.itemsPerDay) * CAPTURE_RATES.general.onSitePerDay;
  const onSiteHi = isRestaurant
    ? CAPTURE_RATES.restaurant.onSiteVisit
    : Math.ceil(qtyHi / CAPTURE_RATES.general.itemsPerDay) * CAPTURE_RATES.general.onSitePerDay;

  const plan =
    isRestaurant && hasQty
      ? (RESTAURANT_PLANS.find((p) => qtyMid <= p.maxMid) ?? RESTAURANT_PLANS[2])
      : null;

  const totalLo = captureLo + (isOnSite && hasQty ? onSiteLo : 0);
  const totalHi = captureHi + (isOnSite && hasQty ? onSiteHi : 0);

  const hasEstimate = (isRestaurant || isGeneral) && hasQty;
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12"
      {...(import.meta.env.DEV && {
        'data-component': 'Request Form',
        'data-file': 'src/pages/RequestForm.tsx',
      })}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_308px] gap-8 items-start">
          {/* ── Left column: progress + form ── */}
          <div>
            <div className="mb-10">
              <div className="flex items-center justify-between text-sm mb-3">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Step {step} of 5</span>
                  <span className="text-slate-500 dark:text-slate-400 ml-2">
                    {step === 1 && 'Tell us about your project'}
                    {step === 2 && 'Define your scope'}
                    {step === 3 && 'Choose your logistics'}
                    {step === 4 && 'Select deliverables'}
                    {step === 5 && 'Confirm your details'}
                  </span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  {Math.round((step / 5) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${(step / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Industry */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Which industry describes you best?
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        We tailor our service to your specific needs.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
                      {[Industry.Restaurant, Industry.General].map((ind) => (
                        <button
                          key={ind}
                          type="button"
                          onClick={() => updateField('industry', ind)}
                          className={`group p-6 rounded-xl border-2 text-left transition-all hover:scale-105 active:scale-100 ${
                            formData.industry === ind
                              ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20 shadow-lg shadow-brand-500/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-500 hover:shadow-md'
                          }`}
                        >
                          <span className="font-bold text-lg block mb-1 text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {ind}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {ind === Industry.Restaurant && 'Menu items & food'}
                            {ind === Industry.General && 'Any other objects'}
                          </span>
                        </button>
                      ))}
                    </div>
                    {errors.industry && (
                      <p className="flex items-center text-red-600 text-sm mt-2">
                        <AlertCircle className="w-4 h-4 mr-1" /> {errors.industry}
                      </p>
                    )}
                  </div>
                )}

                {/* Step 2: Scope */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Project Scope
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Help us understand the scale and size of what we&apos;re capturing.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        How many items?
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['1-10', '11-50', '51-200', '200+'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => updateField('quantity_range', opt)}
                            className={`py-3 px-4 rounded-lg border text-sm font-medium ${
                              formData.quantity_range === opt
                                ? 'bg-brand-600 text-white border-brand-600'
                                : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Approximate Size
                      </label>
                      <select
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        value={formData.object_size_range}
                        onChange={(e) => updateField('object_size_range', e.target.value)}
                      >
                        <option value="">Select a size...</option>
                        <option value="small">Small (Handheld / Jewelry)</option>
                        <option value="medium">Medium (Tabletop / Shoes / Plates)</option>
                        <option value="large">Large (Furniture / Statues)</option>
                        <option value="oversized">Oversized (Vehicle / Room)</option>
                      </select>
                      {errors.object_size_range && (
                        <p className="text-red-600 text-sm mt-1">{errors.object_size_range}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Logistics */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Logistics
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Tell us where we'll capture and where to send the results.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Capture Location
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => updateField('location_mode', 'on_site')}
                          className={`flex-1 py-4 px-4 rounded-xl border-2 font-bold text-slate-900 dark:text-white ${
                            formData.location_mode === 'on_site'
                              ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          On-site (We come to you)
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField('location_mode', 'ship_in')}
                          className={`flex-1 py-4 px-4 rounded-xl border-2 font-bold text-slate-900 dark:text-white ${
                            formData.location_mode === 'ship_in'
                              ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          Ship-in (You send to us)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. United States, France..."
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                        value={formData.country}
                        onChange={(e) => updateField('country', e.target.value)}
                      />
                      {errors.country && (
                        <p className="text-red-600 text-sm mt-1">{errors.country}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Deliverables */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        What do you need?
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Select the formats and tools you&apos;ll use to deliver the 3D experience.
                      </p>
                    </div>

                    {/* Sharing & Embedding */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                        Sharing & Embedding
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          {
                            id: 'hosted_viewer_link',
                            label: 'Hosted Viewer Link',
                            desc: 'Direct link to your 3D model — no setup required',
                            icon: Globe,
                            badge: 'Most popular',
                          },
                          {
                            id: 'website_embed',
                            label: 'Website Embed Code',
                            desc: 'iFrame for Shopify, WordPress, or custom sites',
                            icon: Code2,
                          },
                        ].map(({ id, label, desc, icon: Icon, badge }) => {
                          const selected = formData.deliverables.includes(id);
                          return (
                            <label
                              key={id}
                              className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                selected
                                  ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20 shadow-sm'
                                  : 'border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={selected}
                                onChange={() => toggleArrayField('deliverables', id)}
                              />
                              <div
                                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                  selected
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-slate-900 dark:text-white text-sm">
                                    {label}
                                  </span>
                                  {badge && (
                                    <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                                      {badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                  {desc}
                                </p>
                              </div>
                              {selected && (
                                <Check className="absolute top-3 right-3 w-4 h-4 text-brand-600 flex-shrink-0" />
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* AR Experiences */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                        AR Experiences
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          {
                            id: 'ar_ios_usdz',
                            label: 'AR for iOS',
                            desc: 'QuickLook (.usdz) — place models in your space with iPhone or iPad',
                            icon: Smartphone,
                            tag: 'iPhone / iPad',
                          },
                          {
                            id: 'ar_android_glb',
                            label: 'AR for Android',
                            desc: 'Scene Viewer (.glb) — works natively on most Android devices',
                            icon: Tablet,
                            tag: 'Android',
                          },
                        ].map(({ id, label, desc, icon: Icon, tag }) => {
                          const selected = formData.deliverables.includes(id);
                          return (
                            <label
                              key={id}
                              className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                selected
                                  ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20 shadow-sm'
                                  : 'border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={selected}
                                onChange={() => toggleArrayField('deliverables', id)}
                              />
                              <div
                                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                  selected
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-grow min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-slate-900 dark:text-white text-sm">
                                    {label}
                                  </span>
                                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                                    {tag}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                  {desc}
                                </p>
                              </div>
                              {selected && (
                                <Check className="absolute top-3 right-3 w-4 h-4 text-brand-600 flex-shrink-0" />
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Files & Print */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                        Files & Print
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          {
                            id: 'downloads_bundle',
                            label: 'Raw Files Bundle',
                            desc: 'OBJ, FBX, and other formats — ready for game engines or pipelines',
                            icon: Package,
                          },
                          {
                            id: 'qr_codes',
                            label: 'QR Codes',
                            desc: 'Printable QR links — ideal for packaging, labels, or in-store displays',
                            icon: QrCode,
                          },
                        ].map(({ id, label, desc, icon: Icon }) => {
                          const selected = formData.deliverables.includes(id);
                          return (
                            <label
                              key={id}
                              className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                selected
                                  ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20 shadow-sm'
                                  : 'border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={selected}
                                onChange={() => toggleArrayField('deliverables', id)}
                              />
                              <div
                                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                  selected
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-grow min-w-0">
                                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                                  {label}
                                </span>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                  {desc}
                                </p>
                              </div>
                              {selected && (
                                <Check className="absolute top-3 right-3 w-4 h-4 text-brand-600 flex-shrink-0" />
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {errors.deliverables && (
                      <p className="flex items-center text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" /> {errors.deliverables}
                      </p>
                    )}
                  </div>
                )}

                {/* Step 5: Contact */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Let&apos;s Connect
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        We&apos;ll use this to contact you about your request and next steps.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                          value={formData.contact.full_name}
                          onChange={(e) => updateContact('full_name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Business Email
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                          value={formData.contact.email}
                          onChange={(e) => updateContact('email', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Company / Organization
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                          value={formData.contact.company}
                          onChange={(e) => updateContact('company', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 mt-4">
                      <input type="checkbox" required className="mt-1" />
                      <span>
                        I agree to the Terms of Service and Privacy Policy. I understand this is a
                        request for a quote and consultation.
                      </span>
                    </div>
                  </div>
                )}

                {/* Navigation Actions */}
                <div className="flex justify-between items-center mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 font-medium"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="group flex items-center bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-100"
                    >
                      Next Step{' '}
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group flex items-center bg-brand-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Request{' '}
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
            {/* /form card */}
          </div>
          {/* /left column */}

          {/* ── Right column: Cost Estimate ── */}
          <div className="lg:sticky lg:top-8 space-y-4">
            {/* Estimate card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 bg-gradient-to-br from-brand-600 to-brand-700">
                <div className="flex items-center gap-2 mb-2">
                  <Receipt className="w-4 h-4 text-white/80" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                    Your Estimate
                  </span>
                </div>
                {hasEstimate && !isCustomQty ? (
                  <>
                    <p className="text-2xl font-bold text-white">
                      {fmtEur(totalLo)}
                      {totalHi > totalLo && (
                        <span className="text-lg font-medium text-white/70">
                          {' '}
                          – {fmtEur(totalHi)}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-white/60 mt-0.5">one-time capture</p>
                  </>
                ) : hasEstimate && isCustomQty ? (
                  <>
                    <p className="text-xl font-bold text-white">Custom Pricing</p>
                    <p className="text-xs text-white/60 mt-0.5">tailored for your volume</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold text-white/60">Complete the form</p>
                    <p className="text-xs text-white/40 mt-0.5">to preview your cost</p>
                  </>
                )}
              </div>

              {/* Line items */}
              <div className="px-5 pt-4 pb-2 space-y-1">
                {/* Capture row */}
                <div className="flex items-start justify-between gap-2 py-2.5 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Camera className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        3D Capture
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {hasEstimate
                          ? isCustomQty
                            ? 'Volume quote on request'
                            : `${fmtEur(captureRate)}/item${captureDiscountPct > 0 ? ` · ${captureDiscountPct}% batch discount` : ''}`
                          : formData.industry
                            ? isRestaurant
                              ? 'Starting €20/item'
                              : isComplex
                                ? 'Complex items · €490/item'
                                : 'Standard items · €290/item'
                            : 'Select scope to preview'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white flex-shrink-0 pt-0.5">
                    {hasEstimate && !isCustomQty
                      ? `${fmtEur(captureLo)}${captureHi > captureLo ? ` – ${fmtEur(captureHi)}` : ''}`
                      : hasEstimate
                        ? 'Custom'
                        : '—'}
                  </span>
                </div>

                {/* On-site row */}
                <div
                  className={`flex items-start justify-between gap-2 py-2.5 border-b border-slate-100 dark:border-slate-700 transition-opacity ${
                    isOnSite && hasEstimate ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        On-site Visit
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {isRestaurant ? '€100 / visit' : '€900 / day + travel'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white flex-shrink-0 pt-0.5">
                    {isOnSite && hasEstimate && !isCustomQty
                      ? onSiteLo === onSiteHi
                        ? fmtEur(onSiteLo)
                        : `${fmtEur(onSiteLo)} – ${fmtEur(onSiteHi)}`
                      : isOnSite && hasEstimate
                        ? 'Custom'
                        : '—'}
                  </span>
                </div>

                {/* Platform plan row (restaurant only) */}
                <div
                  className={`flex items-start justify-between gap-2 py-2.5 transition-opacity ${
                    plan ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {plan ? `${plan.name} Plan` : 'Platform Plan'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {plan
                          ? `${plan.views} views · ${plan.storage} storage`
                          : isGeneral
                            ? 'Contact us for pricing'
                            : 'Select scope to recommend'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0 pt-0.5">
                    {plan ? `€${plan.monthly}/mo` : isGeneral ? 'Custom' : '—'}
                  </span>
                </div>
              </div>

              {/* Total footer */}
              {hasEstimate && (
                <div className="mx-5 mb-5 mt-1 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 px-4 py-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Total (one-time)
                    </span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {isCustomQty ? 'Get a quote' : `from ${fmtEur(totalLo)}`}
                    </span>
                  </div>
                  {plan && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      + {`€${plan.monthly}/mo`} platform subscription
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* No-commitment note */}
            <div className="rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 px-4 py-3">
              <p className="text-xs font-semibold text-brand-700 dark:text-brand-300 mb-0.5">
                No commitment required
              </p>
              <p className="text-xs text-brand-600/80 dark:text-brand-400/80 leading-relaxed">
                This is a planning estimate. You&apos;ll receive a confirmed quote after a free
                consultation with our team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
