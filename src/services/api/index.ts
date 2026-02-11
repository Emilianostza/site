/**
 * API Services Index
 *
 * Central export point for all backend API services.
 * Import from this file, not from individual service files.
 */

export { apiClient, ApiClient, type ApiError } from '@/client';
export * as AuthAPI from '@/auth';
export * as ProjectsAPI from '@/projects';
export * as AssetsAPI from '@/assets';
