
import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Function to check subscription status after authentication
  const checkSubscriptionStatus = useCallback(async (session: Session) => {
    try {
      await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
    } catch (error) {
      console.error('Failed to check subscription status:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Enhanced auth state listener with better error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            setAuthState({
              user: session?.user ?? null,
              session,
              loading: false,
              error: null
            });
            
            // Set session persistence
            if (session) {
              localStorage.setItem('supabase.auth.token', 'true');
              setTimeout(() => checkSubscriptionStatus(session), 0);
            }
            break;
            
          case 'SIGNED_OUT':
            setAuthState({
              user: null,
              session: null,
              loading: false,
              error: null
            });
            localStorage.removeItem('supabase.auth.token');
            break;
            
          case 'TOKEN_REFRESHED':
            setAuthState({
              user: session?.user ?? null,
              session,
              loading: false,
              error: null
            });
            break;
            
          default:
            setAuthState({
              user: session?.user ?? null,
              session,
              loading: false,
              error: null
            });
        }
      }
    );

    // Check for existing session with enhanced error handling
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Initial session error:', error);
          // Clear potentially corrupted session data
          localStorage.removeItem('supabase.auth.token');
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error
          });
        } else {
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
            error: null
          });

          if (session) {
            localStorage.setItem('supabase.auth.token', 'true');
            setTimeout(() => checkSubscriptionStatus(session), 0);
          }
        }
      } catch (error) {
        if (!mounted) return;
        
        console.error('Unexpected session error:', error);
        localStorage.removeItem('supabase.auth.token');
        setAuthState({
          user: null,
          session: null,
          loading: false,
          error: error as AuthError
        });
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkSubscriptionStatus]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      clearError();
      
      if (!email || !password || !fullName) {
        throw new Error('All fields are required');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      return { data, error };
    } catch (error) {
      const authError = error as AuthError;
      setAuthState(prev => ({ ...prev, error: authError }));
      return { data: null, error: authError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      clearError();
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      return { data, error };
    } catch (error) {
      const authError = error as AuthError;
      setAuthState(prev => ({ ...prev, error: authError }));
      return { data: null, error: authError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      clearError();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      return { data, error };
    } catch (error) {
      const authError = error as AuthError;
      setAuthState(prev => ({ ...prev, error: authError }));
      return { data: null, error: authError };
    }
  };

  const signOut = async () => {
    try {
      clearError();
      localStorage.removeItem('supabase.auth.token');
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      const authError = error as AuthError;
      setAuthState(prev => ({ ...prev, error: authError }));
      return { error: authError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      clearError();
      
      if (!email) {
        throw new Error('Email is required');
      }

      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      );

      return { data, error };
    } catch (error) {
      const authError = error as AuthError;
      setAuthState(prev => ({ ...prev, error: authError }));
      return { data: null, error: authError };
    }
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    clearError,
  };
};
