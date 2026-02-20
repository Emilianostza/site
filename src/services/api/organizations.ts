/**
 * Organizations API Service
 *
 * PHASE 2: Organization management for multi-tenant system
 */

import { apiClient } from '@/services/api/client';
import { Organization, organizationFromDTO, organizationToDTO } from '@/types/auth';

/**
 * Fetch a single organization by ID
 */
export async function get(orgId: string): Promise<Organization> {
  const data = await apiClient.get(`/organizations/${orgId}`);
  return organizationFromDTO(data);
}

/**
 * List all organizations (admin only)
 */
export async function list(): Promise<Organization[]> {
  const data = await apiClient.get<any[]>('/organizations');
  return data.map(organizationFromDTO);
}

/**
 * Create a new organization (admin only)
 */
export async function create(org: {
  name: string;
  slug: string;
  countryCode: string;
  region: string;
}): Promise<Organization> {
  const data = await apiClient.post('/organizations', {
    name: org.name,
    slug: org.slug,
    country_code: org.countryCode,
    region: org.region,
  });
  return organizationFromDTO(data);
}

/**
 * Update organization settings (admin only)
 */
export async function update(orgId: string, updates: Partial<Organization>): Promise<Organization> {
  // Convert camelCase domain model to snake_case DTO for the API
  const dto = organizationToDTO(updates as Organization);
  // Only include defined fields
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(dto)) {
    if (value !== undefined) payload[key] = value;
  }
  const data = await apiClient.patch(`/organizations/${orgId}`, payload);
  return organizationFromDTO(data);
}
