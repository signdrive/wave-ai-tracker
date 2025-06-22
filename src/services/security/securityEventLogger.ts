
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
      console.log('🔐 Security Event:', event);
      
      const { error } = await supabase
        .from('security_events')
        .insert({
          user_id: event.user_id || 'anonymous',
          event_type: event.event_type,
          severity: event.severity,
          details: event.details,
          ip_address: event.ip_address || 'unknown',
          user_agent: event.user_agent || navigator?.userAgent || 'unknown'
        });

      if (error) {
        console.error('Failed to store security event:', error);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  async getSecurityEvents(userId?: string, severity?: string): Promise<any[]> {
    try {
      let query = supabase.from('security_events').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      if (severity) {
        query = query.eq('severity', severity);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Failed to get security events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get security events:', error);
      return [];
    }
  }
}

export const securityEventLogger = new SecurityEventLogger();
