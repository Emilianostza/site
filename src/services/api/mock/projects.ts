/**
 * Mock Projects API Service
 *
 * Provides hardcoded project data for development and testing.
 * Simulates network latency with artificial delays.
 *
 * This service is used when VITE_USE_MOCK_DATA=true or when the real API is unavailable.
 */

import { Project } from '@/types';
import { ProjectStatus } from '@/types/domain';

// Mutable in-memory store for mock projects
const MOCK_PROJECTS: Project[] = [
  {
    id: 'PRJ-001',
    name: 'Summer Menu Update',
    client: 'Bistro 55',
    status: ProjectStatus.Approved,
    items: 12,
    type: 'restaurant_menu' as any,
    address: '123 Main St, Austin TX',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'PRJ-002',
    name: 'Fall Collection',
    client: 'Style Co',
    status: ProjectStatus.Processing,
    items: 45,
    type: 'standard' as any,
    address: '456 Oak Ave, Portland OR',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'PRJ-003',
    name: 'Ancient Egypt Exhibit',
    client: 'History Museum',
    status: ProjectStatus.QA,
    items: 8,
    type: 'standard' as any,
    address: '789 Museum Way, Boston MA',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Simulate network latency
const NETWORK_DELAY = 500;

/**
 * Fetch all projects (with optional filtering)
 */
export async function fetchProjects(filter: Record<string, any> = {}) {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY));

  let results = [...MOCK_PROJECTS];

  // Apply filters if provided
  if (filter.status) {
    results = results.filter((p) => p.status === filter.status);
  }
  if (filter.client) {
    results = results.filter((p) => p.client.toLowerCase().includes(filter.client.toLowerCase()));
  }

  return {
    projects: results,
    total: results.length,
    page: 1,
    pageSize: results.length,
  };
}

/**
 * Get a single project by ID
 */
export async function getProject(id: string) {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY));

  const project = MOCK_PROJECTS.find((p) => p.id === id);
  if (!project) {
    throw new Error(`Project ${id} not found`);
  }
  return project;
}

/**
 * Create a new project
 */
export async function createProject(data: Partial<Project>) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newProject: Project = {
    id: `PRJ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    name: data.name || 'Untitled Project',
    client: data.client || 'New Client',
    status: ProjectStatus.Pending,
    items: 0,
    type: data.type || ('standard' as any),
    address: data.address,
    phone: data.phone,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  MOCK_PROJECTS.unshift(newProject);
  return newProject;
}

/**
 * Update an existing project
 */
export async function updateProject(id: string, data: Partial<Project>) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const index = MOCK_PROJECTS.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error(`Project ${id} not found`);
  }

  const updated = {
    ...MOCK_PROJECTS[index],
    ...data,
    id: MOCK_PROJECTS[index].id, // Prevent ID changes
    updated_at: new Date().toISOString(),
  };

  MOCK_PROJECTS[index] = updated;
  return updated;
}

/**
 * Approve a project (transitions from Pending to Approved)
 */
export async function approveProject(id: string) {
  return updateProject(id, { status: ProjectStatus.Approved });
}

/**
 * Start processing a project (transitions to Processing)
 */
export async function startProject(id: string) {
  return updateProject(id, { status: ProjectStatus.Processing });
}

/**
 * Deliver a project (transitions to Delivered)
 */
export async function deliverProject(id: string) {
  return updateProject(id, { status: ProjectStatus.Delivered });
}

/**
 * Delete a project
 */
export async function deleteProject(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const index = MOCK_PROJECTS.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error(`Project ${id} not found`);
  }

  MOCK_PROJECTS.splice(index, 1);
  return { success: true, id };
}

// Default export for easier importing
export default {
  fetchProjects,
  getProject,
  createProject,
  updateProject,
  approveProject,
  startProject,
  deliverProject,
  deleteProject,
};
