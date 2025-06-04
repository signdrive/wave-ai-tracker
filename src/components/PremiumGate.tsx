
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import PremiumPage from '@/pages/PremiumPage';

interface PremiumGateProps {
  children: React.ReactNode;
}

const PremiumGate: React.FC<PremiumGateProps> = ({ children }) => {
  const { user, session, loading: authLoading } = useAuth();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user, session]);

  const checkSubscriptionStatus = async () => {
    if (!user || !session) {
      setLoading(false);
      return;
    }

    try {
      // Use the check-subscription edge function instead of direct database query
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Subscription check failed:', error);
        setHasActiveSubscription(false);
      } else {
        setHasActiveSubscription(data?.subscribed || false);
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
