# Analysis TODO Tracker

## Pages/Files Analyzed
- [x] Layout.tsx (header, footer, navigation - shared across all pages)
- [x] Home.tsx (landing page)
- [x] Industry.tsx (industry-specific pages)
- [x] Gallery.tsx (3D asset gallery)
- [x] HowItWorks.tsx (product tutorial)
- [x] Pricing.tsx (platform pricing)
- [x] RestaurantPricing.tsx (restaurant-specific pricing)
- [x] RequestForm.tsx (capture request form)
- [x] Security.tsx (trust center)
- [x] Privacy.tsx (privacy policy)
- [x] Terms.tsx (terms of service)
- [x] Roadmap.tsx (product roadmap)
- [x] Login.tsx (login page)
- [x] NotFound.tsx (404 page)
- [x] ARViewer.tsx (AR viewer)
- [x] index.css (global styles, accessibility, animations)
- [x] SEO.tsx (meta tags component)
- [x] constants.tsx (NAV_ITEMS, HOW_IT_WORKS, INDUSTRIES)
- [x] Accordion.tsx (shared accordion component)
- [x] App.tsx (router configuration)

## Fixes Applied — Round 1

### P0 — Critical ✅
1. [x] Added `<SEO>` component to Home.tsx, Industry.tsx, Gallery.tsx, HowItWorks.tsx — pages now have title/meta tags
2. [x] Fixed `/#contact` dead links on Pricing.tsx — now routes to `/request`
3. [x] Gated demo users in Login.tsx behind `import.meta.env.DEV` — hidden in production
4. [x] Fixed error handling in RequestForm.tsx — removed `setSubmitted(true)` in catch block, shows real error message
5. [x] Fixed `/industries` redirect in Industry.tsx — now goes to `/` instead of non-existent route
6. [x] Added Terms/Privacy hyperlinks in RequestForm.tsx consent checkbox with proper `id`/`htmlFor`

### P1 — High ✅
7. [x] Added contact email (hello@managedcapture.com) to footer in Layout.tsx
8. [x] Unified turnaround time: "5–8 business days" everywhere (Home, HowItWorks, timeline Day 1)
9. [x] Leaned into restaurant positioning: hero headline now "3D dishes for your menu, delivered in days"
10. [x] Updated footer description to "Professional 3D capture for restaurants"
11. [x] Removed "coming soon" quality preview placeholders from RestaurantPricing.tsx
12. [x] Renamed quality levels: "Minimum" → "Standard", "Medium" → "Enhanced", "Best/Premium" → "Premium"
13. [x] Updated Roadmap.tsx dates from 2025 to 2026 (all 4 phases + hero badge)
14. [x] Added Gallery to NAV_ITEMS in constants.tsx + footer Support section
15. [x] Relabeled pricing page CTAs from "Get started" to "Request a quote" (both pricing pages)

### P2 — Medium ✅
16. [x] Renamed "Employee Capture" to "Expert Capture" in constants.tsx
17. [x] Clarified restaurant subtitle: "Our team captures your dishes on-site..."
18. [x] Added "Forgot your password?" link to Login.tsx
19. [x] Fixed dead "Share Model" button in Gallery.tsx — now copies share link to clipboard
20. [x] Removed file path exposure in Gallery.tsx modal fallback
21. [x] Added "No credit card required. Free consultation included." under hero CTAs
22. [x] Changed "no risk" to "no hassle" (Home + HowItWorks) to avoid unsubstantiated claims
23. [x] Changed "exclusively for restaurants" to "Built for restaurants first" (Roadmap)
24. [x] Removed emoji from RequestForm confirmation page
25. [x] Changed "Employee access only. Unauthorized access is prohibited." to friendlier tone on Login.tsx
26. [x] Updated RequestForm confirmation schedule from "24-48 hours" to "a few business days"
27. [x] Updated stats label from "Photographers" to "Capture specialists"
28. [x] Updated RestaurantPricing FAQ to match new quality level names

## Fixes Applied — Round 2 ✅

### Accessibility
29. [x] Added `role="button"`, `tabIndex={0}`, and `onKeyDown` to Gallery.tsx cards (keyboard navigable)
30. [x] Added `role="dialog"`, `aria-modal`, `aria-label` to Gallery.tsx modal
31. [x] Added `Escape` key handler to Gallery.tsx modal for keyboard dismiss

### UX / Friction
32. [x] Added visual "Copied!" feedback to Gallery.tsx share button (was silent)
33. [x] Replaced raw `<details>` elements with `<Accordion>` component on Industry.tsx FAQ (consistent UX across site)
34. [x] Fixed Industry.tsx hero badge: "For Turn your signature items..." → "For Restaurants" (was using full config.title)
35. [x] Fixed Industry.tsx gallery text: "captured for restaurants clients" → "captured for restaurant clients" (grammar)
36. [x] Fixed Industry.tsx permissions text: "the restaurants workflow" → "your restaurant workflow"
37. [x] Updated Industry.tsx FAQ content to match restaurant focus ("objects" → "dishes", added turnaround)
38. [x] Made Login.tsx "Forgot your password?" a real `<a>` mailto link (was a `<p>` with cursor-pointer — dead end)

### Copy Consistency
39. [x] Fixed Pricing.tsx turnaround times: "48h turnaround" → "5–8 day turnaround" (Standard + Complex cards)
40. [x] Updated Home.tsx FAQ: removed "laser scanning" / "sub-millimeter accuracy", rewritten for restaurant context
41. [x] Updated Home.tsx FAQ: "Can I integrate this into my existing website?" → "...website or menu?" with QR focus
42. [x] Fixed RestaurantPricing.tsx FAQ: "quality (A, B, or C)" → "quality (Standard, Enhanced, or Premium)"
43. [x] Fixed RestaurantPricing.tsx FAQ: "published within 48 hours" → "published within 5–8 business days"

### SEO
44. [x] Added `<SEO>` component to Pricing.tsx (was missing — no title/meta)
45. [x] Added `<SEO>` component to RestaurantPricing.tsx (was missing — no title/meta)
46. [x] Added `<SEO>` component to NotFound.tsx (was missing — no title/meta)
47. [x] Fixed SEO.tsx: OG image default pointed to non-existent `/og-image.jpg` — now conditionally rendered
48. [x] Updated SEO.tsx: default description now matches restaurant positioning
49. [x] Fixed SEO.tsx: Twitter card type adapts to whether image is available

### Conversion / Trust
50. [x] Differentiated Pricing.tsx final CTA section: two identical `/request` buttons → "Request a Quote" + "Email Us"
51. [x] Added placeholder text to RequestForm.tsx Step 5 inputs ("Jane Smith", "jane@restaurant.com", "Bistro La Maison")

## Remaining (Not Implemented — Require Content/Business Decisions)
- [ ] Replace stock Astronaut model in Home.tsx hero with real 3D capture example (needs real asset)
- [ ] Replace picsum.photos images in constants.tsx with real food photos (needs real assets)
- [ ] Add GDPR compliance section to Privacy.tsx (needs legal review)
- [ ] Add cookie policy (needs legal review)
- [ ] Expand Security.tsx trust center with actual certifications/details
- [ ] Add second testimonial or case study to Home.tsx (needs real customer)
- [ ] Add `aria-haspopup` and menu roles to nav dropdowns
- [ ] Add focus trap to mobile menu
- [ ] Add structured data (JSON-LD) for FAQ and business info
- [ ] Translate storage GB to approximate item counts on RestaurantPricing.tsx
- [ ] Define what a "menu" means in RestaurantPricing.tsx
