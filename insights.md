# Clarity/Trust/Conversion — Insights Log

---

## 1. Home Page — src/pages/Home.tsx

**Findings:**
- Hero CTA "Start a Request" — vague; visitor doesn't know if it costs money or what happens next
- How It Works CTA "Request a Capture" — same issue
- Testimonial header "What our clients say" uses plural but only one testimonial — creates doubt
- No reassurance text near primary CTA about commitment level

**Visitor questions:** "Will clicking charge me?", "Is this a quote or a purchase?"
**Objections:** Uncertainty, credibility
**CTA + what weakened it:** "Start a Request" → vague action with no outcome signal

**Changes applied:**
1. `Start a Request` → `Get a Free Quote` (hero CTA)
2. `Request a Capture` → `Get a Free Quote` (how-it-works CTA)
3. `What our clients say` → `Client feedback` (neutral when only 1 testimonial)
4. Added: "No credit card required. You'll receive a confirmed quote after a free consultation."

**Why:** Removes payment anxiety and commitment uncertainty at the highest-traffic touchpoint.

---

## 2. Platform Pricing — src/pages/Pricing.tsx

**Findings:**
- All plan CTAs "Get started" link to /request (quote form) — implies self-serve signup that doesn't exist
- Enterprise "Contact Sales" links to `/#contact` — dead end (anchor doesn't exist)
- "Start with a plan" final CTA — misleading
- "Book a visit" — vague about what happens next

**Visitor questions:** "Can I sign up now?", "Where does Contact Sales go?"
**Objections:** Friction (dead link), CTA mismatch

**Changes applied:**
1. `Get started` → `Get a free quote` (all plan CTAs)
2. `/#contact` → `/request` (fixes dead enterprise links)
3. `Start with a plan` → `Request a quote`
4. `Book a visit` → `Request an on-site visit`

**Why:** Eliminates dead-end links and aligns CTA copy with actual user journey.

---

## 3. Restaurant Pricing — src/pages/RestaurantPricing.tsx

**Findings:**
- All plan CTAs "Get started" — same mismatch
- Bottom CTA "Request capture" — vague, no "free" signal

**Changes applied:**
1. `Get started` → `Get a free quote` (all plan CTAs)
2. `Request capture` → `Get a free quote` (bottom CTA)

**Why:** Consistent "free quote" language removes purchase anxiety.

---

## 4. HowItWorks — src/pages/HowItWorks.tsx

**Findings:**
- Hero CTA "Start a Request" — same vagueness
- Bottom CTA "Request a Capture" — same

**Changes applied:**
1. `Start a Request` → `Get a Free Quote`
2. `Request a Capture` → `Get a Free Quote`

**Why:** Consistency with home page; removes commitment ambiguity.

---

## 5. Industry Page — src/pages/Industry.tsx

**Findings:**
- Hero CTA "Request Capture" — vague
- Gallery CTA "Get your own assets captured" — doesn't clarify free/paid

**Changes applied:**
1. `Request Capture` → `Get a Free Quote` (hero and all instances)
2. `Get your own assets captured` → `Get a free quote for your assets`

**Why:** Aligns with site-wide CTA language and clarifies the action is free.

---

## 6. RequestForm — src/pages/RequestForm.tsx

**Findings:**
- Terms/Privacy consent text not linked — visitor can't review what they agree to (trust issue)
- Consent checkbox has no id/htmlFor — accessibility issue that blocks screen reader users
- Submit button "Submit Request" — no reassurance about what happens or cost
- Confirmation heading "Request Confirmed!" — could imply a binding order

**Visitor questions:** "What am I agreeing to?", "Does 'confirmed' mean I'm committed?"
**Objections:** Privacy/trust (unlinked terms), uncertainty (unclear outcome)

**Changes applied:**
1. Added `<Link>` elements for Terms of Service and Privacy Policy in consent text
2. Added `id="consent-checkbox"` and `<label htmlFor>` for accessibility
3. Consent text now reads: "This is a request for a free quote — no payment required."
4. Submit button: `Submit Request` → `Submit Free Quote Request`
5. Confirmation heading: `Request Confirmed!` → `Quote Request Received`

**Why:** Clickable legal links build trust; "free quote" in consent eliminates last-second hesitation; accessible label improves form usability.

---

## 7. Login — src/pages/Login.tsx

**Findings:**
- "Demo Users" section with mock credentials visible in production — severely damages trust
- Shows mock emails (admin@company.com, client@bistro.com) and password "demo" to any visitor

**Visitor questions:** "Is this a real product or just a demo?"
**Objections:** Credibility (demo users visible)

**Changes applied:**
1. Wrapped demo users section in `import.meta.env.DEV` conditional — only visible in development

**Why:** Prevents production visitors from seeing test credentials that undermine product credibility.

---

## 8. Layout (Nav/Footer) — src/components/Layout.tsx

**Findings:**
- Nav CTA "Request Capture" — vague, same as other pages
- Footer claims "SOC 2 Type II Compliant" but Security page only says "SOC 2 Compliant" — inconsistent trust claim
- Footer tagline "Bringing the physical world into the digital age" is generic, not actionable
- No contact email anywhere in footer — reduces trust for visitors seeking human contact

**Changes applied:**
1. `Request Capture` → `Get a Free Quote` (nav, both desktop and mobile)
2. `SOC 2 Type II Compliant` → `SOC 2 Compliant` (aligned with Security page)
3. SOC 2 badge now links to /security page for verification
4. Footer tagline replaced with contact email (hello@managedcapture.com)

**Why:** Consistent claims prevent trust erosion; contact email provides a human touchpoint.

---

## 9. SEO Component — src/components/common/SEO.tsx

**Findings:**
- SITE_ORIGIN uses `managed3d.com` but robots.txt and sitemap use `managedcapture3d.com` — mismatched canonical URLs harm SEO and create confusion

**Changes applied:**
1. `https://managed3d.com` → `https://managedcapture3d.com`

**Why:** Consistent domain prevents canonical URL confusion.

---

## 10. Sitemap — public/sitemap.xml

**Findings:**
- References /industries/museums and /industries/ecommerce which don't exist (only restaurants has config) — crawl errors
- Missing /pricing/platform and /roadmap pages

**Changes applied:**
1. Removed non-existent industry URLs (museums, ecommerce)
2. Added /pricing/platform and /roadmap

**Why:** Eliminates 404 crawl errors and ensures all real pages are discoverable.

---

## 11. Legal Pages — Privacy, Terms, Security

**Findings:**
- Privacy: contact email "privacy@managedcapture.com" is plain text, not clickable
- Terms: no contact information at all
- Security: "security@managedcapture.com" is plain text, not clickable

**Changes applied:**
1. Privacy: email wrapped in `<a href="mailto:...">` with styling
2. Terms: added contact email (legal@managedcapture.com) with mailto link
3. Security: email wrapped in `<a href="mailto:...">` with styling

**Why:** Clickable emails reduce friction for visitors with questions; contact info on legal pages builds trust.

---

## 12. Roadmap — src/pages/Roadmap.tsx

**Findings:**
- Bottom CTA "Get in touch" links to /request but context is "feature request" — mismatch
- No direct contact option for feature feedback

**Changes applied:**
1. Added email contact (hello@managedcapture.com) in the paragraph text
2. CTA: `Get in touch` → `Get a free quote` (aligns with actual destination)

**Why:** Provides a real feedback channel and aligns CTA with destination page.

---

## 13. Gallery, NotFound, Constants — No friction issues

**Reviewed:** Gallery (empty states clear, search/filter functional), NotFound (helpful links, clear recovery path), constants.tsx (content appropriate), index.html (metadata correct). No changes needed — no evidence of friction, confusion, or trust issues.

---
