
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Zap, Crown } from 'lucide-react';

const PremiumSubscriptionPanel = () => {
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
      buttonText: 'Current Plan',
      buttonVariant: 'outline' as const,
    },
    {
      name: 'Wave AI Pro',
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
      buttonText: 'Upgrade to Wave AI Pro',
      buttonVariant: 'default' as const,
    },
    {
      name: 'Wave AI Elite',
      price: '$24.99',
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
      buttonText: 'Upgrade to Wave AI Elite',
      buttonVariant: 'default' as const,
    },
  ];

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Wave AI Plan
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Get AI-powered surf forecasts, premium features, and exclusive access to the best waves.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={plan.name}
            className={`relative transition-all duration-300 hover:scale-105 ${
              plan.popular
                ? 'border-2 border-purple-500 shadow-xl'
                : 'border border-gray-200 dark:border-gray-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  {plan.badge}
                </span>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <plan.icon className="w-12 h-12 text-ocean dark:text-ocean-light" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {plan.name}
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {plan.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">
                  {plan.period}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                per month
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : plan.buttonVariant === 'outline'
                    ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    : 'bg-ocean hover:bg-ocean-dark text-white'
                }`}
                variant={plan.buttonVariant}
                disabled={plan.buttonText === 'Current Plan'}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PremiumSubscriptionPanel;
