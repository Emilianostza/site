/**
 * Data Transfer Objects (DTOs) - Phase 2+
 *
 * Serializable types for API request/response bodies.
 * Mappers convert between DTOs and domain models.
 *
 * Naming: *DTO suffix
 * Pattern: snake_case keys for JSON serialization
 */

import {
  ProjectStatus,
  AssetStatus,
  AssetType,
  PayoutStatus,
  TierType,
  AuditEventType,
} from '@/types/domain';

// ============================================================================
// PAGINATION
// ============================================================================

/**
 * Cursor-based pagination for list endpoints
 * More efficient than offset/limit for large datasets
 */
export interface PaginationDTO {
  cursor?: string; // Opaque cursor for next batch
  limit: number; // Items per batch (default: 20)
}

export interface PaginatedResponseDTO<T> {
  data: T[];
  next_cursor?: string; // Cursor for next batch, absent if no more data
  has_more: boolean;
}

// ============================================================================
// PROJECT DTOs
// ============================================================================

export interface ProjectDTO {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  industry: string;
  status: ProjectStatus;
  tier: TierType;
  customer_id: string;
  created_by: string;
  assigned_to?: string[]; // Technician IDs
  metadata?: Record<string, unknown>;
  requested_at: string;
  approved_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateProjectRequestDTO {
  name: string;
  description?: string;
  industry: string;
  tier: TierType;
  customer_id: string;
}

export interface UpdateProjectRequestDTO {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  assigned_to?: string[];
}

// ============================================================================
// ASSET DTOs
// ============================================================================

export interface AssetDTO {
  id: string;
  org_id: string;
  project_id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  file_key: string;
  file_size: number;
  content_type: string;
  asset_version: number;
  processing_started_at?: string;
  processing_completed_at?: string;
  processing_error?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateAssetRequestDTO {
  project_id: string;
  name: string;
  type: AssetType;
  file_key: string; // Set by upload service
  file_size: number;
  content_type: string;
}

// ============================================================================
// PAYOUT DTOs
// ============================================================================

export interface PayoutDTO {
  id: string;
  org_id: string;
  project_id: string;
  asset_ids: string[];
  photographer_id: string;
  amount: number;
  currency: string;
  tier: TierType;
  status: PayoutStatus;
  approved_at?: string;
  approved_by?: string;
  paid_at?: string;
  invoice_id?: string;
  invoice_url?: string;
  reference_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreatePayoutRequestDTO {
  project_id: string;
  asset_ids: string[];
  photographer_id: string;
  amount: number;
  currency: string;
  tier: TierType;
}

// ============================================================================
// ASSIGNMENT DTOs
// ============================================================================

export interface AssignmentDTO {
  id: string;
  org_id: string;
  project_id: string;
  photographer_id: string;
  role: 'lead' | 'support';
  status: 'assigned' | 'accepted' | 'completed' | 'cancelled';
  accepted_at?: string;
  completed_at?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// ============================================================================
// AUDIT LOG DTOs
// ============================================================================

export interface AuditLogDTO {
  id: string;
  org_id: string;
  event_type: AuditEventType;
  timestamp: string;
  actor_id?: string;
  actor_email?: string;
  resource_type: string;
  resource_id: string;
  from_state?: Record<string, unknown>;
  to_state?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// REQUEST DTOs
// ============================================================================

export interface RequestDTO {
  id: string;
  org_id: string;
  requester_name: string;
  requester_email: string;
  requester_phone?: string;
  industry: string;
  location?: string;
  description: string;
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'submitted' | 'reviewing' | 'contacted' | 'converted' | 'rejected';
  submitted_at: string;
  converted_at?: string;
  converted_to_project_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateRequestRequestDTO {
  requester_name: string;
  requester_email: string;
  requester_phone?: string;
  industry: string;
  location?: string;
  description: string;
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
}

// ============================================================================
// API RESPONSE ENVELOPE
// ============================================================================

/**
 * Standard API response format
 */
export interface ApiResponseDTO<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}
