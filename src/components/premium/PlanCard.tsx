
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, LucideIcon } from 'lucide-react';
import PlanFeature from './PlanFeature';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: LucideIcon;
  popular: boolean;
  badge?: string;
  features: PlanFeature[];
  buttonText: string;
  buttonVariant: 'default' | 'outline';
  planType: 'pro' | 'elite' | null;
  currentPlan: string;
  loading: string | null;
  onPlanSelect: (planType: 'pro' | 'elite') => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  name,
  price,
  period,
  description,
  icon: Icon,
  popular,
  badge,
  features,
  buttonText,
  buttonVariant,
  planType,
  currentPlan,
  loading,
  onPlanSelect,
}) => {
  const isCurrentPlan = name === currentPlan;
  const isLoading = loading === planType;

  return (
    <Card
      className={`relative transition-all duration-300 hover:scale-105 ${
        isCurrentPlan
          ? 'border-2 border-green-500 shadow-xl'
          : popular
          ? 'border-2 border-purple-500 shadow-xl'
          : 'border border-gray-200 dark:border-gray-700'
      }`}
    >
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Your Plan
          </span>
        </div>
      )}
      
      {popular && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      {badge && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            {badge}
          </span>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <Icon className="w-12 h-12 text-ocean dark:text-ocean-light" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {name}
        </h3>
        <div className="mt-4">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            {price}
          </span>
          <span className="text-gray-600 dark:text-gray-400 ml-1">
            {period}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4 mb-8">
          {features.map((feature, featureIndex) => (
            <PlanFeature key={featureIndex} {...feature} />
          ))}
        </div>

        <Button
          className={`w-full ${
            isCurrentPlan
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : popular
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : buttonVariant === 'outline'
              ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              : 'bg-ocean hover:bg-ocean-dark text-white'
          }`}
          variant={isCurrentPlan ? 'default' : buttonVariant}
          disabled={buttonText === 'Current Plan' || isLoading}
          onClick={() => planType && onPlanSelect(planType)}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
