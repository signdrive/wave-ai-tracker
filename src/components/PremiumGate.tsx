
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMentorship } from '@/hooks/useMentorship';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface PremiumGateProps {
  children: React.ReactNode;
}

const PremiumGate: React.FC<PremiumGateProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { userRole, roleLoading } = useMentorship();
  const { isPremium, isLoading: subscriptionLoading } = useSubscription();

  // Show loading while checking auth and subscription
  if (authLoading || roleLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Checking access...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Allow access for admins
  if (userRole === 'admin') {
    return <>{children}</>;
  }

  // Allow access for premium subscribers
  if (user && isPremium) {
    return <>{children}</>;
  }

  // Redirect non-premium users to premium page
  return <Navigate to="/premium" replace />;
};

export default PremiumGate;
