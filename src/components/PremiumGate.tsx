
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import PremiumPage from '@/pages/PremiumPage';

interface PremiumGateProps {
  children: React.ReactNode;
}

const PremiumGate: React.FC<PremiumGateProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user]);

  const checkSubscriptionStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('status, expires_at')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (subscription) {
        // Check if subscription hasn't expired
        const isValid = !subscription.expires_at || 
          new Date(subscription.expires_at) > new Date();
        
        setHasActiveSubscription(isValid);
      } else {
        setHasActiveSubscription(false);
      }
    } catch (error) {
      console.error('Subscription check failed:', error);
      setHasActiveSubscription(false);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show premium page if user doesn't have active subscription
  if (!user || !hasActiveSubscription) {
    return <PremiumPage />;
  }

  // User has active subscription, show protected content
  return <>{children}</>;
};

export default PremiumGate;
