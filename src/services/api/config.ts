/**
 * API Configuration and Feature Flags
 *
 * Routes to centralized env config.
 * Controls whether the app uses mock data or real API calls.
 */

import { env } from '@/config/env';

export const API_CONFIG = {
  useMockData: env.useMockData,
  baseUrl: env.apiBaseUrl,
  timeout: env.apiTimeout,
  mockDelay: 500,
} as const;

/**
 * Check if app is currently using mock data
 */
export function isUsingMockData(): boolean {
  return API_CONFIG.useMockData;
}

/**
 * Check if app is running in development
 */
export function isDevelopment(): boolean {
  return env.isDev;
}

/**
 * Log current API configuration (dev mode only)
 */
if (isDevelopment()) {
  console.log('[API Config] initialized from env config');
}
