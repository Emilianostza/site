export enum Industry {
  Restaurant = 'Restaurant',
  Museum = 'Museum',
  Ecommerce = 'Ecommerce',
  General = 'General'
}

export enum PortalRole {
  PublicVisitor = 'public',
  CustomerOwner = 'customer_owner',
  CustomerViewer = 'customer_viewer',
  Technician = 'technician',
  Approver = 'approver',
  SalesLead = 'sales_lead',
  Admin = 'admin'
}

/**
 * PHASE 3: Project Lifecycle State Machine
 *
 * States represent the project's position in the capture → delivery workflow.
 * Transitions are strictly validated server-side.
 *
 * Requested → Assigned → Captured → Processing → QA → Delivered → Approved → Archived
 *                                        ↑_________↓           ↑_________↓
 *                                       (rejection)          (rejection)
 */
export enum ProjectStatus {
  // Initial: Customer submitted capture request
  Requested = 'Requested',

  // Assigned to technician/photographer by manager
  Assigned = 'Assigned',

  // Photos captured, raw files uploaded
  Captured = 'Captured',

  // Processing raw files (cleanup, alignment, etc)
  Processing = 'Processing',

  // Quality assurance review by approver
  QA = 'QA',

  // Ready for customer review/approval
  Delivered = 'Delivered',

  // Customer approved final outcome, payout triggered
  Approved = 'Approved',

  // Project archived (old, completed, or cancelled)
  Archived = 'Archived'
}

export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export interface IndustryConfig {
  id: string;
  title: string;
  subtitle: string;
  heroImage: string;
  outcomes: string[];
  permissions: string[];
  demoImage: string;
}

export interface RequestFormState {
  industry: Industry | '';
  quantity_range: string;
  object_size_range: string;
  materials: string[];
  location_mode: 'on_site' | 'ship_in' | '';
  country: string;
  preferred_window: string;
  deliverables: string[];
  museum_access_control?: string;
  handling_sensitivity?: string;
  contact: {
    full_name: string;
    email: string;
    company: string;
  };
}

/**
 * PHASE 5: Tier System
 *
 * Tiers determine what features are available for a project.
 * Selected at project creation time.
 * Enforced server-side (cannot be upgraded via frontend).
 */
export enum ServiceTier {
  Basic = 'basic',           // Entry level (limited models, no custom domain)
  Business = 'business',     // Mid-tier (analytics, branding)
  Enterprise = 'enterprise', // High-end (API access, SLA)
  Museum = 'museum'          // Specialized (guided mode, kiosk, accessibility)
}

export type ProjectType = 'standard' | 'restaurant_menu';

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  items: number;
  type?: ProjectType;
  address?: string;
  phone?: string;

  // PHASE 3: Lifecycle management
  assigned_to?: string;           // Technician ID
  created_at?: string;            // ISO timestamp
  updated_at?: string;            // ISO timestamp
  qa_approved?: boolean;          // Approver sign-off
  customer_approved?: boolean;    // Customer acceptance
  payout_triggered?: boolean;     // Contractor payment flag
  rejection_reason?: string;      // Why rejected (if applicable)

  // PHASE 5: Tier system
  tier?: ServiceTier;             // Selected service tier (immutable)
  tier_selected_by?: string;      // User ID who selected tier
  tier_selected_at?: string;      // ISO timestamp when tier chosen
}

/**
 * PHASE 4: Asset with Storage Metadata
 *
 * Assets are 3D models stored in S3-compatible storage.
 * Metadata is stored in database with signed access URLs.
 */
export interface Asset {
  id: string;
  name: string;
  thumb: string;
  status: 'Published' | 'In Review' | 'Processing';
  type?: string;
  size?: string;
  updated?: string;

  // PHASE 4: Storage metadata
  project_id?: string;              // Parent project
  file_key?: string;                // S3 object key (path)
  file_size?: number;               // Bytes
  content_type?: string;            // MIME type (model/gltf-binary)
  storage_url?: string;             // S3 bucket URL (not signed)
  access_url?: string;              // Signed download URL (expires)
  thumbnail_url?: string;           // Signed thumbnail URL
  qr_code_url?: string;             // QR code image (signed)
  created_at?: string;              // ISO timestamp
  updated_at?: string;              // ISO timestamp
  download_count?: number;          // Analytics
}