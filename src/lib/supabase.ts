/**
 * Supabase Client Configuration
 *
 * This module initializes the Supabase client for authentication,
 * database access, and storage operations.
 *
 * Environment variables required:
 * - VITE_SUPABASE_URL: Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Supabase anonymous key
 *
 * Docs: https://supabase.com/docs/reference/javascript
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing environment variables. Using mock mode.', {
    hasUrl: Boolean(supabaseUrl),
    hasKey: Boolean(supabaseAnonKey),
  });
}

/**
 * Supabase client instance
 * - Handles authentication (email/password, magic links, OAuth)
 * - Database queries with RLS policies
 * - File storage with access controls
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

/**
 * Helper: Get current authenticated user
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('[Supabase] Failed to get current user:', error);
    return null;
  }
}

/**
 * Helper: Get current user's session
 */
export async function getCurrentSession() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('[Supabase] Failed to get session:', error);
    return null;
  }
}

/**
 * Helper: Sign out (clears session)
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('[Supabase] Sign out failed:', error);
    return false;
  }
}

/**
 * Helper: Get user profile with role information
 * Requires profiles table to exist with RLS policies
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[Supabase] Failed to fetch user profile:', error);
    return null;
  }
}

/**
 * Helper: Subscribe to auth state changes
 * Useful for updating React state on login/logout
 *
 * Usage:
 * const unsubscribe = supabaseAuthListener((session) => {
 *   console.log('Session changed:', session);
 * });
 *
 * // Cleanup
 * unsubscribe();
 */
export function supabaseAuthListener(callback: (session: any) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  // Return unsubscribe function
  return () => {
    subscription?.unsubscribe();
  };
}

export default supabase;
