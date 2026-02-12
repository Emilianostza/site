/**
 * Storage Service Layer
 *
 * Abstracts storage operations to support multiple backends:
 * - Supabase Storage (primary)
 * - Storj (future)
 *
 * Provides a clean interface for upload, download, delete operations.
 */

import supabase from '@/lib/supabase';

// Storage buckets
export const BUCKETS = {
  ASSETS: 'assets',
  THUMBNAILS: 'thumbnails',
} as const;

// Supported file types
export const ALLOWED_TYPES = {
  MODELS: [
    'model/gltf+json',
    'model/gltf-binary',
    'model/vnd.usdz+zip',
    'application/octet-stream',
  ],
  IMAGES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

export interface StorageProvider {
  upload(bucket: string, path: string, file: File | Blob): Promise<string>;
  getUrl(bucket: string, path: string): Promise<string | null>;
  getSignedUrl(bucket: string, path: string, expirySeconds?: number): Promise<string | null>;
  delete(bucket: string, path: string): Promise<boolean>;
  listFiles(bucket: string, prefix?: string): Promise<string[]>;
}

/**
 * Supabase Storage Implementation
 *
 * Features:
 * - Public URLs for shared assets
 * - Signed URLs for private/temporary access
 * - RLS policies for access control
 * - Automatic metadata handling
 */
class SupabaseStorageProvider implements StorageProvider {
  async upload(bucket: string, path: string, file: File | Blob): Promise<string> {
    try {
      // Get file extension for content-type inference
      const fileExt = path.split('.').pop() || 'bin';

      // Determine content type
      let contentType = file.type;
      if (!contentType) {
        // Fallback for files without type
        if (fileExt === 'glb') contentType = 'model/gltf-binary';
        else if (fileExt === 'gltf') contentType = 'model/gltf+json';
        else if (fileExt === 'usdz') contentType = 'model/vnd.usdz+zip';
        else contentType = 'application/octet-stream';
      }

      const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
        contentType,
        upsert: false, // Fail if file exists
      });

      if (error) throw error;
      if (!data) throw new Error('Upload returned no data');

      return data.path;
    } catch (error) {
      console.error(`[Storage] Upload failed for ${path}:`, error);
      throw error;
    }
  }

  async getUrl(bucket: string, path: string): Promise<string | null> {
    try {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data?.publicUrl || null;
    } catch (error) {
      console.error(`[Storage] Failed to get URL for ${path}:`, error);
      return null;
    }
  }

  async getSignedUrl(
    bucket: string,
    path: string,
    expirySeconds: number = 3600
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expirySeconds);

      if (error) throw error;
      return data?.signedUrl || null;
    } catch (error) {
      console.error(`[Storage] Failed to get signed URL for ${path}:`, error);
      return null;
    }
  }

  async delete(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`[Storage] Delete failed for ${path}:`, error);
      return false;
    }
  }

  async listFiles(bucket: string, prefix?: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage.from(bucket).list(prefix || '', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) throw error;

      return data
        .filter((file) => file.name !== '.emptyFolderPlaceholder')
        .map((file) => file.name);
    } catch (error) {
      console.error(`[Storage] List files failed for ${prefix}:`, error);
      return [];
    }
  }
}

/**
 * Placeholder for Storj Storage
 *
 * To implement later:
 * - Uplink client for Storj
 * - Generate access grants
 * - Upload/download with encryption
 */
class StorjStorageProvider implements StorageProvider {
  async upload(): Promise<string> {
    throw new Error('Storj storage not yet implemented');
  }

  async getUrl(): Promise<string | null> {
    throw new Error('Storj storage not yet implemented');
  }

  async getSignedUrl(): Promise<string | null> {
    throw new Error('Storj storage not yet implemented');
  }

  async delete(): Promise<boolean> {
    throw new Error('Storj storage not yet implemented');
  }

  async listFiles(): Promise<string[]> {
    throw new Error('Storj storage not yet implemented');
  }
}

/**
 * Storage factory - returns the configured provider
 */
function getStorageProvider(): StorageProvider {
  const provider = import.meta.env.VITE_STORAGE_PROVIDER || 'supabase';

  if (provider === 'storj') {
    return new StorjStorageProvider();
  }

  return new SupabaseStorageProvider();
}

/**
 * Default export: Supabase storage provider
 * Use this for all storage operations
 */
export const storage = new SupabaseStorageProvider();

/**
 * High-level convenience functions
 */

/**
 * Upload a 3D model file and return public URL
 */
export async function uploadModel(file: File, projectId: string): Promise<string> {
  const path = `projects/${projectId}/models/${Date.now()}-${file.name}`;
  await storage.upload(BUCKETS.ASSETS, path, file);
  const url = await storage.getUrl(BUCKETS.ASSETS, path);
  if (!url) throw new Error('Failed to get model URL after upload');
  return url;
}

/**
 * Upload a thumbnail image and return public URL
 */
export async function uploadThumbnail(file: File, assetId: string): Promise<string> {
  const path = `assets/${assetId}/thumbnail-${Date.now()}.jpg`;
  await storage.upload(BUCKETS.THUMBNAILS, path, file);
  const url = await storage.getUrl(BUCKETS.THUMBNAILS, path);
  if (!url) throw new Error('Failed to get thumbnail URL after upload');
  return url;
}

/**
 * Delete an asset file
 */
export async function deleteAsset(path: string): Promise<boolean> {
  return storage.delete(BUCKETS.ASSETS, path);
}

/**
 * Get list of uploaded models for a project
 */
export async function listProjectAssets(projectId: string): Promise<string[]> {
  return storage.listFiles(BUCKETS.ASSETS, `projects/${projectId}/models`);
}

export default storage;
