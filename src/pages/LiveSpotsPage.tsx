
import React from 'react';
import PremiumGate from '@/components/PremiumGate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, Camera, Brain, Loader2, AlertCircle } from 'lucide-react';
import SpotCrowdDisplay from '@/components/crowd-feature/SpotCrowdDisplay';
import CrowdReportForm from '@/components/crowd-feature/CrowdReportForm';
import { useSupabaseSurfSpots } from '@/hooks/useSupabaseSurfSpots';

// Define a type for our spots for better type safety
interface SurfSpot {
  id: string;
  name: string;
  height?: string; 
  score?: number;
  crowd?: 'Low' | 'Medium' | 'High' | 'Moderate'; 
  skill?: string;
  isFeatured?: boolean;
  country?: string;
  state?: string;
  difficulty?: string;
}

const LiveSpotsPage = () => {
  const { surfSpots, isLoading, error } = useSupabaseSurfSpots();

  // Generate mock wave data and AI scores for spots
  const generateSpotData = (spot: any): SurfSpot => {
    const waveHeights = ['3-4 ft', '5-6 ft', '6-8 ft', '8-10 ft', '12-15 ft', '20+ ft'];
    const aiScores = [7.2, 7.8, 8.1, 8.7, 9.1, 9.2, 9.8];
    
    return {
      id: spot.id,
      name: spot.name,
      height: waveHeights[Math.floor(Math.random() * waveHeights.length)],
      score: aiScores[Math.floor(Math.random() * aiScores.length)],
      skill: spot.difficulty || 'Intermediate',
      country: spot.country,
      state: spot.state,
      difficulty: spot.difficulty
    };
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-ocean/5 to-sand/20 min-h-screen">
        <PremiumGate>
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-ocean" />
                <p className="text-gray-600">Loading live surf spots...</p>
              </div>
            </div>
          </div>
        </PremiumGate>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-ocean/5 to-sand/20 min-h-screen">
        <PremiumGate>
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
                <p className="text-red-600">Failed to load surf spots</p>
              </div>
            </div>
          </div>
        </PremiumGate>
      </div>
    );
  }

  // Select featured spot (first spot or one with specific characteristics)
  const featuredSpot = surfSpots[0] ? generateSpotData(surfSpots[0]) : null;
  if (featuredSpot) {
    featuredSpot.isFeatured = true;
    // Override with specific data for featured spot
    featuredSpot.height = '6-8 ft';
    featuredSpot.score = 9.2;
  }

  // Select 4 more spots for the grid, skipping the featured one
  const moreSpotsData = surfSpots
    .slice(1, 5)
    .map(spot => generateSpotData(spot));

  return (
    <div className="bg-gradient-to-br from-ocean/5 to-sand/20 min-h-screen">
      <PremiumGate>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ocean-dark mb-2">Live Surf Spots</h1>
            <p className="text-gray-600">AI-powered real-time wave analysis from surf cameras worldwide</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Featured Spot */}
            {featuredSpot && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      {featuredSpot.name}
                    </div>
                    <Badge className="bg-green-500">LIVE</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">Live Camera Feed</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        <Waves className="w-4 h-4 mr-1 text-blue-600" />
                        <span className="text-sm font-medium">Wave Height</span>
                      </div>
                      <p className="text-xl font-bold text-blue-600">{featuredSpot.height}</p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        <Brain className="w-4 h-4 mr-1 text-green-600" />
                        <span className="text-sm font-medium">AI Score</span>
                      </div>
                      <p className="text-xl font-bold text-green-600">{featuredSpot.score}/10</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-3">
                    <SpotCrowdDisplay spotId={featuredSpot.id} />
                    <Badge variant="outline">{featuredSpot.skill}</Badge>
                  </div>
                  <CrowdReportForm spotId={featuredSpot.id} />
                </CardContent>
              </Card>
            )}

            {/* AI Analysis Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Real-time Insights</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Perfect barrel conditions
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      Increasing crowd density
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Optimal tide timing
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Best Session Time</h4>
                  <p className="text-sm text-gray-600">6:30 AM - 8:00 AM tomorrow</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Recommended For</h4>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Advanced</Badge>
                    <Badge variant="outline" className="text-xs">Expert</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* More Spots Grid */}
          {moreSpotsData.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">More Live Spots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {moreSpotsData.map((spot) => (
                  <Card key={spot.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="font-medium mb-2">{spot.name}</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Height:</span>
                          <span className="font-medium">{spot.height}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>AI Score:</span>
                          <span className="font-medium">{spot.score}/10</span>
                        </div>
                        <SpotCrowdDisplay spotId={spot.id} />
                        <Badge variant="outline" className="w-full justify-center mt-2">
                          {spot.skill}
                        </Badge>
                      </div>
                      <CrowdReportForm spotId={spot.id} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </PremiumGate>
    </div>
  );
};

export default LiveSpotsPage;
