/**
 * Caching Layer
 *
 * PHASE 6: In-memory cache for API responses with TTL and tier-aware expiration.
 *
 * Features:
 * - LRU eviction when cache exceeds max size
 * - Tier-specific cache TTLs (higher tiers get longer caches)
 * - Automatic invalidation on mutations
 * - Cache statistics for monitoring
 * - Configurable per-endpoint cache strategies
 *
 * Cache Tiers:
 * - Basic tier: 5 minutes (limited cache)
 * - Business tier: 15 minutes (standard cache)
 * - Enterprise tier: 1 hour (extended cache)

 */

import { ServiceTier } from '@/types';

/**
 * Cache entry with metadata
 */
export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number; // milliseconds
  hits: number;
  lastAccessed: number;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
  totalSize: number;
  maxSize: number;
}

/**
 * Tier-specific cache TTLs
 */
export const CACHE_TTLS: Record<ServiceTier, number> = {
  [ServiceTier.Basic]: 5 * 60 * 1000, // 5 minutes
  [ServiceTier.Business]: 15 * 60 * 1000, // 15 minutes
  [ServiceTier.Enterprise]: 60 * 60 * 1000, // 1 hour
};

/**
 * Cache configuration per endpoint
 */
export interface CacheConfig {
  enabled: boolean;
  ttl?: number; // Override default TTL
  invalidateOn?: string[]; // List of mutation endpoints that invalidate this cache
}

/**
 * Cache strategies for different endpoints
 */
export const CACHE_STRATEGIES: Record<string, CacheConfig> = {
  // User/Auth (always cached, invalidated on logout)
  '/auth/me': { enabled: true, ttl: 10 * 60 * 1000, invalidateOn: ['/auth/logout'] },

  // Projects (cached, invalidated on create/update/delete)
  '/projects': { enabled: true, invalidateOn: ['/projects', '/projects/:id'] },
  '/projects/:id': { enabled: true, invalidateOn: ['/projects/:id'] },

  // Assets (cached, invalidated on upload/delete)
  '/assets': { enabled: true, invalidateOn: ['/assets', '/assets/:id'] },
  '/assets/:id': { enabled: true, invalidateOn: ['/assets/:id'] },
  '/assets/:id/access-url': { enabled: true, invalidateOn: ['/assets/:id'] },

  // Analytics (cached with longer TTL)
  '/analytics/project/:id': { enabled: true, ttl: 60 * 60 * 1000 },
  '/analytics/dashboard': { enabled: true, ttl: 60 * 60 * 1000 },

  // Tier info (rarely changes, long cache)
  '/tiers': { enabled: true, ttl: 24 * 60 * 60 * 1000 },

  // Mutations (never cached)
  POST: { enabled: false },
  PUT: { enabled: false },
  DELETE: { enabled: false },
  PATCH: { enabled: false },
};

/**
 * Cache manager with LRU eviction
 */
class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 1000; // Max entries
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
  };

  /**
   * Generate cache key from URL and params
   */
  generateKey(url: string, params?: Record<string, any>): string {
    let key = url;
    if (params && Object.keys(params).length > 0) {
      const sorted = Object.keys(params)
        .sort()
        .map((k) => `${k}=${JSON.stringify(params[k])}`)
        .join('&');
      key += `?${sorted}`;
    }
    return key;
  }

  /**
   * Get cached value if valid
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check expiration
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update hit stats
    entry.hits++;
    entry.lastAccessed = now;
    this.stats.hits++;

    return entry.value as T;
  }

  /**
   * Set cached value with TTL
   */
  set<T>(key: string, value: T, ttl: number): void {
    // Evict LRU entry if cache is full
    if (this.cache.size >= this.maxSize) {
      let lruKey = '';
      let lruTime = Infinity;

      for (const [k, entry] of this.cache) {
        if (entry.lastAccessed < lruTime) {
          lruTime = entry.lastAccessed;
          lruKey = k;
        }
      }

      if (lruKey) {
        this.cache.delete(lruKey);
        this.stats.evictions++;
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0,
      lastAccessed: Date.now(),
    });
  }

  /**
   * Invalidate cache by pattern (e.g., "/projects/:id" matches "/projects/123")
   */
  invalidate(pattern: string): void {
    const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '[^/]+')}($|\\?)`);

    const keysToDelete: string[] = [];
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
      evictions: this.stats.evictions,
      totalSize: this.cache.size,
      maxSize: this.maxSize,
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = { hits: 0, misses: 0, evictions: 0 };
  }
}

export const cache = new CacheManager();

/**
 * Get cache TTL for tier
 */
export function getCacheTTL(tier: ServiceTier, overrideTTL?: number): number {
  if (overrideTTL !== undefined) {
    return overrideTTL;
  }
  return CACHE_TTLS[tier];
}

/**
 * Check if endpoint should be cached
 */
export function shouldCache(endpoint: string, method: string = 'GET'): boolean {
  // Check method-level cache config
  if (CACHE_STRATEGIES[method]) {
    return CACHE_STRATEGIES[method].enabled;
  }

  // Check endpoint-specific cache config
  const config = CACHE_STRATEGIES[endpoint];
  return config ? config.enabled : false;
}

/**
 * Get cache config for endpoint
 */
export function getCacheConfig(endpoint: string): CacheConfig | null {
  return CACHE_STRATEGIES[endpoint] || null;
}

/**
 * Cache decorator for async functions
 *
 * Example:
 * ```typescript
 * const cached = withCache(
 *   () => projectsAPI.fetch(),
 *   'projects-list',
 *   getCacheTTL(userTier)
 * );
 * const projects = await cached();
 * ```
 */
export function withCache<T>(fn: () => Promise<T>, key: string, ttl: number): () => Promise<T> {
  return async () => {
    // Check cache first
    const cached = cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch and cache
    const result = await fn();
    cache.set(key, result, ttl);
    return result;
  };
}

/**
 * Middleware for automatic cache invalidation
 *
 * Example (in API client):
 * ```typescript
 * // After POST/PUT/DELETE
 * const response = await request(...);
 * cacheInvalidateOnMutation(endpoint, method);
 * return response;
 * ```
 */
export function cacheInvalidateOnMutation(endpoint: string, method: string): void {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    // Invalidate the endpoint itself
    cache.invalidate(endpoint);

    // Invalidate endpoints that depend on this mutation
    for (const [pattern, config] of Object.entries(CACHE_STRATEGIES)) {
      if (config.invalidateOn?.includes(endpoint)) {
        cache.invalidate(pattern);
      }
    }
  }
}

/**
 * Example usage in API service:
 * ```typescript
 * export async function getProject(projectId: string, tier: ServiceTier): Promise<Project> {
 *   const cached = withCache(
 *     () => apiClient.get(`/projects/${projectId}`),
 *     `project-${projectId}`,
 *     getCacheTTL(tier)
 *   );
 *   return cached();
 * }
 * ```
 */
