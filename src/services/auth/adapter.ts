/**
 * Authentication Adapter Interface
 *
 * Pluggable interface for different auth providers:
 * - Stub (unauthenticated, for local development)
 * - Mock (in-memory mock users)
 * - Supabase (production JWT auth)
 * - OAuth2 / OIDC (future)
 *
 * The AuthContext uses an adapter, not a specific provider.
 * This enables easy swapping between implementations.
 */

import { User, LoginResponseDTO } from '@/types/auth';

/**
 * Auth Adapter - abstract interface for authentication
 */
export interface IAuthAdapter {
  /**
   * Initialize adapter (async, e.g., restore session from storage)
   */
  init(): Promise<void>;

  /**
   * Login with email and password
   */
  login(email: string, password: string, orgSlug?: string): Promise<LoginResponseDTO>;

  /**
   * Get current authenticated user
   * Returns null if not authenticated
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Refresh access token
   */
  refreshToken(refreshToken: string): Promise<{ token: string; expiresIn: number }>;

  /**
   * Logout and revoke tokens
   */
  logout(): Promise<void>;

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean;

  /**
   * Get token time-to-live in seconds
   */
  getTokenTTL(token: string): number;
}

/**
 * Stub Adapter - Always returns unauthenticated
 *
 * Used for local development when no real auth is available.
 * Routes are still protected but will redirect to login.
 */
export class StubAuthAdapter implements IAuthAdapter {
  async init(): Promise<void> {
    console.log('[Auth] Stub adapter initialized (unauthenticated)');
  }

  async login(email: string, password: string, orgSlug?: string): Promise<LoginResponseDTO> {
    throw new Error('[Auth] Stub adapter does not support login. Configure a real auth provider.');
  }

  async getCurrentUser(): Promise<User | null> {
    return null; // Always unauthenticated
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; expiresIn: number }> {
    throw new Error('[Auth] Stub adapter does not support token refresh.');
  }

  async logout(): Promise<void> {
    // No-op
  }

  isTokenExpired(token: string): boolean {
    return true; // Always expired
  }

  getTokenTTL(token: string): number {
    return 0; // No TTL
  }
}

/**
 * Auth Adapter Factory
 *
 * Selects the appropriate adapter based on environment.
 * In the future, this could be extended to support multiple providers.
 */
export function createAuthAdapter(): IAuthAdapter {
  // TODO: In Phase 3, detect configured provider and instantiate accordingly:
  // - if (VITE_AUTH_PROVIDER === 'supabase') return new SupabaseAuthAdapter();
  // - if (VITE_AUTH_PROVIDER === 'mock') return new MockAuthAdapter();
  // For now, always stub until real provider is configured

  return new StubAuthAdapter();
}
