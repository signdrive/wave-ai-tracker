
import { securityEventLogger } from './security/securityEventLogger';
import { rateLimitService } from './security/rateLimitService';
import { inputValidationService } from './security/inputValidationService';
import { sessionSecurityService } from './security/sessionSecurityService';
import { csrfService } from './security/csrfService';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  user_id?: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

class EnhancedSecurityService {
  // Delegate to security event logger
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    return securityEventLogger.logSecurityEvent(event);
  }

  async getSecurityEvents(userId?: string, severity?: string): Promise<any[]> {
    return securityEventLogger.getSecurityEvents(userId, severity);
  }

  // Delegate to rate limit service
  async checkRateLimit(identifier: string, action: string, limit: number = 10): Promise<boolean> {
    return rateLimitService.checkRateLimit(identifier, action, limit);
  }

  async cleanupOldRateLimits(): Promise<void> {
    return rateLimitService.cleanupOldRateLimits();
  }

  // Delegate to input validation service
  validateInput(input: string, context: string): boolean {
    return inputValidationService.validateInput(input, context);
  }

  sanitizeUserInput(input: any): any {
    return inputValidationService.sanitizeUserInput(input);
  }

  // Delegate to session security service
  async validateSession(): Promise<boolean> {
    return sessionSecurityService.validateSession();
  }

  async checkUserRole(requiredRole: string): Promise<boolean> {
    return sessionSecurityService.checkUserRole(requiredRole);
  }

  // Delegate to CSRF service
  generateCSRFToken(): string {
    return csrfService.generateCSRFToken();
  }

  validateCSRFToken(token: string, expectedToken: string): boolean {
    return csrfService.validateCSRFToken(token, expectedToken);
  }

  // Enhanced security monitoring
  async performSecurityCheck(): Promise<{ 
    status: 'secure' | 'warning' | 'critical'; 
    issues: string[]; 
  }> {
    const issues: string[] = [];
    let status: 'secure' | 'warning' | 'critical' = 'secure';

    try {
      // Check user authentication
      const sessionValid = await this.validateSession();
      if (!sessionValid) {
        issues.push('Invalid or expired session');
        status = 'warning';
      }

      // Check for recent security events
      const recentEvents = await this.getSecurityEvents(undefined, 'critical');
      if (recentEvents.length > 5) {
        issues.push('Multiple critical security events detected');
        status = 'critical';
      }

      // Log security check
      await this.logSecurityEvent({
        event_type: 'security_check_performed',
        severity: status === 'critical' ? 'high' : 'low',
        details: { 
          status, 
          issuesCount: issues.length,
          timestamp: new Date().toISOString() 
        }
      });

      return { status, issues };
    } catch (error) {
      await this.logSecurityEvent({
        event_type: 'security_check_error',
        severity: 'high',
        details: { error: String(error), timestamp: new Date().toISOString() }
      });
      
      return { 
        status: 'critical', 
        issues: ['Security check system error'] 
      };
    }
  }

  // Enhanced user validation with role checking
  async validateUserWithRole(userId: string, requiredRole?: string): Promise<boolean> {
    try {
      // Basic session validation
      const sessionValid = await this.validateSession();
      if (!sessionValid) {
        return false;
      }

      // Role validation if required
      if (requiredRole) {
        const hasRole = await this.checkUserRole(requiredRole);
        if (!hasRole) {
          await this.logSecurityEvent({
            user_id: userId,
            event_type: 'insufficient_permissions',
            severity: 'medium',
            details: { 
              requiredRole,
              timestamp: new Date().toISOString() 
            }
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      await this.logSecurityEvent({
        user_id: userId,
        event_type: 'user_validation_error',
        severity: 'high',
        details: { 
          error: String(error),
          timestamp: new Date().toISOString() 
        }
      });
      return false;
    }
  }
}

export const enhancedSecurityService = new EnhancedSecurityService();
