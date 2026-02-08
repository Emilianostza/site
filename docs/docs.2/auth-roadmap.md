# Authentication Roadmap

This document outlines the strategy for implementing authentication and authorization in the Managed Capture 3D Platform (capture performed by dedicated employees; customers can access only the content that has been delivered to them).

## Phase 1: Foundation (Frontend)

- [ ] **Context Setup**: Create `AuthContext` to manage user state globally (user, role, tenant/customer scope).
- [ ] **Protected Routes**: Implement a `ProtectedRoute` component to restrict access to authenticated users.
- [ ] **Login Page**: Enhance the existing login page to use the context.
- [ ] **Mock Auth**: Implement a mock authentication service for development and testing.
- [ ] **Session Bootstrap**: On app load, fetch/restore the current session, user profile, role, and tenant scope before rendering protected UI.

## Phase 2: Role-Based Access Control (RBAC)

- [ ] **Roles Definition**: Define roles: `Admin`, `Employee`, `Client`.
- [ ] **Role Capabilities**:
  - [ ] **Admin**: Manage employees, clients, roles/permissions, and global settings; audit access.
  - [ ] **Employee**: Create client accounts, manage capture projects, upload captures, and deliver assets to clients (managed capture workflow).
  - [ ] **Client**: Access only delivered assets/projects; limited edits only to permitted metadata/content provided to them.
- [ ] **Permission Logic**: Implement logic to show/hide UI elements based on roles and tenant scope (do not rely on UI checks for security).
- [ ] **Account Provisioning**: Disable self-serve signup; employees (or admins) create/invite client users and assign them to the correct tenant/customer scope.
- [ ] **Redirects**: Configure role-based redirects after login (e.g., Clients -> Portal, Employees -> Dashboard).
- [ ] **Content Scoping**: Enforce “customer can only see what was provided to them” across UI queries (e.g., `customer_id`/`tenant_id` scoping) and backend policies.

## Phase 3: Backend Integration

- [ ] **Provider Selection**: Select an auth + authorization approach that supports multi-tenant scoping and server-side enforcement (recommendation below).
- [ ] **API Integration**: Replace mock services with actual API calls.
- [ ] **Token Management**: Implement JWT storage (HttpOnly cookies preferred) and refresh logic.
- [ ] **User & Tenant Model**: Define backend schema for tenants/customers, users, roles, and membership (including employee-created client accounts).
- [ ] **Server-Side Authorization**: Enforce role + tenant rules in the backend (e.g., Postgres RLS policies or API middleware). Never trust the frontend for access control decisions.

## Phase 4: Security Enhancements

- [ ] **Session Persistence**: Ensure users stay logged in across reloads.
- [ ] **Logout Flow**: Secure logout clearing all tokens and state.
- [ ] **Error Handling**: Graceful handling of auth errors (401/403) with user-safe messaging.
- [ ] **Audit Logging**: Track critical events (login/logout, role changes, client account creation, asset delivery/sharing).
- [ ] **Least Privilege Defaults**: New users get minimal permissions by default; elevate explicitly via admin workflows.

## Phase 5: 3D Asset Editing & Delivery (Managed Capture)

- [ ] **Canonical Delivery Format**: Standardize client deliverables as **GLB (binary glTF)** for WebAR distribution (single-file, runtime-friendly).
- [ ] **Editor Recommendation (Best Fit)**: Use **Blender** as the primary editor for post-processing managed-capture outputs (cleanup, decimation, retopology, UVs, baking, and GLB export).
- [ ] **MyWebAR Compatibility**: Align exports to what MyWebAR accepts (e.g., GLB for animated assets; additional accepted formats as needed).
- [ ] **Optimization Checklist**:
  - [ ] Reduce polygon count (decimation/retopo) for mobile WebAR performance.
  - [ ] Bake high-poly detail into textures (normal/AO) for low-poly deliverables.
  - [ ] Limit texture resolution and use web-friendly formats; consider KTX2/Basis where supported.
  - [ ] Validate glTF/GLB assets prior to delivery (automated checks in CI/CD if possible).
- [ ] **Storage Separation**: Store high-res “source captures” separately from “client deliverables”; clients get access only to deliverables explicitly assigned to them.
- [ ] **Delivery Controls**: Asset delivery should create an explicit share/assignment record (who received what, when), reflected in both UI visibility and backend authorization.

## Proposed Tech Stack for Auth

- **Frontend**: React Context API + Hooks
- **State Management**: React `useContext` / `useReducer`
- **Routing**: `react-router-dom` loaders/actions (optional) or traditional protected route components.
- **Backend Service (Recommended)**: Supabase Auth + Postgres Row Level Security (RLS) policies for tenant scoping and “delivered assets only” enforcement.
- **Backend Alternatives**:
  - Firebase Auth + custom claims for roles, enforced via security rules / backend verification.
  - Auth0 RBAC for role/permission management, with backend enforcement.
