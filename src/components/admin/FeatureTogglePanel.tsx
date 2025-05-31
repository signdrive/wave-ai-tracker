
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { VideoIcon, Brain, CreditCard, TrendingUp } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';

const FeatureTogglePanel: React.FC = () => {
  const { settings, isLoading, toggleFeature, isUpdating } = useAppSettings();

  const featureConfig = {
    live_coaching: {
      label: 'Live Video Coaching',
      description: 'Enable real-time video sessions between mentors and students',
      icon: VideoIcon,
      color: 'bg-blue-500'
    },
    wave_ai: {
      label: 'AI Wave Prediction',
      description: 'Advanced machine learning wave forecasting and analysis',
      icon: Brain,
      color: 'bg-purple-500'
    },
    payment_processing: {
      label: 'Payment Processing',
      description: 'Stripe integration for mentor payments and subscriptions',
      icon: CreditCard,
      color: 'bg-green-500'
    },
    advanced_analytics: {
      label: 'Advanced Analytics',
      description: 'Detailed performance metrics and user behavior insights',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Toggles</CardTitle>
        <p className="text-sm text-gray-600">
          Control which features are active on your platform
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {settings.map((setting) => {
          const config = featureConfig[setting.feature_name as keyof typeof featureConfig];
          if (!config) return null;

          const Icon = config.icon;

          return (
            <div
              key={setting.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${config.color} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{config.label}</h3>
                    <Badge variant={setting.is_active ? 'default' : 'secondary'}>
                      {setting.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{config.description}</p>
                </div>
              </div>
              <Switch
                checked={setting.is_active}
                onCheckedChange={(checked) => 
                  toggleFeature(setting.feature_name, checked)
                }
                disabled={isUpdating}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default FeatureTogglePanel;
