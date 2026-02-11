/**
 * Upload Service with Signed S3 URLs
 *
 * PHASE 4: Direct-to-S3 uploads without proxying through our servers.
 *
 * Flow:
 * 1. Frontend requests signed upload URL from backend
 * 2. Backend returns presigned URL (valid for ~15 minutes)
 * 3. Frontend uploads directly to S3 with that URL
 * 4. Frontend notifies backend that upload completed
 * 5. Backend stores metadata in database
 * 6. Backend generates thumbnails and QR codes
 * 7. Frontend displays asset with signed access URLs
 *
 * Benefits:
 * - Our servers don't store large files
 * - Scales to many simultaneous uploads
 * - Direct S3 upload (faster, no bandwidth overhead)
 * - Credentials hidden (only URL valid for ~15 min)
 * - No exposing AWS keys to frontend
 */

import { apiClient } from '@/services/api';
import * as AssetsAPI from '@/api/assets';
import { Asset } from '@/types';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  projectId: string;
  fileName: string;
  file: File;
  contentType?: string;
  onProgress?: (progress: UploadProgress) => void;
}

export interface UploadResult {
  asset: Asset;
  success: boolean;
  error?: string;
}

/**
 * Get presigned upload URL from backend
 *
 * Backend generates S3 presigned URL valid for ~15 minutes.
 * This URL can only be used to PUT a single object with specific metadata.
 */
async function getUploadUrl(
  projectId: string,
  fileName: string,
  fileSize: number,
  contentType: string
): Promise<AssetsAPI.UploadUrlResponse> {
  return AssetsAPI.getUploadUrl({
    project_id: projectId,
    file_name: fileName,
    file_size: fileSize,
    content_type: contentType
  });
}

/**
 * Upload file directly to S3 using presigned URL
 *
 * The presigned URL can only be used to upload that exact file.
 * Any tampering with headers/metadata will fail.
 */
async function uploadToS3(
  uploadUrl: string,
  file: File,
  contentType: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round((e.loaded / e.total) * 100)
          });
        }
      });
    }

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'));
    });

    // PUT to S3 with presigned URL
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', contentType);

    // Important: Don't set other headers, presigned URL is specific to content-type
    xhr.send(file);
  });
}

/**
 * Complete upload and notify backend
 *
 * After S3 upload succeeds, tell backend:
 * 1. File is ready at S3 location
 * 2. Store asset metadata
 * 3. Generate thumbnail
 * 4. Generate QR code
 */
async function completeUpload(
  projectId: string,
  assetId: string,
  fileName: string,
  fileSize: number,
  contentType: string
): Promise<Asset> {
  // Notify backend that upload completed
  // Backend will:
  // - Update asset metadata
  // - Generate thumbnail
  // - Generate QR code
  // - Return signed access URLs
  return AssetsAPI.createAsset({
    name: fileName,
    project_id: projectId,
    file_key: `projects/${projectId}/assets/${assetId}/${fileName}`,
    file_size: fileSize,
    content_type: contentType
  });
}

/**
 * Upload file (full flow)
 *
 * 1. Request presigned URL
 * 2. Upload to S3
 * 3. Notify backend
 * 4. Return asset with signed URLs
 *
 * Example:
 * ```tsx
 * const result = await uploadFile({
 *   projectId: 'PRJ-001',
 *   fileName: 'model.glb',
 *   file: fileInput.files[0],
 *   onProgress: (p) => setProgress(p.percentage)
 * });
 *
 * if (result.success) {
 *   console.log('Uploaded:', result.asset);
 * }
 * ```
 */
export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  try {
    const { projectId, fileName, file, contentType, onProgress } = options;
    const mimeType = contentType || file.type || 'application/octet-stream';
    const assetId = `AST-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // Step 1: Request presigned URL
    if (onProgress) {
      onProgress({ loaded: 0, total: file.size, percentage: 0 });
    }

    const uploadUrlResponse = await getUploadUrl(
      projectId,
      fileName,
      file.size,
      mimeType
    );

    // Step 2: Upload to S3
    const progressHandler = onProgress
      ? (p: UploadProgress) => {
          // Report first 90% for upload progress
          onProgress({
            ...p,
            percentage: Math.round(p.percentage * 0.9)
          });
        }
      : undefined;

    await uploadToS3(uploadUrlResponse.upload_url, file, mimeType, progressHandler);

    // Step 3: Notify backend
    if (onProgress) {
      onProgress({ loaded: file.size, total: file.size, percentage: 90 });
    }

    const asset = await completeUpload(
      projectId,
      assetId,
      fileName,
      file.size,
      mimeType
    );

    if (onProgress) {
      onProgress({ loaded: file.size, total: file.size, percentage: 100 });
    }

    return { asset, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      asset: {} as Asset,
      success: false,
      error: message
    };
  }
}

/**
 * Get asset download URL with authorization
 *
 * Server validates user can access this asset, then provides
 * a presigned URL valid for ~1 hour.
 */
export async function getAssetUrl(assetId: string): Promise<string> {
  const response = await AssetsAPI.getAssetAccessUrl(assetId);
  return response.url;
}

/**
 * Calculate file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  options?: {
    maxSize?: number; // Bytes
    allowedTypes?: string[];
  }
): { valid: boolean; error?: string } {
  // Check size
  if (options?.maxSize && file.size > options.maxSize) {
    return {
      valid: false,
      error: `File too large. Max: ${formatFileSize(options.maxSize)}`
    };
  }

  // Check MIME type
  if (options?.allowedTypes && !options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed: ${options.allowedTypes.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Supported 3D model formats
 */
export const SUPPORTED_FORMATS = [
  'model/gltf-binary',      // .glb
  'model/gltf+json',        // .gltf
  'model/vnd.usdz',         // .usdz
  'application/x-zip',      // .zip (may contain obj+mtl)
  'image/vnd.adobe.photoshop' // PSD for reference
];

/**
 * Max file size: 500 MB
 */
export const MAX_FILE_SIZE = 500 * 1024 * 1024;
