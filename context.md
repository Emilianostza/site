# Analysis Context

## Goal
Improving clarity, trust, and conversions on the Managed Capture 3D Platform website by analyzing the exact content and design provided in the source files.

## What We're Looking For (per page/flow)
- Exact phrases causing confusion, doubt, or friction
- Questions visitors will ask at each point
- Concerns/objections triggered (risk, credibility, pricing, effort, time, uncertainty)
- Primary CTA and anything weakening it
- Missing trust signals (proof, specifics, guarantees, process clarity, contact legitimacy)
- UX/UI friction (hierarchy, readability, spacing, mobile, navigation, dead ends)
- Accessibility issues creating friction (contrast, headings, labels, keyboard/focus, alt text)
- SEO/performance basics harming confidence or discovery

## Project Type
- React 19 SPA with React Router v7
- Vite build, Tailwind CSS v3
- Supabase auth, Three.js/Model Viewer for 3D/AR

## Key Public Pages to Analyze
1. Home.tsx (/)
2. Industry.tsx (/industries/:type)
3. Gallery.tsx (/gallery)
4. HowItWorks.tsx (/how-it-works)
5. Pricing.tsx (/pricing/platform)
6. RestaurantPricing.tsx (/pricing)
7. RequestForm.tsx (/request)
8. Privacy.tsx (/privacy)
9. Terms.tsx (/terms)
10. Security.tsx (/security)
11. Roadmap.tsx (/roadmap)
12. Layout.tsx (header/footer/nav - shared)
13. Login.tsx (/app/login)
14. NotFound.tsx (404)
15. ARViewer.tsx (/view/:assetId)

## Key Shared Components to Analyze
- Layout.tsx (header, footer, nav)
- Button.tsx, Input.tsx, Select.tsx, Textarea.tsx
- SEO.tsx
- Modal.tsx, Accordion.tsx
- index.css (styles, animations, accessibility)
