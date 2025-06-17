
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Waves, MapPin, Clock, TrendingUp, Calendar, Users, Brain, Activity, Wind } from 'lucide-react';
import MLWavePredictions from '@/components/MLWavePredictions';
import AIForecastEngine from '@/components/AIForecastEngine';
import RealTimeDataDashboard from '@/components/RealTimeDataDashboard';
import AdvancedAnalyticsDashboard from '@/components/AdvancedAnalyticsDashboard';
import SpotCrowdDisplay from '@/components/crowd-feature/SpotCrowdDisplay';
import CrowdReportForm from '@/components/crowd-feature/CrowdReportForm';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const surfConditions = [
    {
      id: 'pipeline',
      spot: 'Pipeline, Hawaii',
      waveHeight: '6-8 ft',
      condition: 'Epic',
      crowdLevel: 'High',
      status: 'excellent',
      location: { lat: 21.6612, lon: -158.0505, name: 'Pipeline, Hawaii' }
    },
    {
      id: 'malibu',
      spot: 'Malibu, CA',
      waveHeight: '3-4 ft',
      condition: 'Good',
      crowdLevel: 'Medium',
      status: 'good',
      location: { lat: 34.0259, lon: -118.7798, name: 'Malibu, CA' }
    },
    {
      id: 'bondi',
      spot: 'Bondi Beach, AU',
      waveHeight: '2-3 ft',
      condition: 'Fair',
      crowdLevel: 'Low',
      status: 'fair',
      location: { lat: -33.8908, lon: 151.2743, name: 'Bondi Beach, AU' }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ocean-dark mb-2">WaveMentor Dashboard</h1>
        <p className="text-gray-600">Your complete surf intelligence platform with AI predictions and real-time data</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="real-time">Real-Time Data</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Waves className="w-8 h-8 mx-auto mb-2 text-ocean" />
                <div className="text-2xl font-bold text-ocean">47</div>
                <div className="text-sm text-gray-600">Active Spots</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-600">Sessions This Month</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">8.4</div>
                <div className="text-sm text-gray-600">Avg Session Rating</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-600">94%</div>
                <div className="text-sm text-gray-600">AI Accuracy</div>
              </CardContent>
            </Card>
          </div>

          {/* Current Conditions with Crowd Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Live Surf Conditions & Crowd Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {surfConditions.map((spot, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="font-medium">{spot.spot}</span>
                        </div>
                        <Badge className={getStatusColor(spot.status)}>
                          {spot.condition}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Waves className="w-4 h-4 mr-1" />
                          {spot.waveHeight}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Live
                        </div>
                      </div>
                    </div>
                    
                    {/* Crowd Intelligence Section */}
                    <div className="border-t pt-3 space-y-2">
                      <SpotCrowdDisplay spotId={spot.id} />
                      <CrowdReportForm spotId={spot.id} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium">View AI Predictions</div>
                  <div className="text-sm text-gray-600">Get ML-powered wave forecasts</div>
                </button>
                <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Real-Time Data</div>
                  <div className="text-sm text-gray-600">Live weather and wave conditions</div>
                </button>
                <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Analytics Dashboard</div>
                  <div className="text-sm text-gray-600">Track your surf progress</div>
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Surf Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Today</span>
                    <span className="font-medium text-green-600">Excellent</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tomorrow</span>
                    <span className="font-medium text-blue-600">Good</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Weekend</span>
                    <span className="font-medium text-yellow-600">Fair</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-predictions" className="space-y-6">
          <div className="grid gap-6">
            {/* AI Forecast Engine */}
            <AIForecastEngine 
              spotId="malibu" 
              spotName="Malibu, CA" 
            />
            
            {/* ML Wave Predictions */}
            <MLWavePredictions
              spotId="pipeline"
              spotName="Pipeline, Hawaii"
              currentConditions={{
                waveHeight: 6.5,
                period: 14,
                windSpeed: 8,
                windDirection: 225,
                tideLevel: 0.3,
                swellDirection: 315,
                temperature: 26
              }}
              spotPreferences={{
                idealWaveHeight: [6, 12],
                idealPeriod: [12, 16],
                idealWindSpeed: 10,
                bestTide: 'mid'
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="real-time" className="space-y-6">
          <div className="grid gap-6">
            {surfConditions.map((spot) => (
              <RealTimeDataDashboard
                key={spot.id}
                spotLocation={spot.location}
                stationId="9414290"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AdvancedAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
