import React, { useState } from 'react';
import { Zap, Crown } from 'lucide-react';
import { usePremiumSubscription } from '@/hooks/usePremiumSubscription';
import AuthDialog from '@/components/AuthDialog';
import PlanCard from '@/components/premium/PlanCard';
import SubscriptionStatus from '@/components/premium/SubscriptionStatus';

const PremiumSubscriptionPanel = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const {
    user,
    session,
    loading,
    selectedPlan,
    setSelectedPlan,
    subscriptionStatus,
    checkSubscriptionStatus,
    handleUpgrade,
    handleManageSubscription,
  } = usePremiumSubscription();

  const handlePlanSelection = async (planType: 'pro' | 'elite') => {
    console.log('Plan selected:', planType);
    setSelectedPlan(planType);

    // Check if user is authenticated
    if (!user || !session) {
      console.log('User not authenticated, storing plan and showing auth dialog');
      // Store selected plan for post-login redirect
      sessionStorage.setItem('selectedPlan', planType);
      setAuthDialogOpen(true);
      return;
    }

    // User is authenticated, proceed with checkout
    console.log('User authenticated, proceeding to checkout');
    await handleUpgrade(planType);
  };

  const currentPlan = subscriptionStatus?.subscription_tier || 'Wave Tracker';
  const isSubscribed = subscriptionStatus?.subscribed || false;

  const plans = [
    {
      name: 'Wave Tracker',
      price: '$0',
      period: 'Free Forever',
      description: 'Perfect for casual surfers',
      icon: Zap,
      popular: false,
      features: [
        { name: 'Basic 3-day forecasts', included: true },
        { name: 'Standard surf cams', included: true },
        { name: 'Community access', included: true },
        { name: 'Spot favorites', included: true },
        { name: 'Limited AI insights', included: false },
        { name: 'No booking discounts', included: false },
        { name: 'Basic weather data', included: false },
      ],
      buttonText: currentPlan === 'Wave Tracker' ? 'Current Plan' : 'Downgrade',
      buttonVariant: 'outline' as const,
      planType: null,
    },
    {
      name: 'WaveMentor Pro',
      price: '$9.99',
      period: '/month',
      description: 'For serious wave hunters',
      icon: Crown,
      popular: true,
      features: [
        { name: 'AI-powered 14-day forecasts', included: true },
        { name: 'Hyper-local predictions', included: true },
        { name: 'HD surf cams with controls', included: true },
        { name: 'Historical analytics', included: true },
        { name: '15% booking discounts', included: true },
        { name: 'Priority customer support', included: true },
        { name: 'Advanced weather models', included: true },
        { name: 'Crowd level predictions', included: true },
      ],
      buttonText: currentPlan === 'WaveMentor Pro' ? 'Current Plan' : 'Upgrade to Pro',
      buttonVariant: 'default' as const,
      planType: 'pro' as const,
    },
    {
      name: 'WaveMentor Elite',
      price: '€24.99',
      period: '/month',
      description: 'Ultimate surf intelligence',
      icon: Crown,
      popular: false,
      badge: 'Best Value',
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Ultra-precise AI forecasts', included: true },
        { name: '4K surf cams with AR overlay', included: true },
        { name: 'Professional wave analysis', included: true },
        { name: '25% booking discounts', included: true },
        { name: 'Personal surf coach', included: true },
        { name: 'Exclusive spot access', included: true },
        { name: 'Custom alerts & notifications', included: true },
        { name: 'API access for developers', included: true },
        { name: 'Priority booking slots', included: true },
      ],
      buttonText: currentPlan === 'WaveMentor Elite' ? 'Current Plan' : 'Upgrade to Elite',
      buttonVariant: 'default' as const,
      planType: 'elite' as const,
    },
  ];

  return (
    <>
      <div className="py-12">
        <SubscriptionStatus
          currentPlan={currentPlan}
          isSubscribed={isSubscribed}
          loading={loading}
          onManageSubscription={handleManageSubscription}
          onRefreshStatus={checkSubscriptionStatus}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              {...plan}
              currentPlan={currentPlan}
              loading={loading}
              onPlanSelect={handlePlanSelection}
            />
          ))}
        </div>
      </div>

      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen}
      />
    </>
  );
};

export default PremiumSubscriptionPanel;
