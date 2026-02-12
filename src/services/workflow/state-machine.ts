/**
 * Project Workflow State Machine
 *
 * Defines valid state transitions and enforces workflow rules.
 * Prevents invalid status changes (e.g., delivered → pending).
 *
 * State Flow:
 * Pending → Approved → In Progress → Delivered (or Rejected at any point)
 *
 * Rules:
 * - Only admins/approvers can approve projects
 * - Only assigned technicians can mark as in_progress
 * - Only assigned technicians can deliver
 * - Rejection is allowed from any state (for cancellations)
 */

import { ProjectStatus } from '@/types/domain';

export type TransitionType = 'approve' | 'start' | 'deliver' | 'reject' | 'archive';

export interface StateTransition {
  from: ProjectStatus;
  to: ProjectStatus;
  type: TransitionType;
  requiredRole: 'admin' | 'approver' | 'technician' | 'customer';
  requiresAssignment: boolean;
}

// ============================================================================
// VALID TRANSITIONS
// ============================================================================

export const VALID_TRANSITIONS: StateTransition[] = [
  // Pending → Approved (admin/approver only)
  {
    from: ProjectStatus.Pending,
    to: ProjectStatus.Approved,
    type: 'approve',
    requiredRole: 'admin',
    requiresAssignment: false,
  },

  // Pending → Rejected (admin only, for rejection)
  {
    from: ProjectStatus.Pending,
    to: ProjectStatus.Rejected,
    type: 'reject',
    requiredRole: 'admin',
    requiresAssignment: false,
  },

  // Approved → In Progress (technician with assignment)
  {
    from: ProjectStatus.Approved,
    to: ProjectStatus.InProgress,
    type: 'start',
    requiredRole: 'technician',
    requiresAssignment: true,
  },

  // Approved → Rejected (admin only)
  {
    from: ProjectStatus.Approved,
    to: ProjectStatus.Rejected,
    type: 'reject',
    requiredRole: 'admin',
    requiresAssignment: false,
  },

  // In Progress → Delivered (technician who started it)
  {
    from: ProjectStatus.InProgress,
    to: ProjectStatus.Delivered,
    type: 'deliver',
    requiredRole: 'technician',
    requiresAssignment: true,
  },

  // In Progress → Rejected (admin only, for cancellation)
  {
    from: ProjectStatus.InProgress,
    to: ProjectStatus.Rejected,
    type: 'reject',
    requiredRole: 'admin',
    requiresAssignment: false,
  },

  // Delivered → Archived (admin only, after completion)
  {
    from: ProjectStatus.Delivered,
    to: ProjectStatus.Archived,
    type: 'archive',
    requiredRole: 'admin',
    requiresAssignment: false,
  },

  // Rejected → Archived (admin only)
  {
    from: ProjectStatus.Rejected,
    to: ProjectStatus.Archived,
    type: 'archive',
    requiredRole: 'admin',
    requiresAssignment: false,
  },
];

// ============================================================================
// STATE MACHINE FUNCTIONS
// ============================================================================

/**
 * Check if transition is valid
 */
export function canTransition(
  from: ProjectStatus,
  to: ProjectStatus,
  userRole: 'admin' | 'approver' | 'technician' | 'customer',
  hasAssignment: boolean = false
): boolean {
  const transition = VALID_TRANSITIONS.find((t) => t.from === from && t.to === to);

  if (!transition) return false;
  if (transition.requiredRole !== userRole && userRole !== 'admin') return false;
  if (transition.requiresAssignment && !hasAssignment) return false;

  return true;
}

/**
 * Get allowed next states for current status
 */
export function getNextStates(
  currentStatus: ProjectStatus,
  userRole: 'admin' | 'approver' | 'technician' | 'customer',
  hasAssignment: boolean = false
): ProjectStatus[] {
  return VALID_TRANSITIONS.filter(
    (t) => t.from === currentStatus && canTransition(currentStatus, t.to, userRole, hasAssignment)
  ).map((t) => t.to);
}

/**
 * Get transition details
 */
export function getTransition(from: ProjectStatus, to: ProjectStatus): StateTransition | null {
  return VALID_TRANSITIONS.find((t) => t.from === from && t.to === to) || null;
}

/**
 * Check if status is terminal (no further transitions possible)
 */
export function isTerminalStatus(status: ProjectStatus): boolean {
  return !VALID_TRANSITIONS.some((t) => t.from === status);
}

// ============================================================================
// STATUS DESCRIPTIONS
// ============================================================================

export const STATUS_DESCRIPTIONS: Record<
  ProjectStatus,
  { label: string; description: string; color: string }
> = {
  [ProjectStatus.Pending]: {
    label: 'Pending',
    description: 'Awaiting approval from team',
    color: 'bg-yellow-100 text-yellow-800',
  },
  [ProjectStatus.Requested]: {
    label: 'Requested',
    description: 'Customer requested a project',
    color: 'bg-yellow-100 text-yellow-800',
  },
  [ProjectStatus.Assigned]: {
    label: 'Assigned',
    description: 'Project assigned to technician',
    color: 'bg-orange-100 text-orange-800',
  },
  [ProjectStatus.Captured]: {
    label: 'Captured',
    description: 'Raw files captured',
    color: 'bg-blue-100 text-blue-800',
  },
  [ProjectStatus.Processing]: {
    label: 'Processing',
    description: 'Files being processed',
    color: 'bg-purple-100 text-purple-800',
  },
  [ProjectStatus.QA]: {
    label: 'QA',
    description: 'Under quality assurance review',
    color: 'bg-indigo-100 text-indigo-800',
  },
  [ProjectStatus.Approved]: {
    label: 'Approved',
    description: 'Ready for technician to start work',
    color: 'bg-blue-100 text-blue-800',
  },
  [ProjectStatus.InProgress]: {
    label: 'In Progress',
    description: 'Technician is actively working',
    color: 'bg-purple-100 text-purple-800',
  },
  [ProjectStatus.Delivered]: {
    label: 'Delivered',
    description: 'Assets delivered to customer',
    color: 'bg-green-100 text-green-800',
  },
  [ProjectStatus.Archived]: {
    label: 'Archived',
    description: 'Project completed and archived',
    color: 'bg-slate-100 text-slate-800',
  },
  [ProjectStatus.Rejected]: {
    label: 'Rejected',
    description: 'Project was rejected or cancelled',
    color: 'bg-red-100 text-red-800',
  },
};
