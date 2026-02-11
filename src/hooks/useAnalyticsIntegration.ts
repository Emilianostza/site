/**
 * Analytics Integration Hook
 *
 * Provides utilities for tracking user actions, errors, and page events.
 * Handles automatic retry of failed tracking attempts.
 *
 * Usage:
 * const { trackAction, trackError, trackPageView } = useAnalyticsIntegration();
 *
 * // Track button click
 * <button onClick={() => trackAction('submit_form', { formName: 'request' })}>
 *   Submit
 * </button>
 *
 * // Track error in try/catch
 * try {
 *   await uploadFile(file);
 * } catch (err) {
 *   trackError(err, 'file_upload');
 * }
 */

import { useCallback, useRef } from 'react';

interface AnalyticsTrackOptions {
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Hook for tracking analytics events with retry logic
 */
export function useAnalyticsIntegration(options: AnalyticsTrackOptions = {}) {
  const { maxRetries = 2, retryDelay = 1000 } = options;
  const pendingTracksRef = useRef<Map<string, number>>(new Map());

  /**
   * Send event to analytics with retry logic
   */
  const sendAnalyticsEvent = useCallback(
    async (
      eventType: string,
      properties?: Record<string, unknown>,
      retryCount = 0
    ): Promise<boolean> => {
      try {
        const response = await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType,
            timestamp: Date.now(),
            properties
          })
        });

        if (!response.ok && retryCount < maxRetries) {
          // Retry on server error
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return sendAnalyticsEvent(eventType, properties, retryCount + 1);
        }

        return response.ok;
      } catch (err) {
        if (retryCount < maxRetries) {
          // Retry on network error
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return sendAnalyticsEvent(eventType, properties, retryCount + 1);
        }

        console.warn('[Analytics] Failed to track event after retries:', err);
        return false;
      }
    },
    [maxRetries, retryDelay]
  );

  /**
   * Track a user action (click, submit, etc.)
   */
  const trackAction = useCallback(
    (
      actionName: string,
      context?: Record<string, unknown>
    ): void => {
      sendAnalyticsEvent('user_action', {
        action_name: actionName,
        page: window.location.pathname,
        timestamp: Date.now(),
        ...context
      }).catch(err => {
        console.warn('[Analytics] Failed to track action:', err);
      });
    },
    [sendAnalyticsEvent]
  );

  /**
   * Track an error with context
   */
  const trackError = useCallback(
    (
      error: Error | string,
      errorType?: string,
      context?: Record<string, unknown>
    ): void => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;

      sendAnalyticsEvent('error_occurred', {
        error_type: errorType || 'unknown',
        error_message: errorMessage,
        stack,
        page: window.location.pathname,
        url: window.location.href,
        timestamp: Date.now(),
        ...context
      }).catch(err => {
        console.warn('[Analytics] Failed to track error:', err);
      });
    },
    [sendAnalyticsEvent]
  );

  /**
   * Track page view with optional metadata
   */
  const trackPageView = useCallback(
    (
      path?: string,
      title?: string,
      metadata?: Record<string, unknown>
    ): void => {
      const currentPath = path || window.location.pathname;
      const pageTitle = title || document.title;

      sendAnalyticsEvent('page_viewed', {
        path: currentPath,
        title: pageTitle,
        referrer: document.referrer,
        timestamp: Date.now(),
        ...metadata
      }).catch(err => {
        console.warn('[Analytics] Failed to track page view:', err);
      });
    },
    [sendAnalyticsEvent]
  );

  /**
   * Track form submission
   */
  const trackFormSubmit = useCallback(
    (
      formName: string,
      fieldCount?: number,
      success?: boolean
    ): void => {
      sendAnalyticsEvent('form_submitted', {
        form_name: formName,
        field_count: fieldCount,
        success,
        page: window.location.pathname,
        timestamp: Date.now()
      }).catch(err => {
        console.warn('[Analytics] Failed to track form submission:', err);
      });
    },
    [sendAnalyticsEvent]
  );

  /**
   * Track file upload progress
   */
  const trackFileUpload = useCallback(
    (
      fileName: string,
      fileSize: number,
      success: boolean,
      duration?: number
    ): void => {
      sendAnalyticsEvent('file_uploaded', {
        file_name: fileName,
        file_size: fileSize,
        success,
        duration, // milliseconds
        page: window.location.pathname,
        timestamp: Date.now()
      }).catch(err => {
        console.warn('[Analytics] Failed to track file upload:', err);
      });
    },
    [sendAnalyticsEvent]
  );

  /**
   * Track search/filter operation
   */
  const trackSearch = useCallback(
    (
      query: string,
      scope?: string,
      resultsCount?: number
    ): void => {
      sendAnalyticsEvent('search_performed', {
        query,
        scope,
        results_count: resultsCount,
        page: window.location.pathname,
        timestamp: Date.now()
      }).catch(err => {
        console.warn('[Analytics] Failed to track search:', err);
      });
    },
    [sendAnalyticsEvent]
  );

  /**
   * Track workflow state transition
   */
  const trackWorkflowTransition = useCallback(
    (
      resourceType: string,
      resourceId: string,
      fromState: string,
      toState: string,
      metadata?: Record<string, unknown>
    ): void => {
      sendAnalyticsEvent('workflow_transition', {
        resource_type: resourceType,
        resource_id: resourceId,
        from_state: fromState,
        to_state: toState,
        page: window.location.pathname,
        timestamp: Date.now(),
        ...metadata
      }).catch(err => {
        console.warn('[Analytics] Failed to track workflow transition:', err);
      });
    },
    [sendAnalyticsEvent]
  );

  /**
   * Wrap a function to track its execution and errors
   */
  const wrapWithTracking = useCallback(
    <T extends any[], R>(
      fn: (...args: T) => Promise<R> | R,
      trackingName: string,
      context?: Record<string, unknown>
    ): (...args: T) => Promise<R | undefined> => {
      return async (...args: T): Promise<R | undefined> => {
        const startTime = Date.now();

        try {
          const result = await fn(...args);

          // Track successful execution
          trackAction(`${trackingName}_success`, {
            ...context,
            duration: Date.now() - startTime
          });

          return result;
        } catch (err) {
          // Track error
          trackError(err as Error, `${trackingName}_error`, {
            ...context,
            duration: Date.now() - startTime
          });

          throw err;
        }
      };
    },
    [trackAction, trackError]
  );

  return {
    // Raw tracking functions
    sendAnalyticsEvent,
    trackAction,
    trackError,
    trackPageView,
    trackFormSubmit,
    trackFileUpload,
    trackSearch,
    trackWorkflowTransition,

    // Utilities
    wrapWithTracking
  };
}

/**
 * Hook to automatically track page views on component mount
 */
export function usePageViewTracking(pageName: string, metadata?: Record<string, unknown>) {
  const { trackPageView } = useAnalyticsIntegration();

  // Track on mount
  React.useEffect(() => {
    trackPageView(window.location.pathname, pageName, metadata);
  }, [pageName, metadata, trackPageView]);
}

// Import React for useEffect
import React from 'react';
