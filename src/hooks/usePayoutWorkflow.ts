/**
 * Payout Workflow Hook
 *
 * Manages payout status transitions and approvals.
 *
 * Usage:
 * const payout = usePayoutWorkflow(payoutId, currentStatus, userRole);
 *
 * if (payout.canApprove) {
 *   await payout.approve();
 * }
 */

import { useState, useCallback, useEffect } from 'react';
import { PayoutStatus } from '@/types/domain';
import {
  approvePayout,
  rejectPayout,
  markPayoutAsPaid,
  getPhotographerPayoutSummary,
} from '@/services/api/payouts';
import { PAYOUT_STATUS_DESCRIPTIONS } from '@/services/api/payouts';

export function usePayoutWorkflow(
  payoutId: string,
  currentStatus: PayoutStatus,
  userRole: 'admin' | 'finance' | 'photographer'
) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Permissions based on role and current status
  const canApprove =
    userRole === 'admin' || (userRole === 'finance' && currentStatus === PayoutStatus.Pending);
  const canReject = userRole === 'admin' && currentStatus === PayoutStatus.Pending;
  const canMarkPaid = userRole === 'admin' && currentStatus === PayoutStatus.Approved;

  /**
   * Approve payout for payment processing
   */
  const approve = useCallback(async () => {
    if (!canApprove) {
      throw new Error('Not authorized to approve this payout');
    }

    setIsTransitioning(true);
    setError(null);

    try {
      await approvePayout(payoutId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to approve payout';
      setError(errorMsg);
      throw err;
    } finally {
      setIsTransitioning(false);
    }
  }, [payoutId, canApprove]);

  /**
   * Reject payout
   */
  const reject = useCallback(
    async (reason: string) => {
      if (!canReject) {
        throw new Error('Not authorized to reject this payout');
      }

      setIsTransitioning(true);
      setError(null);

      try {
        await rejectPayout(payoutId, reason);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to reject payout';
        setError(errorMsg);
        throw err;
      } finally {
        setIsTransitioning(false);
      }
    },
    [payoutId, canReject]
  );

  /**
   * Mark as paid (after payment processor confirms)
   */
  const markPaid = useCallback(
    async (referenceId: string) => {
      if (!canMarkPaid) {
        throw new Error('Not authorized to mark this payout as paid');
      }

      setIsTransitioning(true);
      setError(null);

      try {
        await markPayoutAsPaid(payoutId, referenceId);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to mark payout as paid';
        setError(errorMsg);
        throw err;
      } finally {
        setIsTransitioning(false);
      }
    },
    [payoutId, canMarkPaid]
  );

  return {
    // Current state
    status: currentStatus,
    statusInfo: PAYOUT_STATUS_DESCRIPTIONS[currentStatus],
    isTransitioning,
    error,

    // Permissions
    canApprove,
    canReject,
    canMarkPaid,

    // Actions
    approve,
    reject,
    markPaid,

    // Clear error
    clearError: () => setError(null),
  };
}

/**
 * Hook to fetch and display photographer's payout summary
 */
export function usePhotographerPayoutSummary(photographerId: string) {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPhotographerPayoutSummary(photographerId);
      setSummary(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch payout summary';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [photographerId]);

  // Fetch on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    summary,
    loading,
    error,
    refresh,
  };
}
