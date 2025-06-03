
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

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event);
        
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
            error: null
          });
        } else if (event === 'SIGNED_IN') {
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
            error: null
          });
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
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
        }
      } catch (error) {
        if (!mounted) return;
        
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
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      clearError();
      
      // Validate inputs
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
          redirectTo: `${window.location.origin}/auth/reset-password`,
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
