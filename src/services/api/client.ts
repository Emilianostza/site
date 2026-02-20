/**
 * HTTP Client for backend API communication
 *
 * This is the single point of contact between frontend and backend.
 * All data flows through this client.
 */

import { env } from '@/config/env';

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private orgId: string | null = null;

  constructor() {
    this.baseUrl = env.apiBaseUrl;
  }

  /**
   * Set JWT token for authenticated requests
   * Called after login/token refresh
   */
  setToken(token: string | null): void {
    this.token = token;
  }

  /**
   * Get current token (for debugging/testing)
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Set organization context for org-scoped requests
   * Called after login with user's orgId
   */
  setOrgId(orgId: string | null): void {
    this.orgId = orgId;
  }

  /**
   * Get current organization ID
   */
  getOrgId(): string | null {
    return this.orgId;
  }

  /**
   * Core fetch wrapper
   * Handles auth headers, org context, request tracking, error responses, JSON parsing
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit & { timeout?: number } = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge existing headers if provided
    if (options.headers) {
      if (typeof options.headers === 'object' && !(options.headers instanceof Headers)) {
        Object.assign(headers, options.headers);
      }
    }

    // Add JWT token if available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Add organization context if available (org-scoped queries)
    if (this.orgId) {
      headers['X-Organization-Id'] = this.orgId;
    }

    // Add request tracking ID for audit trail
    headers['X-Request-Id'] = crypto.randomUUID();

    const controller = new AbortController();
    const timeoutMs = options.timeout || 30000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle error responses
      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          // Response wasn't valid JSON
        }

        throw {
          status: response.status,
          message: errorData.message || response.statusText,
          code: errorData.code,
          details: errorData.details,
        } as ApiError;
      }

      // Parse successful response
      const data: T = await response.json();
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      // Timeout (AbortController signal)
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw {
          status: 0,
          message: 'Request timed out',
          code: 'TIMEOUT_ERROR',
        } as ApiError;
      }

      // Network errors
      if (error instanceof TypeError) {
        throw {
          status: 0,
          message: 'Network error: ' + error.message,
          code: 'NETWORK_ERROR',
        } as ApiError;
      }

      // Already formatted API error
      if (error.status !== undefined) {
        throw error as ApiError;
      }

      // Unknown error
      throw {
        status: 0,
        message: String(error),
        code: 'UNKNOWN_ERROR',
      } as ApiError;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
