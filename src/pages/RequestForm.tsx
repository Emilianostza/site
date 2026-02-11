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
import { Industry, RequestFormState, ProjectStatus } from '@/types';
import { Check, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { ProjectsProvider } from '@/services/dataProvider';

const INITIAL_STATE: RequestFormState = {
  industry: '',
  quantity_range: '',
  object_size_range: '',
  materials: [],
  location_mode: '',
  country: '',
  preferred_window: '',
  deliverables: [],
  contact: { full_name: '', email: '', company: '' }
};

const RequestForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RequestFormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);

  // Initialize industry from URL param
  // Session Storage Key
  const STORAGE_KEY = 'managed_capture_request_draft';

  // Initialize from storage or URL
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved draft");
      }
    }

    const params = new URLSearchParams(location.search);
    const ind = params.get('industry');
    if (ind) {
      if (ind === 'restaurants') setFormData(prev => ({ ...prev, industry: Industry.Restaurant }));
      else if (ind === 'museums') setFormData(prev => ({ ...prev, industry: Industry.Museum }));
      else if (ind === 'ecommerce') setFormData(prev => ({ ...prev, industry: Industry.Ecommerce }));
    }
  }, [location.search]);

  // Persist to storage on change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Generic Type Safe Update
  const updateField = <K extends keyof RequestFormState>(
    field: K,
    value: RequestFormState[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateContact = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  };

  const toggleArrayField = (field: 'materials' | 'deliverables', value: string) => {
    setFormData(prev => {
      const arr = prev[field];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(i => i !== value) };
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
      setStep(prev => prev + 1);
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
      await ProjectsProvider.create({
        name: `${formData.industry} Capture Request`,
        client: formData.contact.company,
        type: 'standard',
        status: ProjectStatus.Requested,
        phone: '', // Optional
        address: formData.country // Using country as address for now
      });

      sessionStorage.removeItem(STORAGE_KEY); // Clear draft
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Failed to click submit", error);
      // Fallback or error handling if needed
      setSubmitted(true); // For demo purposes, still show success
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-2xl min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div>
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
            <Check className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Request Received</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
            Thank you, {formData.contact.full_name}. We have received your capture request for {formData.industry}.
            Our operations team will review your requirements and contact you at {formData.contact.email} within 24 hours.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12" {...(import.meta.env.DEV && { 'data-component': 'Request Form', 'data-file': 'src/pages/RequestForm.tsx' })}>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
            <span>Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}% Complete</span>
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Which industry describes you best?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[Industry.Restaurant, Industry.Museum, Industry.Ecommerce].map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => updateField('industry', ind)}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${formData.industry === ind
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-500'
                        }`}
                    >
                      <span className="font-bold text-lg block mb-1 text-slate-900 dark:text-white">{ind}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {ind === Industry.Restaurant && "Menu items & food"}
                        {ind === Industry.Museum && "Artifacts & collections"}
                        {ind === Industry.Ecommerce && "Retail products"}
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Project Scope</h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">How many items?</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['1-10', '11-50', '51-200', '200+'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField('quantity_range', opt)}
                        className={`py-3 px-4 rounded-lg border text-sm font-medium ${formData.quantity_range === opt ? 'bg-brand-600 text-white border-brand-600' : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Approximate Size</label>
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
                  {errors.object_size_range && <p className="text-red-600 text-sm mt-1">{errors.object_size_range}</p>}
                </div>

                {formData.industry === Industry.Museum && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <label className="block text-sm font-bold text-amber-900 mb-2">Handling Sensitivity</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-amber-900">
                        <input type="radio" name="sensitivity" value="standard" onChange={(e) => updateField('handling_sensitivity', e.target.value)} /> Standard
                      </label>
                      <label className="flex items-center gap-2 text-amber-900">
                        <input type="radio" name="sensitivity" value="fragile" onChange={(e) => updateField('handling_sensitivity', e.target.value)} /> Fragile
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Logistics */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Logistics</h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Capture Location</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => updateField('location_mode', 'on_site')}
                      className={`flex-1 py-4 px-4 rounded-xl border-2 font-bold text-slate-900 dark:text-white ${formData.location_mode === 'on_site' ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700'
                        }`}
                    >
                      On-site (We come to you)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('location_mode', 'ship_in')}
                      className={`flex-1 py-4 px-4 rounded-xl border-2 font-bold text-slate-900 dark:text-white ${formData.location_mode === 'ship_in' ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700'
                        }`}
                    >
                      Ship-in (You send to us)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Country</label>
                  <input
                    type="text"
                    placeholder="e.g. United States, France..."
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                  />
                  {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country}</p>}
                </div>
              </div>
            )}

            {/* Step 4: Deliverables */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Deliverables</h2>
                <p className="text-slate-500 dark:text-slate-400">Select what you need delivered.</p>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'hosted_viewer_link', label: 'Hosted Viewer Link (Web)' },
                    { id: 'website_embed', label: 'Website Embed Code (iFrame)' },
                    { id: 'ar_ios_usdz', label: 'AR File for iOS (.usdz)' },
                    { id: 'ar_android_glb', label: 'AR File for Android (.glb)' },
                    { id: 'downloads_bundle', label: 'Raw Asset Bundle' },
                    { id: 'qr_codes', label: 'QR Codes' },
                  ].map((item) => (
                    <label key={item.id} className="flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                        checked={formData.deliverables.includes(item.id)}
                        onChange={() => toggleArrayField('deliverables', item.id)}
                      />
                      <span className="ml-3 font-medium text-slate-900 dark:text-white">{item.label}</span>
                    </label>
                  ))}
                </div>
                {errors.deliverables && (
                  <p className="flex items-center text-red-600 text-sm mt-2">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.deliverables}
                  </p>
                )}

                {formData.industry === Industry.Museum && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Default Access Control</label>
                    <select
                      className="w-full p-3 border border-slate-300 rounded-lg"
                      onChange={(e) => updateField('museum_access_control', e.target.value)}
                    >
                      <option value="public">Public (Searchable)</option>
                      <option value="unlisted">Unlisted (Link only)</option>
                      <option value="restricted">Restricted (Login required)</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Contact */}
            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Final Step</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                      value={formData.contact.full_name}
                      onChange={(e) => updateContact('full_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Email</label>
                    <input
                      type="email"
                      required
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                      value={formData.contact.email}
                      onChange={(e) => updateContact('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company / Organization</label>
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
                  <span>I agree to the Terms of Service and Privacy Policy. I understand this is a request for a quote and consultation.</span>
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex justify-between items-center mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 font-medium"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </button>
              ) : <div></div>}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors"
                >
                  Next Step <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                  Submit Request
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;