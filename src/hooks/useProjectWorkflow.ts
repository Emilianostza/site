/**
 * Project Workflow Hook
 *
 * Manages project status transitions with state machine validation.
 *
 * Usage:
 * const workflow = useProjectWorkflow(projectId, currentStatus, userRole);
 *
 * if (workflow.canApprove) {
 *   await workflow.approve();
 * }
 */

import { useState, useCallback } from 'react';
import { ProjectStatus } from '@/types/domain';
import {
  canTransition,
  getNextStates,
  STATUS_DESCRIPTIONS,
} from '@/services/workflow/state-machine';
import { apiClient } from '@/services/api/client';

interface WorkflowActions {
  approve: () => Promise<void>;
  start: () => Promise<void>;
  deliver: () => Promise<void>;
  reject: (reason?: string) => Promise<void>;
  archive: () => Promise<void>;
}

interface WorkflowPermissions {
  canApprove: boolean;
  canStart: boolean;
  canDeliver: boolean;
  canReject: boolean;
  canArchive: boolean;
  nextStates: ProjectStatus[];
}

export function useProjectWorkflow(
  projectId: string,
  currentStatus: ProjectStatus,
  userRole: 'admin' | 'approver' | 'technician' | 'customer',
  hasAssignment: boolean = false
) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate permissions
  const permissions: WorkflowPermissions = {
    canApprove: canTransition(currentStatus, ProjectStatus.Approved, userRole, hasAssignment),
    canStart: canTransition(currentStatus, ProjectStatus.InProgress, userRole, hasAssignment),
    canDeliver: canTransition(currentStatus, ProjectStatus.Delivered, userRole, hasAssignment),
    canReject: canTransition(currentStatus, ProjectStatus.Rejected, userRole, hasAssignment),
    canArchive: canTransition(currentStatus, ProjectStatus.Archived, userRole, hasAssignment),
    nextStates: getNextStates(currentStatus, userRole, hasAssignment),
  };

  // Status transition action
  const transitionStatus = useCallback(
    async (toStatus: ProjectStatus, reason?: string) => {
      if (!canTransition(currentStatus, toStatus, userRole, hasAssignment)) {
        throw new Error(`Cannot transition from ${currentStatus} to ${toStatus}`);
      }

      setIsTransitioning(true);
      setError(null);

      try {
        await apiClient.patch(`/projects/${projectId}`, {
          status: toStatus,
          transition_reason: reason,
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Status transition failed';
        setError(errorMsg);
        throw err;
      } finally {
        setIsTransitioning(false);
      }
    },
    [projectId, currentStatus, userRole, hasAssignment]
  );

  // Convenience actions
  const actions: WorkflowActions = {
    approve: () => transitionStatus(ProjectStatus.Approved),
    start: () => transitionStatus(ProjectStatus.InProgress),
    deliver: () => transitionStatus(ProjectStatus.Delivered),
    reject: (reason) => transitionStatus(ProjectStatus.Rejected, reason),
    archive: () => transitionStatus(ProjectStatus.Archived),
  };

  return {
    // Current state
    status: currentStatus,
    statusInfo: STATUS_DESCRIPTIONS[currentStatus],
    isTransitioning,
    error,

    // Permissions
    ...permissions,

    // Actions
    ...actions,

    // Clear error
    clearError: () => setError(null),
  };
}
