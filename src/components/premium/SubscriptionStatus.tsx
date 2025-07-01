
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubscriptionStatusProps {
  currentPlan: string;
  isSubscribed: boolean;
  loading: string | null;
  onManageSubscription: () => void;
  onRefreshStatus: () => void;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  currentPlan,
  isSubscribed,
  loading,
  onManageSubscription,
  onRefreshStatus,
}) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Choose Your WaveMentor Plan
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Get AI-powered surf forecasts, premium features, and exclusive access to the best waves.
      </p>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">
          Current Plan: <span className="font-semibold">{currentPlan}</span>
        </p>
        {isSubscribed && (
          <Button
            onClick={onManageSubscription}
            variant="outline"
            size="sm"
            disabled={loading === 'manage'}
          >
            {loading === 'manage' ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Manage Subscription
          </Button>
        )}
      </div>
      <div className="mt-8">
        <Button
          onClick={onRefreshStatus}
          variant="outline"
          size="sm"
        >
          Refresh Subscription Status
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
