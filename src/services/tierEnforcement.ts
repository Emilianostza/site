/**
 * Tier Enforcement Engine
 *
 * PHASE 5: Validates operations against tier limits.
 * All checks are performed SERVER-SIDE (frontend cannot bypass).
 *
 * When an operation is attempted:
 * 1. Check user's tier
 * 2. Check if feature is enabled for tier
 * 3. Check if limit is exceeded for tier
 * 4. Block or allow operation
 *
 * Example:
 * User tries to upload 6th model on Basic tier (max 5)
 * Server checks: tier.max_models = 5, current = 5, incoming = 1
 * Result: 403 Limit Exceeded, "Upgrade to Business to add more models"
 */

import type { ServiceTier } from '@/types';
import { getTierFeatures, isTierFeatureEnabled, getTierLimit, getTierInfo } from '@/services/tiers';

/**
 * Tier validation result
 */
export interface TierValidationResult {
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
  message?: string; // User-friendly message
}

/**
 * Check if user can upload a model
 */
export function canUploadModel(tier: ServiceTier, currentModelCount: number): TierValidationResult {
  // Check model count limit
  const maxModels = getTierLimit(tier, 'max_models');
  if (currentModelCount >= maxModels) {
    return {
      allowed: false,
      reason: 'Model limit exceeded',
      limit: maxModels,
      current: currentModelCount,
      message: `Model limit (${maxModels}) reached. Upgrade to continue.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if file size is within tier limit
 */
export function canUploadFileSize(tier: ServiceTier, fileSizeMb: number): TierValidationResult {
  const maxSizeMb = getTierLimit(tier, 'max_model_size_mb');

  if (fileSizeMb > maxSizeMb) {
    return {
      allowed: false,
      reason: 'File size exceeds tier limit',
      limit: maxSizeMb,
      current: fileSizeMb,
      message: `File too large. Max ${maxSizeMb}MB for your tier.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if feature is available in tier
 */
export function canUseFeature(
  tier: ServiceTier,
  feature:
    | 'custom_domain'
    | 'api_access'
    | 'guided_mode'
    | 'kiosk_mode'
    | 'analytics_basic'
    | 'analytics_advanced'
    | 'viewer_customization'
): TierValidationResult {
  if (!isTierFeatureEnabled(tier, feature)) {
    const tierInfo = getTierInfo(tier);
    return {
      allowed: false,
      reason: 'Feature not available in this tier',
      message: `This feature requires a higher tier. Upgrade from ${tierInfo.name} to enable it.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if custom domain is allowed
 */
export function canUseCustomDomain(tier: ServiceTier): TierValidationResult {
  return canUseFeature(tier, 'custom_domain');
}

/**
 * Check if API access is allowed
 */
export function canUseAPI(tier: ServiceTier): TierValidationResult {
  return canUseFeature(tier, 'api_access');
}

/**
 * Check if guided mode is available
 */
export function canUseGuidedMode(tier: ServiceTier): TierValidationResult {
  return canUseFeature(tier, 'guided_mode');
}

/**
 * Check if kiosk mode is available
 */
export function canUseKioskMode(tier: ServiceTier): TierValidationResult {
  return canUseFeature(tier, 'kiosk_mode');
}

/**
 * Check if analytics are available
 */
export function canUseAnalytics(
  tier: ServiceTier,
  type: 'basic' | 'advanced'
): TierValidationResult {
  const feature = type === 'advanced' ? 'analytics_advanced' : 'analytics_basic';
  return canUseFeature(tier, feature);
}

/**
 * Determine support level for tier
 */
export function getSupportLevel(
  tier: ServiceTier
): 'community' | 'standard' | 'priority' | 'dedicated' {
  const features = getTierFeatures(tier);
  return features.support_level;
}

/**
 * Determine SLA uptime percentage
 */
export function getSLAUptime(tier: ServiceTier): number {
  const features = getTierFeatures(tier);
  return features.sla_uptime;
}

/**
 * Get upgrade message (what user needs to do to enable feature)
 */
export function getUpgradeMessage(currentTier: ServiceTier, _featureNeeded: string): string {
  const tierInfo = getTierInfo(currentTier);
  return `This feature requires a higher tier than ${tierInfo.name}. Please upgrade your plan.`;
}

/**
 * Comprehensive project operation validation
 * Checks all relevant tier limits before allowing operation
 */
export function validateProjectOperation(
  tier: ServiceTier,
  operation: 'create' | 'upload' | 'customize' | 'api_access',
  context?: {
    fileSize?: number;
    currentModelCount?: number;
  }
): TierValidationResult {
  switch (operation) {
    case 'create':
      // Creating a project is always allowed (just choosing a tier)
      return { allowed: true };

    case 'upload':
      // Validate upload limits
      if (context?.currentModelCount !== undefined) {
        const modelCheck = canUploadModel(tier, context.currentModelCount);
        if (!modelCheck.allowed) return modelCheck;
      }

      if (context?.fileSize !== undefined) {
        const sizeCheck = canUploadFileSize(tier, context.fileSize);
        if (!sizeCheck.allowed) return sizeCheck;
      }

      return { allowed: true };

    case 'customize':
      // Check if viewer customization is available
      return canUseFeature(tier, 'viewer_customization');

    case 'api_access':
      // Only Enterprise allows API access
      return canUseAPI(tier);

    default:
      return { allowed: false, reason: 'Unknown operation' };
  }
}
