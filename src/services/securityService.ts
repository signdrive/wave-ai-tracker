
import { supabase } from '@/integrations/supabase/client';
import { InputValidator } from '@/utils/inputValidator';

interface SecurityEvent {
  user_id?: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

class SecurityService {
  private rateLimitMap = new Map<string, number>();
  private suspiciousPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
    /<script.*?>/i,
    /javascript:/i,
    /eval\(/i,
    /expression\(/i
  ];

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      console.warn('Security Event:', event);
      
      // In production, this would send to a security monitoring service
      // For now, we'll log to Supabase if available
      if (event.severity === 'high' || event.severity === 'critical') {
        await this.notifySecurityTeam(event);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  checkRateLimit(identifier: string, action: string, limit: number = 10): boolean {
    const key = InputValidator.rateLimitKey(identifier, action);
    const current = this.rateLimitMap.get(key) || 0;
    
    if (current >= limit) {
      this.logSecurityEvent({
        event_type: 'rate_limit_exceeded',
        severity: 'medium',
        details: { identifier, action, current, limit }
      });
      return false;
    }
    
    this.rateLimitMap.set(key, current + 1);
    
    // Clean up old entries
    setTimeout(() => {
      this.rateLimitMap.delete(key);
    }, 60000);
    
    return true;
  }

  validateInput(input: string, context: string): boolean {
    if (!input) return true;
    
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(input)) {
        this.logSecurityEvent({
          event_type: 'suspicious_input_detected',
          severity: 'high',
          details: { input: input.substring(0, 100), context, pattern: pattern.source }
        });
        return false;
      }
    }
    
    return true;
  }

  async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return false;
      }
      
      // Check if session is still valid
      const tokenExpiry = new Date(session.expires_at! * 1000);
      if (tokenExpiry <= new Date()) {
        await this.logSecurityEvent({
          user_id: session.user.id,
          event_type: 'expired_session_access_attempt',
          severity: 'medium',
          details: { expires_at: tokenExpiry }
        });
        return false;
      }
      
      return true;
    } catch (error) {
      await this.logSecurityEvent({
        event_type: 'session_validation_error',
        severity: 'medium',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      return false;
    }
  }

  async checkUserRole(requiredRole: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      const hasRole = roleData?.role === requiredRole || 
                     (requiredRole === 'student' && !roleData); // Default to student

      if (!hasRole) {
        await this.logSecurityEvent({
          user_id: user.id,
          event_type: 'unauthorized_role_access_attempt',
          severity: 'high',
          details: { required_role: requiredRole, user_role: roleData?.role || 'none' }
        });
      }

      return hasRole;
    } catch (error) {
      await this.logSecurityEvent({
        event_type: 'role_check_error',
        severity: 'medium',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      return false;
    }
  }

  private async notifySecurityTeam(event: SecurityEvent): Promise<void> {
    // In production, this would integrate with security monitoring tools
    // For now, we'll just log the critical events
    console.error('CRITICAL SECURITY EVENT:', event);
    
    // Could send to services like:
    // - Sentry for error tracking
    // - DataDog for security monitoring
    // - Email/Slack notifications for admin team
  }

  generateCSRFToken(): string {
    return crypto.randomUUID();
  }

  validateCSRFToken(token: string, expectedToken: string): boolean {
    return token === expectedToken && token.length > 0;
  }

  sanitizeUserInput(input: any): any {
    if (typeof input === 'string') {
      return InputValidator.sanitizeString(input);
    }
    
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeUserInput(item));
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[InputValidator.sanitizeString(key)] = this.sanitizeUserInput(value);
      }
      return sanitized;
    }
    
    return input;
  }
}

export const securityService = new SecurityService();
