/**
 * Tier System Configuration
 *
 * PHASE 5: Service tiers define what features are available.
 * All limits are enforced SERVER-SIDE (frontend cannot bypass).
 *
 * Tiers:
 * - Basic: Entry level, limited features
 * - Business: Mid-tier, analytics + branding
 * - Enterprise: High-end, API access + SLA
 * - Museum: Specialized, guided mode + accessibility
 *
 * Tiers are immutable once selected (no downgrade/upgrade mid-project).
 * To change tier, customer must create new project.
 */

import { ServiceTier } from '@/types';

/**
 * Feature flags for each tier
 */
export interface TierFeatures {
  // Asset/model limits
  max_models: number;
  max_model_size_mb: number;
  max_concurrent_uploads: number;

  // Viewer features
  ar_enabled: boolean;
  viewer_customization: boolean;
  guided_mode: boolean;
  kiosk_mode: boolean;
  annotations: boolean;

  // Analytics & reporting
  analytics_basic: boolean;
  analytics_advanced: boolean;
  download_analytics: boolean;

  // Branding & customization
  custom_domain: boolean;
  custom_branding: boolean;
  white_label: boolean;

  // API & integrations
  api_access: boolean;
  webhook_support: boolean;
  custom_integrations: boolean;

  // Support & SLA
  support_level: 'community' | 'standard' | 'priority' | 'dedicated';
  sla_uptime: number; // 99.5, 99.9, 99.99, etc.

  // Accessibility
  accessibility_enhanced: boolean;
  multi_language: number; // number of languages
}

/**
 * Tier definitions
 */
export const TIER_DEFINITIONS: Record<
  ServiceTier,
  {
    name: string;
    description: string;
    price_usd_per_month: number;
    features: TierFeatures;
  }
> = {
  [ServiceTier.Basic]: {
    name: 'Basic',
    description: 'Perfect for trying out 3D photogrammetry',
    price_usd_per_month: 49,
    features: {
      // Asset limits
      max_models: 5,
      max_model_size_mb: 100,
      max_concurrent_uploads: 1,

      // Viewer
      ar_enabled: true,
      viewer_customization: false,
      guided_mode: false,
      kiosk_mode: false,
      annotations: false,

      // Analytics
      analytics_basic: false,
      analytics_advanced: false,
      download_analytics: false,

      // Branding
      custom_domain: false,
      custom_branding: false,
      white_label: false,

      // API
      api_access: false,
      webhook_support: false,
      custom_integrations: false,

      // Support
      support_level: 'community',
      sla_uptime: 99.5,

      // Accessibility
      accessibility_enhanced: false,
      multi_language: 1,
    },
  },

  [ServiceTier.Business]: {
    name: 'Business',
    description: 'For growing businesses needing analytics and branding',
    price_usd_per_month: 199,
    features: {
      // Asset limits
      max_models: 50,
      max_model_size_mb: 500,
      max_concurrent_uploads: 5,

      // Viewer
      ar_enabled: true,
      viewer_customization: true,
      guided_mode: true,
      kiosk_mode: false,
      annotations: true,

      // Analytics
      analytics_basic: true,
      analytics_advanced: false,
      download_analytics: true,

      // Branding
      custom_domain: true,
      custom_branding: true,
      white_label: false,

      // API
      api_access: false,
      webhook_support: false,
      custom_integrations: false,

      // Support
      support_level: 'standard',
      sla_uptime: 99.9,

      // Accessibility
      accessibility_enhanced: true,
      multi_language: 5,
    },
  },

  [ServiceTier.Enterprise]: {
    name: 'Enterprise',
    description: 'For enterprises requiring API access and dedicated support',
    price_usd_per_month: 999,
    features: {
      // Asset limits
      max_models: 500,
      max_model_size_mb: 2000,
      max_concurrent_uploads: 20,

      // Viewer
      ar_enabled: true,
      viewer_customization: true,
      guided_mode: true,
      kiosk_mode: true,
      annotations: true,

      // Analytics
      analytics_basic: true,
      analytics_advanced: true,
      download_analytics: true,

      // Branding
      custom_domain: true,
      custom_branding: true,
      white_label: true,

      // API
      api_access: true,
      webhook_support: true,
      custom_integrations: true,

      // Support
      support_level: 'dedicated',
      sla_uptime: 99.99,

      // Accessibility
      accessibility_enhanced: true,
      multi_language: 20,
    },
  },

  [ServiceTier.Museum]: {
    name: 'Museum',
    description: 'Specialized for museums and cultural institutions',
    price_usd_per_month: 299,
    features: {
      // Asset limits
      max_models: 200,
      max_model_size_mb: 1000,
      max_concurrent_uploads: 10,

      // Viewer
      ar_enabled: true,
      viewer_customization: true,
      guided_mode: true,
      kiosk_mode: true,
      annotations: true,

      // Analytics
      analytics_basic: true,
      analytics_advanced: false,
      download_analytics: false,

      // Branding
      custom_domain: true,
      custom_branding: true,
      white_label: false,

      // API
      api_access: false,
      webhook_support: false,
      custom_integrations: false,

      // Support
      support_level: 'priority',
      sla_uptime: 99.9,

      // Accessibility (museums require high accessibility)
      accessibility_enhanced: true,
      multi_language: 10,
    },
  },
};

/**
 * Get tier features
 */
export function getTierFeatures(tier: ServiceTier): TierFeatures {
  return TIER_DEFINITIONS[tier].features;
}

/**
 * Get tier metadata (name, price, etc)
 */
export function getTierInfo(tier: ServiceTier) {
  return TIER_DEFINITIONS[tier];
}

/**
 * Check if feature is enabled for tier
 */
export function isTierFeatureEnabled(tier: ServiceTier, feature: keyof TierFeatures): boolean {
  const features = getTierFeatures(tier);
  const value = features[feature];

  // Handle boolean features
  if (typeof value === 'boolean') {
    return value;
  }

  // Handle numeric features (enabled if > 0)
  if (typeof value === 'number') {
    return value > 0;
  }

  // Handle string features (enabled if not 'community')
  if (typeof value === 'string') {
    return value !== 'community';
  }

  return false;
}

/**
 * Check if tier limit is exceeded
 */
export function isTierLimitExceeded(
  tier: ServiceTier,
  limit: 'max_models' | 'max_model_size_mb' | 'max_concurrent_uploads',
  current: number
): boolean {
  const features = getTierFeatures(tier);
  const max = features[limit] as number;
  return current >= max;
}

/**
 * Get tier limit
 */
export function getTierLimit(
  tier: ServiceTier,
  limit: 'max_models' | 'max_model_size_mb' | 'max_concurrent_uploads'
): number {
  const features = getTierFeatures(tier);
  return features[limit] as number;
}

/**
 * Validate tier is valid
 */
export function isValidTier(tier: string): tier is ServiceTier {
  return Object.values(ServiceTier).includes(tier as ServiceTier);
}

/**
 * Get all available tiers
 */
export function getAllTiers(): ServiceTier[] {
  return Object.values(ServiceTier) as ServiceTier[];
}

/**
 * Sort tiers by price (ascending)
 */
export function getTiersSortedByPrice(): ServiceTier[] {
  return getAllTiers().sort((a, b) => {
    const priceA = getTierInfo(a).price_usd_per_month;
    const priceB = getTierInfo(b).price_usd_per_month;
    return priceA - priceB;
  });
}

/**
 * Get upgrade path recommendations
 * Returns tiers that unlock more features
 */
export function getUpgradeOptions(currentTier: ServiceTier): ServiceTier[] {
  const current = getTierInfo(currentTier).price_usd_per_month;
  return getAllTiers().filter((tier) => getTierInfo(tier).price_usd_per_month > current);
}
