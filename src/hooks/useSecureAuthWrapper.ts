
import { useSecureAuth } from './useSecureAuth';
import { useAuth } from './useAuth';

// Wrapper hook that provides secure authentication by default
// Falls back to basic auth if secure auth is not available
export const useSecureAuthWrapper = () => {
  const secureAuth = useSecureAuth();
  const basicAuth = useAuth();

  // Use secure auth if session is secure, otherwise fall back to basic
  if (secureAuth.isSecure || secureAuth.loading) {
    return {
      user: secureAuth.user,
      session: secureAuth.session,
      loading: secureAuth.loading,
      error: secureAuth.error,
      signIn: secureAuth.secureSignIn,
      signUp: secureAuth.secureSignUp,
      signOut: secureAuth.secureSignOut,
      isSecure: secureAuth.isSecure
    };
  }

  // Fallback to basic auth with warning
  console.warn('Falling back to basic authentication - consider upgrading session security');
  return {
    user: basicAuth.user,
    session: basicAuth.session,
    loading: basicAuth.loading,
    error: basicAuth.error,
    signIn: basicAuth.signIn,
    signUp: basicAuth.signUp,
    signOut: basicAuth.signOut,
    isSecure: false
  };
};
