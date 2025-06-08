
import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { securityService } from '@/services/securityService';
import { InputValidator } from '@/utils/inputValidator';

interface SecureAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  isSecure: boolean;
}

export const useSecureAuth = () => {
  const [authState, setAuthState] = useState<SecureAuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isSecure: false
  });

  const validateAndSetSession = useCallback(async (session: Session | null) => {
    if (!session) {
      setAuthState(prev => ({ ...prev, session: null, user: null, isSecure: false }));
      return;
    }

    const isValid = await securityService.validateSession();
    setAuthState(prev => ({ 
      ...prev, 
      session, 
      user: session.user,
      isSecure: isValid 
    }));

    if (!isValid) {
      await securityService.logSecurityEvent({
        user_id: session.user.id,
        event_type: 'invalid_session_detected',
        severity: 'high',
        details: { session_id: session.access_token.substring(0, 10) + '...' }
      });
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Secure auth state change:', event);
        
        switch (event) {
          case 'SIGNED_IN':
            await validateAndSetSession(session);
            setAuthState(prev => ({ ...prev, loading: false, error: null }));
            break;
            
          case 'SIGNED_OUT':
            setAuthState({
              user: null,
              session: null,
              loading: false,
              error: null,
              isSecure: false
            });
            break;
            
          case 'TOKEN_REFRESHED':
            await validateAndSetSession(session);
            setAuthState(prev => ({ ...prev, loading: false, error: null }));
            break;
            
          default:
            await validateAndSetSession(session);
            setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    );

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Initial session error:', error);
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error,
            isSecure: false
          });
        } else {
          await validateAndSetSession(session);
          setAuthState(prev => ({ ...prev, loading: false, error: null }));
        }
      } catch (error) {
        if (!mounted) return;
        
        console.error('Unexpected session error:', error);
        setAuthState({
          user: null,
          session: null,
          loading: false,
          error: error as AuthError,
          isSecure: false
        });
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [validateAndSetSession]);

  const secureSignIn = async (email: string, password: string) => {
    try {
      // Input validation
      if (!InputValidator.validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      const passwordValidation = InputValidator.validatePassword(password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.errors[0]);
      }

      // Rate limiting
      if (!securityService.checkRateLimit(email, 'signin', 5)) {
        throw new Error('Too many login attempts. Please try again later.');
      }

      // Input sanitization
      const sanitizedEmail = InputValidator.sanitizeString(email).toLowerCase().trim();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        await securityService.logSecurityEvent({
          event_type: 'failed_login_attempt',
          severity: 'medium',
          details: { email: sanitizedEmail, error: error.message }
        });
      } else if (data.session) {
        await securityService.logSecurityEvent({
          user_id: data.session.user.id,
          event_type: 'successful_login',
          severity: 'low',
          details: { email: sanitizedEmail }
        });
      }

      return { data, error };
    } catch (error) {
      const authError = error as AuthError;
      setAuthState(prev => ({ ...prev, error: authError }));
      return { data: null, error: authError };
    }
  };

  const secureSignUp = async (email: string, password: string, fullName: string) => {
    try {
      // Input validation
      if (!InputValidator.validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      const passwordValidation = InputValidator.validatePassword(password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.errors[0]);
      }

      if (!fullName || fullName.trim().length < 2) {
        throw new Error('Full name must be at least 2 characters');
      }

      // Rate limiting
      if (!securityService.checkRateLimit(email, 'signup', 3)) {
        throw new Error('Too many registration attempts. Please try again later.');
      }

      // Input sanitization
      const sanitizedEmail = InputValidator.sanitizeString(email).toLowerCase().trim();
      const sanitizedFullName = InputValidator.sanitizeString(fullName).trim();

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: {
            full_name: sanitizedFullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (data.user) {
        await securityService.logSecurityEvent({
          user_id: data.user.id,
          event_type: 'user_registration',
          severity: 'low',
          details: { email: sanitizedEmail }
        });
      }

      return { data, error };
    } catch (error) {
      const authError = error as AuthError;
      setAuthState(prev => ({ ...prev, error: authError }));
      return { data: null, error: authError };
    }
  };

  const secureSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (authState.user) {
        await securityService.logSecurityEvent({
          user_id: authState.user.id,
          event_type: 'user_logout',
          severity: 'low',
          details: {}
        });
      }

      return { error };
    } catch (error) {
      const authError = error as AuthError;
      setAuthState(prev => ({ ...prev, error: authError }));
      return { error: authError };
    }
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    isSecure: authState.isSecure,
    secureSignIn,
    secureSignUp,
    secureSignOut,
  };
};
