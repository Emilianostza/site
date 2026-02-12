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
let MOCK_ASSETS: Asset[] = [
  {
    id: 'AST-101',
    name: 'Cheeseburger Deluxe',
    projectId: 'PRJ-001',
    thumb: 'https://picsum.photos/seed/burger/400/300',
    status: 'published' as any,
    type: 'Food & Beverage',
    size: '12MB',
    fileSize: 12 * 1024 * 1024,
    fileKey: 'assets/burger-deluxe.glb',
    contentType: 'model/gltf+json',
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'AST-102',
    name: 'Fries Basket',
    projectId: 'PRJ-001',
    thumb: 'https://picsum.photos/seed/fries/400/300',
    status: 'published' as any,
    type: 'Food & Beverage',
    size: '8MB',
    fileSize: 8 * 1024 * 1024,
    fileKey: 'assets/fries-basket.glb',
    contentType: 'model/gltf+json',
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'AST-103',
    name: 'Milkshake',
    projectId: 'PRJ-001',
    thumb: 'https://picsum.photos/seed/shake/400/300',
    status: 'in_review' as any,
    type: 'Food & Beverage',
    size: '15MB',
    fileSize: 15 * 1024 * 1024,
    fileKey: 'assets/milkshake.glb',
    contentType: 'model/gltf+json',
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'AST-201',
    name: 'Designer Handbag',
    projectId: 'PRJ-002',
    thumb: 'https://picsum.photos/seed/bag/400/300',
    status: 'processing' as any,
    type: 'Fashion',
    size: '18MB',
    fileSize: 18 * 1024 * 1024,
    fileKey: 'assets/handbag.glb',
    contentType: 'model/gltf+json',
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Simulate network latency
const NETWORK_DELAY = 500;

/**
 * Fetch assets (with optional filtering)
 */
export async function fetchAssets(filter: Record<string, any> = {}) {
  await new Promise(resolve => setTimeout(resolve, NETWORK_DELAY));

  let results = [...MOCK_ASSETS];

  // Apply filters if provided
  if (filter.projectId) {
    results = results.filter(a => a.projectId === filter.projectId);
  }
  if (filter.status) {
    results = results.filter(a => a.status === filter.status);
  }
  if (filter.type) {
    results = results.filter(a => a.type.toLowerCase().includes(filter.type.toLowerCase()));
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
  await new Promise(resolve => setTimeout(resolve, NETWORK_DELAY));

  const asset = MOCK_ASSETS.find(a => a.id === id);
  if (!asset) {
    throw new Error(`Asset ${id} not found`);
  }
  return asset;
}

/**
 * Create a new asset
 */
export async function createAsset(data: Partial<Asset>) {
  await new Promise(resolve => setTimeout(resolve, 800));

  const newAsset: Asset = {
    id: `AST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    name: data.name || 'Untitled Scene',
    projectId: data.projectId,
    thumb: data.thumb || 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    status: 'in_review' as any,
    type: data.type || '3D Model',
    size: data.size || 'Unknown',
    fileSize: data.fileSize || 0,
    fileKey: data.fileKey,
    contentType: data.contentType || 'model/gltf+json',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  MOCK_ASSETS.unshift(newAsset);
  return newAsset;
}

/**
 * Update an existing asset
 */
export async function updateAsset(id: string, data: Partial<Asset>) {
  await new Promise(resolve => setTimeout(resolve, 800));

  const index = MOCK_ASSETS.findIndex(a => a.id === id);
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
  return updateAsset(id, { status: 'published' as any });
}

/**
 * Delete an asset
 */
export async function deleteAsset(id: string) {
  await new Promise(resolve => setTimeout(resolve, 800));

  const index = MOCK_ASSETS.findIndex(a => a.id === id);
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
