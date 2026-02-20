# UX/Trust/Conversion Insights

Iteratively updated after reviewing each page/flow/file.

---

## 1. Layout.tsx (Header / Footer / Navigation)

### Confusion & Friction Phrases
- **Nav item "Restaurants"** links to `/industries/restaurants` — first-time visitors don't know this is an industry vertical, not a product. They may think they're on a food site.
- **Footer: "We digitize the physical world."** — vague. A restaurant owner scanning the footer doesn't connect this to their menu or food.
- **Footer: "SOC 2 Type II Compliant"** — good trust badge, but no link to a certificate or audit report to verify.

### Visitor Questions
- "What industries do you serve besides restaurants?" (only one listed in nav + footer)
- "Where's the contact page? How do I email or call someone?" (no contact info anywhere in header/footer)
- "Is there a Gallery or portfolio link in the main nav?" (Gallery is absent from NAV_ITEMS)

### Concerns/Objections
- **No phone number, no physical address, no chat widget** — the only "contact" is buried as an email on the Security page. This is a major trust killer for enterprise buyers.
- **Footer "Industries" section only lists "Restaurants"** — makes the company look tiny or incomplete. If more industries are planned, the section draws attention to the gap.

### CTA Weaknesses
- Header CTA "Request Capture" is strong but competes with "Log in" right next to it. Low friction, but the label "Request Capture" may confuse someone who doesn't yet know what "capture" means.

### Missing Trust Signals
- No phone number, physical address, or registered company info in footer.
- No "Contact Us" page or link.
- No social media links.
- SOC 2 badge has no link to verify.

### UX/UI Friction
- Desktop dropdown menus use CSS `group-hover` only — no click-to-open, which fails on touch laptops.
- Mobile menu has no focus trap — keyboard users can Tab behind the overlay.

### Accessibility
- Mobile hamburger `aria-label` is good. Dropdown menus lack `aria-haspopup` and `role="menu"` for screen readers.
- Footer link lists lack `aria-label` on the `<nav>` wrappers (they aren't wrapped in `<nav>`).

### SEO
- No `<SEO>` component used in Layout. Pages that forget to include `<SEO>` will have no `<title>` or `<meta description>`.

---

## 2. Home.tsx (Landing Page)

### Confusion & Friction Phrases
- **"Expert 3D capture, delivered to you."** — "Expert" is a self-claim. Visitors ask: "expert by whose standards?" Missing proof.
- **"production-ready 3D & AR assets in under a week"** — but the How-It-Works section below says **"Typical turnaround: 5–8 business days"** — these conflict. "Under a week" = less than 5 days. "5–8 business days" = possibly 8 days. Contradictory.
- **Stats: "500+ Photographers" / "10k+ Projects delivered"** — are these real or aspirational? If real, they're powerful but unverifiable — no logos, no case studies, no link to proof.
- **"3 EU countries"** — reads as a limitation, not a feature. Three countries is small.
- **"Now serving EU — Estonia · Greece · France"** — this badge at the top makes the company seem niche/regional, not global. Visitors outside these countries may immediately bounce.

### Visitor Questions
- "What does this cost?" (no pricing hint on homepage)
- "Can I see real examples of YOUR work?" (the hero uses a stock Astronaut GLB from Google, not actual client work)
- "What industries do you serve?" (homepage talks about restaurants only in the roadmap teaser)

### Concerns/Objections
- **The 3D model in the hero is a stock astronaut** — this is the first thing prospects see. It screams "demo" not "we do real work." A real food scan or product scan would be 10x more credible.
- **Single testimonial** — only one quote, from "Marie-Claire D." with no photo, no company name (just "Restaurant Group"), no verifiable identity. Looks fabricated.
- **"All built for restaurants"** in the roadmap teaser — confuses visitors who came for general 3D capture. Is this product for restaurants only?

### CTA Analysis
- Primary CTA: "Start a Request" — good. Secondary: "See Examples" links to `/industries/restaurants`, not a gallery.
- How-It-Works section adds a second "Request a Capture" CTA — consistent, no conflict.
- FAQ links to Pricing page — good.
- **Missing**: No CTA to talk to a human. No "Book a demo" or "Talk to us" anywhere.

### Missing Trust Signals
- No client logos.
- No case study links.
- One unverifiable testimonial.
- Stock 3D model in hero instead of real work.
- No mention of money-back guarantee or "no credit card required" on the homepage CTAs.
- No social proof badges (G2, Trustpilot, etc.)

### UX/UI Friction
- FAQ section has only 4 questions — doesn't address pricing, security, or data ownership.
- Roadmap teaser says "All built for restaurants" — this creates identity confusion on a page that earlier positioned itself as a general 3D capture service.

### Accessibility
- No `<SEO>` component on the Home page — no `<title>` or meta description set.
- `<model-viewer>` has good `alt` text.
- Stats strip has no semantic structure (no `<dl>` / `<dt>` / `<dd>`).

### SEO
- **Critical: No `<SEO>` component** — the most important page has no title tag or meta description.
- No H1 structure issue (h1 exists), but h2s are fine.

---

## 3. Industry.tsx (/industries/restaurants)

### Confusion & Friction Phrases
- **Title: "Turn your signature items into interactive 3D"** — vague "interactive 3D" doesn't tell restaurants what the actual deliverable is (3D models? AR menus? QR codes?).
- **"Managed capture by employees + web/AR-ready delivery for menus and marketing."** — "managed capture by employees" is confusing. Whose employees? Theirs or yours? The word "employees" appears to reference the company's capture staff but reads as if the restaurant's own employees do the capturing.

### Visitor Questions
- "How much does this cost for my restaurant?" (no pricing shown)
- "What does a finished 3D dish actually look like?" (sample images are stock photos from picsum.photos, not real 3D renders or screenshots)
- "Can I click on these samples to see them in 3D?" (the gallery items are static images with an Eye icon overlay, but no 3D interaction)

### Concerns/Objections
- **All images are random stock photos** from picsum.photos — "Signature Burger" shows a random photo, not an actual 3D model of a burger. This destroys credibility.
- **Permissions section** uses Shield icons with labels like "Edit title/description/tags" — these are backend capabilities, not customer benefits. Restaurants don't care about "Create/revoke share links" as a selling point.

### CTA Analysis
- "Request Capture" is the hero CTA — consistent with the header.
- "See Examples" anchor scrolls to the gallery section — good.
- Gallery bottom CTA "Get your own assets captured" — decent.
- **No pricing CTA** on this page at all.

### Missing Trust Signals
- Zero real images or 3D models — all stock photos.
- No testimonials or case studies specific to restaurants.
- No mention of pricing or "free consultation."
- No FAQ about restaurant-specific concerns (food freshness during scanning, disruption to service, etc.).

### UX/UI Friction
- Redirect on invalid industry type goes to `/industries` which doesn't exist as a page — it will 404 or redirect to home (since `Navigate to="/industries" replace` and there's no route for `/industries`).
- FAQ section uses native `<details>`/`<summary>` instead of the Accordion component used elsewhere — inconsistent behavior.

### Accessibility
- No `<SEO>` component — no title/meta.
- Images have alt text set to `config.title` (the headline, not a description of the image).

---

## 4. Gallery.tsx (/gallery)

### Confusion & Friction Phrases
- **"Click any model to interact with it in 3D/AR"** — but clicking opens a modal that may show "Model preview not available in this demo environment" with a local file path exposed.

### Visitor Questions
- "Are these real models or placeholders?" (assets load from data provider — could be empty)
- "Why does the viewer say 'not available'?" (file paths exposed in error states)

### Concerns/Objections
- **Exposes local file paths** in the "model not available" fallback: `(Local file path: {selectedAsset.file_key})` — this leaks internal implementation details to visitors.
- **Default file size "3MB"** hardcoded as fallback — misleading if actual size differs.

### CTA Analysis
- Modal has "View in AR" and "Share Model" buttons — "Share Model" has no `onClick` handler, it's a dead button.

### Missing Trust Signals
- No indication of how many models exist.
- Empty state says "No models found" but doesn't explain that this is normal for a public demo.

### UX/UI Friction
- **"Share Model" button does nothing** — no handler, dead end.
- Category filters come from data — if no assets exist, the filter bar shows only "All" with nothing below.
- Modal doesn't trap focus for accessibility.

### Accessibility
- Search input lacks a `<label>` — only has `placeholder`.
- Modal close button has good `aria-label`.
- Gallery cards use `onClick` on `div` without `role="button"` or keyboard handling.

---

## 5. HowItWorks.tsx (/how-it-works)

### Confusion & Friction Phrases
- **"No equipment, no expertise, no risk on your end."** — "no risk" is a bold claim with no backing. What if they're unhappy? What's the refund policy?
- **"A typical project ships in 8 business days."** — but the homepage says "under a week" — conflict.
- **"One revision round included"** — what happens if the revision isn't enough? This is a concern trigger.

### Visitor Questions
- "What if I need more than one revision?" (only one included — no mention of cost for additional rounds)
- "What happens if I'm not satisfied?" (no guarantee mentioned)
- "Does the 2-hour confirmation actually happen?" (Day 1 promises "confirms within 2 hours" — skepticism)

### Concerns/Objections
- Timeline is optimistic — "Day 1: confirms within 2 hours" sets a high bar that, if unmet, damages trust.
- "One revision round included" — visitors immediately worry about being locked in if the first result is bad.

### CTA Analysis
- Hero: "Start a Request" + "View Sample Assets" — clean dual CTA.
- Bottom: "Request a Capture" + "View Pricing" — good.
- **No "no credit card required"** or risk-reversal language near CTAs.

### Missing Trust Signals
- No satisfaction guarantee.
- No "what if" FAQ for bad outcomes.
- No example of before/after or quality comparison.

---

## 6. Pricing.tsx (/pricing/platform)

### Confusion & Friction Phrases
- **Two completely separate pricing pages exist**: `/pricing` (RestaurantPricing) and `/pricing/platform` (Pricing). The nav links to `/pricing`. A visitor clicking "Pricing" in the nav sees restaurant-specific pricing, not the platform plans. The platform pricing page is effectively hidden.
- **"Simple, transparent pricing"** — then shows a complex system of subscriptions + per-item capture + overage tiers + add-ons + credit packs. This is the opposite of "simple."
- **"+ €1.50 per 1,000 overage views"** — overage math requires mental effort. Not "simple."
- **"Contact Sales" CTA links to `/#contact`** — this anchor doesn't exist on the homepage. Dead link.

### Visitor Questions
- "What's my total monthly cost going to be?" (requires mental math across subscription + capture + overages)
- "Why are there TWO pricing pages?" (confusing navigation)
- "How do I contact sales?" (the link goes nowhere)

### Concerns/Objections
- **Pricing complexity** — subscription + per-item + overage + credit packs + add-ons = 5 pricing dimensions. This creates analysis paralysis.
- **No free tier or trial** — barriers to entry. "Get started" buttons link to the Request form, not a sign-up flow.
- **"Get started" on pricing cards goes to /request** — but the request form is for capture requests, not platform sign-up. Confusing intent mismatch.

### CTA Analysis
- "Get started" on each plan goes to `/request` — this is the capture request form, not a checkout flow. Visitor expects to start using the platform, not fill out a 5-step form about objects.
- "Contact Sales" goes to `/#contact` — dead link.
- "Start with a plan" at the bottom — also goes to `/request`. Same problem.

### Missing Trust Signals
- No "money-back guarantee" or "cancel anytime."
- No comparison to competitors.
- No "trusted by X restaurants" or social proof.
- Billing examples are helpful but don't mention taxes/VAT.

### UX/UI Friction
- Grid uses `xl:grid-cols-4` but only 3 plans — the 4th column is empty, creating an asymmetric layout on XL screens.
- Massive page length — user must scroll through 7 sections to reach the FAQ.

---

## 7. RestaurantPricing.tsx (/pricing — the DEFAULT pricing page)

### Confusion & Friction Phrases
- **"Level A — Minimum"** as a quality label — calling your cheapest tier "Minimum" quality is self-defeating. No one wants to pay for "minimum" quality food photos.
- **"3D model preview: coming soon"** — placeholder boxes in the quality comparison section with "coming soon" text. This is embarrassing on a live pricing page.
- **"Per-menu subscription"** — what exactly is a "menu"? One physical menu? One location? The term is undefined.

### Visitor Questions
- "What does Level A actually look like vs Level C?" (placeholders say 'coming soon')
- "What is a 'menu' in subscription terms?" (undefined unit)
- "Why does the cheapest plan have 'Minimum' quality?" (insults the buyer)
- "How many items can my 2 GB of storage hold?" (no translation of GB to item count)

### Concerns/Objections
- **Quality names create buyer doubt**: "Minimum" → "am I getting bad models?" Renaming to "Standard" / "Enhanced" / "Premium" would remove self-inflicted doubt.
- **"coming soon" placeholders** — visitors see this and think the product isn't ready. Major trust damage.
- **13 add-ons with individual setup fees** — overwhelming. Each add-on has a one-time fee AND a monthly fee. Mental overload.
- **Storage in GB means nothing** to a restaurant owner. Translate to "~50 dishes" or similar.

### CTA Analysis
- "Get started" goes to `/request` — same issue as platform pricing. Not a checkout flow.

### Missing Trust Signals
- Quality comparison has empty placeholder boxes instead of real examples.
- No ROI calculator ("3D menus increase conversions by X%").
- No competitor comparison.

---

## 8. RequestForm.tsx (/request)

### Confusion & Friction Phrases
- **"Which industry describes you best?"** — only 2 options: "Restaurant" and "General." If someone is in retail, real estate, or another industry, "General" feels dismissive.
- **Checkbox text: "I agree to the Terms of Service and Privacy Policy"** — these are not linked. The text says "Terms of Service and Privacy Policy" as plain text with no clickable links.
- **"💡 Keep an eye on your email"** — uses an emoji, inconsistent with the rest of the professional dark-mode brand.

### Visitor Questions
- "Is this a binding quote or just an inquiry?" (the "No commitment required" box helps, but the submit button says "Submit Request" — "request" sounds more binding than "inquiry")
- "How long until I hear back?" (confirmation says "24–48 hours" but the How-It-Works page says "confirms within 2 hours" — contradiction)
- "Why do I need to fill 5 steps just to ask for a quote?" (friction)

### Concerns/Objections
- **5-step wizard for a lead form** — this is a lot of friction for a first contact. Many competitors let you submit name + email + "tell us about your project" in one step.
- **On submit error, the form silently shows success anyway**: `catch (error) { ... setSubmitted(true); // For demo purposes, still show success }` — this masks real failures and would mislead users in production.
- **Step 4 "What do you need?"** requires selecting deliverables — but a new visitor may not know what "Hosted Viewer Link" vs "Website Embed Code" means. Jargon-heavy.

### CTA Analysis
- "Submit Request" + live cost estimate sidebar — the estimate is a good feature.
- **After submission, only CTA is "Return Home"** — missed opportunity to offer "Book a call" or "See our portfolio."

### Missing Trust Signals
- Terms & Privacy checkbox text is not hyperlinked.
- No "we'll never share your email" or GDPR reassurance.
- No indication of response SLA commitment beyond confirmation page text.

### UX/UI Friction
- 5 steps for a lead capture form — high abandonment risk.
- Step 3 "Country" is a free-text input — should be a dropdown/searchable select for EU countries.
- No way to save progress and return later (draft is in sessionStorage, not persisted).
- Materials field (Step 2) is present in the form state but never shown in the UI — ghost field.

### Accessibility
- Checkbox with `required` but no `id`/`htmlFor` link to label.
- Select buttons in Step 2 (quantity) have no `aria-pressed` state.
- Error messages appear but aren't linked to inputs via `aria-describedby`.

---

## 9. Security.tsx (/security — Trust Center)

### Confusion & Friction Phrases
- **"Security is at the core of everything we build."** — generic corporate language that every company says. No specifics.
- **"We adhere to strict security controls and audit procedures."** — which ones? No certifications named beyond "SOC 2 Compliant."
- **"We operate a bug bounty program for responsible disclosure."** — but no link to the program, no scope, no reward range.

### Visitor Questions
- "Can I see your SOC 2 report?" (no download or request link)
- "What cloud provider do you use?" ("enterprise-grade cloud providers" — unnamed)
- "Is my data stored in the EU?" (GDPR compliance not mentioned)
- "Do you have a DPA (Data Processing Agreement)?" (not mentioned)

### Concerns/Objections
- **Page is extremely thin** — 3 cards + 2 paragraphs. This is supposed to be the "Trust Center" but contains almost no substantive information.
- **No certifications beyond SOC 2** — no GDPR, no ISO 27001, no DPA.
- **No link to verify SOC 2** — just a claim.
- **Bug bounty "program"** — no link, no details. Looks like a placeholder.

### Missing Trust Signals
- No audit report download / request form.
- No GDPR compliance statement (critical for EU company).
- No DPA availability.
- No uptime SLA numbers.
- No data residency information.
- No penetration test attestation.
- No named cloud provider / data center locations.

---

## 10. Privacy.tsx & Terms.tsx

### Concerns/Objections
- **Skeleton pages** — Privacy has only 3 sections, Terms has only 3 sections. Both are clearly placeholder-grade legal pages, not real legal documents.
- **Privacy page doesn't mention GDPR** — critical for an EU-based company.
- **No cookie policy** — required by EU law.
- **No data retention periods** mentioned.
- **Terms page lacks**: limitation of liability, refund/cancellation policy, payment terms, IP ownership of captured assets, SLA.

### Missing Trust Signals
- Contact email provided (privacy@managedcapture.com, security@managedcapture.com) — but these are the ONLY contact points in the entire site. No phone, no address.

---

## 11. Roadmap.tsx (/roadmap)

### Confusion & Friction Phrases
- **"Product Roadmap · 2025"** — it's 2026 now. The roadmap is outdated. Phases show Q1-Q4 2025.
- **"Q2 · Intelligence — In Progress"** — if this was Q2 2025 and it's now 2026, this looks abandoned.
- **"Every single one built exclusively for restaurants"** — confirms the single-industry focus, which conflicts with the homepage positioning as a general 3D capture service.

### Visitor Questions
- "Is this company still alive?" (roadmap dates are a year old)
- "If everything is 'built for restaurants,' why does the pricing page show a general platform?"

### Concerns/Objections
- **Outdated roadmap = trust killer.** Planned features from Q3-Q4 2025 should be live or updated by now.
- **Confirms identity crisis**: homepage says "Expert 3D capture" (general), roadmap says "exclusively for restaurants."

### CTA Analysis
- CTA "Get in touch" goes to `/request` — but the context is "feature request," not "capture request." Mismatch.

---

## 12. Login.tsx (/app/login)

### Confusion & Friction Phrases
- **"Demo Users" section** with actual email addresses and auto-fill passwords — this is a development feature exposed to production. Visitors see `admin@company.com` with password "demo." This is a massive credibility and security concern.
- **"Employee access only. Unauthorized access is prohibited."** — threatening language on a login page.

### Visitor Questions
- "Can I create an account?" (no sign-up option)
- "What are these demo users doing on a real login page?" (confusion/mistrust)
- "I forgot my password — what do I do?" (no forgot password link)

### CTA Analysis
- **No sign-up flow** — the form is login-only. New customers have no way to create an account.
- **No "Forgot password?"** link.

### Missing Trust Signals
- Demo credentials on a production page.
- No sign-up path.

---

## 13. NotFound.tsx (404)

### Friction
- Minimal — the page is well-constructed with clear navigation back to home and gallery.
- Links to Restaurants and Request Capture are helpful.

---

## 14. ARViewer.tsx (/view/:assetId)

### Friction
- Falls back to stock Astronaut model if asset not found — visitors may see generic content instead of relevant 3D.
- "Back to gallery" link is the only navigation — no CTA to request their own capture.

---

## 15. SEO.tsx (Meta Component)

### Issues
- Default description: "Managed Capture 3D Platform - Create and share immersive AR experiences." — generic. Doesn't mention key value props.
- **Not used on Home.tsx** — the most important page has NO title tag or meta description.
- Not used on Industry.tsx, Gallery.tsx, or HowItWorks.tsx either.
- `og:image` defaults to `/og-image.jpg` — need to verify this file exists.

---

## 16. index.css & Styles

### Accessibility Positives
- Has `prefers-reduced-motion` media query.
- Has `prefers-contrast: high` styles.
- Has focus-visible ring styles.

### Potential Issues
- Many animations (fade, slide, blur) — could cause motion sickness if reduced-motion is not properly respected in all JS-driven animations (scroll reveal, etc.).

---

## 17. Constants (NAV_ITEMS, HOW_IT_WORKS_STEPS, INDUSTRIES)

### Issues
- **NAV_ITEMS lacks Gallery** — the gallery page exists but isn't in the main navigation.
- **Only one industry** defined (restaurants) — the Industries section in the footer and nav draws attention to this limitation.
- **HOW_IT_WORKS_STEPS step 2 says "Employee Capture"** — confusing terminology. "Employee" could mean the client's employee. Should say "Our Team" or "Expert Capture."

---

---

# CROSS-CUTTING ISSUES (Sitewide)

## 1. Identity Crisis: Restaurant-Specific vs. General 3D
- Homepage hero: generic "Expert 3D capture" positioning
- Homepage roadmap teaser: "All built for restaurants"
- Roadmap page: "exclusively for restaurants"
- Pricing nav link → Restaurant pricing (not platform pricing)
- Request form: only "Restaurant" and "General" as options
- **Fix**: Decide on positioning and be consistent. If restaurants are the primary audience, lean into it everywhere. If it's a general platform, remove "exclusively for restaurants."

## 2. No Contact Method
- No contact page
- No contact form
- No phone number
- No physical address
- No chat widget
- Only contact info: two email addresses buried in Privacy and Security pages
- **Fix**: Add a contact page with email, phone, and optionally a form. Add contact link to footer and header.

## 3. "Contact Sales" Dead Link
- Pricing pages link to `/#contact` — this anchor does not exist. Dead link.
- **Fix**: Create a contact section on the homepage or a dedicated contact page.

## 4. Stock/Placeholder Content on Live Pages
- Hero 3D model: stock Astronaut from Google
- Industry page images: random picsum.photos stock
- Restaurant pricing quality comparison: "3D model preview: coming soon"
- Login page: demo users with real email addresses
- **Fix**: Replace all stock content with real examples. Remove demo users from production. Add real 3D model previews.

## 5. Turnaround Time Contradictions
- Homepage: "under a week"
- How-It-Works: "5–8 business days"
- How-It-Works: "typical project ships in 8 business days"
- Request confirmation: "schedule within 24–48 hours"
- How-It-Works timeline Day 1: "confirms within 2 hours"
- **Fix**: Unify to one consistent message. "5–8 business days" is the most defensible.

## 6. Request Form ≠ Sign-Up
- Every "Get started" button on pricing pages goes to `/request` — a 5-step capture request form.
- There is no actual sign-up or checkout flow.
- Visitors expect to start using a platform, not fill out a lengthy form.
- **Fix**: Either create a sign-up flow, or relabel buttons to "Request a Quote" to set correct expectations.

## 7. SEO Gaps
- Home, Industry, Gallery, HowItWorks pages lack `<SEO>` component — no title/meta.
- SPA without SSR means search engines may not index content properly.
- No structured data (JSON-LD) for business, FAQ, or pricing.

## 8. Accessibility Gaps
- Gallery cards are clickable `div`s without keyboard support.
- Form inputs lack `aria-describedby` for error messages.
- Mobile menu lacks focus trap.
- Nav dropdowns lack ARIA menu roles.
- Tables on pricing pages lack `scope` attributes on `th` elements.

## 9. Missing Trust Signals (Sitewide)
- No client logos
- No case studies
- One unverifiable testimonial
- No video testimonials
- No satisfaction guarantee
- No "cancel anytime" messaging
- No GDPR compliance page
- No cookie consent banner
- No social proof (review site badges)
- No team/about page
- No registered company information

## 10. Two Pricing Pages, One Nav Link
- `/pricing` → Restaurant-specific pricing (linked from nav)
- `/pricing/platform` → Platform pricing (hidden, only reachable from restaurant pricing footer CTA)
- **Fix**: Merge into one pricing page with tabs, or add both to nav with clear labels.
