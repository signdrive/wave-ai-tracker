
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  user_id?: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

class SecurityEventLogger {
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
}

export const securityEventLogger = new SecurityEventLogger();
