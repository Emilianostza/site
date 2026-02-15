/**
 * Typed Environment Configuration
 *
 * Single source of truth for all environment variables.
 * Validates at startup and provides compile-time safe access.
 *
 * No component should access import.meta.env directly.
 * Import from this module instead.
 */

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

interface EnvConfig {
  // Feature flags
  isDev: boolean;
  isProd: boolean;
  useMockData: boolean;

  // API Configuration
  apiBaseUrl: string;
  apiTimeout: number;

  // Storage Configuration
  storageBucket: string;

  // Auth Configuration
  jwtExpiresIn: number;
  jwtRefreshExpiresIn: number;

  // Supabase Configuration
  supabaseUrl: string;
  supabaseAnonKey: string;

  // Gemini API (server-side only via proxy)
  // Never expose in client code - accessed via /.netlify/functions/gemini-proxy
  geminiProxyUrl: string;
}

// ============================================================================
// ENVIRONMENT PARSING
// ============================================================================

function validateEnv(): EnvConfig {
  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;

  // Feature flags
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

  // API Configuration
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  const apiTimeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

  // Storage Configuration
  const storageBucket = import.meta.env.VITE_STORAGE_BUCKET || 's3.example.com/managed-capture';

  // Auth Configuration
  const jwtExpiresIn = parseInt(import.meta.env.VITE_JWT_EXPIRES_IN || '3600', 10);
  const jwtRefreshExpiresIn = parseInt(import.meta.env.VITE_JWT_REFRESH_EXPIRES_IN || '604800', 10);

  // Supabase Configuration
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  // Gemini Proxy
  const geminiProxyUrl = '/.netlify/functions/gemini-proxy';

  // ============================================================================
  // VALIDATION RULES (fail-fast in dev)
  // ============================================================================

  const errors: string[] = [];

  // API base URL must be valid in production
  if (isProd && !apiBaseUrl.startsWith('http')) {
    errors.push('VITE_API_BASE_URL must be a valid HTTP URL in production');
  }

  // Storage bucket should be configured
  if (storageBucket === 's3.example.com/managed-capture') {
    const warning = isDev ? 'warn' : 'error';
    // Only fail in production if we are NOT using mock data
    if (warning === 'error' && !useMockData) {
      errors.push('VITE_STORAGE_BUCKET must be configured in production');
    } else if (isDev) {
      console.warn('[Config] VITE_STORAGE_BUCKET using default placeholder');
    }
  }

  // Supabase must be configured if not using mock data
  if (!useMockData) {
    if (!supabaseUrl) {
      errors.push('VITE_SUPABASE_URL is required when not using mock data');
    } else if (!supabaseUrl.includes('.supabase.co')) {
      errors.push('VITE_SUPABASE_URL must be a valid Supabase project URL');
    }

    if (!supabaseAnonKey) {
      errors.push('VITE_SUPABASE_ANON_KEY is required when not using mock data');
    } else if (supabaseAnonKey.length < 20) {
      errors.push('VITE_SUPABASE_ANON_KEY appears to be invalid (too short)');
    }
  }

  // Fail fast in development if there are errors
  if (errors.length > 0) {
    const message = `❌ Environment Configuration Errors:\n${errors.map((e) => `  • ${e}`).join('\n')}`;
    if (isDev) {
      console.error(message);
      // In dev, show alert so user notices
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          alert(`Configuration Error:\n\n${errors.join('\n')}`);
        }, 0);
      }
    } else {
      throw new Error(message);
    }
  }

  return {
    isDev,
    isProd,
    useMockData,
    apiBaseUrl,
    apiTimeout,
    storageBucket,
    jwtExpiresIn,
    jwtRefreshExpiresIn,
    supabaseUrl,
    supabaseAnonKey,
    geminiProxyUrl,
  };
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const env = validateEnv();

// ============================================================================
// DEBUG LOGGING (dev mode only)
// ============================================================================

if (env.isDev) {
  console.log('[Config] Environment initialized:', {
    mode: env.isProd ? 'production' : 'development',
    useMockData: env.useMockData,
    apiBaseUrl: env.apiBaseUrl,
    storageBucket: env.storageBucket,
  });
}
