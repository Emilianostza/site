/**
 * Logging Infrastructure
 *
 * PHASE 6: Structured logging for observability and debugging.
 *
 * Log levels:
 * - DEBUG: Detailed debugging info
 * - INFO: General information (logins, uploads)
 * - WARN: Warning conditions (rate limit approaching)
 * - ERROR: Errors (failed operations)
 * - FATAL: Critical errors (system down)
 *
 * Destinations:
 * - Console (development)
 * - File (production)
 * - Cloud logging service (monitoring)
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

/**
 * Structured log entry
 */
export interface LogEntry {
  timestamp: string; // ISO 8601
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
  user_id?: string;
  request_id?: string;
  duration_ms?: number;
}

/**
 * Logger instance
 */
class Logger {
  private isDev = process.env.NODE_ENV !== 'production';

  private formatEntry(entry: LogEntry): string {
    return JSON.stringify(entry);
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    };

    if (error) {
      entry.error = {
        message: error.message,
        stack: error.stack,
        code: (error as any).code
      };
    }

    const formatted = this.formatEntry(entry);

    if (this.isDev) {
      // Development: color-coded console output
      const colors: Record<LogLevel, string> = {
        DEBUG: '\x1b[36m', // cyan
        INFO: '\x1b[32m', // green
        WARN: '\x1b[33m', // yellow
        ERROR: '\x1b[31m', // red
        FATAL: '\x1b[35m' // magenta
      };
      const reset = '\x1b[0m';
      console.log(`${colors[level]}[${level}]${reset} ${message}`, context);
    } else {
      // Production: structured JSON logs
      // In real implementation: send to cloud logging service
      console.log(formatted);
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('DEBUG', message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('INFO', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('WARN', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log('ERROR', message, context, error);
  }

  fatal(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log('FATAL', message, context, error);
  }
}

// Singleton instance
export const logger = new Logger();

/**
 * Log categories
 */
export const LogCategory = {
  AUTH: 'auth',
  UPLOAD: 'upload',
  PROJECT: 'project',
  ASSET: 'asset',
  TIER: 'tier',
  API: 'api',
  PERFORMANCE: 'performance',
  SECURITY: 'security',
  ERROR: 'error'
};

/**
 * Common log messages
 */
export const LogMessages = {
  // Auth
  LOGIN_SUCCESS: 'User logged in',
  LOGIN_FAILED: 'Login failed',
  LOGOUT: 'User logged out',
  TOKEN_REFRESH: 'Token refreshed',
  UNAUTHORIZED: 'Unauthorized access',

  // Upload
  UPLOAD_START: 'File upload started',
  UPLOAD_COMPLETE: 'File upload completed',
  UPLOAD_FAILED: 'File upload failed',
  UPLOAD_BLOCKED: 'File upload blocked (tier limit)',

  // Projects
  PROJECT_CREATED: 'Project created',
  PROJECT_UPDATED: 'Project updated',
  PROJECT_DELETED: 'Project deleted',
  STATUS_CHANGED: 'Project status changed',

  // Performance
  SLOW_REQUEST: 'Slow request detected',
  RATE_LIMITED: 'Rate limit exceeded',
  DATABASE_SLOW: 'Database query slow',

  // Security
  SUSPICIOUS_ACCESS: 'Suspicious access attempt',
  TIER_LIMIT_EXCEEDED: 'Tier limit exceeded',
  PERMISSION_DENIED: 'Permission denied'
};

/**
 * Log API request (middleware)
 */
export function logRequest(
  method: string,
  path: string,
  userId?: string,
  requestId?: string
) {
  logger.debug(`API Request: ${method} ${path}`, {
    method,
    path,
    user_id: userId,
    request_id: requestId
  });
}

/**
 * Log API response (middleware)
 */
export function logResponse(
  method: string,
  path: string,
  status: number,
  durationMs: number,
  userId?: string,
  requestId?: string
) {
  const level = status >= 500 ? 'ERROR' : status >= 400 ? 'WARN' : 'INFO';
  const message = `API Response: ${method} ${path} ${status}`;

  if (level === 'INFO') {
    logger.info(message, {
      method,
      path,
      status,
      duration_ms: durationMs,
      user_id: userId,
      request_id: requestId
    });
  } else {
    logger.warn(message, {
      method,
      path,
      status,
      duration_ms: durationMs,
      user_id: userId,
      request_id: requestId
    });
  }
}

/**
 * Log business event
 */
export function logEvent(
  category: string,
  message: string,
  context: Record<string, unknown>
) {
  logger.info(`[${category}] ${message}`, context);
}
