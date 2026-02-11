/**
 * Signed Upload Service
 *
 * Handles S3 uploads via signed URLs (pre-signed POST).
 * Security: User never sees AWS credentials, backend controls what/where can be uploaded.
 *
 * Flow:
 * 1. Frontend requests signed URL from backend (/api/assets/upload-url)
 * 2. Backend validates user + project, generates signed S3 policy, returns URL
 * 3. Frontend uploads file directly to S3 using signed policy
 * 4. S3 triggers webhook (Lambda/webhook) to notify backend when upload completes
 * 5. Backend creates Asset record + triggers processing
 *
 * PHASE 3 Prerequisites:
 * - Backend endpoint: POST /api/assets/upload-url
 * - S3 CORS configuration (allow PUT from frontend domain)
 * - S3 event notifications (Lambda or SQS) to trigger processing
 */

export interface SignedUploadUrlResponse {
  upload_url: string; // Pre-signed S3 URL
  upload_policy: {
    bucket: string;
    key: string; // S3 object key
    expiration: string; // ISO timestamp
    conditions: Record<string, string>;
  };
  file_key: string; // For Asset creation
  asset_id?: string; // If asset created server-side
}

export interface UploadProgressEvent {
  type: 'start' | 'progress' | 'complete' | 'error';
  loaded: number; // Bytes uploaded
  total: number; // Total bytes
  percent: number; // 0-100
  error?: string;
}

/**
 * Request signed upload URL from backend
 *
 * Backend validates:
 * - User is authenticated
 * - User has permission to upload to this project
 * - File size is within limits
 * - File type is allowed (by MIME type, extension)
 */
export async function getSignedUploadUrl(
  projectId: string,
  filename: string,
  fileSize: number,
  contentType: string
): Promise<SignedUploadUrlResponse> {
  const response = await fetch('/api/assets/upload-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('managed_capture_auth_token') || ''}`
    },
    body: JSON.stringify({
      project_id: projectId,
      filename,
      file_size: fileSize,
      content_type: contentType
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to get signed upload URL');
  }

  return response.json();
}

/**
 * Upload file to S3 using signed URL
 *
 * Supports progress tracking via XMLHttpRequest (not fetch, for progress events)
 */
export async function uploadToSignedUrl(
  file: File,
  signedUrl: string,
  onProgress?: (event: UploadProgressEvent) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Progress tracking
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        onProgress?.({
          type: 'progress',
          loaded: e.loaded,
          total: e.total,
          percent: percentComplete
        });
      }
    });

    // Success
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.({
          type: 'complete',
          loaded: file.size,
          total: file.size,
          percent: 100
        });
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    // Error
    xhr.addEventListener('error', () => {
      onProgress?.({
        type: 'error',
        loaded: 0,
        total: file.size,
        percent: 0,
        error: `Upload failed: ${xhr.statusText}`
      });
      reject(new Error('Upload failed'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'));
    });

    // Send to S3
    xhr.open('PUT', signedUrl, true);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.send(file);
  });
}

/**
 * Complete upload flow: get signed URL + upload file
 */
export async function uploadAssetFile(
  projectId: string,
  file: File,
  onProgress?: (event: UploadProgressEvent) => void
): Promise<{ fileKey: string; assetId?: string }> {
  try {
    // Step 1: Get signed URL from backend
    onProgress?.({
      type: 'start',
      loaded: 0,
      total: file.size,
      percent: 0
    });

    const signedResponse = await getSignedUploadUrl(
      projectId,
      file.name,
      file.size,
      file.type || 'application/octet-stream'
    );

    // Step 2: Upload to S3 using signed URL
    await uploadToSignedUrl(file, signedResponse.upload_url, onProgress);

    // Step 3: Return file key for Asset creation
    return {
      fileKey: signedResponse.file_key,
      assetId: signedResponse.asset_id // If backend created asset automatically
    };
  } catch (err) {
    onProgress?.({
      type: 'error',
      loaded: 0,
      total: file.size,
      percent: 0,
      error: err instanceof Error ? err.message : 'Upload failed'
    });
    throw err;
  }
}

/**
 * Allowed file types for uploads
 */
export const ALLOWED_ASSET_TYPES = {
  '3d_model': ['application/x-zip-compressed', 'application/zip', 'model/gltf-binary', 'application/octet-stream'],
  'photo': ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'],
  'mesh': ['application/x-zip-compressed', 'application/zip', 'model/obj', 'model/gltf-binary'],
  'point_cloud': ['application/x-zip-compressed', 'application/zip', 'application/octet-stream'],
  'video': ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
};

/**
 * Validate file before upload
 */
export function validateUploadFile(
  file: File,
  maxSizeMB: number = 500
): { valid: boolean; error?: string } {
  // Size check
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File too large. Max: ${maxSizeMB}MB, Got: ${Math.round(file.size / 1024 / 1024)}MB`
    };
  }

  // Type check (basic, server does strict validation)
  const allowedTypes = [
    'application/zip',
    'application/x-zip-compressed',
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'model/gltf-binary',
    'application/octet-stream'
  ];

  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(zip|jpg|png|webp|mp4|glb|obj)$/i)) {
    return {
      valid: false,
      error: `File type not supported: ${file.type || 'unknown'}`
    };
  }

  return { valid: true };
}
