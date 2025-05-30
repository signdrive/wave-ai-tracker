
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Target, Brain, Camera, Wind } from 'lucide-react';

const PremiumSubscriptionPanel: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'elite'>('free');

  const plans = {
    free: {
      name: 'Wave Tracker',
      price: 0,
      period: 'Free Forever',
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      features: [
        'Basic 3-day forecasts',
        'Standard surf cams',
        'Community access',
        'Spot favorites'
      ],
      limitations: [
        'Limited AI insights',
        'No booking discounts',
        'Basic weather data'
      ]
    },
    pro: {
      name: 'Wave AI Pro',
      price: 9.99,
      period: 'per month',
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      features: [
        'AI-powered 14-day forecasts',
        'Hyper-local predictions',
        'HD surf cams with controls',
        'Historical analytics',
        '15% booking discounts',
        'Priority customer support',
        'Advanced weather models',
        'Crowd level predictions'
      ],
      badge: 'Most Popular'
    },
    elite: {
      name: 'Wave AI Elite',
      price: 24.99,
      period: 'per month',
      icon: <Crown className="w-6 h-6 text-yellow-500" />,
      features: [
        'Everything in Pro',
        'Ultra-precise AI forecasts',
        '4K surf cams with AR overlay',
        'Professional wave analysis',
        '25% booking discounts',
        'Personal surf coach AI',
        'Exclusive spot access',
        'Custom alerts & notifications',
        'API access for developers',
        'Priority booking slots'
      ],
      badge: 'Best Value'
    }
  };

  const featureComparison = [
    { feature: 'Forecast Range', free: '3 days', pro: '14 days', elite: '21 days' },
    { feature: 'AI Accuracy', free: 'Basic', pro: '95%+', elite: '98%+' },
    { feature: 'Surf Cams', free: 'Standard', pro: 'HD + Controls', elite: '4K + AR' },
    { feature: 'Booking Discounts', free: '0%', pro: '15%', elite: '25%' },
    { feature: 'Support', free: 'Community', pro: 'Priority', elite: 'VIP' },
  ];

  return (
    <div className="space-y-6">
      {/* Plan Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(plans).map(([key, plan]) => (
          <Card 
            key={key}
            className={`relative cursor-pointer transition-all ${
              selectedPlan === key ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
            } ${key === 'pro' ? 'border-purple-200 bg-purple-50' : key === 'elite' ? 'border-yellow-200 bg-yellow-50' : ''}`}
            onClick={() => setSelectedPlan(key as 'free' | 'pro' | 'elite')}
          >
            {plan.badge && (
              <Badge className={`absolute -top-2 left-1/2 transform -translate-x-1/2 ${
                key === 'pro' ? 'bg-purple-500' : 'bg-yellow-500'
              } text-white`}>
                {plan.badge}
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                {plan.icon}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                ${plan.price}
                {plan.price > 0 && <span className="text-base font-normal text-gray-500">/{plan.period.split(' ')[1]}</span>}
              </div>
              <div className="text-sm text-gray-500">{plan.period}</div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {plan.limitations && plan.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-400">
                    <div className="w-4 h-4 mr-2 flex-shrink-0">×</div>
                    {limitation}
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  key === 'free' ? 'bg-gray-600 hover:bg-gray-700' :
                  key === 'pro' ? 'bg-purple-600 hover:bg-purple-700' :
                  'bg-yellow-600 hover:bg-yellow-700'
                }`}
                disabled={selectedPlan === key && key === 'free'}
              >
                {key === 'free' ? 'Current Plan' : 
                 selectedPlan === key ? 'Selected' : 
                 `Upgrade to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Feature Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Feature</th>
                  <th className="text-center py-3 font-medium">Free</th>
                  <th className="text-center py-3 font-medium text-purple-600">Pro</th>
                  <th className="text-center py-3 font-medium text-yellow-600">Elite</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 font-medium">{item.feature}</td>
                    <td className="text-center py-3">{item.free}</td>
                    <td className="text-center py-3 text-purple-600 font-medium">{item.pro}</td>
                    <td className="text-center py-3 text-yellow-600 font-medium">{item.elite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Features Showcase */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-500" />
            AI-Powered Surf Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <Wind className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-2">Hyper-Local Forecasts</h3>
              <p className="text-sm text-gray-600">AI analyzes micro-climates for spot-specific predictions</p>
            </div>
            <div className="text-center p-4">
              <Camera className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold mb-2">Computer Vision</h3>
              <p className="text-sm text-gray-600">Automatic wave height detection from live cams</p>
            </div>
            <div className="text-center p-4">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-2">Perfect Timing</h3>
              <p className="text-sm text-gray-600">AI calculates optimal surf windows with 98% accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="text-center py-8">
          <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-2xl font-bold mb-2">Ready to Crush Your Sessions?</h2>
          <p className="mb-6 opacity-90">Join thousands of surfers using AI to find perfect waves</p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-white text-purple-600 hover:bg-gray-100">
              Start 7-Day Free Trial
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              See All Features
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumSubscriptionPanel;
