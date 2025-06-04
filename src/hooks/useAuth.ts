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

    // Handle OAuth tokens in URL hash (for Google OAuth)
    const handleOAuthTokens = async () => {
      if (window.location.hash) {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error handling OAuth tokens:', error);
          } else if (data.session) {
            console.log('OAuth session established:', data.session.user.email);
            // Clear the hash from URL
            window.history.replaceState(null, '', window.location.pathname);
          }
        } catch (error) {
          console.error('Unexpected OAuth error:', error);
        }
      }
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);
        
        // Update state synchronously
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null
        });

        // Check subscription status after successful authentication
        if (session && event === 'SIGNED_IN') {
          setTimeout(() => {
            checkSubscriptionStatus(session);
          }, 0);
        }
      }
    );

    // Handle OAuth tokens if present
    handleOAuthTokens();

    // THEN check for existing session
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
            error
          });
        } else {
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
            error: null
          });

          // Check subscription status for existing session
          if (session) {
            setTimeout(() => {
              checkSubscriptionStatus(session);
            }, 0);
          }
        }
      } catch (error) {
        if (!mounted) return;
        
        console.error('Unexpected session error:', error);
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
          redirectTo: `${window.location.origin}/`,
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
