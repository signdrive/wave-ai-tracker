
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Check if there was a selected plan stored
        const selectedPlan = sessionStorage.getItem('selectedPlan');
        
        if (selectedPlan) {
          // Clear the stored plan
          sessionStorage.removeItem('selectedPlan');
          
          toast({
            title: "Welcome!",
            description: "Authentication successful. You can now complete your plan selection.",
          });
          
          // Redirect to pricing/premium page
          navigate('/', { replace: true });
        } else {
          toast({
            title: "Welcome back!",
            description: "You've successfully signed in.",
          });
          
          // Redirect to dashboard
          navigate('/', { replace: true });
        }
      } else {
        // Authentication failed or was cancelled
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue.",
          variant: "destructive",
        });
        
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate]);

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
