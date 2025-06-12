
import { useSecureAuth } from './useSecureAuth';
import { useAuth } from './useAuth';
import { enhancedSecurityService } from '@/services/enhancedSecurityService';
import { useEffect, useState } from 'react';

export const useSecureAuthenticationWrapper = () => {
  const secureAuth = useSecureAuth();
  const basicAuth = useAuth();
  const [securityLevel, setSecurityLevel] = useState<'basic' | 'enhanced'>('basic');

  useEffect(() => {
    // Determine security level based on session validation
    const checkSecurityLevel = async () => {
      const isSecureSession = await enhancedSecurityService.validateSession();
      setSecurityLevel(isSecureSession && secureAuth.isSecure ? 'enhanced' : 'basic');
    };

    checkSecurityLevel();
  }, [secureAuth.isSecure]);

  // Use enhanced auth if available and secure, otherwise fall back to basic
  if (securityLevel === 'enhanced' && (secureAuth.isSecure || secureAuth.loading)) {
    return {
      ...secureAuth,
      signIn: secureAuth.secureSignIn,
      signUp: secureAuth.secureSignUp,
      signOut: secureAuth.secureSignOut,
      securityLevel: 'enhanced' as const,
      isSecure: true
    };
  }

  // Enhanced basic auth with additional security checks
  return {
    user: basicAuth.user,
    session: basicAuth.session,
    loading: basicAuth.loading,
    error: basicAuth.error,
    signIn: async (email: string, password: string) => {
      // Add rate limiting to basic auth
      if (!enhancedSecurityService.checkRateLimit(email, 'signin', 5)) {
        throw new Error('Too many login attempts. Please try again later.');
      }
      return basicAuth.signIn(email, password);
    },
    signUp: async (email: string, password: string, fullName: string) => {
      // Add rate limiting to signup
      if (!enhancedSecurityService.checkRateLimit(email, 'signup', 3)) {
        throw new Error('Too many registration attempts. Please try again later.');
      }
      return basicAuth.signUp(email, password, fullName);
    },
    signOut: basicAuth.signOut,
    resetPassword: basicAuth.resetPassword,
    clearError: basicAuth.clearError,
    securityLevel: 'basic' as const,
    isSecure: false
  };
};
