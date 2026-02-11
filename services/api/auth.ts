/**
 * Authentication API Service
 *
 * Handles login, logout, token validation, and refresh.
 * Works with JWT-based backend authentication.
 *
 * API Contract (to be implemented by backend):
 * POST   /auth/login             - Login with email/password → JWT token
 * POST   /auth/logout            - Logout (revoke token if needed)
 * GET    /auth/me                - Get current user from token
 * POST   /auth/refresh           - Refresh expired token
 */

import { apiClient } from './client';
import { AuthUser } from '../../contexts/AuthContext';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refresh_token?: string;
  expires_in: number; // Token TTL in seconds
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  token: string;
  expires_in: number;
}

/**
 * Login with email and password.
 *
 * Backend validates credentials and returns JWT token + user info.
 * Frontend stores token in localStorage and sets in apiClient.
 *
 * Request:
 * ```
 * POST /auth/login
 * {
 *   "email": "user@example.com",
 *   "password": "secure_password"
 * }
 * ```
 *
 * Response (200 OK):
 * ```
 * {
 *   "user": {
 *     "id": "user-123",
 *     "email": "user@example.com",
 *     "name": "John Doe",
 *     "role": "admin",
 *     "org_id": "org-123"
 *   },
 *   "token": "eyJhbGc...",
 *   "expires_in": 3600
 * }
 * ```
 *
 * Response (401 Unauthorized):
 * ```
 * {
 *   "message": "Invalid email or password",
 *   "code": "INVALID_CREDENTIALS"
 * }
 * ```
 */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>('/auth/login', request);
}

/**
 * Get current authenticated user.
 *
 * Validates JWT token and returns user info.
 * Call this on app startup to restore session.
 *
 * Requires: Authorization header with valid JWT
 *
 * Response (200 OK):
 * ```
 * {
 *   "id": "user-123",
 *   "email": "user@example.com",
 *   "name": "John Doe",
 *   "role": "admin",
 *   "org_id": "org-123"
 * }
 * ```
 *
 * Response (401 Unauthorized):
 * ```
 * {
 *   "message": "Invalid or expired token",
 *   "code": "INVALID_TOKEN"
 * }
 * ```
 */
export async function getCurrentUser(): Promise<AuthUser> {
  return apiClient.get<AuthUser>('/auth/me');
}

/**
 * Refresh an expired JWT token.
 *
 * Accepts refresh_token (valid longer than JWT) and returns new JWT.
 * Use this when JWT expires to get a new one without re-login.
 *
 * Request:
 * ```
 * POST /auth/refresh
 * {
 *   "refresh_token": "refresh_eyJhbGc..."
 * }
 * ```
 *
 * Response (200 OK):
 * ```
 * {
 *   "token": "eyJhbGc...",
 *   "expires_in": 3600
 * }
 * ```
 *
 * Response (401 Unauthorized):
 * ```
 * {
 *   "message": "Refresh token expired",
 *   "code": "REFRESH_TOKEN_EXPIRED"
 * }
 * ```
 */
export async function refreshToken(
  request: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  return apiClient.post<RefreshTokenResponse>('/auth/refresh', request);
}

/**
 * Logout and revoke tokens.
 *
 * Optional: Backend can revoke token in blacklist for extra security.
 * Frontend always clears localStorage and apiClient token.
 *
 * Note: Frontend always clears local token regardless of backend response.
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout', {});
  } catch (error) {
    // Even if logout fails, clear local token
    console.warn('Logout request failed (will clear local token anyway)', error);
  }
}

/**
 * Utility: Decode JWT to check expiration without hitting backend.
 *
 * WARNING: Only checks expiration, does NOT validate signature.
 * Use getCurrentUser() for actual validation.
 */
export function decodeJWT(token: string): {
  exp?: number;
  iat?: number;
  [key: string]: any;
} {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');

    const decoded = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return decoded;
  } catch (error) {
    console.error('Failed to decode JWT', error);
    return {};
  }
}

/**
 * Check if JWT is expired.
 *
 * Returns true if token is past expiration time.
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded.exp) return true; // Invalid token

  // Convert from seconds (JWT format) to milliseconds
  const expirationTime = decoded.exp * 1000;
  const now = Date.now();

  // Consider expired if less than 30 seconds remain
  return now >= expirationTime - 30000;
}

/**
 * Get time remaining on JWT token in seconds.
 */
export function getTokenTTL(token: string): number {
  const decoded = decodeJWT(token);
  if (!decoded.exp) return 0;

  const expirationTime = decoded.exp * 1000;
  const now = Date.now();
  const remaining = Math.max(0, (expirationTime - now) / 1000);

  return Math.floor(remaining);
}
