import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Waves, Camera, BookOpen, Users, Brain, Mic, Watch, Scan, BarChart3, Settings } from 'lucide-react';
import { AnimatedTabs, AnimatedTabsList, AnimatedTabsTrigger, AnimatedTabsContent } from './AnimatedTabs';
import { LoadingSkeleton } from './LoadingSkeleton';

// Import all our new components
import AIForecastEngine from './AIForecastEngine';
import BookingMarketplace from './BookingMarketplace';
import SocialCommunityHub from './SocialCommunityHub';
import VoiceCommandSystem from './VoiceCommandSystem';
import SessionLogger from './SessionLogger';
import WearableIntegration from './WearableIntegration';
import AROverlaySystem from './AROverlaySystem';
import AdvancedAnalyticsDashboard from './AdvancedAnalyticsDashboard';
import RealTimeSurfCam from './RealTimeSurfCam';

interface EnhancedSurfInterfaceProps {
  spotId?: string;
  spotName?: string;
}

const EnhancedSurfInterface: React.FC<EnhancedSurfInterfaceProps> = ({ 
  spotId = 'malibu-ca', 
  spotName = 'Malibu' 
}) => {
  const [activeTab, setActiveTab] = useState('forecast');
  const [isLoading, setIsLoading] = useState(false);

  const handleSpotQuery = (spotName: string) => {
    console.log('Voice query for spot:', spotName);
    setActiveTab('forecast');
  };

  const handleConditionCheck = (location: string) => {
    console.log('Checking conditions for:', location);
    setActiveTab('forecast');
  };

  const handleBookingRequest = (service: string) => {
    console.log('Booking request for:', service);
    setActiveTab('booking');
  };

  const handleSessionSaved = (session: any) => {
    console.log('Session saved:', session);
  };

  const handleTabChange = (value: string) => {
    setIsLoading(true);
    setActiveTab(value);
    // Simulate loading delay for better UX
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 animate-in fade-in-50 slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-ocean-dark dark:text-white transition-colors duration-300">
                Wave AI Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">
                The Ultimate Surf Intelligence Platform • Powered by AI
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500 animate-pulse">
                🤖 AI Active
              </Badge>
              <Badge className="bg-blue-500 animate-pulse">
                🌊 Live Data
              </Badge>
              <Badge className="bg-purple-500 animate-pulse">
                🎯 Premium
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
          <AnimatedTabs value={activeTab} onValueChange={handleTabChange}>
            <AnimatedTabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2">
              <AnimatedTabsTrigger value="forecast">
                <Brain className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">AI Forecast</span>
              </AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="cams">
                <Camera className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Surf Cams</span>
              </AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="booking">
                <BookOpen className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Booking</span>
              </AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="community">
                <Users className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Community</span>
              </AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="voice">
                <Mic className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Voice AI</span>
              </AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="session">
                <Watch className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Sessions</span>
              </AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="ar">
                <Scan className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">AR View</span>
              </AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Analytics</span>
              </AnimatedTabsTrigger>
            </AnimatedTabsList>

            {/* AI Forecast Engine */}
            <AnimatedTabsContent value="forecast">
              {isLoading ? (
                <LoadingSkeleton type="forecast" />
              ) : (
                <AIForecastEngine spotId={spotId} spotName={spotName} />
              )}
            </AnimatedTabsContent>

            {/* Enhanced Surf Cams */}
            <AnimatedTabsContent value="cams">
              <Card className="transition-all duration-300 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-ocean dark:text-ocean-light" />
                    Live Surf Cams with AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <LoadingSkeleton type="cam" />
                  ) : (
                    <RealTimeSurfCam
                      spotId={spotId}
                      spotName={spotName}
                      imageSrc="/placeholder.svg"
                      cameraStatus={{ 
                        spotId: spotId,
                        status: 'LIVE', 
                        lastChecked: new Date().toISOString(),
                        isValid: true
                      }}
                      metadata={{
                        lat: 34.0259,
                        lon: -118.7798,
                        country: 'USA',
                        state: 'California',
                        waveType: 'Point Break',
                        difficulty: 'Intermediate',
                        bestSwellDirection: 'W-SW',
                        bestWind: 'Offshore',
                        bestTide: 'Mid',
                        crowdFactor: 'Moderate',
                        liveCam: 'https://example.com/cam',
                        cameraStatus: 'LIVE'
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </AnimatedTabsContent>

            {/* Other tab contents with loading states */}
            <AnimatedTabsContent value="booking">
              {isLoading ? (
                <LoadingSkeleton type="card" count={3} />
              ) : (
                <BookingMarketplace spotId={spotId} spotName={spotName} />
              )}
            </AnimatedTabsContent>

            <AnimatedTabsContent value="community">
              {isLoading ? (
                <LoadingSkeleton type="list" />
              ) : (
                <SocialCommunityHub spotId={spotId} spotName={spotName} />
              )}
            </AnimatedTabsContent>

            <AnimatedTabsContent value="voice">
              {isLoading ? (
                <LoadingSkeleton type="card" />
              ) : (
                <VoiceCommandSystem
                  onSpotQuery={handleSpotQuery}
                  onConditionCheck={handleConditionCheck}
                  onBookingRequest={handleBookingRequest}
                />
              )}
            </AnimatedTabsContent>

            <AnimatedTabsContent value="session">
              {isLoading ? (
                <LoadingSkeleton type="card" count={2} />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SessionLogger
                    currentSpot={spotName}
                    onSessionSaved={handleSessionSaved}
                  />
                  <WearableIntegration />
                </div>
              )}
            </AnimatedTabsContent>

            <AnimatedTabsContent value="ar">
              {isLoading ? (
                <LoadingSkeleton type="card" />
              ) : (
                <AROverlaySystem />
              )}
            </AnimatedTabsContent>

            <AnimatedTabsContent value="analytics">
              {isLoading ? (
                <LoadingSkeleton type="chart" count={4} />
              ) : (
                <AdvancedAnalyticsDashboard />
              )}
            </AnimatedTabsContent>
          </AnimatedTabs>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSurfInterface;
