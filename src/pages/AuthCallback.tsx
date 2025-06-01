
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/mentorship?error=auth_failed');
          return;
        }

        if (data.session) {
          // Successfully authenticated, redirect to mentorship
          navigate('/mentorship');
        } else {
          // No session found, redirect to login
          navigate('/mentorship');
        }
      } catch (error) {
        console.error('Unexpected auth callback error:', error);
        navigate('/mentorship?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [navigate]);

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
