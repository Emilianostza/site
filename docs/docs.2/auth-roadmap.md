# Authentication Roadmap

This document outlines the strategy for implementing authentication and authorization in the Managed Capture 3D Platform (capture performed by dedicated employees; customers can access only the content that has been delivered to them).

## Phase 1: Foundation (Frontend)

- [ ] **Type Definitions**: Define `User`, `Role`, `Tenant`, and `AuthState` interfaces/enums in `types.ts`.
  ```
  Role       = Admin | Employee | Client
  Tenant     = { id, name, createdAt }
  User       = { id, email, name, role, tenantId }
  AuthState  = { user: User | null, isLoading: boolean, isAuthenticated: boolean }
  ```
- [ ] **Context Setup**: Create `AuthContext` + `AuthProvider` in `contexts/AuthContext.tsx` to manage user state globally (user, role, tenant scope).
- [ ] **Mock Auth Service**: Create `services/authService.ts` with login, logout, getCurrentSession, and mock user data. Design the interface to match the Supabase Auth API shape so the swap in Phase 3 is minimal.
- [ ] **Session Persistence**: Store session in localStorage on login; restore on app load. Show a loading state while bootstrapping so protected UI never flashes.
- [ ] **Login Page**: Update `pages/Login.tsx` to call the mock auth service via AuthContext instead of raw navigation.
- [ ] **Protected Routes**: Create `components/ProtectedRoute.tsx` to gate access by authentication status and role. Redirect unauthenticated users to `/app/login`.
- [ ] **Route Wiring**: Apply `ProtectedRoute` in `App.tsx`:
  - `/app/dashboard` — Employee and Admin only
  - `/portal/dashboard` — Client only
  - `/app/login` — public (redirect if already authenticated)
  - `/editor/*`, `/templates/*` — Employee and Admin only
- [ ] **Gatekeeper Disposition**: Deprecate `components/Gatekeeper.tsx` once real auth is in place. If site-preview gating is still needed, keep it as a separate concern outside the auth system.

## Phase 2: Role-Based Access Control (RBAC)

- [ ] **Roles & Capabilities**:
  - **Admin**: Manage employees, clients, roles/permissions, and global settings; audit access.
  - **Employee**: Create client accounts, manage capture projects, upload captures, deliver assets to clients.
  - **Client**: Access only delivered assets/projects; limited edits to permitted metadata.
- [ ] **Permission Map**: Create a `permissions.ts` mapping roles to allowed actions/routes. UI components check this map (but never rely on UI checks alone for security).
- [ ] **Admin Bootstrap**: Add an admin login path or seed mechanism (first admin created via env variable or CLI script; no self-serve admin creation).
- [ ] **Account Provisioning** (employee-created client accounts):
  - [ ] Employee UI to create a new client account and assign to a tenant.
  - [ ] Invitation/welcome email trigger (stubbed in mock, wired in Phase 3).
  - [ ] Client first-login / password-set flow.
  - [ ] Tenant assignment validation during account creation.
- [ ] **Role-Based Redirects**: After login, redirect based on role — Client to `/portal/dashboard`, Employee/Admin to `/app/dashboard`.
- [ ] **Context-Driven UI**: Refactor `Portal.tsx` and `Sidebar.tsx` to read role from AuthContext instead of props. Implement functional logout in Sidebar.
- [ ] **Content Scoping**: Filter all data queries by `tenantId` — clients see only assets explicitly delivered to them.

## Phase 3: Backend Integration (Supabase)

Supabase Auth + Postgres is the chosen backend. It provides auth, database, row-level security, and storage in one platform — a direct fit for tenant-scoped asset delivery.

- [ ] **Supabase Project Setup**: Create project, configure auth providers (email/password at minimum), set up environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
- [ ] **API Client**: Create an authenticated HTTP/Supabase client with:
  - Automatic auth header injection (Bearer token).
  - Response interceptors for 401 (redirect to login) and 403 (show access denied).
  - Base URL configuration per environment.
- [ ] **Replace Mock Services**: Swap `services/authService.ts` mock implementations for real Supabase Auth calls (signIn, signOut, getSession, onAuthStateChange).
- [ ] **Token Management**: Use Supabase's built-in session handling (stores tokens in localStorage by default; supports refresh). Evaluate HttpOnly cookie mode for production.
- [ ] **Database Schema**: Define tables for tenants, users, roles, membership, and delivery records (who received which asset, when).
- [ ] **Row-Level Security (RLS)**: Write Postgres RLS policies so clients can only query rows scoped to their tenant. Employees can query across tenants they manage. Admins have full access.
- [ ] **Storage Buckets**: Configure Supabase Storage with separate buckets/paths for source captures vs. client deliverables, with RLS-aligned access policies.

## Phase 4: Security Enhancements

- [ ] **Logout Flow**: Secure logout clearing all tokens, context state, and localStorage.
- [ ] **Error Handling**: Graceful handling of auth errors (401/403) with user-safe messaging and automatic redirect.
- [ ] **Audit Logging**: Track critical events — login/logout, role changes, client account creation, asset delivery/sharing.
- [ ] **Least Privilege Defaults**: New users get minimal permissions; elevate explicitly via admin workflows.
- [ ] **Rate Limiting**: Configure Supabase rate limits on auth endpoints to prevent brute-force attacks.

## Phase 5: Delivery Authorization

This phase covers the auth-relevant aspects of asset delivery. For the 3D asset pipeline (formats, editing, optimization), see `docs/docs.2/asset-pipeline.md`.

- [ ] **Storage Separation**: Store high-res source captures separately from client deliverables. Clients get access only to deliverables explicitly assigned to them (enforced by RLS + storage policies).
- [ ] **Delivery Records**: Asset delivery creates an explicit share/assignment record (who received what, when), reflected in both UI visibility and backend authorization.
- [ ] **Delivery Revocation**: Ability to revoke access to previously delivered assets, with the change taking effect immediately.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend State | React Context API + `useReducer` |
| Routing | `react-router-dom` v7 with `ProtectedRoute` wrapper |
| Backend Auth | Supabase Auth |
| Database | Supabase Postgres |
| Authorization | Postgres Row-Level Security (RLS) |
| Storage | Supabase Storage (buckets with RLS-aligned policies) |

## Implementation Order

| Step | Task | Key Files |
|------|------|-----------|
| 1 | Define User, Role, Tenant, AuthState types | `types.ts` |
| 2 | Create AuthContext + AuthProvider with mock backend | `contexts/AuthContext.tsx` |
| 3 | Create mock auth service (Supabase-shaped API) | `services/authService.ts` |
| 4 | Session persistence + bootstrap on load | `contexts/AuthContext.tsx` |
| 5 | ProtectedRoute component with role + redirect | `components/ProtectedRoute.tsx` |
| 6 | Wire routes with protection | `App.tsx` |
| 7 | Update Login to use AuthContext | `pages/Login.tsx` |
| 8 | Refactor Portal + Sidebar to read from context | `pages/Portal.tsx`, `components/portal/Sidebar.tsx` |
| 9 | Implement functional logout | `components/portal/Sidebar.tsx` |
| 10 | Permission map + Admin bootstrap | `permissions.ts` |
| 11 | Employee -> client account creation UI | New component |
| 12 | Supabase integration (replace mocks) | `services/`, env config |
| 13 | RLS policies + storage buckets | Supabase dashboard / migrations |
| 14 | Security hardening (audit log, rate limits, error handling) | Various |
