/**
 * Authentication API Service
 *
 * PHASE 2: JWT-based authentication with real and mock backends.
 * Routes between Supabase real auth and mock auth based on feature flag.
 *
 * Feature flag: VITE_USE_MOCK_DATA
 * - true: Use mock authentication with hardcoded users
 * - false: Use real Supabase authentication
 *
 * Usage:
 *   import { login, logout, getCurrentUser, refreshToken } from '@/services/api/auth';
 *   const response = await login({ email, password });
 */
import { apiClient } from '@/services/api/client';
import { env } from '@/config/env';
import { PortalRole } from '@/types';
import { LoginRequestDTO, LoginResponseDTO, userToDTO, UserProfileDTO, User } from '@/types/auth';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type LoginRequest = LoginRequestDTO;
export type LoginResponse = LoginResponseDTO;

export interface GetUsersRequest {
  role?: string;
}

export type GetUsersResponse = User[];

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

// ============================================================================
// FEATURE FLAG: USE_MOCK_DATA
// ============================================================================

const USE_MOCK_DATA = env.useMockData;

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// MOCK DATA (only used when USE_MOCK_DATA === true)
// ============================================================================

const MOCK_USERS_MAP: Record<string, any> = {
  'user-admin': {
    id: 'user-admin',
    email: 'admin@company.com',
    name: 'Admin User',
    role: { type: 'admin', orgId: 'org-1' },
    orgId: 'org-1',
    status: 'active' as const,
    mfaEnabled: false,
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'user-approver': {
    id: 'user-approver',
    email: 'approver@company.com',
    name: 'QA Approver',
    role: { type: 'approver', orgId: 'org-1' },
    orgId: 'org-1',
    status: 'active' as const,
    mfaEnabled: false,
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'user-tech': {
    id: 'user-tech',
    email: 'tech@company.com',
    name: 'Field Technician',
    role: { type: 'technician', orgId: 'org-1', assignedProjectIds: [] },
    orgId: 'org-1',
    status: 'active' as const,
    mfaEnabled: false,
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'user-client-bistro': {
    id: 'user-client-bistro',
    email: 'client@bistro.com',
    name: 'Bistro Owner',
    role: { type: 'customer_owner', orgId: 'cust-bistro', customerId: 'cust-bistro' },
    orgId: 'cust-bistro',
    customerId: 'cust-bistro',
    status: 'active' as const,
    mfaEnabled: false,
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'user-emiliano-admin': {
    id: 'user-emiliano-admin',
    email: 'emilianostza@gmail.com',
    name: 'Emiliano (Admin)',
    role: { type: 'super_admin', orgId: 'org-emiliano' },
    orgId: 'org-emiliano',
    status: 'active' as const,
    mfaEnabled: false,
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'user-emiliano-customer': {
    id: 'user-emiliano-customer',
    email: 'emilianostza+customer@gmail.com',
    name: 'Emiliano (Customer)',
    role: { type: 'customer_owner', orgId: 'cust-emiliano', customerId: 'cust-emiliano' },
    orgId: 'cust-emiliano',
    customerId: 'cust-emiliano',
    status: 'active' as const,
    mfaEnabled: false,
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// ============================================================================
// MOCK AUTH IMPLEMENTATION
// ============================================================================

async function mockLogin(request: LoginRequest): Promise<LoginResponse> {
  await delay(800);

  const user = Object.values(MOCK_USERS_MAP).find(
    (u) => u.email.toLowerCase() === request.email.toLowerCase()
  );

  if (!user) {
    throw {
      status: 401,
      message: 'Invalid email or password',
      code: 'INVALID_CREDENTIALS',
    };
  }

  const token = `mock-token-${user.id}-${Date.now()}`;
  const refreshToken = `mock-refresh-${user.id}-${Date.now()}`;

  return {
    user: userToDTO(user),
    token,
    refreshToken,
    expiresIn: 3600,
  };
}

async function mockGetCurrentUser(): Promise<LoginResponseDTO['user']> {
  await delay(300);

  const token = apiClient.getToken();
  if (!token || !token.startsWith('mock-token-')) {
    throw {
      status: 401,
      message: 'Invalid or expired token',
      code: 'INVALID_TOKEN',
    };
  }

  const parts = token.split('-');
  const userIdParts = parts.slice(2, parts.length - 1);
  const userId = userIdParts.join('-');

  const user = Object.values(MOCK_USERS_MAP).find((u) => u.id === userId);

  if (!user) {
    throw {
      status: 401,
      message: 'User not found for token',
      code: 'INVALID_TOKEN',
    };
  }

  return userToDTO(user);
}

async function mockRefreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  await delay(500);

  if (!request.refresh_token || !request.refresh_token.startsWith('mock-refresh-')) {
    throw {
      status: 401,
      message: 'Refresh token expired',
      code: 'REFRESH_TOKEN_EXPIRED',
    };
  }

  const parts = request.refresh_token.split('-');
  const userIdParts = parts.slice(2, parts.length - 1);
  const userId = userIdParts.join('-');

  const user = Object.values(MOCK_USERS_MAP).find((u) => u.id === userId);

  if (!user) {
    throw {
      status: 401,
      message: 'Invalid refresh token',
      code: 'REFRESH_TOKEN_EXPIRED',
    };
  }

  const newToken = `mock-token-${user.id}-${Date.now()}`;

  return {
    token: newToken,
    expiresIn: 3600,
  };
}

function mockIsTokenExpired(token: string): boolean {
  if (!token.startsWith('mock-token-')) return true;
  const parts = token.split('-');
  const timestampStr = parts[parts.length - 1];
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return true;
  const expirationTime = timestamp + 3600 * 1000;
  const now = Date.now();
  return now >= expirationTime - 30000;
}

function mockGetTokenTTL(token: string): number {
  if (!token.startsWith('mock-token-')) return 0;
  const parts = token.split('-');
  const timestampStr = parts[parts.length - 1];
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return 0;
  const expirationTime = timestamp + 3600 * 1000;
  const now = Date.now();
  const remaining = Math.max(0, (expirationTime - now) / 1000);
  return Math.floor(remaining);
}

async function mockCreateUser(data: {
  name: string;
  email: string;
  roleType: string;
  orgId?: string;
}): Promise<User> {
  await delay(600);

  const id = `user-${Date.now()}`;
  const orgId = data.orgId || (data.roleType.startsWith('customer') ? `cust-${id}` : 'org-1');
  const isCustomer = data.roleType === 'customer_owner' || data.roleType === 'customer_viewer';

  const newUser: User = {
    id,
    email: data.email,
    name: data.name,
    orgId,
    role: isCustomer
      ? { type: data.roleType as any, orgId, customerId: orgId }
      : data.roleType === 'technician'
        ? { type: 'technician', orgId, assignedProjectIds: [] }
        : { type: data.roleType as any, orgId },
    status: 'active',
    mfaEnabled: false,
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  MOCK_USERS_MAP[id] = newUser;
  return newUser;
}

async function mockDeleteUser(id: string): Promise<void> {
  await delay(400);
  delete MOCK_USERS_MAP[id];
}

async function mockGetUsers(request: GetUsersRequest = {}): Promise<GetUsersResponse> {
  await delay(500);
  // MOCK_USERS_MAP values are likely any, but we know they match User structure
  let users = Object.values(MOCK_USERS_MAP) as User[];

  if (request.role) {
    // rudimentary filtering
    users = users.filter((u) => {
      // u.role is UserRole object, so u.role.type is valid
      if (request.role === 'employee')
        return ['admin', 'technician', 'approver', 'sales_lead', 'super_admin'].includes(
          u.role.type
        );
      if (request.role === 'customer')
        return ['customer_owner', 'customer_viewer'].includes(u.role.type);
      return u.role.type === request.role;
    });
  }
  return users;
}

// ============================================================================
// HELPER: Build role object from profile data
// ============================================================================

/**
 * Constructs the typed role object from Supabase profile row data.
 * Reads the actual role from the database instead of hardcoding.
 */
function buildRoleFromProfile(profileData: any): User['role'] {
  const roleType = profileData.role || 'customer_owner';
  const orgId = profileData.org_id || '';

  switch (roleType) {
    case 'admin':
      return { type: 'admin', orgId };
    case 'approver':
      return { type: 'approver', orgId };
    case 'technician':
      return {
        type: 'technician',
        orgId,
        assignedProjectIds: profileData.assigned_project_ids || [],
      };
    case 'sales_lead':
      return { type: 'sales_lead', orgId };
    case 'customer_owner':
      return {
        type: 'customer_owner',
        orgId,
        customerId: profileData.customer_id || orgId,
      };
    case 'customer_viewer':
      return {
        type: 'customer_viewer',
        orgId,
        customerId: profileData.customer_id || orgId,
        assignedProjectIds: profileData.assigned_project_ids || [],
      };
    case 'public_visitor':
      return { type: 'public_visitor', orgId };
    default:
      return { type: 'customer_owner', orgId, customerId: orgId };
  }
}

// ============================================================================
// REAL SUPABASE AUTH IMPLEMENTATION
// ============================================================================

async function realLogin(request: LoginRequest): Promise<LoginResponse> {
  // Lazy load Supabase to avoid circular dependencies
  const { supabase } = await import('@/services/supabase/client');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: request.email,
    password: request.password,
  });

  if (error || !data.session) {
    throw {
      status: 401,
      message: error?.message || 'Login failed',
      code: 'INVALID_CREDENTIALS',
    };
  }

  // Fetch user profile with role info from user_profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*, user_org_memberships(*)')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profileData) {
    throw {
      status: 401,
      message: 'User profile not found. Please contact an administrator.',
      code: 'INVALID_USER',
    };
  }

  // Build user domain object with ACTUAL role from database
  const user: User = {
    id: data.user.id,
    orgId: profileData.org_id || '',
    email: data.user.email || '',
    name: profileData.name || '',
    role: buildRoleFromProfile(profileData),
    status: (profileData.status as User['status']) || 'active',
    mfaEnabled: profileData.mfa_enabled || false,
    failedLoginAttempts: profileData.failed_login_attempts || 0,
    createdAt: profileData.created_at || new Date().toISOString(),
    updatedAt: profileData.updated_at || new Date().toISOString(),
  };

  // Add customerId if role is customer-type
  if (profileData.customer_id) {
    (user as any).customerId = profileData.customer_id;
  }

  const userDTO = userToDTO(user);

  return {
    user: userDTO,
    token: data.session.access_token,
    refreshToken: data.session.refresh_token || '',
    expiresIn: 3600,
  };
}

async function realGetCurrentUser(): Promise<LoginResponseDTO['user']> {
  const { supabase } = await import('@/services/supabase/client');

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw {
      status: 401,
      message: 'No active session',
      code: 'INVALID_TOKEN',
    };
  }

  // Fetch user profile with role info from user_profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*, user_org_memberships(*)')
    .eq('id', session.user.id)
    .single();

  if (profileError || !profileData) {
    throw {
      status: 401,
      message: 'User profile not found',
      code: 'INVALID_USER',
    };
  }

  // Build user domain object with ACTUAL role from database
  const user: User = {
    id: session.user.id,
    orgId: profileData.org_id || '',
    email: session.user.email || '',
    name: profileData.name || '',
    role: buildRoleFromProfile(profileData),
    status: (profileData.status as User['status']) || 'active',
    mfaEnabled: profileData.mfa_enabled || false,
    failedLoginAttempts: profileData.failed_login_attempts || 0,
    createdAt: profileData.created_at || new Date().toISOString(),
    updatedAt: profileData.updated_at || new Date().toISOString(),
  };

  if (profileData.customer_id) {
    (user as any).customerId = profileData.customer_id;
  }

  return userToDTO(user);
}

async function realRefreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  const { supabase } = await import('@/services/supabase/client');

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: request.refresh_token,
  });

  if (error || !data.session) {
    throw {
      status: 401,
      message: 'Token refresh failed',
      code: 'REFRESH_TOKEN_EXPIRED',
    };
  }

  return {
    token: data.session.access_token,
    expiresIn: 3600,
  };
}

async function realLogout(): Promise<void> {
  const { supabase } = await import('@/services/supabase/client');
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.warn('[Auth] Logout error:', error);
  }
}

function realIsTokenExpired(token: string): boolean {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return true;

    // Compare expiry with current time (with 5-minute buffer)
    const expiryTime = payload.exp * 1000;
    const now = Date.now();
    const bufferMs = 5 * 60 * 1000;
    return now > expiryTime - bufferMs;
  } catch (error) {
    console.warn('[Auth] Token decode error:', error);
    return true;
  }
}

function realGetTokenTTL(token: string): number {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return 0;

    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return 0;

    const expiryTime = payload.exp * 1000;
    const now = Date.now();
    const remaining = Math.max(0, (expiryTime - now) / 1000);
    return Math.floor(remaining);
  } catch (error) {
    console.warn('[Auth] Token decode error:', error);
    return 0;
  }
}

async function realGetUsers(request: GetUsersRequest = {}): Promise<GetUsersResponse> {
  const { supabase } = await import('@/services/supabase/client');

  const query = supabase.from('user_profiles').select('*');

  // Real implementation would need more complex role filtering since role is JSON or separate column
  // For now, return all
  const { data, error } = await query;

  if (error) {
    console.error('Failed to fetch users', error);
    return [];
  }

  return data.map((profile) => {
    const user: User = {
      id: profile.id,
      orgId: profile.org_id || '',
      email: profile.email || '', // Email might not be in profile depending on schema, usually in auth.users
      name: profile.name || '',
      role: buildRoleFromProfile(profile),
      status: (profile.status as User['status']) || 'active',
      mfaEnabled: profile.mfa_enabled || false,
      failedLoginAttempts: profile.failed_login_attempts || 0,
      createdAt: profile.created_at || new Date().toISOString(),
      updatedAt: profile.updated_at || new Date().toISOString(),
    };
    return user;
  });
}

// ============================================================================
// PUBLIC API - ROUTES BASED ON FEATURE FLAG
// ============================================================================

/**
 * Login with email and password
 * Routes to mock or real based on VITE_USE_MOCK_DATA flag
 */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCK_DATA) {
    return mockLogin(request);
  }
  return realLogin(request);
}

/**
 * Get current authenticated user
 * Routes to mock or real based on VITE_USE_MOCK_DATA flag
 */
export async function getCurrentUser(): Promise<LoginResponseDTO['user']> {
  if (USE_MOCK_DATA) {
    return mockGetCurrentUser();
  }
  return realGetCurrentUser();
}

/**
 * Refresh an expired JWT token
 * Routes to mock or real based on VITE_USE_MOCK_DATA flag
 */
export async function refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  if (USE_MOCK_DATA) {
    return mockRefreshToken(request);
  }
  return realRefreshToken(request);
}

/**
 * Get all users (Super Admin only)
 */
export async function getUsers(request: GetUsersRequest = {}): Promise<GetUsersResponse> {
  if (USE_MOCK_DATA) {
    return mockGetUsers(request);
  }
  return realGetUsers(request);
}

/**
 * Logout and revoke tokens
 * Routes to mock or real based on VITE_USE_MOCK_DATA flag
 */
export async function logout(): Promise<void> {
  if (USE_MOCK_DATA) {
    await delay(200);
    return;
  }
  return realLogout();
}

/**
 * Check if JWT is expired
 * Routes to mock or real based on VITE_USE_MOCK_DATA flag
 */
export function isTokenExpired(token: string): boolean {
  if (USE_MOCK_DATA) {
    return mockIsTokenExpired(token);
  }
  return realIsTokenExpired(token);
}

/**
 * Get time remaining on JWT token in seconds
 * Routes to mock or real based on VITE_USE_MOCK_DATA flag
 */
export function getTokenTTL(token: string): number {
  if (USE_MOCK_DATA) {
    return mockGetTokenTTL(token);
  }
  return realGetTokenTTL(token);
}

export interface CreateUserRequest {
  name: string;
  email: string;
  roleType: string;
  orgId?: string;
}

/**
 * Create a new user (Super Admin only)
 */
export async function createUser(request: CreateUserRequest): Promise<User> {
  if (USE_MOCK_DATA) {
    return mockCreateUser(request);
  }
  // Real implementation: create via Supabase admin API
  throw new Error('Real createUser not yet implemented');
}

/**
 * Delete a user by ID (Super Admin only)
 */
export async function deleteUser(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    return mockDeleteUser(id);
  }
  // Real implementation: delete via Supabase admin API
  throw new Error('Real deleteUser not yet implemented');
}

// Unused but exported to maintain interface compatibility
export function decodeJWT(_token: string): any {
  return {};
}
