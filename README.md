<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Managed Capture 3D Platform

> Professional 3D capture services for enterprise. We digitize the physical world.

A modern, full-featured web application for managing professional 3D photogrammetry services.  Built with React, TypeScript, and Vite.

## ✨ Features

- **🎨 Modern UI/UX** - Beautiful, responsive design with smooth animations
- **🌙 Dark Mode** - Full dark mode support with persistent user preference
- **⚡ Performance** - Lazy loading routes, code splitting, and optimized bundle size
- **📱 Responsive** - Mobile-first design that works on all devices
- **♿ Accessible** - WCAG compliant with keyboard navigation and screen reader support
- **🎯 Industry-Specific** - Tailored solutions for restaurants, museums, and e-commerce
- **💼 Enterprise Ready** - Error boundaries, TypeScript, and production-ready code

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd managed-capture-3d-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (for local development)
   ```bash
   cp .env.example .env.local
   ```
   ⚠️ **Important:** The `.env.local` file should NOT be committed to source control.
   - For production (Netlify): Add `GEMINI_API_KEY` to your Netlify environment variables (Site Settings > Build & Deploy > Environment)
   - For local development: You can set it here, but it will not be exposed to the frontend bundle
   - The frontend calls `/.netlify/functions/gemini-proxy` for secure API access

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Users (Mock Auth)

For development, use these test accounts (any password works):

**Employee Roles:**
- `admin@company.com` - Admin access
- `approver@company.com` - QA approver role
- `tech@company.com` - Technician role

**Customer Roles:**
- `client@bistro.com` - Restaurant owner
- `client@museum.com` - Museum curator

## 📁 Project Structure

```
managed-capture-3d-platform/
├── components/                   # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── DarkModeToggle.tsx
│   ├── ErrorBoundary.tsx
│   ├── Layout.tsx
│   ├── Toast.tsx
│   ├── Modal.tsx
│   ├── Accordion.tsx
│   ├── ProtectedRoute.tsx        # Auth route guard (NEW)
│   ├── Gatekeeper.tsx            # (Deprecated - to be removed)
│   ├── devtools/
│   │   └── CodeInspector.tsx
│   ├── editor/
│   │   └── AssetUploader.tsx
│   └── portal/
│       ├── Sidebar.tsx
│       ├── ProjectTable.tsx
│       ├── AssetGrid.tsx
│       ├── NewProjectModal.tsx
│       ├── ProjectProgress.tsx
│       └── ActivityFeed.tsx
├── contexts/                     # React contexts
│   ├── ThemeContext.tsx          # Dark mode theme
│   ├── ToastContext.tsx          # Toast notifications
│   └── AuthContext.tsx           # Authentication (NEW)
├── hooks/
│   └── useToast.tsx
├── pages/                        # Route page components
│   ├── Home.tsx
│   ├── Industry.tsx
│   ├── Gallery.tsx
│   ├── RequestForm.tsx
│   ├── Login.tsx                 # Updated to use AuthContext
│   ├── Portal.tsx                # Employee & Customer dashboards
│   ├── HowItWorks.tsx
│   ├── Pricing.tsx
│   ├── NotFound.tsx
│   ├── editor/
│   │   └── ModelEditor.tsx       # 3D model editor
│   └── templates/
│       └── RestaurantMenu.tsx
├── services/
│   └── mockData.ts               # Mock API (in-memory)
├── netlify/functions/            # Netlify serverless functions
│   └── gemini-proxy.ts           # Gemini API proxy (NEW)
├── App.tsx                       # Main routing & context providers
├── constants.tsx                 # Shared constants & configs
├── types.ts                      # TypeScript types & enums
├── index.tsx                     # React entry point
├── index.css                     # Global styles
└── index.html                    # HTML template
```

## 🎨 Available Routes

### Public Routes (No Auth Required)
- `/` - Home page with hero, industries, and features
- `/industries/:type` - Industry-specific pages (restaurants, museums, ecommerce)
- `/gallery` - Public 3D model gallery
- `/how-it-works` - Detailed process timeline
- `/pricing` - Pricing tiers with FAQ
- `/request` - Capture request form
- `/security` - Trust & security information
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/project/:id/menu` - Restaurant menu template (public)

### Auth Routes
- `/app/login` - Login page (redirects to dashboard if already authenticated)

### Protected Employee Routes (Require Authentication + Employee Role)
- `/app/dashboard` - Employee operations dashboard (stats, pipeline)
- `/app/editor/:assetId` - 3D model editor & asset uploader
- `/editor/:assetId` - Demo version (no auth required, for testing)

### Protected Customer Routes (Require Authentication + Customer Role)
- `/portal/dashboard` - Customer portal (project tracking, asset downloads)

### Fallback
- `*` - Custom 404 page

## 🛠️ Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Authentication (MVP - Mock Auth)

The application uses **mock authentication** for MVP development. This is NOT production-ready.

### How Auth Works
1. User navigates to `/app/login`
2. Enters any email address from the demo user list (see Quick Start section)
3. Enters any password (mock auth doesn't validate passwords)
4. Session persists in localStorage for 24 hours
5. Protected routes redirect to login if user is not authenticated
6. User is redirected based on role:
   - **Employee roles** → `/app/dashboard`
   - **Customer roles** → `/portal/dashboard`

### Key Files
- `contexts/AuthContext.tsx` - Mock auth provider & hook
- `components/ProtectedRoute.tsx` - Route guard component
- `pages/Login.tsx` - Login UI with demo user selector

### Important Notes
- ⚠️ **This is mock auth**: No real password validation, no backend API
- All user data is in-memory; lost on page refresh
- For production: Replace with real auth (Supabase, Firebase, Clerk, etc.)
- The demo user list is in `AuthContext.tsx` lines 24–44; customize as needed

## 🌙 Dark Mode

The application includes a fully functional dark mode with:
- System preference detection
- Manual toggle in header
- localStorage persistence
- Smooth theme transitions
- Complete dark mode styling across all components

## 📦 Key Dependencies

- **React 19** - UI library
- **React Router 7** - Client-side routing
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS (via CDN)
- **Lucide React** - Icon library

## 🎯 Production Deployment

### Netlify (Recommended)

The app is pre-configured for Netlify with serverless functions support.

1. **Connect your repo** to Netlify
2. **Add environment variable** in Netlify Site Settings:
   - Key: `GEMINI_API_KEY`
   - Value: Your actual API key (kept secure on Netlify, not in source)
3. **Deploy**:
   ```bash
   npm run build
   # netlify.toml automatically sets build command and publish folder
   ```

The `netlify/functions/gemini-proxy.ts` function will securely proxy API calls from the frontend, keeping the API key server-side only.

### Other Platforms

1. **Build the project**
   ```bash
   npm run build
   ```

2. **The `dist/` folder** contains the production-ready files

3. **Deploy** to your favorite hosting service:
   - Vercel
   - GitHub Pages
   - Any static hosting service

**Note:** If not using Netlify, you'll need to:
- Set up your own API proxy (to keep GEMINI_API_KEY server-side)
- Or use a different auth provider (Firebase, Supabase, etc.)

## 🔧 Troubleshooting

### Development Server Won't Start
- Ensure Node.js v18+ is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Dark Mode Not Persisting
- Check browser localStorage is enabled
- Clear browser cache and try again

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

## 📝 Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# Gemini API Key for AI features
GEMINI_API_KEY=your_api_key_here
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [View in AI Studio](https://ai.studio/apps/drive/1zW4-d6ryX0ZZ-C4BSoSOeJETd9oGOPXF)
- [Report Issues](https://github.com/your-repo/issues)
- [Documentation](https://github.com/your-repo/wiki)

---

<div align="center">
Made with ❤️ by the Managed Capture Team
</div>
