/**
 * Rate Limiting Service
 *
 * PHASE 6: Prevent abuse and ensure fair resource allocation.
 *
 * Strategy:
 * - Token bucket algorithm (smooth, allows bursts)
 * - Per-user limits (authenticated requests)
 * - Per-IP limits (unauthenticated requests)
 * - Per-endpoint limits (API endpoints have different limits)
 * - Tiered limits (different limits per service tier)
 *
 * Storage: Redis (distributed, fast)
 * Fallback: In-memory (if Redis unavailable)
 */

import { ServiceTier } from '@/types';

/**
 * Rate limit configuration per endpoint
 */
export interface RateLimitConfig {
  /** Requests per minute */
  requests_per_minute: number;

  /** Burst allowance (can exceed RPM for short time) */
  burst_size: number;

  /** If true, tier determines limits */
  tier_aware: boolean;
}

/**
 * Rate limits by endpoint and tier
 */
export const RATE_LIMITS: Record<string, Record<ServiceTier | 'unauthenticated', RateLimitConfig>> = {
  // Authentication endpoints (strict)
  '/api/auth/login': {
    basic: { requests_per_minute: 5, burst_size: 10, tier_aware: false },
    business: { requests_per_minute: 5, burst_size: 10, tier_aware: false },
    enterprise: { requests_per_minute: 5, burst_size: 10, tier_aware: false },
    museum: { requests_per_minute: 5, burst_size: 10, tier_aware: false },
    unauthenticated: { requests_per_minute: 5, burst_size: 10, tier_aware: false }
  },

  // Project list endpoint (tier-aware)
  '/api/projects': {
    basic: { requests_per_minute: 30, burst_size: 60, tier_aware: true },
    business: { requests_per_minute: 60, burst_size: 120, tier_aware: true },
    enterprise: { requests_per_minute: 300, burst_size: 500, tier_aware: true },
    museum: { requests_per_minute: 100, burst_size: 200, tier_aware: true },
    unauthenticated: { requests_per_minute: 0, burst_size: 0, tier_aware: false }
  },

  // Asset upload (tiered limits)
  '/api/assets/upload-url': {
    basic: { requests_per_minute: 5, burst_size: 10, tier_aware: true },
    business: { requests_per_minute: 20, burst_size: 40, tier_aware: true },
    enterprise: { requests_per_minute: 100, burst_size: 200, tier_aware: true },
    museum: { requests_per_minute: 30, burst_size: 60, tier_aware: true },
    unauthenticated: { requests_per_minute: 0, burst_size: 0, tier_aware: false }
  },

  // API access (Enterprise only)
  '/api/*': {
    basic: { requests_per_minute: 0, burst_size: 0, tier_aware: false },
    business: { requests_per_minute: 0, burst_size: 0, tier_aware: false },
    enterprise: { requests_per_minute: 1000, burst_size: 2000, tier_aware: true },
    museum: { requests_per_minute: 0, burst_size: 0, tier_aware: false },
    unauthenticated: { requests_per_minute: 0, burst_size: 0, tier_aware: false }
  },

  // Public gallery (generous)
  '/api/gallery': {
    basic: { requests_per_minute: 60, burst_size: 120, tier_aware: false },
    business: { requests_per_minute: 60, burst_size: 120, tier_aware: false },
    enterprise: { requests_per_minute: 60, burst_size: 120, tier_aware: false },
    museum: { requests_per_minute: 60, burst_size: 120, tier_aware: false },
    unauthenticated: { requests_per_minute: 60, burst_size: 120, tier_aware: false }
  }
};

/**
 * Rate limit result
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAfter: number; // seconds
  retryAfter?: number; // seconds (if rate limited)
}

/**
 * Check if request is rate limited
 *
 * In production, this would:
 * 1. Check Redis for token bucket
 * 2. Decrement tokens if available
 * 3. Return remaining tokens
 * 4. Return 429 if no tokens available
 */
export async function checkRateLimit(
  userId: string | 'unauthenticated',
  endpoint: string,
  tier?: ServiceTier
): Promise<RateLimitResult> {
  // Get config for endpoint
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS['/api/*'];
  const tierConfig = tier ? config[tier] : config.unauthenticated;

  // In real implementation:
  // 1. Get token bucket from Redis
  // 2. If tokens available, decrement and return
  // 3. If no tokens, return rate limited

  return {
    allowed: true,
    remaining: tierConfig.requests_per_minute,
    resetAfter: 60
  };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': '60',
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + result.resetAfter)
  };
}

/**
 * Get default rate limit config for endpoint
 */
export function getDefaultRateLimit(endpoint: string, tier: ServiceTier = 'basic'): RateLimitConfig {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS['/api/*'];
  return config[tier] || { requests_per_minute: 30, burst_size: 60, tier_aware: true };
}
