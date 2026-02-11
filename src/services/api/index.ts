/**
 * API Services Index
 *
 * Central export point for all backend API services.
 * Import from this file, not from individual service files.
 */

export { apiClient, ApiClient, type ApiError } from '@/services/api/client';
export * as AuthAPI from '@/services/api/auth';
export * as ProjectsAPI from '@/services/api/projects';
export * as AssetsAPI from '@/services/api/assets';
