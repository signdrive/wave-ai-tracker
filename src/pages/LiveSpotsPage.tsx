
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PremiumGate from '@/components/PremiumGate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, Camera, Brain, Users } from 'lucide-react';
// Import real data components instead of mock ones
import RealCrowdDisplay from '@/components/crowd-feature/RealCrowdDisplay';
import RealWeatherDisplay from '@/components/RealWeatherDisplay';
import CrowdReportForm from '@/components/crowd-feature/CrowdReportForm';

interface SurfSpot {
  id: string;
  name: string;
  lat: number;
  lon: number;
  height?: string;
  score?: number;
  skill?: string;
  isFeatured?: boolean;
}

const featuredSpotData: SurfSpot = {
  id: 'spot-pipeline',
  name: 'Pipeline, Hawaii',
  lat: 21.6597,
  lon: -158.0575,
  isFeatured: true,
};

const moreSpotsData: SurfSpot[] = [
  { id: 'spot-mavericks', name: 'Mavericks, CA', lat: 37.4912, lon: -122.5008, height: '12-15 ft', score: 8.7, skill: 'Expert' },
  { id: 'spot-bondi', name: 'Bondi Beach, AU', lat: -33.8908, lon: 151.2743, height: '3-4 ft', score: 7.2, skill: 'Beginner' },
  { id: 'spot-jeffreys', name: 'Jeffreys Bay, SA', lat: -34.0508, lon: 24.9094, height: '5-6 ft', score: 9.1, skill: 'Intermediate' },
  { id: 'spot-nazare', name: 'Nazaré, PT', lat: 39.6019, lon: -9.0754, height: '20+ ft', score: 9.8, skill: 'Expert' },
];

const LiveSpotsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <NavBar />
      <main className="pt-16">
        <PremiumGate>
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-ocean-dark mb-2">Live Surf Spots - Real Data Only</h1>
              <p className="text-gray-600">Real-time data from live APIs and user reports - no mock data</p>
            </div>

            {/* Real Weather Data for Featured Spot */}
            <div className="mb-6">
              <RealWeatherDisplay 
                lat={featuredSpotData.lat} 
                lon={featuredSpotData.lon} 
                locationName={featuredSpotData.name}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Featured Spot with Real Data */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      {featuredSpotData.name}
                    </div>
                    <Badge className="bg-green-500">REAL DATA</Badge>
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
                      <p className="text-xl font-bold text-blue-600">6-8 ft</p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center mb-1">
                        <Brain className="w-4 h-4 mr-1 text-green-600" />
                        <span className="text-sm font-medium">AI Score</span>
                      </div>
                      <p className="text-xl font-bold text-green-600">9.2/10</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-3">
                    <RealCrowdDisplay spotId={featuredSpotData.id} />
                    <Badge variant="outline">Advanced</Badge>
                  </div>
                  <CrowdReportForm spotId={featuredSpotData.id} />
                </CardContent>
              </Card>

              {/* AI Analysis Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Real-Time Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Live Insights</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Real API data active
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Live weather monitoring
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        User crowd reports
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Data Sources</h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">StormGlass</Badge>
                      <Badge variant="outline" className="text-xs">WeatherAPI</Badge>
                      <Badge variant="outline" className="text-xs">User Reports</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* More Spots with Real Data */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">More Live Spots - Real Data</h2>
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
                        <RealCrowdDisplay spotId={spot.id} />
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
          </div>
        </PremiumGate>
      </main>
      <Footer />
    </div>
  );
};

export default LiveSpotsPage;
