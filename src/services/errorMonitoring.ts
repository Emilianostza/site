/**
 * Error Monitoring & Alerting
 *
 * PHASE 6: Track and alert on errors in production.
 *
 * Integrations (ready for):
 * - Sentry (error tracking)
 * - PagerDuty (alerting)
 * - DataDog (APM)
 * - CloudWatch (AWS monitoring)
 *
 * Error severity levels:
 * - LOW: Recoverable, user can retry
 * - MEDIUM: Temporary failure, needs investigation
 * - HIGH: Data loss risk, needs immediate action
 * - CRITICAL: System down, needs immediate response
 */

export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Error report to monitoring service
 */
export interface ErrorReport {
  message: string;
  severity: ErrorSeverity;
  code?: string;
  context?: Record<string, unknown>;
  stack?: string;
  timestamp: string;
  user_id?: string;
  request_id?: string;
}

/**
 * Error categories and default severity
 */
export const ErrorCategories: Record<string, { severity: ErrorSeverity; alert: boolean }> = {
  // Low severity (recoverable)
  VALIDATION_ERROR: { severity: 'LOW', alert: false },
  NOT_FOUND: { severity: 'LOW', alert: false },
  RATE_LIMITED: { severity: 'LOW', alert: false },
  TIER_LIMIT_EXCEEDED: { severity: 'LOW', alert: false },

  // Medium severity (investigation needed)
  AUTHENTICATION_FAILED: { severity: 'MEDIUM', alert: true },
  PERMISSION_DENIED: { severity: 'MEDIUM', alert: true },
  EXTERNAL_SERVICE_ERROR: { severity: 'MEDIUM', alert: true },
  DATABASE_ERROR: { severity: 'MEDIUM', alert: true },

  // High severity (data risk)
  DATA_INTEGRITY_ERROR: { severity: 'HIGH', alert: true },
  UPLOAD_FAILURE: { severity: 'HIGH', alert: true },
  STORAGE_ERROR: { severity: 'HIGH', alert: true },

  // Critical (system down)
  SYSTEM_FAILURE: { severity: 'CRITICAL', alert: true },
  DEPENDENCY_DOWN: { severity: 'CRITICAL', alert: true },
  UNRECOVERABLE_ERROR: { severity: 'CRITICAL', alert: true }
};

/**
 * Error monitoring service
 */
class ErrorMonitor {
  /**
   * Report error to monitoring service
   *
   * In production:
   * 1. Send to Sentry
   * 2. Send to DataDog APM
   * 3. If HIGH/CRITICAL, alert team via PagerDuty
   */
  async reportError(report: ErrorReport) {
    // Log error
    console.error(`[${report.severity}] ${report.message}`, report);

    // In production, send to monitoring service:
    // if (process.env.SENTRY_DSN) {
    //   Sentry.captureException(new Error(report.message), {
    //     level: report.severity.toLowerCase(),
    //     contexts: { custom: report.context }
    //   });
    // }

    // Alert if needed
    if (['HIGH', 'CRITICAL'].includes(report.severity)) {
      await this.alertTeam(report);
    }
  }

  /**
   * Alert team via PagerDuty/Slack
   */
  private async alertTeam(report: ErrorReport) {
    // In production:
    // POST to PagerDuty incident endpoint
    // POST to Slack webhook
    console.error(`ALERT: ${report.severity} - ${report.message}`);
  }

  /**
   * Track error rate for alerting
   */
  trackErrorRate(category: string, count: number = 1) {
    // In production: send metric to DataDog/CloudWatch
    console.warn(`Error rate: ${category} = ${count}`);
  }
}

export const errorMonitor = new ErrorMonitor();

/**
 * Wrap function with error monitoring
 */
export function withErrorMonitoring<T>(
  fn: () => Promise<T>,
  category: string,
  context?: Record<string, unknown>
): Promise<T> {
  return fn().catch(error => {
    const categoryConfig = ErrorCategories[category] || {
      severity: 'MEDIUM',
      alert: true
    };

    errorMonitor.reportError({
      message: error.message,
      severity: categoryConfig.severity,
      code: error.code,
      context,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    throw error;
  });
}

/**
 * Error-aware promise wrapper
 */
export async function handleError<T>(
  promise: Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await promise;
  } catch (error) {
    errorMonitor.reportError({
      message: (error as Error).message,
      severity: 'MEDIUM',
      stack: (error as Error).stack,
      timestamp: new Date().toISOString()
    });
    return fallback;
  }
}
