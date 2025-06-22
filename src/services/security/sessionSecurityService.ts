
import { supabase } from '@/integrations/supabase/client';

class SessionSecurityService {
  async validateSession(): Promise<boolean> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return !error && !!user;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }

  async checkUserRole(requiredRole: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error || !roles) return false;

      return roles.some(role => role.role === requiredRole);
    } catch (error) {
      console.error('Role check failed:', error);
      return false;
    }
  }
}

export const sessionSecurityService = new SessionSecurityService();
