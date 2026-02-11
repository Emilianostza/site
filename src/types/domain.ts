/**
 * Domain Types - Phase 2+
 *
 * Strict, immutable domain models for core business entities.
 * These are the internal representations used throughout the app.
 *
 * Separate from DTOs which are used for API serialization.
 */

// ============================================================================
// ENUMS (Shared across domain and DTOs)
// ============================================================================

export enum ProjectStatus {
  Pending = 'pending',
  Approved = 'approved',
  InProgress = 'in_progress',
  Delivered = 'delivered',
  Archived = 'archived',
  Rejected = 'rejected'
}

export enum AssetType {
  Model3D = '3d_model',
  Photo = 'photo',
  Mesh = 'mesh',
  PointCloud = 'point_cloud',
  Video = 'video'
}

export enum AssetStatus {
  Uploaded = 'uploaded',
  Processing = 'processing',
  Published = 'published',
  Failed = 'failed',
  Archived = 'archived'
}

export enum AuditEventType {
  ProjectCreated = 'project_created',
  ProjectApproved = 'project_approved',
  ProjectDelivered = 'project_delivered',
  ProjectRejected = 'project_rejected',
  AssetUploaded = 'asset_uploaded',
  AssetProcessed = 'asset_processed',
  AssetPublished = 'asset_published',
  PayoutCreated = 'payout_created',
  PayoutApproved = 'payout_approved',
  PayoutPaid = 'payout_paid'
}

export enum PayoutStatus {
  Pending = 'pending',
  Approved = 'approved',
  Paid = 'paid',
  Rejected = 'rejected',
  Failed = 'failed'
}

export enum TierType {
  Basic = 'basic',
  Standard = 'standard',
  Premium = 'premium',
  Enterprise = 'enterprise'
}

// ============================================================================
// DOMAIN TYPES (Core Business Models)
// ============================================================================

// --- Project ---

export interface Project {
  id: string;
  orgId: string;

  // Basic
  name: string;
  description?: string;
  industry: string; // restaurants, museums, ecommerce, etc.

  // Status & Timeline
  status: ProjectStatus;
  tier: TierType;
  requestedAt: string;
  approvedAt?: string;
  deliveredAt?: string;

  // Ownership
  customerId: string; // Foreign key to customer org
  createdBy: string; // User ID
  assignedTo?: string[]; // Technician user IDs

  // Metadata
  metadata?: Record<string, unknown>;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// --- Asset ---

export interface Asset {
  id: string;
  orgId: string;
  projectId: string;

  // Identity
  name: string;
  type: AssetType;
  status: AssetStatus;

  // File Info
  fileKey: string; // S3 key or storage path
  fileSize: number; // bytes
  contentType: string; // mime type
  assetVersion: number; // For versioning

  // Processing
  processingStartedAt?: string;
  processingCompletedAt?: string;
  processingError?: string;

  // Metadata
  metadata?: Record<string, unknown>;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// --- Payout ---

export interface Payout {
  id: string;
  orgId: string;

  // Reference
  projectId: string;
  assetIds: string[]; // Which assets contributed to payout
  photographerId: string; // Contractor user ID

  // Amount
  amount: number; // In cents
  currency: string; // ISO 4217 (usd, eur, etc)
  tier: TierType;

  // Status
  status: PayoutStatus;
  approvedAt?: string;
  approvedBy?: string;
  paidAt?: string;

  // Reconciliation
  invoiceId?: string;
  invoiceUrl?: string;
  referenceId?: string; // Bank reference

  // Metadata
  metadata?: Record<string, unknown>;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// --- Assignment ---

export interface Assignment {
  id: string;
  orgId: string;

  // What & Who
  projectId: string;
  photographerId: string; // User ID
  role: 'lead' | 'support'; // Lead photographer or support

  // Status
  status: 'assigned' | 'accepted' | 'completed' | 'cancelled';
  acceptedAt?: string;
  completedAt?: string;

  // Metadata
  metadata?: Record<string, unknown>;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// --- Audit Log ---

export interface AuditLog {
  id: string;
  orgId: string;

  // Event
  eventType: AuditEventType;
  timestamp: string;

  // Actor
  actorId?: string; // Who did this (system if null)
  actorEmail?: string;

  // Resource
  resourceType: string; // project, asset, payout, etc
  resourceId: string;

  // State Change
  fromState?: Record<string, unknown>;
  toState?: Record<string, unknown>;

  // Metadata
  metadata?: Record<string, unknown>;
}

// --- Request (Lead/CMS)---

export interface Request {
  id: string;
  orgId: string;

  // Requestor Info
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;

  // Project Details
  industry: string;
  location?: string;
  description: string;
  budget?: {
    min: number;
    max: number;
    currency: string;
  };

  // Status
  status: 'submitted' | 'reviewing' | 'contacted' | 'converted' | 'rejected';
  submittedAt: string;
  convertedAt?: string;
  convertedToProjectId?: string;

  // Metadata
  metadata?: Record<string, unknown>;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
