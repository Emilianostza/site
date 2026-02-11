/**
 * Projects API Service
 *
 * Provides frontend interface to project backend endpoints.
 * All project data flows through here.
 * Handles role-based filtering and server-side data validation.
 *
 * API Contract (to be implemented by backend):
 * GET    /projects           - List projects visible to current user
 * POST   /projects           - Create new project
 * GET    /projects/:id       - Get single project
 * PATCH  /projects/:id       - Update project
 * DELETE /projects/:id       - Archive/delete project
 */

import { apiClient } from '@/services/api/client';
import { Project, ProjectStatus, ProjectType } from '@/types';

export interface CreateProjectInput {
  name: string;
  client: string;
  type: ProjectType;
  address?: string;
  phone?: string;
}

export interface UpdateProjectInput {
  name?: string;
  status?: ProjectStatus;
  // Additional fields as needed
}

/**
 * Fetch all projects visible to current user.
 *
 * PHASE 2: Role-based server-side filtering
 *
 * Server automatically filters based on user role (from JWT):
 * - Admin: All projects
 * - Technician/Approver/SalesLead: Projects assigned to them
 * - CustomerOwner: Only their organization's projects
 * - CustomerViewer: Only assigned projects in their organization
 *
 * Request: GET /api/projects
 * Headers: Authorization: Bearer <JWT token>
 *
 * Response (200 OK):
 * [
 *   {
 *     "id": "PRJ-001",
 *     "name": "Summer Menu",
 *     "client": "Bistro 55",
 *     "status": "Published",
 *     "items": 12,
 *     "type": "restaurant_menu"
 *   },
 *   ...
 * ]
 *
 * Note: Client cannot request projects they don't have access to.
 * If attempted: GET /api/projects?include_all=true → 400 Bad Request
 * Server never exposes a "filter" parameter for security.
 */
export async function fetchProjects(): Promise<Project[]> {
  return apiClient.get<Project[]>('/projects');
}

/**
 * Get single project by ID.
 * Server validates user has access.
 */
export async function fetchProject(id: string): Promise<Project> {
  return apiClient.get<Project>(`/projects/${id}`);
}

/**
 * Create new project.
 * Available to employees and admins only.
 */
export async function createProject(data: CreateProjectInput): Promise<Project> {
  return apiClient.post<Project>('/projects', data);
}

/**
 * Update project.
 * Available to authorized users only (owner, admin, assigned tech).
 */
export async function updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
  return apiClient.patch<Project>(`/projects/${id}`, data);
}

/**
 * Archive/delete project.
 * Available to admins and project creator only.
 */
export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}

/**
 * Assign project to photographer/technician.
 * Server-side role enforcement.
 */
export async function assignProject(projectId: string, technicianId: string): Promise<Project> {
  return apiClient.post<Project>(`/projects/${projectId}/assign`, {
    technician_id: technicianId,
  });
}

/**
 * Update project status with state machine validation.
 *
 * PHASE 3: Enforces state machine transitions server-side.
 * Only valid transitions allowed based on user role.
 *
 * State transitions:
 * - Requested → Assigned (sales assigns technician)
 * - Assigned → Captured (tech uploads files)
 * - Captured → Processing (tech starts processing)
 * - Processing → QA (submit for review)
 * - QA → Delivered (approver approves)
 * - QA → Captured (approver rejects, retake)
 * - Delivered → Approved (customer approves, trigger payout)
 * - Delivered → Captured (customer rejects, retake)
 * - Any → Archived (cancel/complete)
 *
 * Request:
 * ```
 * PATCH /api/projects/:id
 * {
 *   "status": "QA",
 *   "reason": "Submitting for quality review"  // Optional
 * }
 * ```
 *
 * Response (200 OK):
 * ```
 * {
 *   "id": "PRJ-001",
 *   "status": "QA",
 *   "updated_at": "2026-02-11T15:30:00Z"
 * }
 * ```
 *
 * Response (400 Bad Request - invalid transition):
 * ```
 * {
 *   "message": "Transition from Captured to Approved not allowed",
 *   "code": "INVALID_STATE_TRANSITION"
 * }
 * ```
 *
 * Response (403 Forbidden - insufficient role):
 * ```
 * {
 *   "message": "Role 'technician' cannot approve quality",
 *   "code": "INSUFFICIENT_PERMISSION"
 * }
 * ```
 *
 * Server logs audit event for all state changes (immutable).
 */
export async function updateProjectStatus(
  id: string,
  status: ProjectStatus,
  reason?: string
): Promise<Project> {
  return apiClient.patch<Project>(`/projects/${id}`, { status, reason });
}
