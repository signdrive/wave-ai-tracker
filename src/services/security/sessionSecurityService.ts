
import { supabase } from '@/integrations/supabase/client';
import { securityEventLogger } from './securityEventLogger';

class SessionSecurityService {
  async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return false;
      }
      
      // Enhanced session validation
      const tokenExpiry = new Date(session.expires_at! * 1000);
      if (tokenExpiry <= new Date()) {
        await securityEventLogger.logSecurityEvent({
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
        await securityEventLogger.logSecurityEvent({
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
      await securityEventLogger.logSecurityEvent({
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
        await securityEventLogger.logSecurityEvent({
          user_id: user.id,
          event_type: 'unauthorized_role_access_attempt',
          severity: 'high',
          details: { required_role: requiredRole, user_role: roleData?.role || 'none' }
        });
      }

      return hasRole;
    } catch (error) {
      await securityEventLogger.logSecurityEvent({
        event_type: 'role_check_error',
        severity: 'medium',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      return false;
    }
  }
}

export const sessionSecurityService = new SessionSecurityService();
