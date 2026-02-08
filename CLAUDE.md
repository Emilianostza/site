# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Managed Capture 3D Platform — a React SPA for a professional 3D photogrammetry services company. The marketing site and client/employee portal are a single application. Data is currently mocked (no real backend).

## Commands

```bash
npm run dev       # Start dev server on http://localhost:3000
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

No test runner or linter is configured.

## Architecture

**Stack:** React 19, TypeScript, Vite 6, Tailwind CSS (loaded via CDN in index.html), React Router 7 (hash-based routing), Lucide React icons.

**Path alias:** `@/*` maps to project root (configured in both tsconfig.json and vite.config.ts).

**Environment variables:** `GEMINI_API_KEY` in `.env.local` — exposed to client as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` via Vite's `define`.

### Key Directories

- `pages/` — Route-level page components. Lazy-loaded in App.tsx via `React.lazy()`.
- `components/` — Shared UI components (Button, Card, Layout, Toast, etc.).
- `components/portal/` — Portal-specific components (Sidebar, ProjectTable, AssetGrid, NewProjectModal).
- `components/devtools/` — CodeInspector dev tool for hovering over components to copy file paths.
- `contexts/` — ThemeContext for dark/light mode (persisted to localStorage, respects system preference).
- `hooks/` — Custom hooks (useToast).
- `services/mockData.ts` — In-memory mock data store with simulated async delays. All project/asset data lives here.
- `types.ts` — Shared TypeScript enums (`Industry`, `ProjectStatus`) and interfaces (`RequestFormState`, `Project`).
- `constants.tsx` — Industry configurations, pricing tiers, and shared constants (contains JSX).

### Routing

All routing is hash-based (`HashRouter`). Two route families:

- **Public routes** (`/`, `/gallery`, `/pricing`, `/how-it-works`, `/request`, `/industries/:type`) — marketing pages wrapped in `Layout` (header + footer).
- **App routes** (`/app/*`, `/portal/*`) — dashboard and editor pages, no Layout wrapper. Portal.tsx handles both employee and customer dashboard views.

### Styling

Tailwind CSS is loaded from CDN with custom theme extensions defined in `index.html`. Custom CSS variables for brand colors are in `index.css`. Dark mode uses the `dark:` variant with the class strategy (toggled on `<html>`). Typography uses Google Fonts: Syne (display) and DM Sans (body).

### Form System

`RequestForm.tsx` implements a 5-step wizard with draft persistence to sessionStorage. Accepts a `?industry=` URL param to pre-select the industry step.

### Deployment

Configured for Netlify via `netlify.toml` (build command: `npm run build`, publish: `dist/`). Works on any static host since it uses hash routing.
