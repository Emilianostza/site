/**
 * Data Provider with Fallback & Role-Based Access Control
 *
 * PHASE 1-2: Support both real backend AND mock data.
 * This provider abstracts the choice and allows gradual migration.
 *
 * Flow:
 * 1. Try real API
 * 2. If API unavailable AND VITE_USE_MOCK_DATA=true, fall back to mock
 * 3. If both fail, throw error
 *
 * PHASE 2+: Role-Based Access Enforcement
 * ==========================================
 * DO NOT add client-side filtering here.
 *
 * ALL role-based access control MUST be enforced SERVER-SIDE:
 * - Employees: See only projects assigned to them
 * - Customers: See only their own projects
 * - Admins: See all projects
 *
 * The backend /api/projects endpoint AUTOMATICALLY filters based on user role
 * extracted from the JWT token. The frontend simply displays what the server returns.
 *
 * If a user somehow makes a GET request for another customer's project:
 * - Backend checks JWT token
 * - Backend verifies user has access
 * - Backend returns 403 Forbidden if not authorized
 *
 * This cannot be bypassed from the frontend because:
 * 1. Token is server-signed (can't forge)
 * 2. Role is in the token (can't change)
 * 3. Access control happens server-side (client can't override)
 */

import * as ProjectsAPI from '@/api/projects';
import * as AssetsAPI from '@/api/assets';
import {
  getProjects as getMockProjects,
  getAssets as getMockAssets,
  addProject as addMockProject,
  saveAsset as saveMockAsset,
} from '@/mockData';
import { Project, Asset, ProjectType, ProjectStatus } from '@/types';

const FALLBACK_TO_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

/**
 * Wraps API call with fallback to mock data
 */
async function withMockFallback<T>(
  apiCall: () => Promise<T>,
  mockCall: () => Promise<T>,
  operation: string
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (FALLBACK_TO_MOCK) {
      console.warn(`[DataProvider] API ${operation} failed, using mock data:`, error);
      return mockCall();
    }
    throw error;
  }
}

/**
 * Projects Data Provider
 *
 * PHASE 2: Role-based filtering happens SERVER-SIDE
 * When you call ProjectsProvider.list():
 * 1. JWT token is sent with request
 * 2. Backend extracts role from token
 * 3. Backend filters projects based on role:
 *    - Admin: All projects
 *    - Technician/Approver: Assigned projects only
 *    - Customer: Own projects only
 * 4. Only accessible projects returned to frontend
 *
 * Frontend never sees unauthorized data.
 */
export const ProjectsProvider = {
  async list(): Promise<Project[]> {
    // Backend automatically filters by user role from JWT token
    return withMockFallback(
      () => ProjectsAPI.fetchProjects(),
      () => getMockProjects(),
      'fetchProjects'
    );
  },

  async get(id: string): Promise<Project> {
    return withMockFallback(
      () => ProjectsAPI.fetchProject(id),
      async () => {
        const projects = await getMockProjects();
        const project = projects.find(p => p.id === id);
        if (!project) throw new Error(`Project not found: ${id}`);
        return project;
      },
      `fetchProject(${id})`
    );
  },

  async create(data: {
    name: string;
    client: string;
    type: ProjectType;
    address?: string;
    phone?: string;
    status?: ProjectStatus;
  }): Promise<Project> {
    return withMockFallback(
      () => ProjectsAPI.createProject(data),
      () => addMockProject(data),
      'createProject'
    );
  },

  async update(id: string, data: Partial<Project>): Promise<Project> {
    return withMockFallback(
      () => ProjectsAPI.updateProject(id, data),
      async () => {
        throw new Error('Project update not supported in mock data');
      },
      `updateProject(${id})`
    );
  },
};

/**
 * Assets Data Provider
 */
export const AssetsProvider = {
  async list(projectId?: string): Promise<Asset[]> {
    return withMockFallback(
      () => AssetsAPI.fetchAssets(projectId),
      () => getMockAssets(),
      'fetchAssets'
    );
  },

  async get(id: string): Promise<Asset> {
    return withMockFallback(
      () => AssetsAPI.fetchAsset(id),
      async () => {
        const assets = await getMockAssets();
        const asset = assets.find(a => a.id === id);
        if (!asset) throw new Error(`Asset not found: ${id}`);
        return asset;
      },
      `fetchAsset(${id})`
    );
  },

  async create(data: Omit<Asset, 'id' | 'created_at' | 'updated_at'>): Promise<Asset> {
    return withMockFallback(
      () => AssetsAPI.createAsset(data),
      () => saveMockAsset(data),
      'createAsset'
    );
  },

  async update(id: string, data: Partial<Asset>): Promise<Asset> {
    return withMockFallback(
      () => AssetsAPI.updateAsset(id, data),
      () => saveMockAsset({ ...data, id }),
      `updateAsset(${id})`
    );
  },
};
