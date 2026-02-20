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
 * Authorization Model: RLS-first
 * - Client talks directly to Supabase; all permissions enforced via Row Level Security policies.
 * - Each table/storage bucket has RLS policies scoped to org_id and role.
 * - Netlify Functions are used ONLY for privileged server-side operations:
 *     • gemini-proxy  — AI features (employees only, rate-limited)
 *     • assets-signed-url — private asset download URLs
 *     • publish        — future: publish/deploy workflows
 * - No client-side role filtering — Supabase returns only what the authenticated user may see.
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
async function getMockProjectsService() {
  return await import('@/services/api/mock/projects');
}

async function getMockAssetsService() {
  return await import('@/services/api/mock/assets');
}

async function getRealProjectsService() {
  return await import('@/services/api/real/projects');
}

async function getRealAssetsService() {
  return await import('@/services/api/real/assets');
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

    // Mock data
    const mockService = await getMockProjectsService();
    const { projects } = await mockService.fetchProjects(filter);
    return projects;
  },

  async get(id: string) {
    if (USE_REAL_API) {
      const { getProject } = await getRealProjectsService();
      return await getProject(id);
    }

    // Mock data
    const mockService = await getMockProjectsService();
    return await mockService.getProject(id);
  },

  async create(data: any) {
    if (USE_REAL_API) {
      const { createProject } = await getRealProjectsService();
      return await createProject(data);
    }

    // Mock data
    const mockService = await getMockProjectsService();
    return await mockService.createProject(data);
  },

  async update(id: string, data: any) {
    if (USE_REAL_API) {
      const { updateProject } = await getRealProjectsService();
      return await updateProject(id, data);
    }

    // Mock data
    const mockService = await getMockProjectsService();
    return await mockService.updateProject(id, data);
  },

  async approve(id: string) {
    if (USE_REAL_API) {
      const { approveProject } = await getRealProjectsService();
      return await approveProject(id);
    }

    // Mock data
    const mockService = await getMockProjectsService();
    return await mockService.approveProject(id);
  },

  async start(id: string) {
    if (USE_REAL_API) {
      const { startProject } = await getRealProjectsService();
      return await startProject(id);
    }

    // Mock data
    const mockService = await getMockProjectsService();
    return await mockService.startProject(id);
  },

  async deliver(id: string) {
    if (USE_REAL_API) {
      const { deliverProject } = await getRealProjectsService();
      return await deliverProject(id);
    }

    // Mock data
    const mockService = await getMockProjectsService();
    return await mockService.deliverProject(id);
  },

  async delete(id: string) {
    if (USE_REAL_API) {
      const { deleteProject } = await getRealProjectsService();
      return await deleteProject(id);
    }

    // Mock data
    const mockService = await getMockProjectsService();
    return await mockService.deleteProject(id);
  },
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

    // Mock data
    const mockService = await getMockAssetsService();
    const { assets } = await mockService.fetchAssets(filter);
    return assets;
  },

  async get(id: string) {
    if (USE_REAL_API) {
      const { getAsset } = await getRealAssetsService();
      return await getAsset(id);
    }

    // Mock data
    const mockService = await getMockAssetsService();
    return await mockService.getAsset(id);
  },

  async create(data: any) {
    if (USE_REAL_API) {
      const { createAsset } = await getRealAssetsService();
      return await createAsset(data);
    }

    // Mock data
    const mockService = await getMockAssetsService();
    return await mockService.createAsset(data);
  },

  async update(id: string, data: any) {
    if (USE_REAL_API) {
      const { updateAsset } = await getRealAssetsService();
      return await updateAsset(id, data);
    }

    // Mock data
    const mockService = await getMockAssetsService();
    return await mockService.updateAsset(id, data);
  },

  async publish(id: string) {
    if (USE_REAL_API) {
      const { publishAsset } = await getRealAssetsService();
      return await publishAsset(id);
    }

    // Mock data
    const mockService = await getMockAssetsService();
    return await mockService.publishAsset(id);
  },

  async delete(id: string) {
    if (USE_REAL_API) {
      const { deleteAsset } = await getRealAssetsService();
      return await deleteAsset(id);
    }

    // Mock data
    const mockService = await getMockAssetsService();
    return await mockService.deleteAsset(id);
  },
};
