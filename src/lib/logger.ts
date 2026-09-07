/**
 * Logging utility for consistent error handling and logging across the application
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, context || "");
    }
    // In production, send to logging service
    this.sendToService("info", message, context);
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context || "");
    this.sendToService("warn", message, context);
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    console.error(`[ERROR] ${message}`, error || "", context || "");
    
    // Extract error details
    const errorDetails = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : { error };

    this.sendToService("error", message, { ...context, ...errorDetails });
  }

  /**
   * Log debug messages (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context || "");
    }
  }

  /**
   * Send logs to external service (e.g., Sentry, LogRocket, DataDog)
   */
  private sendToService(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): void {
    // Only send errors and warnings to production logging service
    if (!this.isDevelopment && (level === "error" || level === "warn")) {
      // Example: Send to Sentry, LogRocket, or custom endpoint
      // Sentry.captureMessage(message, { level, extra: context });
      
      // For now, we'll just prepare the payload
      const payload = {
        level,
        message,
        context,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
        url: typeof window !== "undefined" ? window.location.href : undefined,
      };

      // TODO: Replace with actual logging service call
      // fetch('/api/logs', { method: 'POST', body: JSON.stringify(payload) });
      
      // For development, just log that we would send it
      if (this.isDevelopment) {
        console.log("[Logger] Would send to service:", payload);
      }
    }
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Helper to get error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "An unexpected error occurred";
}

/**
 * Helper to safely stringify errors for logging
 */
export function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return { error: String(error) };
}
