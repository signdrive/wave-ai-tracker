
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Waves, Camera, BookOpen, Users, Brain, Mic, Watch, Scan, BarChart3, Settings } from 'lucide-react';

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

const EnhancedSurfInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState('forecast');
  const [currentSpot] = useState('malibu-ca');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-ocean-dark">Wave AI Tracker</h1>
              <p className="text-gray-600 mt-1">
                The Ultimate Surf Intelligence Platform • Powered by AI
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500">
                🤖 AI Active
              </Badge>
              <Badge className="bg-blue-500">
                🌊 Live Data
              </Badge>
              <Badge className="bg-purple-500">
                🎯 Premium
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2">
            <TabsTrigger value="forecast" className="flex items-center">
              <Brain className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">AI Forecast</span>
            </TabsTrigger>
            <TabsTrigger value="cams" className="flex items-center">
              <Camera className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Surf Cams</span>
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Booking</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center">
              <Mic className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Voice AI</span>
            </TabsTrigger>
            <TabsTrigger value="session" className="flex items-center">
              <Watch className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="ar" className="flex items-center">
              <Scan className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">AR View</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* AI Forecast Engine */}
          <TabsContent value="forecast">
            <AIForecastEngine />
          </TabsContent>

          {/* Enhanced Surf Cams */}
          <TabsContent value="cams">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-ocean" />
                  Live Surf Cams with AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RealTimeSurfCam
                  spotId={currentSpot}
                  spotName="Malibu"
                  imageSrc="/placeholder.svg"
                  cameraStatus={{ status: 'LIVE', lastChecked: new Date().toISOString() }}
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Booking Marketplace */}
          <TabsContent value="booking">
            <BookingMarketplace />
          </TabsContent>

          {/* Social Community */}
          <TabsContent value="community">
            <SocialCommunityHub />
          </TabsContent>

          {/* Voice Commands */}
          <TabsContent value="voice">
            <VoiceCommandSystem
              onSpotQuery={handleSpotQuery}
              onConditionCheck={handleConditionCheck}
              onBookingRequest={handleBookingRequest}
            />
          </TabsContent>

          {/* Session Tracking */}
          <TabsContent value="session">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SessionLogger
                currentSpot="Malibu"
                onSessionSaved={handleSessionSaved}
              />
              <WearableIntegration />
            </div>
          </TabsContent>

          {/* AR Overlay System */}
          <TabsContent value="ar">
            <AROverlaySystem />
          </TabsContent>

          {/* Advanced Analytics */}
          <TabsContent value="analytics">
            <AdvancedAnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedSurfInterface;
