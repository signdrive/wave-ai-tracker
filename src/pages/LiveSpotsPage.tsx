
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PremiumGate from '@/components/PremiumGate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, Camera, Brain, Users } from 'lucide-react';

const LiveSpotsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <NavBar />
      <main className="pt-16">
        <PremiumGate>
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-ocean-dark mb-2">Live Surf Spots</h1>
              <p className="text-gray-600">AI-powered real-time wave analysis from surf cameras worldwide</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Featured Spot */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      Pipeline, Hawaii
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
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1 text-orange-500" />
                      <span>Crowd: Moderate</span>
                    </div>
                    <Badge variant="outline">Advanced</Badge>
                  </div>
                </CardContent>
              </Card>

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
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">More Live Spots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Mavericks, CA', height: '12-15 ft', score: 8.7, crowd: 'Low', skill: 'Expert' },
                  { name: 'Bondi Beach, AU', height: '3-4 ft', score: 7.2, crowd: 'High', skill: 'Beginner' },
                  { name: 'Jeffreys Bay, SA', height: '5-6 ft', score: 9.1, crowd: 'Moderate', skill: 'Intermediate' },
                  { name: 'Nazaré, PT', height: '20+ ft', score: 9.8, crowd: 'Low', skill: 'Expert' },
                ].map((spot, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
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
                        <div className="flex justify-between">
                          <span>Crowd:</span>
                          <span className="font-medium">{spot.crowd}</span>
                        </div>
                        <Badge variant="outline" className="w-full justify-center mt-2">
                          {spot.skill}
                        </Badge>
                      </div>
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
