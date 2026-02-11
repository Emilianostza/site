/**
 * Data Provider with Mock/Real API Switching
 *
 * Unified data access layer that switches between mock and real backend.
 * Supports gradual migration from development mock data to production Supabase.
 *
 * Architecture:
 * - VITE_USE_MOCK_DATA=true: Use in-memory mock data
 * - VITE_USE_MOCK_DATA=false: Use Supabase backend via REST API
 *
 * Role-Based Access Control (RBAC):
 * - ALL role-based filtering happens SERVER-SIDE
 * - Backend filters results based on JWT token claims
 * - Frontend receives only authorized data
 * - Client-side filtering is NOT performed (not your job)
 *
 * Security Model:
 * 1. User authenticates → JWT token generated with role + org_id
 * 2. Token sent with every API request (via Authorization header)
 * 3. Backend verifies token signature (can't be forged)
 * 4. Backend extracts role from token
 * 5. Backend filters results based on role:
 *    - Admin: All projects
 *    - Technician: Only assigned projects
 *    - Customer: Only own projects
 * 6. Backend returns 403 Forbidden if unauthorized
 *
 * This is secure because tokens are cryptographically signed.
 */

import { env } from '@/config/env';

/**
 * Select between mock or real API based on feature flag
 */
const USE_REAL_API = !env.useMockData;

/**
 * Dynamic imports for mock vs real services
 * This allows tree-shaking unused code in production
 */
async function getRealProjectsService() {
  const { default: service } = await import('@/services/api/real/projects');
  return service;
}

async function getRealAssetsService() {
  const { default: service } = await import('@/services/api/real/assets');
  return service;
}

/**
 * Projects Data Provider
 *
 * Usage:
 * const projects = await ProjectsProvider.list();
 * const project = await ProjectsProvider.get(id);
 */
export const ProjectsProvider = {
  async list(filter = {}) {
    if (USE_REAL_API) {
      const { fetchProjects } = await getRealProjectsService();
      const { projects } = await fetchProjects(filter);
      return projects;
    }

    // Mock data fallback
    console.log('[DataProvider] Using mock projects');
    return [];
  },

  async get(id: string) {
    if (USE_REAL_API) {
      const { getProject } = await getRealProjectsService();
      return await getProject(id);
    }

    // Mock data fallback
    return null;
  },

  async create(data: any) {
    if (USE_REAL_API) {
      const { createProject } = await getRealProjectsService();
      return await createProject(data);
    }

    throw new Error('Project creation not available in mock mode');
  },

  async update(id: string, data: any) {
    if (USE_REAL_API) {
      const { updateProject } = await getRealProjectsService();
      return await updateProject(id, data);
    }

    throw new Error('Project update not available in mock mode');
  },

  async approve(id: string) {
    if (USE_REAL_API) {
      const { approveProject } = await getRealProjectsService();
      return await approveProject(id);
    }

    throw new Error('Project approval not available in mock mode');
  },

  async start(id: string) {
    if (USE_REAL_API) {
      const { startProject } = await getRealProjectsService();
      return await startProject(id);
    }

    throw new Error('Project start not available in mock mode');
  },

  async deliver(id: string) {
    if (USE_REAL_API) {
      const { deliverProject } = await getRealProjectsService();
      return await deliverProject(id);
    }

    throw new Error('Project delivery not available in mock mode');
  },

  async delete(id: string) {
    if (USE_REAL_API) {
      const { deleteProject } = await getRealProjectsService();
      return await deleteProject(id);
    }

    throw new Error('Project deletion not available in mock mode');
  }
};

/**
 * Assets Data Provider
 *
 * Usage:
 * const assets = await AssetsProvider.list({ projectId });
 * const asset = await AssetsProvider.get(id);
 */
export const AssetsProvider = {
  async list(filter = {}) {
    if (USE_REAL_API) {
      const { fetchAssets } = await getRealAssetsService();
      const { assets } = await fetchAssets(filter);
      return assets;
    }

    // Mock data fallback
    console.log('[DataProvider] Using mock assets');
    return [];
  },

  async get(id: string) {
    if (USE_REAL_API) {
      const { getAsset } = await getRealAssetsService();
      return await getAsset(id);
    }

    // Mock data fallback
    return null;
  },

  async create(data: any) {
    if (USE_REAL_API) {
      const { createAsset } = await getRealAssetsService();
      return await createAsset(data);
    }

    throw new Error('Asset creation not available in mock mode');
  },

  async update(id: string, data: any) {
    if (USE_REAL_API) {
      const { updateAsset } = await getRealAssetsService();
      return await updateAsset(id, data);
    }

    throw new Error('Asset update not available in mock mode');
  },

  async publish(id: string) {
    if (USE_REAL_API) {
      const { publishAsset } = await getRealAssetsService();
      return await publishAsset(id);
    }

    throw new Error('Asset publish not available in mock mode');
  },

  async delete(id: string) {
    if (USE_REAL_API) {
      const { deleteAsset } = await getRealAssetsService();
      return await deleteAsset(id);
    }

    throw new Error('Asset deletion not available in mock mode');
  }
};
