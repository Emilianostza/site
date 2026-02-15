/**
 * File Upload Hook - Signed URL Version (Phase 3)
 *
 * Manages upload state, progress, error handling, and retry logic.
 * Uploads directly to S3 via signed URLs.
 *
 * Example:
 * ```tsx
 * const upload = useFileUpload();
 *
 * const handleFileSelect = async (file: File) => {
 *   try {
 *     const result = await upload.uploadFile(projectId, file);
 *     console.log('Uploaded:', result.fileKey);
 *   } catch (err) {
 *     console.error('Upload failed:', upload.error);
 *   }
 * };
 *
 * return (
 *   <>
 *     <input type="file" onChange={(e) => handleFileSelect(e.target.files?.[0])} />
 *     {upload.isUploading && <div>{upload.progress}%</div>}
 *     {upload.error && <div className="error">{upload.error}</div>}
 *     {upload.uploadedFileName && <div className="success">✓ {upload.uploadedFileName}</div>}
 *   </>
 * );
 * ```
 */

import { useState, useCallback } from 'react';
import {
  uploadAssetFile,
  validateUploadFile,
  UploadProgressEvent,
} from '@/services/upload/signed-upload';

export interface UseFileUploadResult {
  // State
  isUploading: boolean;
  progress: number; // 0-100
  error: string | null;
  uploadedFileName?: string;

  // Actions
  uploadFile: (
    projectId: string,
    file: File
  ) => Promise<{ fileKey: string; assetId?: string; fileName: string; fileSize: number }>;
  reset: () => void;
  clearError: () => void;
}

export function useFileUpload(): UseFileUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>();

  const uploadFile = useCallback(async (projectId: string, file: File) => {
    // Validate
    const validation = validateUploadFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Validation failed');
      throw new Error(validation.error);
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Upload with progress tracking
      const result = await uploadAssetFile(projectId, file, (event: UploadProgressEvent) => {
        if (event.type === 'progress') {
          setProgress(event.percent);
        } else if (event.type === 'error') {
          setError(event.error || 'Upload failed');
        }
      });

      // Success
      setProgress(100);
      setUploadedFileName(file.name);

      return {
        fileKey: result.fileKey,
        assetId: result.assetId,
        fileName: file.name,
        fileSize: file.size,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setUploadedFileName(undefined);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isUploading,
    progress,
    error,
    uploadedFileName,
    uploadFile,
    reset,
    clearError,
  };
}
