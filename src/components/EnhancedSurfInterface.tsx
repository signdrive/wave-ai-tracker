
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, DollarSign, Users, Crown } from 'lucide-react';
import AIForecastEngine from './AIForecastEngine';
import BookingMarketplace from './BookingMarketplace';
import SocialCommunityHub from './SocialCommunityHub';
import PremiumSubscriptionPanel from './PremiumSubscriptionPanel';

interface EnhancedSurfInterfaceProps {
  spotId: string;
  spotName: string;
}

const EnhancedSurfInterface: React.FC<EnhancedSurfInterfaceProps> = ({ spotId, spotName }) => {
  const [activeTab, setActiveTab] = useState('forecast');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forecast" className="flex items-center">
            <Brain className="w-4 h-4 mr-1" />
            AI Forecast
            <Badge className="ml-2 bg-blue-500 text-white text-xs">NEW</Badge>
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Community
          </TabsTrigger>
          <TabsTrigger value="premium" className="flex items-center">
            <Crown className="w-4 h-4 mr-1" />
            Premium
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forecast">
          <AIForecastEngine spotId={spotId} spotName={spotName} />
        </TabsContent>

        <TabsContent value="marketplace">
          <BookingMarketplace spotId={spotId} spotName={spotName} />
        </TabsContent>

        <TabsContent value="community">
          <SocialCommunityHub spotId={spotId} spotName={spotName} />
        </TabsContent>

        <TabsContent value="premium">
          <PremiumSubscriptionPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSurfInterface;
