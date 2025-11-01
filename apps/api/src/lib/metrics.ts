import { appendFileSync } from 'fs';
import { join } from 'path';
import { metricsLogger } from './logger';

export interface MetricEvent {
  /** Event name (e.g., 'otp.generated', 'auth.success') */
  event: string;
  /** ISO timestamp */
  timestamp: string;
  /** User ID (if applicable) */
  userId?: string;
  /** User email (if applicable) */
  email?: string;
  /** Whether the operation was successful */
  success: boolean;
  /** Additional metadata */
  metadata?: Record<string, any>;
  /** Error message (if failed) */
  error?: string;
}

type MetricsFormat = 'console' | 'file' | 'both' | 'none';

class MetricsService {
  private enabled: boolean;
  private format: MetricsFormat;
  private filePath: string;

  constructor() {
    // Read configuration from environment
    this.enabled = process.env.METRICS_ENABLED !== 'false'; // Default: enabled
    this.format = (process.env.METRICS_FORMAT as MetricsFormat) || 'console';
    this.filePath =
      process.env.METRICS_FILE_PATH || join(process.cwd(), 'logs', 'metrics.jsonl');
  }

  /**
   * Track a metric event
   */
  track(event: Omit<MetricEvent, 'timestamp'>): void {
    if (!this.enabled) return;

    const metricEvent: MetricEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    // Output to console
    if (this.format === 'console' || this.format === 'both') {
      this.logToConsole(metricEvent);
    }

    // Output to file
    if (this.format === 'file' || this.format === 'both') {
      this.logToFile(metricEvent);
    }
  }

  /**
   * Log to console with color coding
   */
  private logToConsole(event: MetricEvent): void {
    const statusSymbol = event.success ? '✅' : '❌';
    const eventName = event.event.padEnd(30);

    // Build metadata string
    const metaParts: string[] = [];
    if (event.email) metaParts.push(`email=${event.email}`);
    if (event.userId) metaParts.push(`userId=${event.userId}`);
    if (event.metadata) {
      Object.entries(event.metadata).forEach(([key, value]) => {
        metaParts.push(`${key}=${JSON.stringify(value)}`);
      });
    }
    if (event.error) metaParts.push(`error=${event.error}`);

    const metaString = metaParts.length > 0 ? ` | ${metaParts.join(', ')}` : '';

    metricsLogger.info(`${statusSymbol} ${eventName}${metaString}`);
  }

  /**
   * Log to file as JSON lines
   */
  private logToFile(event: MetricEvent): void {
    try {
      const line = JSON.stringify(event) + '\n';
      appendFileSync(this.filePath, line, 'utf-8');
    } catch (error) {
      metricsLogger.error({ err: error, filePath: this.filePath }, 'Failed to write metrics to file');
    }
  }

  /**
   * Helper to track successful events
   */
  success(
    event: string,
    data?: Omit<MetricEvent, 'event' | 'timestamp' | 'success'>
  ): void {
    this.track({
      event,
      success: true,
      ...data,
    });
  }

  /**
   * Helper to track failed events
   */
  failure(
    event: string,
    error: string,
    data?: Omit<MetricEvent, 'event' | 'timestamp' | 'success' | 'error'>
  ): void {
    this.track({
      event,
      success: false,
      error,
      ...data,
    });
  }
}

// Export singleton instance
export const metrics = new MetricsService();

// Export convenience functions
export const trackMetric = metrics.track.bind(metrics);
export const trackSuccess = metrics.success.bind(metrics);
export const trackFailure = metrics.failure.bind(metrics);
