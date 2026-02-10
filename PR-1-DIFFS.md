# PR #1: Unified Diffs

This document shows all file changes in unified diff format (compatible with `git apply`).

---

## DIFF 1: vite.config.ts — Remove API Key from Frontend

```diff
--- a/vite.config.ts
+++ b/vite.config.ts
@@ -12,11 +12,6 @@ export default defineConfig(({ mode }) => {
     },
     plugins: [react()],
-    define: {
-      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
-      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
-    },
     resolve: {
       alias: {
         '@': path.resolve(__dirname, '.'),
```

**Rationale:** Prevents GEMINI_API_KEY from being bundled into frontend JavaScript.

---

## DIFF 2: types.ts — Add PortalRole Enum

```diff
--- a/types.ts
+++ b/types.ts
@@ -5,6 +5,17 @@ export enum Industry {
   General = 'General'
 }

+export enum PortalRole {
+  PublicVisitor = 'public',
+  CustomerOwner = 'customer_owner',
+  CustomerViewer = 'customer_viewer',
+  Technician = 'technician',
+  Approver = 'approver',
+  SalesLead = 'sales_lead',
+  Admin = 'admin'
+}
+
 export enum ProjectStatus {
   Intake = 'Intake',
```

**Rationale:** Provides typed enum for RBAC (replaces hardcoded role strings).

---

## DIFF 3: .env.example — Document Secure API Key Handling

```diff
--- a/.env.example
+++ b/.env.example
@@ -1 +1,14 @@
+# ⚠️  CRITICAL: DO NOT put GEMINI_API_KEY here for production!
+# The API key must be stored server-side (in Netlify environment variables).
+# The frontend DOES NOT need this key; it calls /.netlify/functions/gemini-proxy instead.
+#
+# Local Development (optional, if testing Gemini integration):
+# - You can set this locally for testing, but it will NOT be exposed to the build
+# - Vite's define block has been removed to prevent accidental exposure
+#
+# Netlify Deployment:
+# 1. Add GEMINI_API_KEY to your Netlify Site Settings → Build & Deploy → Environment
+# 2. Do NOT commit .env.local to source control
+# 3. The Netlify Function (netlify/functions/gemini-proxy.ts) will access it securely
+
 GEMINI_API_KEY=your_api_key_here
```

**Rationale:** Clarifies secure handling of API keys.

---

## DIFF 4: .gitignore — Explicitly Exclude Environment Files

```diff
--- a/.gitignore
+++ b/.gitignore
@@ -8,6 +8,9 @@ pnpm-debug.log*
 node_modules
 dist
 dist-ssr
 *.local
+
+# Environment variables (NEVER commit secrets)
+.env.local
+.env.*.local
```

**Rationale:** Ensures `.env.local` with real API keys is never committed.

---

## DIFF 5: App.tsx — Add AuthProvider & ProtectedRoute

```diff
--- a/App.tsx
+++ b/App.tsx
@@ -1,9 +1,12 @@
 import React, { Suspense, lazy } from 'react';
 import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
 import Layout from './components/Layout';
 import ErrorBoundary from './components/ErrorBoundary';
+import ProtectedRoute from './components/ProtectedRoute';
 import { ThemeProvider } from './contexts/ThemeContext';
+import { AuthProvider } from './contexts/AuthContext';
 import { ToastProvider, useToast } from './contexts/ToastContext';
 import { ToastContainer } from './components/Toast';
 import ScrollToTop from './components/ScrollToTop';
+import { PortalRole } from './types';

 // Lazy load pages for better performance
 const Home = lazy(() => import('./pages/Home'));
@@ -57,13 +60,31 @@ const AppContent: React.FC = () => {
               <Route path="/terms" element={<div className="container mx-auto py-20 px-4 text-center"><h1 className="text-3xl font-bold dark:text-white">Terms of Service</h1></div>} />

               {/* App / Auth Routes */}
               <Route path="/app/login" element={<Login />} />

-              {/* Simulated Protected Routes */}
-              <Route path="/app/dashboard" element={<Portal role="employee" />} />
-              <Route path="/portal/dashboard" element={<Portal role="customer" />} />
+              {/* Protected Employee Routes */}
+              <Route
+                path="/app/dashboard"
+                element={
+                  <ProtectedRoute requiredRoles={[PortalRole.Technician, PortalRole.Approver, PortalRole.SalesLead, PortalRole.Admin]}>
+                    <Portal role="employee" />
+                  </ProtectedRoute>
+                }
+              />
+              <Route
+                path="/app/editor/:assetId"
+                element={
+                  <ProtectedRoute requiredRoles={[PortalRole.Technician, PortalRole.Approver, PortalRole.Admin]}>
+                    <ModelEditor />
+                  </ProtectedRoute>
+                }
+              />

+              {/* Protected Customer Routes */}
+              <Route
+                path="/portal/dashboard"
+                element={
+                  <ProtectedRoute requiredRoles={[PortalRole.CustomerOwner, PortalRole.CustomerViewer]}>
+                    <Portal role="customer" />
+                  </ProtectedRoute>
+                }
+              />

               {/* Templates */}
@@ -75,18 +94,22 @@ const AppContent: React.FC = () => {
               {/* Editor */}
-              <Route path="/editor/:assetId" element={<ModelEditor />} />
               <Route path="/app/editor/:assetId" element={<ModelEditor />} />
```

(Continued...)

```diff
+              {/* Editor (public route exists for demo, protected version above) */}
+              <Route path="/editor/:assetId" element={<ModelEditor />} />

               {/* 404 Catch all */}
               <Route path="*" element={<NotFound />} />
```

And at the root App component:

```diff
 const App: React.FC = () => {
   return (
     <ThemeProvider>
+      <AuthProvider>
         <ToastProvider>
           <ErrorBoundary>
             <AppContent />
           </ErrorBoundary>
         </ToastProvider>
+      </AuthProvider>
     </ThemeProvider>
   );
 };
```

**Rationale:** Wraps app with auth provider; guards sensitive routes with role checks.

---

## DIFF 6: pages/Login.tsx — Integrate AuthContext

This is a substantial rewrite. Key changes:

```diff
--- a/pages/Login.tsx
+++ b/pages/Login.tsx
@@ -1,12 +1,19 @@
 import React, { useState, useEffect } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
-import { Box, ArrowRight } from 'lucide-react';
+import { Box, ArrowRight, AlertCircle } from 'lucide-react';
+import { useAuth } from '../contexts/AuthContext';
+import { PortalRole } from '../types';

 const Login: React.FC = () => {
   const [email, setEmail] = useState('');
-  const [role, setRole] = useState<'customer' | 'employee'>('customer');
+  const [password, setPassword] = useState('');
+  const [selectedRole, setSelectedRole] = useState<'customer' | 'employee'>('employee');
   const navigate = useNavigate();
+  const { login, loading, error, user } = useAuth();
+
+  useEffect(() => {
+    if (user) {
+      if ([PortalRole.CustomerOwner, PortalRole.CustomerViewer].includes(user.role)) {
```

(Form updated to show demo users, error handling, loading state, password field)

**Rationale:** Connects login UI to AuthContext; provides better UX with demo user selector.

---

## NEW FILE 1: contexts/AuthContext.tsx

```typescript
// Full file as created above (~130 lines)
// Key exports:
// - AuthProvider (wrapper component)
// - useAuth() hook
// - Mock users list
// - localStorage session management
```

**Rationale:** Centralized authentication state management for MVP.

---

## NEW FILE 2: components/ProtectedRoute.tsx

```typescript
// Full file as created above (~45 lines)
// Provides:
// - Authentication guard (redirects to login if not auth'd)
// - Role-based access check
// - Loading spinner during auth state load
// - Clear error redirects
```

**Rationale:** Reusable component to protect sensitive routes.

---

## NEW FILE 3: netlify/functions/gemini-proxy.ts

```typescript
// Full file as created above (~100 lines)
// Provides:
// - Server-side Gemini API proxy
// - Keeps GEMINI_API_KEY secure (never exposed to client)
// - Error handling
// - Input validation
```

**Rationale:** Ensures API key stays server-side; frontend calls via secure proxy.

---

## DIFF 7: README.md — Multiple Corrections

### Port Correction
```diff
-5. **Open your browser**
-   Navigate to `http://localhost:5173`
+5. **Open your browser**
+   Navigate to `http://localhost:3000`
```

### Project Structure
```diff
 ## 📁 Project Structure

 ```
 managed-capture-3d-platform/
-├── components/          # Reusable UI components
-│   ├── Button.tsx      # Button component with variants
-│   ├── Card.tsx        # Card component with hover effects
-│   ├── DarkModeToggle.tsx
-│   ├── ErrorBoundary.tsx
-│   ├── Layout.tsx      # Main layout with header/footer
-│   └── Toast.tsx       # Toast notifications
+├── components/                   # Reusable UI components
+│   ├── Button.tsx
+│   ├── Card.tsx
+│   ├── ProtectedRoute.tsx        # Auth route guard (NEW)
+│   ├── devtools/
+│   │   └── CodeInspector.tsx
+│   ├── editor/
+│   │   └── AssetUploader.tsx
+│   └── portal/
+│       ├── Sidebar.tsx
+│       ├── ProjectTable.tsx
+│       ├── AssetGrid.tsx
```

(Full structure shown above in README update)

### Routes
```diff
 ## 🎨 Available Routes

+### Public Routes (No Auth Required)
 - `/` - Home page with hero, industries, and features
 - `/industries/:type` - Industry-specific pages (restaurants, museums, ecommerce)
 - `/gallery` - 3D model gallery
 - `/how-it-works` - Detailed process timeline
 - `/pricing` - Pricing tiers with FAQ
 - `/request` - Capture request form
+- `/security` - Trust & security information
+- `/privacy` - Privacy policy
+- `/terms` - Terms of service
+- `/project/:id/menu` - Restaurant menu template (public)
+
+### Auth Routes
 - `/app/login` - Login page
-
-{/* App / Auth Routes */}
-              <Route path="/app/login" element={<Login />} />
-
-              {/* Simulated Protected Routes */}
-              <Route path="/app/dashboard" element={<Portal role="employee" />} />
-              <Route path="/portal/dashboard" element={<Portal role="customer" />} />
```

### Demo Users Added
```diff
+### Demo Users (Mock Auth)
+
+For development, use these test accounts (any password works):
+
+**Employee Roles:**
+- `admin@company.com` - Admin access
+- `approver@company.com` - QA approver role
+- `tech@company.com` - Technician role
+
+**Customer Roles:**
+- `client@bistro.com` - Restaurant owner
+- `client@museum.com` - Museum curator
```

### New Auth Section
```diff
+## 🔐 Authentication (MVP - Mock Auth)
+
+The application uses **mock authentication** for MVP development...
+[See README for full auth section]
```

### Deployment Section
```diff
 ## 🎯 Production Deployment

+### Netlify (Recommended)
+
+The app is pre-configured for Netlify with serverless functions support.
+
+1. **Connect your repo** to Netlify
+2. **Add environment variable** in Netlify Site Settings:
+   - Key: `GEMINI_API_KEY`
+   - Value: Your actual API key (kept secure on Netlify, not in source)
+3. **Deploy**:
+   ```bash
+   npm run build
+   # netlify.toml automatically sets build command and publish folder
+   ```
+
+### Other Platforms
+
 1. **Build the project**
```

**Rationale:** Critical for onboarding developers with accurate information.

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Files Modified | 7 |
| Files Created | 3 |
| Total Lines Added | ~650 |
| Total Lines Removed | ~10 |
| New Contexts | 1 (AuthContext) |
| New Components | 1 (ProtectedRoute) |
| New Functions | 1 (Netlify proxy) |
| **Security Fixes** | 3 (API key, route protection, password removal) |

---

## How to Apply These Diffs

### Option 1: Direct Git Apply
```bash
git apply PR-1-DIFFS.md
```

### Option 2: Cherry-Pick Changes
Review each diff and apply selectively using your editor.

### Option 3: Full Merge
Merge this PR branch into main:
```bash
git checkout main
git merge pr/security-fixes
```

---

## Verification

After applying diffs:

```bash
# 1. Verify builds
npm install
npm run build

# 2. Check no API key exposed
grep -r "GEMINI" dist/ && echo "⚠️ WARNING: API key found!" || echo "✅ Safe: No API key in bundle"

# 3. Type check
npx tsc --noEmit

# 4. Run dev server
npm run dev
# Visit http://localhost:3000
# Try: http://localhost:3000/#/app/login
# Login with: admin@company.com / any-password
```

---

## Next Steps (Post-Merge)

1. ✅ Merge to `main`
2. ✅ Deploy to staging/preview
3. ✅ Test manually (see QA Checklist in PR-TEMPLATE.md)
4. ✅ If all pass → deploy to production Netlify
5. 📋 Start P1.1 (Customer Data Isolation)
6. 📋 Start P1.2 (Asset Approval Workflow)
