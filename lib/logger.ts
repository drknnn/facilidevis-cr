/**
 * Système de logs structurés pour FaciliDevis
 * 
 * En production, peut être étendu avec Sentry, LogRocket, etc.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  userId?: string
  requestId?: string
  [key: string]: any
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` ${JSON.stringify(context)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage('info', message, context))
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context))
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    }
    console.error(this.formatMessage('error', message, errorContext))
    
    // En production, envoyer à Sentry ou autre service de monitoring
    if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
      // TODO: Intégrer Sentry
      // Sentry.captureException(error, { extra: errorContext })
    }
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context))
    }
  }
}

export const logger = new Logger()

/**
 * Helper pour logger les erreurs d'API
 */
export function logApiError(
  endpoint: string,
  error: Error | unknown,
  context?: LogContext
): void {
  logger.error(`API Error: ${endpoint}`, error, {
    ...context,
    endpoint,
  })
}

/**
 * Helper pour logger les actions utilisateur
 */
export function logUserAction(
  action: string,
  userId: string,
  details?: Record<string, any>
): void {
  logger.info(`User Action: ${action}`, {
    userId,
    ...details,
  })
}

