/**
 * Authentication Context - PHASE 2
 *
 * PHASE 2: JWT-based authentication with real backend.
 * PHASE 1 mock auth removed.
 *
 * Features:
 * - JWT token storage and refresh
 * - Server-side role enforcement
 * - Automatic token injection in API requests
 * - Session restoration on app load
 * - Secure logout
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { PortalRole } from '@/types';
import {
  User,
  Organization,
  LoginResponseDTO,
  Permission,
  hasPermission as checkPermission,
  userFromDTO,
} from '@/types/auth';
import { apiClient } from '@/services/api';
import * as AuthAPI from '@/services/api/auth';

/**
 * PHASE 2: AuthUser is now an alias to User from types/auth.ts
 * This maintains backward compatibility during migration
 */
export type AuthUser = User;

interface AuthContextType {
  user: AuthUser | null;
  organization: Organization | null;
  loading: boolean;
  login: (email: string, password: string, orgSlug?: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  token: string | null;
  refreshToken: () => Promise<boolean>;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'managed_capture_auth_token';
const REFRESH_TOKEN_STORAGE_KEY = 'managed_capture_refresh_token';
const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // Refresh token every 5 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIntervalId, setRefreshIntervalId] = useState<NodeJS.Timeout | null>(null);

  /**
   * Update token state AND localStorage AND apiClient AND org context
   */
  const setToken = (newToken: string | null, orgId?: string | null) => {
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      apiClient.setToken(newToken);
      // Set org context for org-scoped API requests
      if (orgId) {
        apiClient.setOrgId(orgId);
      }
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      apiClient.setToken(null);
      apiClient.setOrgId(null);
    }
    setTokenState(newToken);
  };

  /**
   * Restore session on mount
   * Try to load token from localStorage and validate with backend
   */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

        if (storedToken) {
          // Check if token is expired before attempting to use it
          if (AuthAPI.isTokenExpired(storedToken)) {
            console.log('[Auth] Token expired, attempting refresh...');

            // Try refresh token if available
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
            if (refreshToken) {
              try {
                const response = await AuthAPI.refreshToken({
                  refresh_token: refreshToken, // Keep snake_case for API compatibility
                });
                setToken(response.token, user?.orgId);
              } catch (err) {
                console.log('[Auth] Refresh token failed, clearing session');
                localStorage.removeItem(TOKEN_STORAGE_KEY);
                localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
              }
            } else {
              console.log('[Auth] No refresh token, clearing session');
              localStorage.removeItem(TOKEN_STORAGE_KEY);
            }
          } else {
            // Token is valid, use it
            setToken(storedToken);
          }
        }

        // If we have a token, try to fetch current user
        const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (currentToken) {
          apiClient.setToken(currentToken);
          try {
            const currentUserDTO = await AuthAPI.getCurrentUser();
            const currentUser = userFromDTO(currentUserDTO);
            setUser(currentUser);
            setTokenState(currentToken);
            // Set org context
            apiClient.setOrgId(currentUser.orgId);
            setError(null);
          } catch (err: any) {
            console.warn('[Auth] Failed to fetch current user, clearing session', err);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
            apiClient.setToken(null);
            apiClient.setOrgId(null);
          }
        }
      } catch (err) {
        console.error('[Auth] Session restore failed', err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * Set up token refresh interval
   * Refresh every 5 minutes to keep session alive
   */
  useEffect(() => {
    if (user && token) {
      const id = setInterval(async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
        if (refreshToken && AuthAPI.isTokenExpired(token)) {
          console.log('[Auth] Refreshing token automatically...');
          try {
            const response = await AuthAPI.refreshToken({
              refresh_token: refreshToken, // Keep snake_case for API compatibility
            });
            setToken(response.token, user?.orgId);
          } catch (err) {
            console.error('[Auth] Automatic token refresh failed', err);
            // Do NOT logout automatically on refresh failure
            // Let the user stay "logged in" locally until they make an API call that fails
            // await logout();
          }
        }
      }, TOKEN_REFRESH_INTERVAL);

      setRefreshIntervalId(id);
      return () => clearInterval(id);
    }
  }, [user, token]);

  /**
   * Login with email and password
   * Calls backend /auth/login endpoint
   * Stores JWT token and restores user session
   */
  const login = async (email: string, password: string, orgSlug?: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: LoginResponseDTO = await AuthAPI.login({ email, password, orgSlug });

      // Store tokens
      setToken(response.token, response.user.orgId);
      if (response.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.refreshToken);
      }

      // Set user and organization
      // Fix: Convert DTO to Domain User to ensure role is an object, not a string
      // Fix: Convert DTO to Domain User to ensure role is an object, not a string
      const userDomain = userFromDTO(response.user);
      setUser(userDomain);

      // Fetch organization (TODO: get from login response instead)
      try {
        // For now, create a minimal org object from user's orgId
        // In real implementation, server should return org in login response
        setOrganization({
          id: userDomain.orgId,
          name: '', // Will be fetched separately
          slug: '',
          countryCode: 'ee' as const,
          region: 'eu' as const,
          gdprConsent: false,
          dataRetentionDays: 365,
          metadata: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (orgErr) {
        console.warn('[Auth] Failed to load organization', orgErr);
      }

      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      console.error('[Auth] Login failed:', errorMessage);
      setError(errorMessage);
      setUser(null);
      setOrganization(null);
      setTokenState(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout and revoke tokens
   * Calls backend /auth/logout endpoint
   * Clears all local state
   */
  const logout = async (): Promise<void> => {
    try {
      // Notify backend to revoke token
      await AuthAPI.logout();
    } catch (err) {
      // Even if backend logout fails, clear local state
      console.warn('[Auth] Backend logout failed, clearing local state', err);
    } finally {
      // Clear all local state
      setUser(null);
      setOrganization(null);
      setToken(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      apiClient.setToken(null);
      apiClient.setOrgId(null);
      setError(null);

      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
        setRefreshIntervalId(null);
      }
    }
  };

  /**
   * Manually refresh token
   * Returns true if successful, false otherwise
   */
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
      if (!refreshToken) {
        console.warn('[Auth] No refresh token available');
        return false;
      }

      const response = await AuthAPI.refreshToken({
        refresh_token: refreshToken, // Keep snake_case for API compatibility
      });
      setToken(response.token, user?.orgId);
      return true;
    } catch (err) {
      console.error('[Auth] Token refresh failed', err);
      await logout();
      return false;
    }
  };

  /**
   * Check if user has permission for a resource
   */
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return checkPermission(user, permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        loading,
        login,
        logout,
        error,
        token,
        refreshToken: refreshAccessToken,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
