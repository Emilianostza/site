/**
 * Hook: Project State Machine Validation
 *
 * Provides state transition helpers and validation for project lifecycle.
 * Used in Portal and project detail pages to enable/disable actions.
 *
 * Example:
 * ```tsx
 * const { canTransitionTo, getValidNextStates, getTransitionDescription } =
 *   useProjectStateMachine(currentStatus, userRole);
 *
 * if (canTransitionTo(ProjectStatus.QA)) {
 *   <button>Submit for QA</button>
 * }
 * ```
 */

import { useMemo } from 'react';
import { ProjectStatus } from '@/types/domain';
import {
  canTransition,
  getValidNextStates,
  getTransitionDescription,
  requiresApproval,
  TERMINAL_STATES,
} from '@/services/stateMachine';
import { useAuth } from '@/contexts/AuthContext';

export interface UseProjectStateMachineResult {
  /** Check if transition to targetState is valid */
  canTransitionTo: (targetState: ProjectStatus) => boolean;

  /** Get all valid next states from current state */
  validNextStates: ProjectStatus[];

  /** Get description of a specific transition */
  transitionDescription: (targetState: ProjectStatus) => string;

  /** Check if transition requires approval */
  transitionRequiresApproval: (targetState: ProjectStatus) => boolean;

  /** Check if current state is terminal (completed/archived) */
  isTerminalState: boolean;

  /** Current user role */
  userRole: string;
}

/**
 * Hook for project state machine validation
 */
export function useProjectStateMachine(
  currentStatus: ProjectStatus,
  roleOverride?: string
): UseProjectStateMachineResult {
  const { user } = useAuth();
  const userRole = roleOverride || user?.role?.type || 'public';

  const result = useMemo<UseProjectStateMachineResult>(() => {
    return {
      canTransitionTo: (targetState: ProjectStatus) => {
        return canTransition(currentStatus, targetState, userRole).valid;
      },

      validNextStates: getValidNextStates(currentStatus, userRole),

      transitionDescription: (targetState: ProjectStatus) => {
        return getTransitionDescription(currentStatus, targetState);
      },

      transitionRequiresApproval: (targetState: ProjectStatus) => {
        return requiresApproval(currentStatus, targetState);
      },

      isTerminalState: TERMINAL_STATES.includes(currentStatus),

      userRole,
    };
  }, [currentStatus, userRole]);

  return result;
}
