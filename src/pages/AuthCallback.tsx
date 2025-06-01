
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle OAuth callback with URL parameters
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          
          // Check for specific error messages
          if (error.message.includes('invalid_request') || error.message.includes('access_denied')) {
            navigate('/mentorship?error=access_denied', { replace: true });
          } else {
            navigate('/mentorship?error=auth_failed', { replace: true });
          }
          return;
        }

        if (data.session) {
          console.log('Successfully authenticated user:', data.session.user.email);
          // Successfully authenticated, redirect to dashboard
          navigate('/', { replace: true });
        } else {
          console.log('No session found, redirecting to mentorship');
          // No session found, redirect to login
          navigate('/mentorship', { replace: true });
        }
      } catch (error) {
        console.error('Unexpected auth callback error:', error);
        navigate('/mentorship?error=unexpected_error', { replace: true });
      }
    };

    // Add a small delay to ensure the URL parameters are processed
    const timer = setTimeout(handleAuthCallback, 100);
    
    return () => clearTimeout(timer);
  }, [navigate, searchParams]);

  // Check for error parameters
  const errorParam = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (errorParam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8">
            <Alert variant="destructive">
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Authentication Error</p>
                  <p className="text-sm">
                    {errorDescription || 'There was a problem with the authentication process.'}
                  </p>
                  <button
                    onClick={() => navigate('/mentorship')}
                    className="text-sm text-ocean hover:underline"
                  >
                    Return to login
                  </button>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Completing authentication...</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
