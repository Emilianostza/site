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
 * import { login, logout, getCurrentUser, refreshToken } from '@/services/api/auth';
 * const response = await login({ email, password });
 */

import { apiClient } from '@/services/api/client';
import { env } from '@/config/env';
import { PortalRole } from '@/types';
import {
  LoginRequestDTO,
  LoginResponseDTO,
  userToDTO,
  UserProfileDTO
} from '@/types/auth';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type LoginRequest = LoginRequestDTO;
export type LoginResponse = LoginResponseDTO;

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
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    updatedAt: new Date().toISOString()
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
    updatedAt: new Date().toISOString()
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
    updatedAt: new Date().toISOString()
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
    updatedAt: new Date().toISOString()
  },
  'user-client-museum': {
    id: 'user-client-museum',
    email: 'client@museum.com',
    name: 'Museum Curator',
    role: { type: 'customer_viewer', orgId: 'cust-museum', customerId: 'cust-museum', assignedProjectIds: [] },
    orgId: 'cust-museum',
    customerId: 'cust-museum',
    status: 'active' as const,
    mfaEnabled: false,
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  'user-emiliano-admin': {
    id: 'user-emiliano-admin',
    email: 'emilianostza@gmail.com',
    name: 'Emiliano (Admin)',
    role: { type: 'admin', orgId: 'org-emiliano' },
    orgId: 'org-emiliano',
    status: 'active' as const,
    mfaEnabled: false,
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    updatedAt: new Date().toISOString()
  }
};

// ============================================================================
// MOCK AUTH IMPLEMENTATION
// ============================================================================

async function mockLogin(request: LoginRequest): Promise<LoginResponse> {
  await delay(800);

  const user = Object.values(MOCK_USERS_MAP).find(u => u.email.toLowerCase() === request.email.toLowerCase());

  if (!user) {
    throw {
      status: 401,
      message: 'Invalid email or password',
      code: 'INVALID_CREDENTIALS'
    };
  }

  const token = `mock-token-${user.id}-${Date.now()}`;
  const refreshToken = `mock-refresh-${user.id}-${Date.now()}`;

  return {
    user: userToDTO(user),
    token,
    refreshToken,
    expiresIn: 3600
  };
}

async function mockGetCurrentUser(): Promise<LoginResponseDTO['user']> {
  await delay(300);

  const token = apiClient.getToken();
  if (!token || !token.startsWith('mock-token-')) {
    throw {
      status: 401,
      message: 'Invalid or expired token',
      code: 'INVALID_TOKEN'
    };
  }

  const parts = token.split('-');
  const userIdParts = parts.slice(2, parts.length - 1);
  const userId = userIdParts.join('-');

  const user = Object.values(MOCK_USERS_MAP).find(u => u.id === userId);

  if (!user) {
    throw {
      status: 401,
      message: 'User not found for token',
      code: 'INVALID_TOKEN'
    };
  }

  return userToDTO(user);
}

async function mockRefreshToken(
  request: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  await delay(500);

  if (!request.refresh_token || !request.refresh_token.startsWith('mock-refresh-')) {
    throw {
      status: 401,
      message: 'Refresh token expired',
      code: 'REFRESH_TOKEN_EXPIRED'
    };
  }

  const parts = request.refresh_token.split('-');
  const userIdParts = parts.slice(2, parts.length - 1);
  const userId = userIdParts.join('-');

  const user = Object.values(MOCK_USERS_MAP).find(u => u.id === userId);

  if (!user) {
    throw {
      status: 401,
      message: 'Invalid refresh token',
      code: 'REFRESH_TOKEN_EXPIRED'
    };
  }

  const newToken = `mock-token-${user.id}-${Date.now()}`;

  return {
    token: newToken,
    expiresIn: 3600
  };
}

function mockIsTokenExpired(token: string): boolean {
  if (!token.startsWith('mock-token-')) return true;

  const parts = token.split('-');
  const timestampStr = parts[parts.length - 1];
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) return true;

  const expirationTime = timestamp + (3600 * 1000);
  const now = Date.now();

  return now >= expirationTime - 30000;
}

function mockGetTokenTTL(token: string): number {
  if (!token.startsWith('mock-token-')) return 0;

  const parts = token.split('-');
  const timestampStr = parts[parts.length - 1];
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) return 0;

  const expirationTime = timestamp + (3600 * 1000);
  const now = Date.now();
  const remaining = Math.max(0, (expirationTime - now) / 1000);

  return Math.floor(remaining);
}

// ============================================================================
// REAL SUPABASE AUTH IMPLEMENTATION
// ============================================================================

async function realLogin(request: LoginRequest): Promise<LoginResponse> {
  // Lazy load Supabase to avoid circular dependencies
  const { supabase } = await import('@/services/supabase/client');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: request.email,
    password: request.password
  });

  if (error || !data.session) {
    throw {
      status: 401,
      message: error?.message || 'Login failed',
      code: 'INVALID_CREDENTIALS'
    };
  }

  // Fetch user profile with role info
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*, user_org_memberships(*)')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profileData) {
    throw {
      status: 401,
      message: 'User profile not found',
      code: 'INVALID_USER'
    };
  }

  // Build user DTO from Supabase data
  const userDTO: UserProfileDTO = {
    id: data.user.id,
    email: data.user.email || '',
    name: profileData.name || '',
    role: {
      type: 'customer_owner' as PortalRole,
      orgId: profileData.org_id || ''
    },
    orgId: profileData.org_id || '',
    status: 'active' as const,
    mfaEnabled: false,
    failedLoginAttempts: 0,
    createdAt: profileData.created_at || new Date().toISOString(),
    updatedAt: profileData.updated_at || new Date().toISOString()
  };

  return {
    user: userDTO,
    token: data.session.access_token,
    refreshToken: data.session.refresh_token || '',
    expiresIn: 3600
  };
}

async function realGetCurrentUser(): Promise<LoginResponseDTO['user']> {
  const { supabase } = await import('@/services/supabase/client');

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw {
      status: 401,
      message: 'No active session',
      code: 'INVALID_TOKEN'
    };
  }

  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*, user_org_memberships(*)')
    .eq('id', session.user.id)
    .single();

  if (profileError || !profileData) {
    throw {
      status: 401,
      message: 'User profile not found',
      code: 'INVALID_USER'
    };
  }

  const userDTO: UserProfileDTO = {
    id: session.user.id,
    email: session.user.email || '',
    name: profileData.name || '',
    role: {
      type: 'customer_owner' as PortalRole,
      orgId: profileData.org_id || ''
    },
    orgId: profileData.org_id || '',
    status: 'active' as const,
    mfaEnabled: false,
    failedLoginAttempts: 0,
    createdAt: profileData.created_at || new Date().toISOString(),
    updatedAt: profileData.updated_at || new Date().toISOString()
  };

  return userDTO;
}

async function realRefreshToken(
  request: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  const { supabase } = await import('@/services/supabase/client');

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: request.refresh_token
  });

  if (error || !data.session) {
    throw {
      status: 401,
      message: 'Token refresh failed',
      code: 'REFRESH_TOKEN_EXPIRED'
    };
  }

  return {
    token: data.session.access_token,
    expiresIn: 3600
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

    return now > (expiryTime - bufferMs);
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
export async function refreshToken(
  request: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  if (USE_MOCK_DATA) {
    return mockRefreshToken(request);
  }
  return realRefreshToken(request);
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

// Unused but exported to maintain interface compatibility
export function decodeJWT(token: string): any {
  return {};
}
