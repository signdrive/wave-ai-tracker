
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSecureAuthenticationWrapper } from '@/hooks/useSecureAuthenticationWrapper';
import { enhancedSecurityService } from '@/services/enhancedSecurityService';
import { toast } from 'sonner';

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  error: any;
  securityLevel: 'basic' | 'enhanced';
  isSecure: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<any>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthenticationManager');
  }
  return context;
};

interface AuthenticationManagerProps {
  children: React.ReactNode;
}

const AuthenticationManager: React.FC<AuthenticationManagerProps> = ({ children }) => {
  const auth = useSecureAuthenticationWrapper();
  const [sessionHealth, setSessionHealth] = useState<'healthy' | 'warning' | 'critical'>('healthy');

  useEffect(() => {
    // Monitor session health
    const checkSessionHealth = async () => {
      if (auth.user) {
        const isValid = await enhancedSecurityService.validateSession();
        
        if (!isValid) {
          setSessionHealth('critical');
          toast.error('Session security compromised. Please sign in again.');
          await auth.signOut();
        } else if (auth.securityLevel === 'basic') {
          setSessionHealth('warning');
        } else {
          setSessionHealth('healthy');
        }
      }
    };

    // Check session health every 5 minutes
    const interval = setInterval(checkSessionHealth, 5 * 60 * 1000);
    
    // Initial check
    checkSessionHealth();

    return () => clearInterval(interval);
  }, [auth.user, auth.securityLevel]);

  useEffect(() => {
    // Clean up old rate limits periodically
    const cleanup = setInterval(() => {
      enhancedSecurityService.cleanupOldRateLimits();
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(cleanup);
  }, []);

  const refreshSession = async () => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.auth.refreshSession();
      
      if (error) {
        await enhancedSecurityService.logSecurityEvent({
          user_id: auth.user?.id,
          event_type: 'session_refresh_failed',
          severity: 'medium',
          details: { error: error.message }
        });
        throw error;
      }

      await enhancedSecurityService.logSecurityEvent({
        user_id: auth.user?.id,
        event_type: 'session_refreshed',
        severity: 'low',
        details: { security_level: auth.securityLevel }
      });
    } catch (error) {
      console.error('Failed to refresh session:', error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user: auth.user,
    session: auth.session,
    loading: auth.loading,
    error: auth.error,
    securityLevel: auth.securityLevel,
    isSecure: auth.isSecure,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    refreshSession
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Session Health Indicator */}
      {auth.user && sessionHealth !== 'healthy' && (
        <div className={`fixed top-0 left-0 right-0 z-50 p-2 text-center text-sm ${
          sessionHealth === 'warning' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {sessionHealth === 'warning' 
            ? '⚠️ Session using basic security. Consider upgrading for enhanced protection.'
            : '🚨 Session security compromised. Please sign in again.'
          }
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticationManager;
