/**
 * Analytics Events Service
 *
 * Tracks user actions and business metrics for insights & dashboards.
 *
 * Events are sent to analytics backend (PostHog, Mixpanel, custom).
 * Client-side tracking provides real-time user insights.
 * Server-side events (via audit logs) provide financial accuracy.
 *
 * Privacy:
 * - No PII stored (only userId, not email)
 * - No sensitive data (no project budget, asset content)
 * - Respects GDPR (analytics opt-out available)
 */

export enum AnalyticsEventType {
  // User events
  UserSignedIn = 'user_signed_in',
  UserSignedOut = 'user_signed_out',
  UserProfileViewed = 'user_profile_viewed',

  // Project events
  ProjectCreated = 'project_created',
  ProjectViewed = 'project_viewed',
  ProjectApproved = 'project_approved',
  ProjectStarted = 'project_started',
  ProjectDelivered = 'project_delivered',
  ProjectRejected = 'project_rejected',

  // Asset events
  AssetUploadStarted = 'asset_upload_started',
  AssetUploadCompleted = 'asset_upload_completed',
  AssetUploadFailed = 'asset_upload_failed',
  AssetViewed = 'asset_viewed',
  AssetDownloaded = 'asset_downloaded',

  // QA events
  QASubmitted = 'qa_submitted',
  QAApproved = 'qa_approved',
  QAChangesRequested = 'qa_changes_requested',
  QARejected = 'qa_rejected',

  // Payout events
  PayoutRequested = 'payout_requested',
  PayoutApproved = 'payout_approved',
  PayoutPaid = 'payout_paid',

  // Page events
  PageViewed = 'page_viewed',
  FormSubmitted = 'form_submitted',
  ButtonClicked = 'button_clicked',
  ErrorOccurred = 'error_occurred',

  // Search & Filter
  SearchPerformed = 'search_performed',
  FilterApplied = 'filter_applied'
}

export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  userId?: string; // Current user ID
  orgId?: string; // Organization context
  projectId?: string; // Project context
  timestamp?: number; // Unix timestamp (ms)
  properties?: Record<string, unknown>; // Event-specific data
}

/**
 * Send analytics event to backend
 *
 * Batches events and sends periodically to reduce network calls.
 * Respects analytics opt-out preference.
 */
export function trackEvent(event: AnalyticsEvent): void {
  // Check if analytics is enabled
  const analyticsOptOut = localStorage.getItem('analytics_opt_out') === 'true';
  if (analyticsOptOut) {
    return;
  }

  // Add timestamp if not provided
  const eventToSend: AnalyticsEvent = {
    ...event,
    timestamp: event.timestamp || Date.now()
  };

  // Log to console in dev mode
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventToSend);
  }

  // Send to backend (batched)
  enqueueEvent(eventToSend);
}

// ============================================================================
// EVENT QUEUE & BATCHING
// ============================================================================

let eventQueue: AnalyticsEvent[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

const BATCH_SIZE = 20; // Events per batch
const FLUSH_INTERVAL = 30000; // 30 seconds

function enqueueEvent(event: AnalyticsEvent): void {
  eventQueue.push(event);

  // Flush if batch size reached
  if (eventQueue.length >= BATCH_SIZE) {
    flushEvents();
  } else if (!flushTimeout) {
    // Schedule flush if not already scheduled
    flushTimeout = setTimeout(flushEvents, FLUSH_INTERVAL);
  }
}

async function flushEvents(): Promise<void> {
  if (eventQueue.length === 0) return;

  const eventsToSend = [...eventQueue];
  eventQueue = [];

  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }

  try {
    // Send to backend
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: eventsToSend })
    });
  } catch (err) {
    console.warn('[Analytics] Failed to send events:', err);
    // Re-queue failed events (don't lose them)
    eventQueue.unshift(...eventsToSend);
  }
}

/**
 * Flush remaining events on page unload
 */
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    flushEvents();
  });
}

// ============================================================================
// CONVENIENCE TRACKERS
// ============================================================================

export function trackPageView(path: string, title?: string): void {
  trackEvent({
    eventType: AnalyticsEventType.PageViewed,
    properties: { path, title }
  });
}

export function trackFormSubmit(formName: string, fields?: string[]): void {
  trackEvent({
    eventType: AnalyticsEventType.FormSubmitted,
    properties: { form_name: formName, field_count: fields?.length }
  });
}

export function trackButtonClick(buttonName: string, context?: string): void {
  trackEvent({
    eventType: AnalyticsEventType.ButtonClicked,
    properties: { button_name: buttonName, context }
  });
}

export function trackError(errorMessage: string, errorType?: string, context?: string): void {
  trackEvent({
    eventType: AnalyticsEventType.ErrorOccurred,
    properties: { error_message: errorMessage, error_type: errorType, context }
  });
}

export function trackProjectEvent(
  eventType: AnalyticsEventType,
  projectId: string,
  properties?: Record<string, unknown>
): void {
  trackEvent({
    eventType,
    projectId,
    properties
  });
}

export function trackAssetEvent(
  eventType: AnalyticsEventType,
  projectId: string,
  assetId: string,
  properties?: Record<string, unknown>
): void {
  trackEvent({
    eventType,
    projectId,
    properties: { asset_id: assetId, ...properties }
  });
}

/**
 * Set analytics opt-out preference
 */
export function setAnalyticsOptOut(optOut: boolean): void {
  if (optOut) {
    localStorage.setItem('analytics_opt_out', 'true');
  } else {
    localStorage.removeItem('analytics_opt_out');
  }
}

/**
 * Check if analytics is enabled
 */
export function isAnalyticsEnabled(): boolean {
  return localStorage.getItem('analytics_opt_out') !== 'true';
}
