/**
 * Hook: File Upload with Progress Tracking
 *
 * Manages file upload state and progress for React components.
 *
 * Example:
 * ```tsx
 * const { upload, uploading, progress, error } = useFileUpload(projectId);
 *
 * const handleFileSelect = async (file: File) => {
 *   const asset = await upload(file);
 *   if (asset) {
 *     console.log('Uploaded:', asset);
 *   }
 * };
 *
 * return (
 *   <>
 *     <input type="file" onChange={(e) => handleFileSelect(e.target.files[0])} />
 *     {uploading && <div>{progress}%</div>}
 *     {error && <div>{error}</div>}
 *   </>
 * );
 * ```
 */

import { useState, useCallback } from 'react';
import { Asset } from '@/types';
import { uploadFile, validateFile, SUPPORTED_FORMATS, MAX_FILE_SIZE, UploadProgress } from '@/services/upload';

export interface UseFileUploadResult {
  /** Upload a file (returns asset on success, null on failure) */
  upload: (file: File) => Promise<Asset | null>;

  /** Currently uploading? */
  uploading: boolean;

  /** Upload progress 0-100 */
  progress: number;

  /** Error message if upload failed */
  error: string | null;

  /** Clear error message */
  clearError: () => void;
}

export function useFileUpload(projectId: string): UseFileUploadResult {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<Asset | null> => {
      // Clear previous error
      setError(null);

      // Validate file
      const validation = validateFile(file, {
        maxSize: MAX_FILE_SIZE,
        allowedTypes: SUPPORTED_FORMATS
      });

      if (!validation.valid) {
        setError(validation.error);
        return null;
      }

      setUploading(true);
      setProgress(0);

      try {
        const result = await uploadFile({
          projectId,
          fileName: file.name,
          file,
          contentType: file.type,
          onProgress: (p: UploadProgress) => {
            setProgress(p.percentage);
          }
        });

        if (!result.success) {
          setError(result.error || 'Upload failed');
          return null;
        }

        return result.asset;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setError(message);
        return null;
      } finally {
        setUploading(false);
      }
    },
    [projectId]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    upload,
    uploading,
    progress,
    error,
    clearError
  };
}
