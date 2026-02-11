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
import { PortalRole } from '../types';
import { apiClient } from '../services/api';
import * as AuthAPI from '../services/api/auth';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: PortalRole;
  customer_id?: string;
  org_id?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  token: string | null;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'managed_capture_auth_token';
const REFRESH_TOKEN_STORAGE_KEY = 'managed_capture_refresh_token';
const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // Refresh token every 5 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIntervalId, setRefreshIntervalId] = useState<NodeJS.Timeout | null>(null);

  /**
   * Update token state AND localStorage AND apiClient
   */
  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      apiClient.setToken(newToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      apiClient.setToken(null);
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
                  refresh_token: refreshToken,
                });
                setToken(response.token);
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
            const currentUser = await AuthAPI.getCurrentUser();
            setUser(currentUser);
            setTokenState(currentToken);
            setError(null);
          } catch (err: any) {
            console.warn('[Auth] Failed to fetch current user, clearing session', err);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
            apiClient.setToken(null);
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
              refresh_token: refreshToken,
            });
            setToken(response.token);
          } catch (err) {
            console.error('[Auth] Automatic token refresh failed', err);
            // Logout on refresh failure
            await logout();
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
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthAPI.login({ email, password });

      // Store tokens
      setToken(response.token);
      if (response.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.refresh_token);
      }

      // Set user
      setUser(response.user);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      console.error('[Auth] Login failed:', errorMessage);
      setError(errorMessage);
      setUser(null);
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
      setToken(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      apiClient.setToken(null);
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
        refresh_token: refreshToken,
      });
      setToken(response.token);
      return true;
    } catch (err) {
      console.error('[Auth] Token refresh failed', err);
      await logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        error,
        token,
        refreshToken: refreshAccessToken,
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
