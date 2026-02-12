/**
 * Request Service (Leads API)
 *
 * Handles lead/request creation and management.
 * POSTs to backend /api/requests endpoint.
 */

import { apiClient } from '@/services/api/client';
import { RequestDTO, CreateRequestRequestDTO, ApiResponseDTO } from '@/types/dtos';
import { Request } from '@/types/domain';

/**
 * Submit a new lead request
 *
 * Idempotency: Use idempotency_key to prevent duplicate submissions
 * If request is retried with same key, server returns cached response
 */
export async function submitRequest(
  data: CreateRequestRequestDTO,
  idempotencyKey: string
): Promise<RequestDTO> {
  const response = await apiClient.post<ApiResponseDTO<RequestDTO>>('/requests', data, {
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
  });

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to submit request');
  }

  return response.data;
}

/**
 * Fetch a single request (for viewing submitted request)
 */
export async function fetchRequest(id: string): Promise<RequestDTO> {
  const response = await apiClient.get<ApiResponseDTO<RequestDTO>>(`/requests/${id}`);

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch request');
  }

  return response.data;
}

/**
 * Fetch all requests for current user (admin/sales staff)
 */
export async function fetchRequests(params?: {
  status?: string;
  industry?: string;
  cursor?: string;
  limit?: number;
}): Promise<{ requests: RequestDTO[]; nextCursor?: string }> {
  // Build query string from params
  const queryString = params
    ? '?' +
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';

  const response = await apiClient.get<ApiResponseDTO<RequestDTO[]>>(`/requests${queryString}`);

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to fetch requests');
  }

  return {
    requests: response.data,
    nextCursor: (response as any).next_cursor,
  };
}

/**
 * Domain model converter (DTO → Domain)
 * Use when you need to work with Request as a domain model
 */
export function requestFromDTO(dto: RequestDTO): Request {
  return {
    id: dto.id,
    orgId: dto.org_id,
    requesterName: dto.requester_name,
    requesterEmail: dto.requester_email,
    requesterPhone: dto.requester_phone,
    industry: dto.industry,
    location: dto.location,
    description: dto.description,
    budget: dto.budget,
    status: dto.status,
    submittedAt: dto.submitted_at,
    convertedAt: dto.converted_at,
    convertedToProjectId: dto.converted_to_project_id,
    metadata: dto.metadata,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    deletedAt: dto.deleted_at,
  };
}
