/**
 * Analytics Dashboard Hook
 *
 * Fetches, caches, and manages dashboard metrics for display in components.
 * Auto-refreshes metrics periodically and provides trend analysis.
 *
 * Usage:
 * const { metrics, loading, error, refresh } = useAnalyticsDashboard('daily');
 *
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorAlert message={error} />;
 *
 * return (
 *   <DashboardGrid metrics={metrics} />
 * );
 */

import { useState, useEffect, useCallback } from 'react';
import {
  DashboardMetrics,
  MetricsTrend,
  aggregateDashboardMetrics,
  calculateMetricsTrend,
} from '@/services/analytics/dashboard';
import { apiClient } from '@/services/api/client';

interface UseAnalyticsDashboardOptions {
  period?: 'daily' | 'weekly' | 'monthly';
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
  orgId?: string;
  projectId?: string;
}

interface UseAnalyticsDashboardResult {
  // Current data
  metrics: DashboardMetrics | null;
  previousMetrics: DashboardMetrics | null;
  trends: MetricsTrend[];

  // State
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;

  // Actions
  refresh: () => Promise<void>;
  clearError: () => void;
  setPeriod: (period: 'daily' | 'weekly' | 'monthly') => void;
}

/**
 * Hook to fetch and manage analytics dashboard metrics
 */
export function useAnalyticsDashboard(
  options: UseAnalyticsDashboardOptions = {}
): UseAnalyticsDashboardResult {
  const {
    period: initialPeriod = 'daily',
    autoRefresh = true,
    refreshInterval = 60000, // 1 minute
    orgId,
    projectId,
  } = options;

  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>(initialPeriod);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [previousMetrics, setPreviousMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calculate date range based on period
   */
  const getDateRange = useCallback((): { dateFrom: string; dateTo: string } => {
    const now = new Date();
    let dateFrom: Date;

    switch (period) {
      case 'daily':
        dateFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    return {
      dateFrom: dateFrom.toISOString(),
      dateTo: now.toISOString(),
    };
  }, [period]);

  /**
   * Fetch analytics events and calculate metrics
   */
  const fetchMetrics = useCallback(
    async (isPreviousPeriod = false) => {
      try {
        const { dateFrom, dateTo } = getDateRange();

        // Adjust date range for previous period comparison
        let adjustedDateFrom = dateFrom;
        let adjustedDateTo = dateTo;

        if (isPreviousPeriod) {
          const fromDate = new Date(dateFrom);
          const toDate = new Date(dateTo);
          const rangeMs = toDate.getTime() - fromDate.getTime();

          adjustedDateTo = new Date(fromDate.getTime()).toISOString();
          adjustedDateFrom = new Date(fromDate.getTime() - rangeMs).toISOString();
        }

        // Fetch events from analytics API
        const params = new URLSearchParams();
        params.append('date_from', adjustedDateFrom);
        params.append('date_to', adjustedDateTo);
        if (orgId) params.append('org_id', orgId);
        if (projectId) params.append('project_id', projectId);

        const response = await apiClient.get<any>(`/analytics/metrics?${params.toString()}`);

        // If response already contains aggregated metrics, use them
        if (response.metrics) {
          return response.metrics as DashboardMetrics;
        }

        // Otherwise, aggregate from raw events
        const events = response.events || [];
        const aggregated = aggregateDashboardMetrics(
          events,
          period,
          adjustedDateFrom,
          adjustedDateTo
        );

        return aggregated;
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to fetch metrics');
      }
    },
    [period, orgId, projectId, getDateRange]
  );

  /**
   * Load current and previous metrics
   */
  const loadMetrics = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      // Fetch current and previous period metrics in parallel
      const [current, previous] = await Promise.all([fetchMetrics(false), fetchMetrics(true)]);

      setMetrics(current);
      setPreviousMetrics(previous);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load metrics';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [fetchMetrics]);

  /**
   * Refresh metrics (manual or auto)
   */
  const refresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);

      const [current, previous] = await Promise.all([fetchMetrics(false), fetchMetrics(true)]);

      setMetrics(current);
      setPreviousMetrics(previous);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to refresh metrics';
      setError(errorMsg);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchMetrics]);

  /**
   * Load metrics on mount
   */
  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  /**
   * Auto-refresh metrics
   */
  useEffect(() => {
    if (!autoRefresh || !metrics) return;

    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, metrics, refresh]);

  /**
   * Calculate trends from current and previous metrics
   */
  const trends = metrics && previousMetrics ? calculateMetricsTrend(metrics, previousMetrics) : [];

  return {
    metrics,
    previousMetrics,
    trends,
    loading,
    error,
    isRefreshing,
    refresh,
    clearError: () => setError(null),
    setPeriod,
  };
}

/**
 * Hook to track a specific analytics event
 *
 * Usage:
 * const trackEvent = useTrackEvent();
 * trackEvent('project_created', { projectId: '123' });
 */
export function useTrackEvent() {
  return useCallback((eventType: string, properties?: Record<string, unknown>) => {
    // Send event to analytics service
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        timestamp: Date.now(),
        properties,
      }),
    }).catch((err) => console.warn('[Analytics] Failed to track event:', err));
  }, []);
}

/**
 * Hook to track page views automatically
 *
 * Usage:
 * usePageViewTracking('/dashboard');
 */
export function usePageViewTracking(pagePath: string, pageTitle?: string) {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'page_viewed',
            timestamp: Date.now(),
            properties: {
              path: pagePath,
              title: pageTitle || document.title,
              referrer: document.referrer,
            },
          }),
        });
      } catch (err) {
        console.warn('[Analytics] Failed to track page view:', err);
      }
    };

    trackPageView();
  }, [pagePath, pageTitle]);
}

/**
 * Hook to track form submissions
 *
 * Usage:
 * useFormSubmissionTracking('request_form');
 * <form onSubmit={handleFormSubmit}>...</form>
 */
export function useFormSubmissionTracking(formName: string) {
  const trackEvent = useTrackEvent();

  return useCallback(
    (fields?: string[]) => {
      trackEvent('form_submitted', {
        form_name: formName,
        field_count: fields?.length ?? 0,
        timestamp: Date.now(),
      });
    },
    [formName, trackEvent]
  );
}

/**
 * Hook to track button clicks with context
 *
 * Usage:
 * const trackClick = useButtonClickTracking();
 * <button onClick={() => trackClick('submit', 'request-form')}>Submit</button>
 */
export function useButtonClickTracking() {
  return useCallback((buttonName: string, context?: string) => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'button_clicked',
        timestamp: Date.now(),
        properties: {
          button_name: buttonName,
          context,
          page: window.location.pathname,
        },
      }),
    }).catch((err) => console.warn('[Analytics] Failed to track button click:', err));
  }, []);
}

/**
 * Hook to track and report errors to analytics
 *
 * Usage:
 * useErrorTracking();
 * try { ... } catch (err) { errorTracker(err, 'asset_upload'); }
 */
export function useErrorTracking() {
  return useCallback((error: Error | string, errorType?: string) => {
    const errorMessage = error instanceof Error ? error.message : String(error);

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'error_occurred',
        timestamp: Date.now(),
        properties: {
          error_message: errorMessage,
          error_type: errorType,
          stack: error instanceof Error ? error.stack : undefined,
          page: window.location.pathname,
        },
      }),
    }).catch((err) => console.warn('[Analytics] Failed to track error:', err));
  }, []);
}

/**
 * Hook to track search/filter operations
 *
 * Usage:
 * const trackSearch = useSearchTracking();
 * <input onChange={(e) => trackSearch(e.target.value, 'projects')} />
 */
export function useSearchTracking() {
  return useCallback((query: string, scope?: string) => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'search_performed',
        timestamp: Date.now(),
        properties: {
          query,
          scope,
          page: window.location.pathname,
        },
      }),
    }).catch((err) => console.warn('[Analytics] Failed to track search:', err));
  }, []);
}
