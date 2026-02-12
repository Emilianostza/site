/**
 * Payouts Service
 *
 * Manages photographer earnings, approvals, and payments.
 *
 * Workflow:
 * 1. Project delivered → System creates Payout record with calculated amount
 * 2. Finance team reviews pending payouts
 * 3. Finance approves payout → Status becomes 'approved'
 * 4. Payment processor (Stripe, ACH) sends payment
 * 5. Webhook confirms payment → Status becomes 'paid'
 * 6. Photographer receives invoice/receipt
 */

import { apiClient } from '@/services/api/client';
import { PayoutDTO } from '@/types/dtos';
import { Payout, PayoutStatus } from '@/types/domain';

export interface PayoutFilter {
  status?: PayoutStatus;
  photographerId?: string;
  dateFrom?: string;
  dateTo?: string;
  cursor?: string;
  limit?: number;
}

/**
 * Fetch payouts with filtering
 * Admin/Finance can see all; photographers see only their own
 */
export async function fetchPayouts(filter: PayoutFilter): Promise<{
  payouts: PayoutDTO[];
  nextCursor?: string;
}> {
  const params = new URLSearchParams();

  if (filter.status) params.append('status', filter.status);
  if (filter.photographerId) params.append('photographer_id', filter.photographerId);
  if (filter.dateFrom) params.append('date_from', filter.dateFrom);
  if (filter.dateTo) params.append('date_to', filter.dateTo);
  if (filter.cursor) params.append('cursor', filter.cursor);
  if (filter.limit) params.append('limit', filter.limit.toString());

  const response = await apiClient.get<{ data: PayoutDTO[]; next_cursor?: string }>(
    `/payouts?${params.toString()}`
  );

  return {
    payouts: response.data,
    nextCursor: (response as any).next_cursor,
  };
}

/**
 * Get single payout
 */
export async function getPayout(id: string): Promise<PayoutDTO> {
  const response = await apiClient.get<PayoutDTO>(`/payouts/${id}`);
  return response;
}

/**
 * Approve payout (finance workflow)
 * Only admins/finance can approve
 */
export async function approvePayout(id: string, approvedBy?: string): Promise<PayoutDTO> {
  const response = await apiClient.patch<{ data: PayoutDTO }>(`/payouts/${id}/approve`, {
    approved_by: approvedBy,
  });
  return response.data;
}

/**
 * Reject payout
 * Returns to pending, not processed
 */
export async function rejectPayout(id: string, reason: string): Promise<PayoutDTO> {
  const response = await apiClient.patch<{ data: PayoutDTO }>(`/payouts/${id}/reject`, {
    reason,
  });
  return response.data;
}

/**
 * Mark payout as paid
 * Called after payment processor confirms delivery
 */
export async function markPayoutAsPaid(
  id: string,
  referenceId: string, // Bank transfer ID, check #, etc.
  paidAt?: string
): Promise<PayoutDTO> {
  const response = await apiClient.patch<{ data: PayoutDTO }>(`/payouts/${id}/mark-paid`, {
    reference_id: referenceId,
    paid_at: paidAt || new Date().toISOString(),
  });
  return response.data;
}

/**
 * Get photographer's payout summary
 * Total earned, pending, paid, etc.
 */
export async function getPhotographerPayoutSummary(photographerId: string): Promise<{
  total_earned: number; // cents
  total_paid: number; // cents
  pending_approval: number; // cents
  pending_payment: number; // cents
  average_per_project: number; // cents
  project_count: number;
}> {
  const response = await apiClient.get<any>(`/photographers/${photographerId}/payout-summary`);
  return response;
}

/**
 * Request payout (photographer initiates withdrawal)
 * Creates a new payout if threshold met
 */
export async function requestPayout(photographerId: string): Promise<PayoutDTO> {
  const response = await apiClient.post<{ data: PayoutDTO }>('/payouts/request', {
    photographer_id: photographerId,
  });
  return response.data;
}

/**
 * Generate invoice/receipt for payout
 */
export async function generatePayoutInvoice(
  payoutId: string,
  format: 'pdf' | 'json' = 'pdf'
): Promise<{ url: string; invoiceId: string }> {
  const response = await apiClient.post<{ url: string; invoiceId: string }>(
    `/payouts/${payoutId}/invoice`,
    { format }
  );
  return response;
}

/**
 * Export payouts for accounting (CSV, JSON)
 */
export async function exportPayouts(
  format: 'csv' | 'json' | 'quickbooks',
  filter?: PayoutFilter
): Promise<{ url: string }> {
  const response = await apiClient.post<{ url: string }>('/payouts/export', {
    format,
    filter,
  });
  return response;
}

/**
 * Domain model converter (DTO → Domain)
 */
export function payoutFromDTO(dto: PayoutDTO): Payout {
  return {
    id: dto.id,
    orgId: dto.org_id,
    projectId: dto.project_id,
    assetIds: dto.asset_ids,
    photographerId: dto.photographer_id,
    amount: dto.amount,
    currency: dto.currency,
    tier: dto.tier,
    status: dto.status,
    approvedAt: dto.approved_at,
    approvedBy: dto.approved_by,
    paidAt: dto.paid_at,
    invoiceId: dto.invoice_id,
    invoiceUrl: dto.invoice_url,
    referenceId: dto.reference_id,
    metadata: dto.metadata,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    deletedAt: dto.deleted_at,
  };
}

/**
 * Payout status descriptions for UI
 */
export const PAYOUT_STATUS_DESCRIPTIONS: Record<
  PayoutStatus,
  { label: string; description: string; color: string }
> = {
  [PayoutStatus.Pending]: {
    label: 'Pending',
    description: 'Awaiting finance approval',
    color: 'bg-yellow-100 text-yellow-800',
  },
  [PayoutStatus.Approved]: {
    label: 'Approved',
    description: 'Approved, waiting for payment processing',
    color: 'bg-blue-100 text-blue-800',
  },
  [PayoutStatus.Paid]: {
    label: 'Paid',
    description: 'Payment sent to photographer',
    color: 'bg-green-100 text-green-800',
  },
  [PayoutStatus.Rejected]: {
    label: 'Rejected',
    description: 'Finance rejected this payout',
    color: 'bg-red-100 text-red-800',
  },
  [PayoutStatus.Failed]: {
    label: 'Failed',
    description: 'Payment processing failed',
    color: 'bg-red-100 text-red-800',
  },
};
