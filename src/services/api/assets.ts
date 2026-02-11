/**
 * Assets API Service
 *
 * Provides frontend interface to asset management endpoints.
 * Handles file uploads, metadata storage, and access control.
 *
 * API Contract (to be implemented by backend):
 * GET    /assets            - List assets visible to current user
 * GET    /assets/:id        - Get asset metadata
 * POST   /assets/:id        - Create/update asset
 * DELETE /assets/:id        - Delete asset
 * POST   /assets/upload-url - Get signed upload URL (S3)
 */

import { apiClient } from '@/client';
import { Asset } from '@/types';

export interface UploadUrlRequest {
  project_id: string;
  file_name: string;
  file_size: number;
  content_type: string;
}

export interface UploadUrlResponse {
  upload_url: string;
  asset_id: string;
  expires_in: number;
}

export interface CreateAssetInput {
  name: string;
  project_id: string;
  file_key: string; // S3 object key after upload
  file_size: number;
  content_type: string;
  thumb?: string;
}

/**
 * Get list of assets visible to current user.
 * Server filters based on user's project access.
 */
export async function fetchAssets(projectId?: string): Promise<Asset[]> {
  const params = projectId ? `?project_id=${projectId}` : '';
  return apiClient.get<Asset[]>(`/assets${params}`);
}

/**
 * Get single asset metadata.
 * Server validates user has access to parent project.
 */
export async function fetchAsset(id: string): Promise<Asset> {
  return apiClient.get<Asset>(`/assets/${id}`);
}

/**
 * Create asset record in database.
 * Called after file is uploaded to S3 via signed URL.
 */
export async function createAsset(data: CreateAssetInput): Promise<Asset> {
  return apiClient.post<Asset>('/assets', data);
}

/**
 * Update asset metadata.
 * Name, status, etc.
 */
export async function updateAsset(
  id: string,
  data: Partial<Omit<Asset, 'id'>>
): Promise<Asset> {
  return apiClient.patch<Asset>(`/assets/${id}`, data);
}

/**
 * Delete asset and its files from storage.
 * Available to authorized users only.
 */
export async function deleteAsset(id: string): Promise<void> {
  await apiClient.delete(`/assets/${id}`);
}

/**
 * Request a signed upload URL from S3.
 *
 * Flow:
 * 1. Frontend calls this endpoint with file metadata
 * 2. Backend generates signed URL valid for ~15 minutes
 * 3. Frontend uploads file directly to S3
 * 4. Frontend calls createAsset() to record in DB
 *
 * This avoids uploading files through our servers - keeps them lightweight.
 */
export async function getUploadUrl(request: UploadUrlRequest): Promise<UploadUrlResponse> {
  return apiClient.post<UploadUrlResponse>('/assets/upload-url', request);
}

/**
 * Get signed URL for accessing/downloading an asset.
 * Server validates access, generates short-lived URL.
 */
export async function getAssetAccessUrl(assetId: string): Promise<{ url: string }> {
  return apiClient.post<{ url: string }>(`/assets/${assetId}/access-url`, {});
}
