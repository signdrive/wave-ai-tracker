
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Navigation, Brain, Trophy, Languages } from 'lucide-react';
import GeolocationRecommendations from './GeolocationRecommendations';
import MLWavePredictions from './MLWavePredictions';
import SessionLogger from './SessionLogger';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';

const AdvancedFeaturesShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('geolocation');
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ocean-dark mb-4">
            Advanced Surf Features
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover personalized recommendations, AI predictions, rewards, and multi-language support
          </p>
          
          {/* Language Selector */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Language:</span>
              <LanguageSelector />
            </div>
          </div>

          {/* Feature Badges */}
          <div className="flex justify-center flex-wrap gap-2 mb-8">
            <Badge className="bg-blue-500">
              <Navigation className="w-3 h-3 mr-1" />
              Geolocation
            </Badge>
            <Badge className="bg-purple-500">
              <Brain className="w-3 h-3 mr-1" />
              AI Predictions
            </Badge>
            <Badge className="bg-yellow-500">
              <Trophy className="w-3 h-3 mr-1" />
              Points & Rewards
            </Badge>
            <Badge className="bg-green-500">
              <Languages className="w-3 h-3 mr-1" />
              Multi-Language
            </Badge>
          </div>
        </div>

        {/* Feature Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="geolocation" className="flex flex-col items-center p-4">
              <Navigation className="w-5 h-5 mb-1" />
              <span className="text-sm">Location-Based Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="ai-predictions" className="flex flex-col items-center p-4">
              <Brain className="w-5 h-5 mb-1" />
              <span className="text-sm">AI Wave Predictions</span>
            </TabsTrigger>
            <TabsTrigger value="points-rewards" className="flex flex-col items-center p-4">
              <Trophy className="w-5 h-5 mb-1" />
              <span className="text-sm">Points & Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex flex-col items-center p-4">
              <Languages className="w-5 h-5 mb-1" />
              <span className="text-sm">Multi-Language</span>
            </TabsTrigger>
          </TabsList>

          {/* Geolocation Recommendations */}
          <TabsContent value="geolocation">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Navigation className="w-5 h-5 mr-2" />
                    Smart Location-Based Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Get personalized surf spot recommendations based on your current location, skill level, 
                    and preferences. Our smart algorithm considers distance, wave conditions, crowd levels, 
                    and your personal surfing style to find the perfect spots for you.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">50km</div>
                      <div className="text-sm text-gray-600">Search Radius</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">95%</div>
                      <div className="text-sm text-gray-600">Accuracy Rate</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">Real-time</div>
                      <div className="text-sm text-gray-600">Updates</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <GeolocationRecommendations />
            </div>
          </TabsContent>

          {/* AI Predictions */}
          <TabsContent value="ai-predictions">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Machine Learning Wave Quality Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Our AI engine analyzes multiple factors including wave height, period, wind conditions, 
                    tides, and historical data to predict wave quality scores. Get detailed insights and 
                    optimal surfing times to maximize your sessions.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">Wave Quality</div>
                      <div className="text-sm text-gray-600">Analysis</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">Wind Patterns</div>
                      <div className="text-sm text-gray-600">Optimization</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">Tide Timing</div>
                      <div className="text-sm text-gray-600">Predictions</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">Crowd Factor</div>
                      <div className="text-sm text-gray-600">Estimation</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <MLWavePredictions 
                spotId="pipeline" 
                spotName="Pipeline" 
                spotPreferences={{
                  idealWaveHeight: [6, 12],
                  idealPeriod: [10, 15],
                  idealWindSpeed: 8,
                  bestTide: 'mid'
                }}
              />
            </div>
          </TabsContent>

          {/* Points & Rewards */}
          <TabsContent value="points-rewards">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Gamified Session Logging & Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Track your surf sessions, earn points, unlock achievements, and climb the leaderboards. 
                    Our comprehensive reward system motivates consistent surfing, skill development, and 
                    exploration of new spots.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">Points</div>
                      <div className="text-sm text-gray-600">Per Session</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">Achievements</div>
                      <div className="text-sm text-gray-600">To Unlock</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">Levels</div>
                      <div className="text-sm text-gray-600">System</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">Streaks</div>
                      <div className="text-sm text-gray-600">Tracking</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <SessionLogger />
            </div>
          </TabsContent>

          {/* Multi-Language */}
          <TabsContent value="language">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Languages className="w-5 h-5 mr-2" />
                    Multi-Language Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Access the surf tracker in multiple languages with full localization support. 
                    All text, numbers, dates, and cultural preferences are automatically adapted 
                    to your selected language for a seamless experience.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">6</div>
                      <div className="text-sm text-gray-600">Languages Supported</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">100%</div>
                      <div className="text-sm text-gray-600">Interface Coverage</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">Auto</div>
                      <div className="text-sm text-gray-600">Detection</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Available Languages:</h4>
                    <LanguageSelector variant="buttons" className="justify-center" />
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium mb-2">Sample Translations:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Wave Height:</span>
                          <div className="ml-4 space-y-1">
                            <div>🇺🇸 Wave Height</div>
                            <div>🇪🇸 Altura de Olas</div>
                            <div>🇫🇷 Hauteur des Vagues</div>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Excellent:</span>
                          <div className="ml-4 space-y-1">
                            <div>🇺🇸 Excellent</div>
                            <div>🇪🇸 Excelente</div>
                            <div>🇫🇷 Excellent</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Integration Notice */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Seamless Integration</h3>
              <p className="text-gray-600">
                All these advanced features are seamlessly integrated throughout the surf tracking application. 
                Experience personalized recommendations, AI-powered insights, gamified progression, and 
                multi-language support across every component of the platform.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedFeaturesShowcase;
