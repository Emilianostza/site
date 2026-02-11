/**
 * Organizations API Service
 *
 * PHASE 2: Organization management for multi-tenant system
 */

import { apiClient } from '@/client';
import { Organization, organizationFromDTO } from '@/types/auth';

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
  const data = await apiClient.post('/organizations', org);
  return organizationFromDTO(data);
}

/**
 * Update organization settings (admin only)
 */
export async function update(
  orgId: string,
  updates: Partial<Organization>
): Promise<Organization> {
  const data = await apiClient.patch(`/organizations/${orgId}`, updates);
  return organizationFromDTO(data);
}
