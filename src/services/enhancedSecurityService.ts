
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

class EnhancedSecurityService {
  private rateLimitCache = new Map<string, { count: number; windowStart: number }>();
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute

  private suspiciousPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
    /<script.*?>/i,
    /javascript:/i,
    /eval\(/i,
    /expression\(/i,
    /document\.cookie/i,
    /window\.location/i,
    /\.innerHTML/i
  ];

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      console.warn('Security Event:', event);
      
      // Try to store in database, but don't fail if table doesn't exist
      try {
        // Use any type to bypass TypeScript checking for new tables
        const { error } = await (supabase as any)
          .from('security_events')
          .insert({
            user_id: event.user_id,
            event_type: event.event_type,
            severity: event.severity,
            details: event.details,
            ip_address: event.ip_address || await this.getCurrentIP(),
            user_agent: event.user_agent || navigator.userAgent
          });

        if (error && !error.message.includes('relation "security_events" does not exist')) {
          console.error('Failed to store security event:', error);
        }
      } catch (dbError) {
        // Silently handle database errors for new tables
        console.debug('Security event logged to console only');
      }

      // For critical events, trigger immediate alerts
      if (event.severity === 'critical') {
        await this.triggerSecurityAlert(event);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  async checkRateLimit(identifier: string, action: string, limit: number = 10): Promise<boolean> {
    const key = `${identifier}:${action}`;
    const now = Date.now();
    const windowStart = Math.floor(now / this.RATE_LIMIT_WINDOW) * this.RATE_LIMIT_WINDOW;

    try {
      // Try to check database rate limits first, but fall back to memory if table doesn't exist
      try {
        const { data, error } = await (supabase as any)
          .from('rate_limits')
          .select('count')
          .eq('identifier', identifier)
          .eq('action', action)
          .gte('window_start', new Date(windowStart).toISOString())
          .single();

        let currentCount = 0;
        if (!error && data) {
          currentCount = data.count;
        }

        if (currentCount >= limit) {
          await this.logSecurityEvent({
            event_type: 'rate_limit_exceeded',
            severity: 'medium',
            details: { identifier, action, current: currentCount, limit }
          });
          return false;
        }

        // Update rate limit in database
        await (supabase as any)
          .from('rate_limits')
          .upsert({
            identifier,
            action,
            count: currentCount + 1,
            window_start: new Date(windowStart).toISOString()
          });

        return true;
      } catch (dbError) {
        // Fall back to memory-based rate limiting
        return this.checkMemoryRateLimit(key, limit);
      }
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Fallback to memory-based rate limiting
      return this.checkMemoryRateLimit(key, limit);
    }
  }

  private checkMemoryRateLimit(key: string, limit: number): boolean {
    const now = Date.now();
    const windowStart = Math.floor(now / this.RATE_LIMIT_WINDOW) * this.RATE_LIMIT_WINDOW;
    
    const cached = this.rateLimitCache.get(key);
    
    if (!cached || cached.windowStart < windowStart) {
      this.rateLimitCache.set(key, { count: 1, windowStart });
      return true;
    }
    
    if (cached.count >= limit) {
      return false;
    }
    
    cached.count++;
    return true;
  }

  validateInput(input: string, context: string): boolean {
    if (!input) return true;
    
    // Enhanced pattern detection
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(input)) {
        this.logSecurityEvent({
          event_type: 'suspicious_input_detected',
          severity: 'high',
          details: { 
            input: input.substring(0, 100), 
            context, 
            pattern: pattern.source,
            inputLength: input.length 
          }
        });
        return false;
      }
    }
    
    // Check for excessive length
    if (input.length > 10000) {
      this.logSecurityEvent({
        event_type: 'excessive_input_length',
        severity: 'medium',
        details: { context, inputLength: input.length }
      });
      return false;
    }
    
    return true;
  }

  async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return false;
      }
      
      // Enhanced session validation
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

      // Check for session anomalies
      const userAgent = navigator.userAgent;
      const sessionUserAgent = session.user.user_metadata?.user_agent;
      
      if (sessionUserAgent && sessionUserAgent !== userAgent) {
        await this.logSecurityEvent({
          user_id: session.user.id,
          event_type: 'session_user_agent_mismatch',
          severity: 'high',
          details: { 
            session_user_agent: sessionUserAgent, 
            current_user_agent: userAgent 
          }
        });
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
                     (requiredRole === 'student' && !roleData);

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

  generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  validateCSRFToken(token: string, expectedToken: string): boolean {
    return token === expectedToken && token.length === 64;
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

  private async getCurrentIP(): Promise<string> {
    try {
      // In production, you would get this from your backend
      return 'unknown';
    } catch {
      return 'unknown';
    }
  }

  private async triggerSecurityAlert(event: SecurityEvent): Promise<void> {
    // In production, this would integrate with alerting systems
    console.error('CRITICAL SECURITY ALERT:', event);
    
    // Could send to:
    // - Email notifications
    // - Slack/Discord webhooks
    // - Security monitoring services
    // - Admin dashboard notifications
  }

  async getSecurityEvents(userId?: string, severity?: string): Promise<any[]> {
    try {
      // Try to fetch from database, but return empty array if table doesn't exist
      try {
        let query = (supabase as any)
          .from('security_events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (userId) {
          query = query.eq('user_id', userId);
        }

        if (severity) {
          query = query.eq('severity', severity);
        }

        const { data, error } = await query;
        
        if (error && error.message.includes('relation "security_events" does not exist')) {
          return [];
        }
        
        if (error) {
          throw error;
        }

        return data || [];
      } catch (dbError) {
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch security events:', error);
      return [];
    }
  }

  async cleanupOldRateLimits(): Promise<void> {
    try {
      // Try to call the cleanup function, but don't fail if it doesn't exist
      try {
        await (supabase as any).rpc('cleanup_rate_limits');
      } catch (rpcError) {
        // Function doesn't exist yet, clean up memory cache instead
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        
        for (const [key, data] of this.rateLimitCache.entries()) {
          if (data.windowStart < oneHourAgo) {
            this.rateLimitCache.delete(key);
          }
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old rate limits:', error);
    }
  }
}

export const enhancedSecurityService = new EnhancedSecurityService();
