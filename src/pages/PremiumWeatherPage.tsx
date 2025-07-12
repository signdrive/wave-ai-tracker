import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, TrendingUp, Wind, Waves, Eye, Thermometer, Droplets, Compass, Clock, AlertTriangle } from 'lucide-react';
import PremiumGate from '@/components/PremiumGate';

const PremiumWeatherPage = () => {
  const [selectedSpot, setSelectedSpot] = useState('malibu');
  const [selectedTimeframe, setSelectedTimeframe] = useState('21-day');

  // Mock premium weather data
  const premiumSpots = [
    { value: 'malibu', label: 'Malibu, CA', coordinates: '34.0259, -118.7798' },
    { value: 'pipeline', label: 'Pipeline, HI', coordinates: '21.6611, -158.0511' },
    { value: 'jeffreys-bay', label: 'Jeffreys Bay, SA', coordinates: '-34.0486, 24.9093' }
  ];

  const extendedForecast = [
    {
      date: '2024-01-20',
      waveHeight: { min: 3, max: 5, optimal: 4 },
      waveDirection: 270,
      wavePeriod: 12,
      windSpeed: 8,
      windDirection: 'offshore',
      tide: { low: '6:30 AM', high: '12:45 PM' },
      visibility: 15,
      waterTemp: 65,
      airTemp: 72,
      conditions: 'excellent',
      confidence: 94,
      alerts: []
    },
    {
      date: '2024-01-21',
      waveHeight: { min: 2, max: 4, optimal: 3 },
      waveDirection: 285,
      wavePeriod: 10,
      windSpeed: 12,
      windDirection: 'cross-shore',
      tide: { low: '7:15 AM', high: '1:30 PM' },
      visibility: 12,
      waterTemp: 64,
      airTemp: 70,
      conditions: 'good',
      confidence: 87,
      alerts: ['Wind picking up afternoon']
    },
    {
      date: '2024-01-22',
      waveHeight: { min: 4, max: 7, optimal: 6 },
      waveDirection: 260,
      wavePeriod: 14,
      windSpeed: 6,
      windDirection: 'offshore',
      tide: { low: '8:00 AM', high: '2:15 PM' },
      visibility: 18,
      waterTemp: 65,
      airTemp: 75,
      conditions: 'epic',
      confidence: 91,
      alerts: []
    }
  ];

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'epic': return 'text-purple-600';
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConditionBg = (condition: string) => {
    switch (condition) {
      case 'epic': return 'bg-purple-100 border-purple-200';
      case 'excellent': return 'bg-green-100 border-green-200';
      case 'good': return 'bg-blue-100 border-blue-200';
      case 'fair': return 'bg-yellow-100 border-yellow-200';
      case 'poor': return 'bg-red-100 border-red-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <PremiumGate>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-8 h-8 text-yellow-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Premium Weather Data
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Extended forecasts with advanced analytics and high accuracy predictions
            </p>
          </div>
          
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            Premium Feature
          </Badge>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Select value={selectedSpot} onValueChange={setSelectedSpot}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {premiumSpots.map(spot => (
                <SelectItem key={spot.value} value={spot.value}>
                  {spot.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7-day">7-Day Forecast</SelectItem>
              <SelectItem value="14-day">14-Day Forecast</SelectItem>
              <SelectItem value="21-day">21-Day Forecast</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="forecast" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="forecast">Extended Forecast</TabsTrigger>
            <TabsTrigger value="analytics">Wave Analytics</TabsTrigger>
            <TabsTrigger value="trends">Seasonal Trends</TabsTrigger>
            <TabsTrigger value="alerts">Smart Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-6">
            <div className="grid gap-4">
              {extendedForecast.map((day, index) => (
                <Card key={index} className={`p-6 ${getConditionBg(day.conditions)}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                    {/* Date and Conditions */}
                    <div className="lg:col-span-1">
                      <div className="text-sm text-gray-600 mb-1">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className={`text-2xl font-bold ${getConditionColor(day.conditions)}`}>
                        {day.conditions.toUpperCase()}
                      </div>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm">{day.confidence}% confidence</span>
                      </div>
                    </div>

                    {/* Wave Data */}
                    <div className="lg:col-span-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <Waves className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="text-sm font-medium">Wave Height</span>
                          </div>
                          <div className="text-lg font-bold">
                            {day.waveHeight.min}-{day.waveHeight.max}ft
                          </div>
                          <div className="text-sm text-gray-600">
                            Optimal: {day.waveHeight.optimal}ft
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-2">
                            <Compass className="w-4 h-4 mr-2 text-green-500" />
                            <span className="text-sm font-medium">Wave Direction</span>
                          </div>
                          <div className="text-lg font-bold">{day.waveDirection}°</div>
                          <div className="text-sm text-gray-600">
                            Period: {day.wavePeriod}s
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wind & Weather */}
                    <div className="lg:col-span-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <Wind className="w-4 h-4 mr-2 text-purple-500" />
                            <span className="text-sm font-medium">Wind</span>
                          </div>
                          <div className="text-lg font-bold">{day.windSpeed} mph</div>
                          <div className="text-sm text-gray-600">{day.windDirection}</div>
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-2">
                            <Thermometer className="w-4 h-4 mr-2 text-red-500" />
                            <span className="text-sm font-medium">Temperature</span>
                          </div>
                          <div className="text-lg font-bold">{day.airTemp}°F</div>
                          <div className="text-sm text-gray-600">Water: {day.waterTemp}°F</div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Data */}
                    <div className="lg:col-span-1">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center mb-1">
                            <Clock className="w-3 h-3 mr-1" />
                            <span className="text-xs font-medium">Tides</span>
                          </div>
                          <div className="text-xs">
                            <div>Low: {day.tide.low}</div>
                            <div>High: {day.tide.high}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-1">
                            <Eye className="w-3 h-3 mr-1" />
                            <span className="text-xs font-medium">Visibility</span>
                          </div>
                          <div className="text-xs">{day.visibility} miles</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alerts */}
                  {day.alerts.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {day.alerts.map((alert, alertIndex) => (
                        <div key={alertIndex} className="flex items-center text-sm text-orange-600">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          {alert}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wave Height Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>2-3ft</span>
                      <Progress value={25} className="flex-1 mx-4" />
                      <span>25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>3-4ft</span>
                      <Progress value={40} className="flex-1 mx-4" />
                      <span>40%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>4-6ft</span>
                      <Progress value={30} className="flex-1 mx-4" />
                      <span>30%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>6ft+</span>
                      <Progress value={5} className="flex-1 mx-4" />
                      <span>5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Surf Quality Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">8.7/10</div>
                    <p className="text-gray-600">Next 7 days average</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Wave consistency</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wind conditions</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tide timing</span>
                        <span className="font-medium">78%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    Seasonal trend analysis and historical comparisons will be displayed here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Smart Alert Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Perfect Conditions Alert</div>
                      <div className="text-sm text-gray-600">
                        Get notified when conditions are epic or excellent
                      </div>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Swell Change Alert</div>
                      <div className="text-sm text-gray-600">
                        Alert when significant swell is approaching
                      </div>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Wind Forecast Alert</div>
                      <div className="text-sm text-gray-600">
                        Get warned about unfavorable wind conditions
                      </div>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PremiumGate>
  );
};

export default PremiumWeatherPage;