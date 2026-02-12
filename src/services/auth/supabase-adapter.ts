/**
 * Supabase Authentication Adapter
 *
 * Implements the IAuthAdapter interface using Supabase as the backend.
 * Handles session management, token refresh, and user profile queries.
 *
 * Session flow:
 * 1. User signs in → Supabase returns session with access_token + refresh_token
 * 2. Access token stored in memory, automatically refreshed before expiry
 * 3. Refresh token stored in localStorage, survives page reloads
 * 4. On page load, Supabase auto-restores session from localStorage
 * 5. Stale token detected → auto-refresh via Supabase
 */

import { LoginRequestDTO, LoginResponseDTO, User } from '@/types/auth';
import { IAuthAdapter } from '@/services/auth/adapter';
import { supabase } from '@/services/supabase/client';
import { env } from '@/config/env';
import { jwtDecode } from 'jwt-decode';

export class SupabaseAuthAdapter implements IAuthAdapter {
  private initialized = false;

  /**
   * Initialize adapter (called on app startup)
   */
  async init(): Promise<void> {
    try {
      // Restore existing session if available
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('[Auth] Failed to restore session:', error);
        return;
      }

      if (data.session) {
        console.log('[Auth] Session restored from storage');
      }

      this.initialized = true;
    } catch (err) {
      console.error('[Auth] Initialization failed:', err);
      throw err;
    }
  }

  /**
   * Sign in with email and password
   */
  async login(
    email: string,
    password: string,
    orgSlug?: string
  ): Promise<LoginResponseDTO> {
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message || 'Sign in failed');
      }

      if (!data.session) {
        throw new Error('No session returned from sign in');
      }

      // Fetch user profile with org and role information
      const user = await this.getUserProfile(data.user.id);

      return {
        success: true,
        token: data.session.access_token,
        refreshToken: data.session.refresh_token || undefined,
        expiresIn: data.session.expires_in || 3600,
        user
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      return {
        success: false,
        error: message
      };
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        return null;
      }

      return this.getUserProfile(data.user.id);
    } catch (err) {
      console.error('[Auth] Failed to get current user:', err);
      return null;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ token: string; expiresIn: number }> {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error || !data.session) {
        throw new Error(error?.message || 'Token refresh failed');
      }

      return {
        token: data.session.access_token,
        expiresIn: data.session.expires_in || 3600
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Token refresh failed';
      throw new Error(message);
    }
  }

  /**
   * Sign out
   */
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message || 'Sign out failed');
      }
    } catch (err) {
      console.error('[Auth] Sign out failed:', err);
      throw err;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.exp) return false;

      // Check if expires within next 5 minutes
      const expiresAt = decoded.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const bufferMs = 5 * 60 * 1000; // 5 minute buffer

      return now + bufferMs > expiresAt;
    } catch (err) {
      console.warn('[Auth] Failed to decode token:', err);
      return true; // Assume expired if can't decode
    }
  }

  /**
   * Get token time-to-live in seconds
   */
  getTokenTTL(token: string): number {
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.exp) return 0;

      const expiresAt = decoded.exp * 1000; // milliseconds
      const now = Date.now();
      const ttl = Math.max(0, Math.floor((expiresAt - now) / 1000));

      return ttl;
    } catch (err) {
      console.warn('[Auth] Failed to decode token:', err);
      return 0;
    }
  }

  /**
   * Fetch user profile with org and role info
   * (Requires user_profiles table in Supabase)
   */
  private async getUserProfile(userId: string): Promise<User> {
    try {
      // Query user_profiles table for org and role info
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('id, name, email, avatar_url, created_at')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        console.warn('[Auth] Could not fetch user profile, using basic auth data');

        // Return minimal user object from auth record
        const { data: authUser } = await supabase.auth.getUser();
        return {
          id: userId,
          email: authUser?.user?.email || '',
          name: authUser?.user?.user_metadata?.full_name || 'User',
          avatarUrl: authUser?.user?.user_metadata?.avatar_url,
          createdAt: authUser?.user?.created_at,
          orgId: '',
          roles: []
        };
      }

      // Query user_org_memberships for org and role info
      const { data: memberships, error: membershipError } = await supabase
        .from('user_org_memberships')
        .select('org_id, role')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (membershipError) {
        console.warn('[Auth] Could not fetch user memberships:', membershipError);
      }

      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatar_url,
        createdAt: profile.created_at,
        orgId: memberships?.[0]?.org_id || '',
        roles: memberships?.map(m => m.role) || []
      };
    } catch (err) {
      console.error('[Auth] Error fetching user profile:', err);
      throw err;
    }
  }
}

/**
 * Singleton instance of Supabase adapter
 */
export const supabaseAuthAdapter = new SupabaseAuthAdapter();
