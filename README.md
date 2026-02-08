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

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
managed-capture-3d-platform/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Button component with variants
│   ├── Card.tsx        # Card component with hover effects
│   ├── DarkModeToggle.tsx
│   ├── ErrorBoundary.tsx
│   ├── Layout.tsx      # Main layout with header/footer
│   └── Toast.tsx       # Toast notifications
├── contexts/           # React contexts
│   └── ThemeContext.tsx # Dark mode theme management
├── hooks/              # Custom React hooks
│   └── useToast.tsx    # Toast notification hook
├── pages/              # Page components (routes)
│   ├── Home.tsx
│   ├── Industry.tsx
│   ├── Gallery.tsx
│   ├── RequestForm.tsx
│   ├── Login.tsx
│   ├── Portal.tsx
│   ├── HowItWorks.tsx
│   ├── Pricing.tsx
│   └── NotFound.tsx
├── App.tsx             # Main app with routing
├── constants.tsx       # Shared constants
├── types.ts            # TypeScript types
├── index.css           # Global styles
└── index.html          # HTML entry point
```

## 🎨 Available Routes

- `/` - Home page with hero, industries, and features
- `/industries/:type` - Industry-specific pages (restaurants, museums, ecommerce)
- `/gallery` - 3D model gallery
- `/how-it-works` - Detailed process timeline
- `/pricing` - Pricing tiers with FAQ
- `/request` - Capture request form
- `/app/login` - Login page
- `/app/dashboard` - Employee dashboard
- `/portal/dashboard` - Customer portal
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

1. **Build the project**
   ```bash
   npm run build
   ```

2. **The `dist/` folder** contains the production-ready files

3. **Deploy** to your favorite hosting service:
   - Netlify (includes `netlify.toml`)
   - Vercel
   - GitHub Pages
   - Any static hosting service

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
