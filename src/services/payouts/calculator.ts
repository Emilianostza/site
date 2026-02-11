/**
 * Payout Calculator
 *
 * Calculates photographer earnings based on:
 * - Project tier (basic, standard, premium, enterprise)
 * - Number of assets delivered
 * - Asset type complexity
 * - Approval status (only approved projects generate payouts)
 *
 * Pricing structure (in cents USD):
 * - Basic: $50-100 per asset
 * - Standard: $100-200 per asset
 * - Premium: $200-500 per asset
 * - Enterprise: Custom (negotiated)
 *
 * All calculations are server-side; client-side is for display only.
 */

import { TierType } from '@/types/domain';
import { AssetType } from '@/types/domain';

// Tier pricing per asset (in cents)
export const TIER_PRICING: Record<TierType, { min: number; max: number }> = {
  [TierType.Basic]: { min: 5000, max: 10000 }, // $50-100
  [TierType.Standard]: { min: 10000, max: 20000 }, // $100-200
  [TierType.Premium]: { min: 20000, max: 50000 }, // $200-500
  [TierType.Enterprise]: { min: 50000, max: 100000 } // $500-1000
};

// Asset type complexity multipliers
export const ASSET_TYPE_MULTIPLIERS: Record<AssetType, number> = {
  [AssetType.Photo]: 1.0, // Base rate
  [AssetType.Model3D]: 2.0, // 2x more complex
  [AssetType.Mesh]: 2.5, // Even more complex
  [AssetType.PointCloud]: 2.5,
  [AssetType.Video]: 1.5 // Moderately complex
};

/**
 * Calculate payout for a single asset
 *
 * Formula:
 * baseAmount = (min + max) / 2 (average of tier range)
 * multiplier = assetTypeMultiplier
 * finalAmount = baseAmount * multiplier
 */
export function calculateAssetPayout(
  tier: TierType,
  assetType: AssetType,
  quantity: number = 1
): number {
  const tierRange = TIER_PRICING[tier];
  const baseAmount = (tierRange.min + tierRange.max) / 2;
  const multiplier = ASSET_TYPE_MULTIPLIERS[assetType];

  return Math.round(baseAmount * multiplier * quantity);
}

/**
 * Calculate total payout for a project
 *
 * Sums all asset payouts + applies any adjustments
 */
export function calculateProjectPayout(
  tier: TierType,
  assetBreakdown: { assetType: AssetType; quantity: number }[],
  adjustments?: {
    bonus?: number; // Additional amount in cents
    discount?: number; // Deduction in cents
    multiplier?: number; // e.g., 1.5 for 50% bonus
  }
): number {
  let total = 0;

  // Sum all assets
  for (const asset of assetBreakdown) {
    total += calculateAssetPayout(tier, asset.assetType, asset.quantity);
  }

  // Apply adjustments
  if (adjustments?.multiplier) {
    total = Math.round(total * adjustments.multiplier);
  }

  if (adjustments?.bonus) {
    total += adjustments.bonus;
  }

  if (adjustments?.discount) {
    total -= adjustments.discount;
  }

  return Math.max(0, total); // Prevent negative amounts
}

/**
 * Format amount in cents as currency string
 */
export function formatPayoutAmount(cents: number, currency: string = 'USD'): string {
  const dollars = (cents / 100).toFixed(2);

  if (currency === 'USD') {
    return `$${dollars}`;
  } else if (currency === 'EUR') {
    return `€${dollars}`;
  } else {
    return `${currency} ${dollars}`;
  }
}

/**
 * Calculate take-home after platform fee
 * Platform takes 15% (standard SaaS fee)
 */
export function calculateTakeHome(
  grossAmount: number,
  platformFeePercent: number = 15
): { gross: number; fee: number; net: number } {
  const fee = Math.round(grossAmount * (platformFeePercent / 100));
  const net = grossAmount - fee;

  return {
    gross: grossAmount,
    fee,
    net: Math.max(0, net)
  };
}

/**
 * Check if payout meets minimum threshold for processing
 * Don't pay out unless at least $10
 */
export function isPayoutProcessable(amount: number, minAmount: number = 1000): boolean {
  return amount >= minAmount;
}
