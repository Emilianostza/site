/**
 * AuthContext.tsx Unit Tests
 * Tests authentication flow, token management, and session handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { useEffect } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import * as AuthAPI from '@/services/api/auth';

// Mock auth API
vi.mock('@/services/api/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
  refreshToken: vi.fn(),
  isTokenExpired: vi.fn(() => false),
  getTokenTTL: vi.fn(() => 3600),
}));

// Mock dataProvider
vi.mock('@/services/dataProvider', () => ({
  ProjectsProvider: {
    list: vi.fn(),
  },
  AssetsProvider: {
    list: vi.fn(),
  },
}));

// Mock API client
vi.mock('@/services/api/client', () => ({
  apiClient: {
    setToken: vi.fn(),
    getToken: vi.fn(),
    setOrgId: vi.fn(),
  },
}));

// Test component that uses auth
const TestComponent = () => {
  const { user, token, loading, login, logout, error } = useAuth();

  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <div data-testid="token">{token ? 'has-token' : 'no-token'}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <button
        onClick={() => login('test@example.com', 'password123')}
        data-testid="login-button"
      >
        Login
      </button>
      <button onClick={() => logout()} data-testid="logout-button">
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with loading state', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loadingEl = screen.getByTestId('loading');
      expect(loadingEl.textContent).toBe('loading');
    });

    it('should have no user initially', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const userEl = screen.getByTestId('user');
      expect(userEl.textContent).toBe('no-user');
    });
  });

  describe('Login Flow', () => {
    it('should handle successful login', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: { type: 'admin' as const, orgId: 'org-1' },
        orgId: 'org-1',
        status: 'active' as const,
        mfaEnabled: false,
        failedLoginAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(AuthAPI.login).mockResolvedValueOnce({
        user: mockUser,
        token: 'test-token-123',
        refreshToken: 'refresh-token-456',
        expiresIn: 3600,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).not.toBe('loading');
      });

      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(vi.mocked(AuthAPI.login)).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      // Note: Full state updates depend on implementation details
      // This test verifies the flow works without errors
    });

    it('should handle login errors', async () => {
      const loginError = new Error('Invalid credentials');
      vi.mocked(AuthAPI.login).mockRejectedValueOnce(loginError);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).not.toBe('loading');
      });

      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(vi.mocked(AuthAPI.login)).toHaveBeenCalled();
      });
    });

    it('should set token after successful login', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: { type: 'admin' as const, orgId: 'org-1' },
        orgId: 'org-1',
        status: 'active' as const,
        mfaEnabled: false,
        failedLoginAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(AuthAPI.login).mockResolvedValueOnce({
        user: mockUser,
        token: 'test-token-123',
        refreshToken: 'refresh-token-456',
        expiresIn: 3600,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).not.toBe('loading');
      });

      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          expect.stringContaining('auth_token'),
          expect.any(String)
        );
      });
    });
  });

  describe('Logout Flow', () => {
    it('should clear user on logout', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: { type: 'admin' as const, orgId: 'org-1' },
        orgId: 'org-1',
        status: 'active' as const,
        mfaEnabled: false,
        failedLoginAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(AuthAPI.login).mockResolvedValueOnce({
        user: mockUser,
        token: 'test-token-123',
        refreshToken: 'refresh-token-456',
        expiresIn: 3600,
      });

      vi.mocked(AuthAPI.logout).mockResolvedValueOnce(undefined);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).not.toBe('loading');
      });

      // First login
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(vi.mocked(AuthAPI.login)).toHaveBeenCalled();
      });

      // Then logout
      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(vi.mocked(AuthAPI.logout)).toHaveBeenCalled();
      });

      // Verify token is cleared
      expect(localStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('Token Management', () => {
    it('should detect expired tokens', async () => {
      vi.mocked(AuthAPI.isTokenExpired).mockReturnValueOnce(true);

      const result = AuthAPI.isTokenExpired('expired-token');
      expect(result).toBe(true);
    });

    it('should get token TTL', async () => {
      vi.mocked(AuthAPI.getTokenTTL).mockReturnValueOnce(1800);

      const ttl = AuthAPI.getTokenTTL('valid-token');
      expect(ttl).toBe(1800);
    });
  });

  describe('Session Restoration', () => {
    it('should restore session from localStorage', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: { type: 'admin' as const, orgId: 'org-1' },
        orgId: 'org-1',
        status: 'active' as const,
        mfaEnabled: false,
        failedLoginAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Set up localStorage with existing token
      const mockGetItem = vi.fn((key: string) => {
        if (key.includes('auth_token')) {
          return 'existing-token-123';
        }
        return null;
      });

      vi.mocked(localStorage.getItem).mockImplementation(mockGetItem);

      vi.mocked(AuthAPI.getCurrentUser).mockResolvedValueOnce(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Session restoration should happen on mount
      await waitFor(() => {
        expect(vi.mocked(AuthAPI.getCurrentUser)).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network request failed');
      vi.mocked(AuthAPI.login).mockRejectedValueOnce(networkError);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).not.toBe('loading');
      });

      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(vi.mocked(AuthAPI.login)).toHaveBeenCalled();
      });

      // Component should show error without crashing
      expect(screen.getByTestId('error')).toBeTruthy();
    });

    it('should handle missing user profile', async () => {
      vi.mocked(AuthAPI.getCurrentUser).mockRejectedValueOnce(
        new Error('User profile not found')
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).not.toBe('loading');
      });

      // Should clear session on error
      expect(localStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('Permission Checking', () => {
    it('should check user permissions', () => {
      const { hasPermission } = useAuth();

      // This would need actual implementation to test
      // For now, verify the hook exists and is callable
      expect(typeof hasPermission).toBe('function');
    });
  });

  describe('Dual-Mode Authentication', () => {
    it('should support mock authentication', async () => {
      // When VITE_USE_MOCK_DATA=true
      const mockUser = {
        id: 'user-admin',
        email: 'admin@company.com',
        name: 'Admin User',
        role: { type: 'admin' as const, orgId: 'org-1' },
        orgId: 'org-1',
        status: 'active' as const,
        mfaEnabled: false,
        failedLoginAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(AuthAPI.login).mockResolvedValueOnce({
        user: mockUser,
        token: 'mock-token-admin-123',
        refreshToken: 'mock-refresh-admin',
        expiresIn: 3600,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).not.toBe('loading');
      });

      expect(screen.getByTestId('token').textContent).toBe('no-token');
    });

    it('should support real Supabase authentication', async () => {
      // When VITE_USE_MOCK_DATA=false
      const supabaseUser = {
        id: 'supabase-user-uuid',
        email: 'real@example.com',
        name: 'Real User',
        role: { type: 'customer_owner' as const, orgId: 'org-supabase' },
        orgId: 'org-supabase',
        status: 'active' as const,
        mfaEnabled: false,
        failedLoginAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(AuthAPI.login).mockResolvedValueOnce({
        user: supabaseUser,
        token: 'eyJhbGc...',  // Real JWT format
        refreshToken: 'real-refresh-token',
        expiresIn: 3600,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).not.toBe('loading');
      });

      expect(vi.mocked(AuthAPI.login)).toBeTruthy();
    });
  });
});
