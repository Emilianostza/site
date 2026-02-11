/**
 * Audit Logs Service
 *
 * Immutable append-only log of all significant actions.
 * Used for compliance, debugging, and financial reconciliation.
 *
 * Audit trails track:
 * - Who did what (actor)
 * - What changed (from_state → to_state)
 * - When it happened (timestamp)
 * - Why it happened (metadata/reason)
 *
 * Stored server-side only (not client-editable).
 */

import { apiClient } from '@/services/api/client';
import { AuditLogDTO } from '@/types/dtos';
import { AuditLog, AuditEventType } from '@/types/domain';

export interface AuditLogFilter {
  eventType?: AuditEventType;
  resourceType?: string;
  resourceId?: string;
  actorId?: string;
  dateFrom?: string; // ISO timestamp
  dateTo?: string; // ISO timestamp
  cursor?: string;
  limit?: number;
}

/**
 * Fetch audit logs with filtering
 *
 * Backend enforces access control:
 * - Admins can see all org logs
 * - Users can see logs for resources they have access to
 */
export async function fetchAuditLogs(filter: AuditLogFilter): Promise<{
  logs: AuditLogDTO[];
  nextCursor?: string;
}> {
  const params = new URLSearchParams();

  if (filter.eventType) params.append('event_type', filter.eventType);
  if (filter.resourceType) params.append('resource_type', filter.resourceType);
  if (filter.resourceId) params.append('resource_id', filter.resourceId);
  if (filter.actorId) params.append('actor_id', filter.actorId);
  if (filter.dateFrom) params.append('date_from', filter.dateFrom);
  if (filter.dateTo) params.append('date_to', filter.dateTo);
  if (filter.cursor) params.append('cursor', filter.cursor);
  if (filter.limit) params.append('limit', filter.limit.toString());

  const response = await apiClient.get<{ data: AuditLogDTO[]; next_cursor?: string }>(
    `/audit-logs?${params.toString()}`
  );

  return {
    logs: response.data,
    nextCursor: (response as any).next_cursor
  };
}

/**
 * Fetch audit logs for a specific resource (project, asset, payout, etc.)
 */
export async function fetchResourceAuditLog(resourceType: string, resourceId: string): Promise<AuditLogDTO[]> {
  const response = await apiClient.get<AuditLogDTO[]>(
    `/audit-logs?resource_type=${resourceType}&resource_id=${resourceId}`
  );
  return response;
}

/**
 * Get audit log entry
 */
export async function getAuditLog(id: string): Promise<AuditLogDTO> {
  const response = await apiClient.get<AuditLogDTO>(`/audit-logs/${id}`);
  return response;
}

/**
 * Export audit logs (CSV or JSON) for compliance
 * Returns download URL
 */
export async function exportAuditLogs(format: 'csv' | 'json', filter?: AuditLogFilter): Promise<{ url: string }> {
  const response = await apiClient.post<{ url: string }>('/audit-logs/export', {
    format,
    filter
  });
  return response;
}

/**
 * Domain model converter (DTO → Domain)
 */
export function auditLogFromDTO(dto: AuditLogDTO): AuditLog {
  return {
    id: dto.id,
    orgId: dto.org_id,
    eventType: dto.event_type,
    timestamp: dto.timestamp,
    actorId: dto.actor_id,
    actorEmail: dto.actor_email,
    resourceType: dto.resource_type,
    resourceId: dto.resource_id,
    fromState: dto.from_state,
    toState: dto.to_state,
    metadata: dto.metadata
  };
}

/**
 * Event type descriptions for UI
 */
export const EVENT_DESCRIPTIONS: Record<AuditEventType, { label: string; icon: string; color: string }> = {
  [AuditEventType.ProjectCreated]: {
    label: 'Project Created',
    icon: '📋',
    color: 'bg-blue-50'
  },
  [AuditEventType.ProjectApproved]: {
    label: 'Project Approved',
    icon: '✅',
    color: 'bg-green-50'
  },
  [AuditEventType.ProjectDelivered]: {
    label: 'Project Delivered',
    icon: '🚚',
    color: 'bg-green-50'
  },
  [AuditEventType.ProjectRejected]: {
    label: 'Project Rejected',
    icon: '❌',
    color: 'bg-red-50'
  },
  [AuditEventType.AssetUploaded]: {
    label: 'Asset Uploaded',
    icon: '📸',
    color: 'bg-purple-50'
  },
  [AuditEventType.AssetProcessed]: {
    label: 'Asset Processed',
    icon: '⚙️',
    color: 'bg-purple-50'
  },
  [AuditEventType.AssetPublished]: {
    label: 'Asset Published',
    icon: '🌍',
    color: 'bg-blue-50'
  },
  [AuditEventType.PayoutCreated]: {
    label: 'Payout Created',
    icon: '💰',
    color: 'bg-yellow-50'
  },
  [AuditEventType.PayoutApproved]: {
    label: 'Payout Approved',
    icon: '👍',
    color: 'bg-green-50'
  },
  [AuditEventType.PayoutPaid]: {
    label: 'Payout Paid',
    icon: '💳',
    color: 'bg-green-50'
  }
};
