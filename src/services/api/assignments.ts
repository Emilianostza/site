/**
 * Assignments Service
 *
 * Manages project assignments to photographers/technicians.
 * Tracks who is assigned, their role (lead/support), and status.
 */

import { apiClient } from '@/services/api/client';
import { AssignmentDTO } from '@/types/dtos';
import { Assignment } from '@/types/domain';

export interface CreateAssignmentRequestDTO {
  project_id: string;
  photographer_id: string;
  role: 'lead' | 'support';
}

/**
 * Assign a photographer to a project
 */
export async function assignPhotographer(
  data: CreateAssignmentRequestDTO
): Promise<AssignmentDTO> {
  const response = await apiClient.post<{ data: AssignmentDTO }>('/assignments', data);
  return response.data;
}

/**
 * Get assignments for a project
 */
export async function getProjectAssignments(projectId: string): Promise<AssignmentDTO[]> {
  const response = await apiClient.get<AssignmentDTO[]>(`/projects/${projectId}/assignments`);
  return response;
}

/**
 * Get assignments for a photographer
 */
export async function getPhotographerAssignments(photographerId: string): Promise<AssignmentDTO[]> {
  const response = await apiClient.get<AssignmentDTO[]>(`/assignments?photographer_id=${photographerId}`);
  return response;
}

/**
 * Accept assignment (photographer confirms they're working on it)
 */
export async function acceptAssignment(assignmentId: string): Promise<AssignmentDTO> {
  const response = await apiClient.patch<{ data: AssignmentDTO }>(`/assignments/${assignmentId}`, {
    status: 'accepted'
  });
  return response.data;
}

/**
 * Mark assignment as completed
 */
export async function completeAssignment(assignmentId: string): Promise<AssignmentDTO> {
  const response = await apiClient.patch<{ data: AssignmentDTO }>(`/assignments/${assignmentId}`, {
    status: 'completed'
  });
  return response.data;
}

/**
 * Cancel assignment
 */
export async function cancelAssignment(assignmentId: string, reason?: string): Promise<void> {
  await apiClient.patch(`/assignments/${assignmentId}`, {
    status: 'cancelled',
    metadata: { cancellation_reason: reason }
  });
}

/**
 * Domain model converter (DTO → Domain)
 */
export function assignmentFromDTO(dto: AssignmentDTO): Assignment {
  return {
    id: dto.id,
    orgId: dto.org_id,
    projectId: dto.project_id,
    photographerId: dto.photographer_id,
    role: dto.role,
    status: dto.status,
    roleAssignedAt: dto.created_at,
    metadata: dto.metadata,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    deletedAt: dto.deleted_at
  };
}
