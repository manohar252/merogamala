export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment: boolean = import.meta.env.DEV;
  private isConsoleEnabled: boolean = import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true';

  private formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error
    };

    // In development, always log to console if enabled
    if (this.isDevelopment && this.isConsoleEnabled) {
      const formattedMessage = this.formatMessage(level, message, context);
      
      switch (level) {
        case 'debug':
          console.debug(formattedMessage, error);
          break;
        case 'info':
          console.info(formattedMessage, error);
          break;
        case 'warn':
          console.warn(formattedMessage, error);
          break;
        case 'error':
          console.error(formattedMessage, error);
          break;
      }
    }

    // In production, you would send logs to a logging service
    // Example: Send to server endpoint or external logging service
    if (!this.isDevelopment) {
      this.sendToLoggingService(logEntry);
    }
  }

  private async sendToLoggingService(logEntry: LogEntry): Promise<void> {
    try {
      // In production, implement actual logging service integration
      // Example: Send to server endpoint, Sentry, LogRocket, etc.
      
      // For now, just store critical errors in localStorage as fallback
      if (logEntry.level === 'error') {
        const existingLogs = localStorage.getItem('mero-gamala-error-logs');
        const logs = existingLogs ? JSON.parse(existingLogs) : [];
        
        logs.push({
          ...logEntry,
          timestamp: logEntry.timestamp.toISOString()
        });
        
        // Keep only last 50 error logs
        if (logs.length > 50) {
          logs.splice(0, logs.length - 50);
        }
        
        localStorage.setItem('mero-gamala-error-logs', JSON.stringify(logs));
      }
    } catch (error) {
      // Fallback: If logging service fails, at least log to console in development
      if (this.isDevelopment) {
        console.error('Failed to send log to logging service:', error);
      }
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log('warn', message, context, error);
  }

  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log('error', message, context, error);
  }

  // Specialized logging methods for different domains
  auth(action: 'login' | 'logout' | 'session_check', message: string, context?: Record<string, unknown>): void {
    this.info(`AUTH: ${action.toUpperCase()} - ${message}`, { ...context, domain: 'authentication' });
  }

  order(action: 'created' | 'updated' | 'failed', message: string, context?: Record<string, unknown>): void {
    this.info(`ORDER: ${action.toUpperCase()} - ${message}`, { ...context, domain: 'orders' });
  }

  payment(action: 'initiated' | 'success' | 'failed', message: string, context?: Record<string, unknown>): void {
    this.info(`PAYMENT: ${action.toUpperCase()} - ${message}`, { ...context, domain: 'payments' });
  }

  database(action: 'query' | 'insert' | 'update' | 'delete' | 'error', message: string, context?: Record<string, unknown>): void {
    this.info(`DB: ${action.toUpperCase()} - ${message}`, { ...context, domain: 'database' });
  }

  // Performance logging
  performance(metric: string, value: number, unit: string = 'ms'): void {
    this.info(`PERFORMANCE: ${metric} - ${value}${unit}`, { 
      domain: 'performance',
      metric,
      value,
      unit
    });
  }

  // Security logging
  security(event: 'suspicious_activity' | 'failed_auth' | 'input_validation', message: string, context?: Record<string, unknown>): void {
    this.warn(`SECURITY: ${event.toUpperCase()} - ${message}`, { ...context, domain: 'security' });
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;