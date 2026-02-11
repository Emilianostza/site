/**
 * Project Lifecycle State Machine
 *
 * Validates state transitions and enforces business rules.
 * All transitions are DETERMINISTIC and REVERSIBLE (on rejection).
 *
 * State Diagram:
 * Requested → Assigned → Captured ←→ Processing → QA ←→ Delivered ←→ Approved → Archived
 *                           ↑_____[reject]_____↓    ↑_____[reject]_____↓
 *
 * Only the backend can change state (frontend requests, backend validates & applies).
 */

import { ProjectStatus } from '../types';

/**
 * Audit event logged for every state transition
 */
export interface StateChangeAudit {
  project_id: string;
  user_id: string;
  user_role: string;
  from_state: ProjectStatus;
  to_state: ProjectStatus;
  reason?: string;
  metadata?: Record<string, unknown>;
  timestamp: string; // ISO 8601
}

/**
 * Describes a valid state transition
 */
interface StateTransition {
  from: ProjectStatus;
  to: ProjectStatus;
  requiredRole: string | string[]; // Role(s) that can make this transition
  requiresApproval?: boolean;
  description: string;
}

/**
 * Valid state transitions in the system
 * MUST match backend validation
 */
const VALID_TRANSITIONS: StateTransition[] = [
  // Requested → Assigned (sales/admin assigns technician)
  {
    from: ProjectStatus.Requested,
    to: ProjectStatus.Assigned,
    requiredRole: ['admin', 'sales_lead'],
    description: 'Assign technician to project'
  },

  // Assigned → Captured (technician uploads raw files)
  {
    from: ProjectStatus.Assigned,
    to: ProjectStatus.Captured,
    requiredRole: 'technician',
    description: 'Upload captured photos'
  },

  // Captured → Processing (technician/admin starts processing)
  {
    from: ProjectStatus.Captured,
    to: ProjectStatus.Processing,
    requiredRole: ['technician', 'admin'],
    description: 'Start processing raw files'
  },

  // Processing → QA (files ready for review)
  {
    from: ProjectStatus.Processing,
    to: ProjectStatus.QA,
    requiredRole: ['technician', 'admin'],
    description: 'Submit for quality assurance'
  },

  // QA → Delivered (approver accepts quality)
  {
    from: ProjectStatus.QA,
    to: ProjectStatus.Delivered,
    requiredRole: 'approver',
    requiresApproval: true,
    description: 'Approve quality, ready for customer'
  },

  // QA → Captured (approver rejects, retake needed)
  {
    from: ProjectStatus.QA,
    to: ProjectStatus.Captured,
    requiredRole: 'approver',
    description: 'Reject QA, request retake'
  },

  // Delivered → Approved (customer accepts)
  {
    from: ProjectStatus.Delivered,
    to: ProjectStatus.Approved,
    requiredRole: 'customer_owner',
    requiresApproval: true,
    description: 'Customer approves outcome, trigger payout'
  },

  // Delivered → Captured (customer rejects)
  {
    from: ProjectStatus.Delivered,
    to: ProjectStatus.Captured,
    requiredRole: 'customer_owner',
    description: 'Customer rejects, request retake'
  },

  // Approved → Archived (auto-archive after approval)
  {
    from: ProjectStatus.Approved,
    to: ProjectStatus.Archived,
    requiredRole: ['admin', 'approver'],
    description: 'Archive completed project'
  },

  // Any → Archived (cancel/abandon project)
  {
    from: ProjectStatus.Requested,
    to: ProjectStatus.Archived,
    requiredRole: ['admin', 'sales_lead', 'customer_owner'],
    description: 'Cancel project'
  },
  {
    from: ProjectStatus.Assigned,
    to: ProjectStatus.Archived,
    requiredRole: ['admin', 'sales_lead'],
    description: 'Cancel assigned project'
  },
  {
    from: ProjectStatus.Captured,
    to: ProjectStatus.Archived,
    requiredRole: ['admin', 'sales_lead'],
    description: 'Cancel project'
  },
  {
    from: ProjectStatus.Processing,
    to: ProjectStatus.Archived,
    requiredRole: ['admin', 'sales_lead'],
    description: 'Cancel project'
  },
  {
    from: ProjectStatus.QA,
    to: ProjectStatus.Archived,
    requiredRole: ['admin', 'approver'],
    description: 'Cancel project'
  },
  {
    from: ProjectStatus.Delivered,
    to: ProjectStatus.Archived,
    requiredRole: ['admin', 'sales_lead', 'customer_owner'],
    description: 'Cancel project'
  }
];

/**
 * Check if a state transition is valid
 *
 * Returns { valid: boolean, error?: string, transition?: StateTransition }
 */
export function canTransition(
  currentState: ProjectStatus,
  targetState: ProjectStatus,
  userRole: string
): {
  valid: boolean;
  error?: string;
  transition?: StateTransition;
} {
  // Idempotent: same state is always valid
  if (currentState === targetState) {
    return { valid: true };
  }

  // Find matching transition rule
  const transition = VALID_TRANSITIONS.find(
    t => t.from === currentState && t.to === targetState
  );

  if (!transition) {
    return {
      valid: false,
      error: `Transition from ${currentState} to ${targetState} not allowed`
    };
  }

  // Check role permission
  const allowedRoles = Array.isArray(transition.requiredRole)
    ? transition.requiredRole
    : [transition.requiredRole];

  if (!allowedRoles.includes(userRole)) {
    return {
      valid: false,
      error: `Role '${userRole}' cannot perform this transition. Required: ${allowedRoles.join(', ')}`
    };
  }

  return { valid: true, transition };
}

/**
 * Get all valid next states from current state
 */
export function getValidNextStates(
  currentState: ProjectStatus,
  userRole: string
): ProjectStatus[] {
  return VALID_TRANSITIONS.filter(
    t => t.from === currentState && canTransition(currentState, t.to, userRole).valid
  ).map(t => t.to);
}

/**
 * Get transition metadata (for UI hints, approval requirements, etc)
 */
export function getTransitionInfo(
  fromState: ProjectStatus,
  toState: ProjectStatus
): StateTransition | null {
  return VALID_TRANSITIONS.find(t => t.from === fromState && t.to === toState) || null;
}

/**
 * Check if a transition requires approval
 */
export function requiresApproval(fromState: ProjectStatus, toState: ProjectStatus): boolean {
  const transition = getTransitionInfo(fromState, toState);
  return transition?.requiresApproval ?? false;
}

/**
 * Get human-readable transition description
 */
export function getTransitionDescription(
  fromState: ProjectStatus,
  toState: ProjectStatus
): string {
  const transition = getTransitionInfo(fromState, toState);
  return transition?.description ?? `Move from ${fromState} to ${toState}`;
}

/**
 * All valid states (for UI dropdowns, etc)
 */
export const ALL_STATES = Object.values(ProjectStatus);

/**
 * States that represent completion
 */
export const TERMINAL_STATES = [ProjectStatus.Approved, ProjectStatus.Archived];

/**
 * States where payout can be triggered
 */
export const PAYOUT_STATES = [ProjectStatus.Approved];

/**
 * Get the natural lifecycle progression (happy path)
 */
export function getHappyPath(): ProjectStatus[] {
  return [
    ProjectStatus.Requested,
    ProjectStatus.Assigned,
    ProjectStatus.Captured,
    ProjectStatus.Processing,
    ProjectStatus.QA,
    ProjectStatus.Delivered,
    ProjectStatus.Approved,
    ProjectStatus.Archived
  ];
}

/**
 * Audit event creation helper
 */
export function createAuditEvent(
  projectId: string,
  userId: string,
  userRole: string,
  fromState: ProjectStatus,
  toState: ProjectStatus,
  reason?: string
): StateChangeAudit {
  return {
    project_id: projectId,
    user_id: userId,
    user_role: userRole,
    from_state: fromState,
    to_state: toState,
    reason,
    timestamp: new Date().toISOString()
  };
}
