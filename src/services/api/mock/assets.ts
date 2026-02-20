/**
 * Mock Assets API Service
 *
 * Provides hardcoded asset data for development and testing.
 * Simulates network latency with artificial delays.
 *
 * This service is used when VITE_USE_MOCK_DATA=true or when the real API is unavailable.
 */

import { Asset } from '@/types';

// Mutable in-memory store for mock assets
const MOCK_ASSETS: Asset[] = [
  {
    id: 'AST-105',
    name: 'Project',
    project_id: 'PRJ-001',
    thumb: 'https://picsum.photos/seed/burger/400/400',
    status: 'Published',
    type: undefined,
    size: '5MB',
    updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    file_size: 5 * 1024 * 1024,
    file_key: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    content_type: 'model/gltf-binary',
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 1640,
    uniqueViewCount: 1200,
  },
];

// Simulate network latency
const NETWORK_DELAY = 500;

/**
 * Fetch assets (with optional filtering)
 */
export async function fetchAssets(filter: Record<string, any> = {}) {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY));

  let results = [...MOCK_ASSETS];

  // Apply filters if provided
  if (filter.project_id) {
    results = results.filter((a) => a.project_id === filter.project_id);
  }
  if (filter.status) {
    results = results.filter((a) => a.status === filter.status);
  }
  if (filter.type) {
    results = results.filter(
      (a) => a.type && a.type.toLowerCase().includes(filter.type.toLowerCase())
    );
  }

  return {
    assets: results,
    total: results.length,
    page: 1,
    pageSize: results.length,
  };
}

/**
 * Get a single asset by ID
 */
export async function getAsset(id: string) {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY));

  const asset = MOCK_ASSETS.find((a) => a.id === id);
  if (!asset) {
    throw new Error(`Asset ${id} not found`);
  }
  return asset;
}

/**
 * Create a new asset
 */
export async function createAsset(data: Partial<Asset>) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newAsset: Asset = {
    id: `AST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    name: data.name || 'Untitled Scene',
    project_id: data.project_id,
    thumb: data.thumb || 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    status: 'In Review',
    type: data.type || '3D Model',
    size: data.size || 'Unknown',
    file_size: data.file_size || 0,
    file_key: data.file_key,
    content_type: data.content_type || 'model/gltf+json',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    viewCount: Math.floor(Math.random() * 1000),
    uniqueViewCount: Math.floor(Math.random() * 800),
  };

  MOCK_ASSETS.unshift(newAsset);
  return newAsset;
}

/**
 * Update an existing asset
 */
export async function updateAsset(id: string, data: Partial<Asset>) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const index = MOCK_ASSETS.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error(`Asset ${id} not found`);
  }

  const updated = {
    ...MOCK_ASSETS[index],
    ...data,
    id: MOCK_ASSETS[index].id, // Prevent ID changes
    updated_at: new Date().toISOString(),
  };

  MOCK_ASSETS[index] = updated;
  return updated;
}

/**
 * Publish an asset (transitions from in_review to published)
 */
export async function publishAsset(id: string) {
  return updateAsset(id, { status: 'Published' });
}

/**
 * Delete an asset
 */
export async function deleteAsset(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const index = MOCK_ASSETS.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error(`Asset ${id} not found`);
  }

  MOCK_ASSETS.splice(index, 1);
  return { success: true, id };
}

// Default export for easier importing
export default {
  fetchAssets,
  getAsset,
  createAsset,
  updateAsset,
  publishAsset,
  deleteAsset,
};
