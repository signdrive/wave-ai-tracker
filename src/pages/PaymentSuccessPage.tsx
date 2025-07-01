
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Crown, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<{
    subscription_tier?: string;
    subscription_end?: string;
  } | null>(null);

  const sessionId = searchParams.get('session_id');
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    if (canceled) {
      toast({
        title: "Payment Canceled",
        description: "Your payment was canceled. You can try again anytime.",
        variant: "destructive",
      });
      setTimeout(() => navigate('/premium'), 2000);
      return;
    }

    if (sessionId && user && session) {
      verifyPayment();
    } else if (!user) {
      navigate('/premium');
    }
  }, [sessionId, user, session, canceled]);

  const verifyPayment = async () => {
    try {
      // Check subscription status to get updated plan information
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session!.access_token}`,
        },
      });

      if (error) throw error;

      setSubscriptionData(data);
      
      if (data.subscribed) {
        toast({
          title: "Payment Successful!",
          description: `Welcome to ${data.subscription_tier}! Your subscription is now active.`,
        });
      } else {
        toast({
          title: "Verifying Payment",
          description: "Please wait while we confirm your payment...",
        });
        
        // Retry after a delay if subscription isn't active yet
        setTimeout(verifyPayment, 3000);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Verification Error",
        description: "There was an issue verifying your payment. Please contact support if this persists.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (canceled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="w-8 h-8 text-red-600 rotate-180" />
            </div>
            <CardTitle className="text-2xl text-gray-900">Payment Canceled</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Your payment was canceled. No charges were made to your account.
            </p>
            <Button onClick={() => navigate('/premium')} className="w-full">
              Return to Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading || !subscriptionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl text-gray-900">Verifying Payment</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">
              Please wait while we confirm your payment and activate your subscription...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case 'WaveMentor Elite':
        return Crown;
      case 'WaveMentor Pro':
        return Crown;
      default:
        return Zap;
    }
  };

  const getPlanColor = (tier: string) => {
    switch (tier) {
      case 'WaveMentor Elite':
        return 'from-yellow-400 to-yellow-600';
      case 'WaveMentor Pro':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const PlanIcon = getPlanIcon(subscriptionData.subscription_tier || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl text-gray-900 mb-2">
            Welcome to WaveMentor!
          </CardTitle>
          <p className="text-gray-600 text-lg">
            Your subscription has been successfully activated
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Plan Details */}
          <div className={`bg-gradient-to-r ${getPlanColor(subscriptionData.subscription_tier || '')} p-6 rounded-lg text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {subscriptionData.subscription_tier}
                </h3>
                <p className="text-white/90">
                  Your premium surf intelligence platform
                </p>
                {subscriptionData.subscription_end && (
                  <p className="text-white/80 text-sm mt-2">
                    Next billing: {new Date(subscriptionData.subscription_end).toLocaleDateString()}
                  </p>
                )}
              </div>
              <PlanIcon className="w-16 h-16 text-white/80" />
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <ArrowRight className="w-5 h-5 mr-2 text-ocean" />
              What's Next?
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Access to premium AI-powered surf forecasts</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>HD surf cams with advanced controls</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Priority customer support</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Exclusive booking discounts</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/live-spots')}
              className="flex-1 bg-ocean hover:bg-ocean-dark text-white"
            >
              Explore Live Spots
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex-1"
            >
              Go to Dashboard
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            <p>
              Need help? Contact our support team at{' '}
              <a href="mailto:support@wavementor.com" className="text-ocean hover:underline">
                support@wavementor.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
