
interface MonitoringConfig {
  dsn?: string;
  environment?: string;
  userId?: string;
}

class Monitoring {
  private isInitialized = false;
  private config: MonitoringConfig = {};

  init(config: MonitoringConfig) {
    this.config = config;
    
    // Initialize Sentry if available and DSN is provided
    if (typeof window !== 'undefined' && config.dsn) {
      try {
        // Check if Sentry is available
        if ((window as any).Sentry) {
          (window as any).Sentry.init({
            dsn: config.dsn,
            environment: config.environment || 'development',
            integrations: [
              new (window as any).Sentry.BrowserTracing({
                // Set up automatic route change tracking for React Router
                routingInstrumentation: (window as any).Sentry.reactRouterV6Instrumentation(
                  React.useEffect,
                  () => window.location,
                  () => ({ pathname: window.location.pathname })
                )
              })
            ],
            tracesSampleRate: 1.0,
            beforeSend: (event) => {
              // Filter out development errors in production
              if (config.environment === 'production') {
                return event;
              }
              console.log('📊 Sentry event (dev):', event);
              return event;
            }
          });
          
          this.isInitialized = true;
          console.log('📊 Monitoring initialized with Sentry');
        }
      } catch (error) {
        console.warn('⚠️ Failed to initialize Sentry:', error);
      }
    }
  }

  captureException(error: Error, context?: Record<string, any>) {
    console.error('📊 Capturing exception:', error, context);
    
    if (this.isInitialized && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: context,
        user: this.config.userId ? { id: this.config.userId } : undefined
      });
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) {
    console.log(`📊 Capturing message [${level}]:`, message, context);
    
    if (this.isInitialized && (window as any).Sentry) {
      (window as any).Sentry.captureMessage(message, level as any, {
        contexts: context,
        user: this.config.userId ? { id: this.config.userId } : undefined
      });
    }
  }

  setUser(userId: string) {
    this.config.userId = userId;
    
    if (this.isInitialized && (window as any).Sentry) {
      (window as any).Sentry.setUser({ id: userId });
    }
  }

  addBreadcrumb(message: string, category: string = 'general', data?: Record<string, any>) {
    if (this.isInitialized && (window as any).Sentry) {
      (window as any).Sentry.addBreadcrumb({
        message,
        category,
        data,
        timestamp: Date.now() / 1000
      });
    }
  }
}

export const monitoring = new Monitoring();

// React hook for easy monitoring integration
export const useMonitoring = () => {
  const captureException = (error: Error, context?: Record<string, any>) => {
    monitoring.captureException(error, context);
  };

  const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) => {
    monitoring.captureMessage(message, level, context);
  };

  const addBreadcrumb = (message: string, category?: string, data?: Record<string, any>) => {
    monitoring.addBreadcrumb(message, category, data);
  };

  return {
    captureException,
    captureMessage,
    addBreadcrumb
  };
};
