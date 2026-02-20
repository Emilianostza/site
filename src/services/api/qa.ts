/**
 * QA (Quality Assurance) Service
 *
 * Manages QA checks, approvals, and rejections before project delivery.
 *
 * Flow:
 * 1. Technician uploads assets
 * 2. QA reviewer checks assets (photos, 3D models, metadata)
 * 3. QA reviewer approves or requests changes
 * 4. If changes requested, technician re-uploads corrected assets
 * 5. Once approved, project can be delivered
 */

import { apiClient } from '@/services/api/client';

export enum QAStatus {
  Pending = 'pending',
  UnderReview = 'under_review',
  ChangesRequested = 'changes_requested',
  Approved = 'approved',
  Rejected = 'rejected',
}

export interface QAChecklistItem {
  id: string;
  item: string; // "3D model is complete", "Photos are in focus", etc.
  required: boolean;
  completed: boolean;
  notes?: string;
}

export interface QACheckRequest {
  project_id: string;
  asset_ids: string[];
  checklist: QAChecklistItem[];
}

export interface QACheckResponse {
  id: string;
  project_id: string;
  asset_ids: string[];
  status: QAStatus;
  checklist: QAChecklistItem[];
  reviewer_id?: string;
  reviewed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Submit assets for QA review
 */
export async function submitForQA(request: QACheckRequest): Promise<QACheckResponse> {
  const response = await apiClient.post<{ data: QACheckResponse }>('/qa/checks', request);
  return response.data;
}

/**
 * Get QA check for project
 */
export async function getQACheck(projectId: string): Promise<QACheckResponse | null> {
  try {
    const response = await apiClient.get<QACheckResponse>(`/qa/checks?project_id=${projectId}`);
    return response;
  } catch (err: any) {
    // Only treat 404 as "no QA check yet"; re-throw actual errors
    if (err?.status === 404) return null;
    throw err;
  }
}

/**
 * Approve QA check (reviewer confirms all items pass)
 */
export async function approveQA(qaCheckId: string, notes?: string): Promise<QACheckResponse> {
  const response = await apiClient.patch<{ data: QACheckResponse }>(
    `/qa/checks/${qaCheckId}/approve`,
    {
      notes,
    }
  );
  return response.data;
}

/**
 * Request changes (reviewer marks items that need work)
 */
export async function requestQAChanges(
  qaCheckId: string,
  changedItems: QAChecklistItem[],
  notes: string
): Promise<QACheckResponse> {
  const response = await apiClient.patch<{ data: QACheckResponse }>(
    `/qa/checks/${qaCheckId}/request-changes`,
    {
      changed_items: changedItems,
      notes,
    }
  );
  return response.data;
}

/**
 * Reject QA check entirely (major issues)
 */
export async function rejectQA(qaCheckId: string, reason: string): Promise<QACheckResponse> {
  const response = await apiClient.patch<{ data: QACheckResponse }>(
    `/qa/checks/${qaCheckId}/reject`,
    {
      reason,
    }
  );
  return response.data;
}

/**
 * Resubmit for QA after changes
 */
export async function resubmitForQA(
  qaCheckId: string,
  updatedAssetIds: string[]
): Promise<QACheckResponse> {
  const response = await apiClient.patch<{ data: QACheckResponse }>(
    `/qa/checks/${qaCheckId}/resubmit`,
    {
      asset_ids: updatedAssetIds,
    }
  );
  return response.data;
}

/**
 * Get QA history for asset (all QA checks it's been through)
 */
export async function getAssetQAHistory(assetId: string): Promise<QACheckResponse[]> {
  const response = await apiClient.get<QACheckResponse[]>(`/assets/${assetId}/qa-history`);
  return response;
}

/**
 * QA status descriptions
 */
export const QA_STATUS_DESCRIPTIONS: Record<
  QAStatus,
  { label: string; description: string; color: string }
> = {
  [QAStatus.Pending]: {
    label: 'Pending QA',
    description: 'Waiting for QA review',
    color: 'bg-gray-100 text-gray-800',
  },
  [QAStatus.UnderReview]: {
    label: 'Under Review',
    description: 'QA reviewer is checking assets',
    color: 'bg-blue-100 text-blue-800',
  },
  [QAStatus.ChangesRequested]: {
    label: 'Changes Requested',
    description: 'Reviewer found issues, technician needs to fix',
    color: 'bg-yellow-100 text-yellow-800',
  },
  [QAStatus.Approved]: {
    label: 'QA Approved',
    description: 'All assets meet quality standards',
    color: 'bg-green-100 text-green-800',
  },
  [QAStatus.Rejected]: {
    label: 'QA Rejected',
    description: 'Assets do not meet quality standards',
    color: 'bg-red-100 text-red-800',
  },
};
