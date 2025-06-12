
import { securityEventLogger } from './security/securityEventLogger';
import { rateLimitService } from './security/rateLimitService';
import { inputValidationService } from './security/inputValidationService';
import { sessionSecurityService } from './security/sessionSecurityService';
import { csrfService } from './security/csrfService';

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
}

export const enhancedSecurityService = new EnhancedSecurityService();
