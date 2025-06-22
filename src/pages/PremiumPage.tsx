
import React from 'react';
import PremiumSubscriptionPanel from '@/components/PremiumSubscriptionPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Zap, Users, TrendingUp } from 'lucide-react';

const PremiumPage = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Crown className="w-16 h-16 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade to Wave AI Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the most accurate surf forecasts on the planet with AI-powered predictions, 
            advanced features, and exclusive booking discounts.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center pb-2">
              <Zap className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <CardTitle className="text-2xl font-bold">98%</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">AI Forecast Accuracy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <Users className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <CardTitle className="text-2xl font-bold">50K+</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">Active Pro Users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <TrendingUp className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <CardTitle className="text-2xl font-bold">25%</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">Booking Discounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <Crown className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
              <CardTitle className="text-2xl font-bold">21</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">Day Elite Forecasts</p>
            </CardContent>
          </Card>
        </div>

        {/* Premium Plans */}
        <PremiumSubscriptionPanel />

        {/* Testimonials */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">What Pro Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold">Sarah Chen</div>
                    <div className="text-sm text-gray-500">Pro Surfer</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The AI forecasts are incredibly accurate. I've never had better wave predictions for competitions."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold">Mike Rodriguez</div>
                    <div className="text-sm text-gray-500">Surf Instructor</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The booking discounts alone pay for the subscription. Plus the 4K cams are amazing!"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold">Alex Thompson</div>
                    <div className="text-sm text-gray-500">Weekend Warriors</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Finally found perfect waves every weekend. The AI knows exactly when to go!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
