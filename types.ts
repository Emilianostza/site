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

export enum ProjectStatus {
  Intake = 'Intake',
  Capture = 'Capture',
  Processing = 'Processing',
  QA = 'QA',
  ReadyForReview = 'Ready for Review',
  Published = 'Published'
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
}

export interface Asset {
  id: string;
  name: string;
  thumb: string;
  status: 'Published' | 'In Review' | 'Processing';
  type?: string;
  size?: string;
  updated?: string;
}