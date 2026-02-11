/**
 * Authentication API Service (MOCK VERSION)
 *
 * PHASE 2: Uses new types from types/auth.ts
 * Handles login, logout, token validation, and refresh using LOCAL MOCK DATA.
 * Bypasses backend for development/demo purposes.
 * TODO: Replace with real Supabase Auth calls
 */

import { apiClient } from '@/services/api/client';
import { PortalRole } from '@/types';
import {
  LoginRequestDTO,
  LoginResponseDTO,
  userToDTO
} from '@/types/auth';

// Re-export DTOs for compatibility
export type LoginRequest = LoginRequestDTO;
export type LoginResponse = LoginResponseDTO;

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

// --- MOCK DATA ---

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

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- API IMPLEMENTATION ---

/**
 * Login with email and password (MOCK).
 */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  await delay(800); // Simulate network latency

  const user = Object.values(MOCK_USERS_MAP).find(u => u.email.toLowerCase() === request.email.toLowerCase());

  // For this mock, we'll accept any password as long as the user exists.
  // In a real app, you'd check bcrypt.compare(request.password, user.passwordHash)
  if (!user) {
    throw {
      status: 401,
      message: 'Invalid email or password',
      code: 'INVALID_CREDENTIALS'
    };
  }

  // Generate a fake JWT-like token that encodes the user ID for our "getCurrentUser" mock to use
  // Format: "mock-token-[userId]-[timestamp]"
  const token = `mock-token-${user.id}-${Date.now()}`;
  const refreshToken = `mock-refresh-${user.id}-${Date.now()}`;

  return {
    user: userToDTO(user),
    token,
    refreshToken,
    expiresIn: 3600 // 1 hour
  };
}

/**
 * Get current authenticated user (MOCK).
 * Parses the fake token to find the user.
 */
export async function getCurrentUser(): Promise<LoginResponseDTO['user']> {
  await delay(300);

  const token = apiClient.getToken();
  if (!token || !token.startsWith('mock-token-')) {
    throw {
      status: 401,
      message: 'Invalid or expired token',
      code: 'INVALID_TOKEN'
    };
  }

  // Extract user ID from our simple mock token format
  const parts = token.split('-');
  // mock-token-[userId]-timestamp
  // Since userId might contain hyphens, we need to be careful.
  // Format is: mock, token, ...idParts..., timestamp
  // Let's assume the ID is everything between index 2 and length-1
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

/**
 * Refresh an expired JWT token (MOCK).
 */
export async function refreshToken(
  request: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  await delay(500);

  // Validate refresh token format
  if (!request.refresh_token || !request.refresh_token.startsWith('mock-refresh-')) {
    throw {
      status: 401,
      message: 'Refresh token expired',
      code: 'REFRESH_TOKEN_EXPIRED'
    };
  }

  // Extract user ID (same logic as access token)
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

/**
 * Logout (MOCK).
 */
export async function logout(): Promise<void> {
  await delay(200);
  // No server-side state to clear in mock mode
}

/**
 * Check if JWT is expired (MOCK).
 */
export function isTokenExpired(token: string): boolean {
  if (!token.startsWith('mock-token-')) return true;

  const parts = token.split('-');
  const timestampStr = parts[parts.length - 1];
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) return true;

  // Expire after 1 hour (3600 * 1000 ms)
  const now = Date.now();
  const expirationTime = timestamp + (3600 * 1000);

  return now >= expirationTime - 30000;
}

/**
 * Get time remaining on JWT token in seconds (MOCK).
 */
export function getTokenTTL(token: string): number {
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

// Unused but exported to maintain interface compatibility if needed
export function decodeJWT(token: string): any {
  return {};
}
