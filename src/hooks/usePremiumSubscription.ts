
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export const usePremiumSubscription = () => {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    if (user && session) {
      checkSubscriptionStatus();
    }
  }, [user, session]);

  // Handle post-login plan selection with improved timing
  useEffect(() => {
    const handleStoredPlan = async () => {
      const storedPlan = sessionStorage.getItem('selectedPlan');
      
      if (storedPlan && user && session && !loading) {
        console.log('Processing stored plan after authentication:', storedPlan);
        
        // Clear the stored plan immediately to prevent re-processing
        sessionStorage.removeItem('selectedPlan');
        
        // Add a small delay to ensure all auth state is settled
        setTimeout(() => {
          console.log('Triggering upgrade for stored plan:', storedPlan);
          handleUpgrade(storedPlan as 'pro' | 'elite');
        }, 500);
      }
    };

    // Only process if we have a user and session, and we're not currently loading
    if (user && session && loading === null) {
      handleStoredPlan();
    }
  }, [user, session, loading]);

  const checkSubscriptionStatus = async () => {
    if (!session) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleUpgrade = async (planType: 'pro' | 'elite') => {
    if (!session) {
      // Store the plan and redirect to auth
      sessionStorage.setItem('selectedPlan', planType);
      toast({
        title: "Authentication Required",
        description: "Please sign in to upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    setLoading(planType);
    console.log('Starting checkout process for plan:', planType);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      console.log('Checkout session created, redirecting to Stripe:', data.url);
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to Payment",
        description: "Opening Stripe checkout in a new tab...",
      });
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
      setSelectedPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!session) return;
    
    setLoading('manage');
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      // Open Stripe customer portal in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Opening Customer Portal",
        description: "Managing your subscription in a new tab...",
      });
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return {
    user,
    session,
    loading,
    selectedPlan,
    setSelectedPlan,
    subscriptionStatus,
    checkSubscriptionStatus,
    handleUpgrade,
    handleManageSubscription,
  };
};
