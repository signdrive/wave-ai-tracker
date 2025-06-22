
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, MapPin, Clock, TrendingUp, Calendar, Users } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const surfConditions = [
    {
      spot: 'Pipeline, Hawaii',
      waveHeight: '6-8 ft',
      condition: 'Epic',
      crowdLevel: 'High',
      status: 'excellent'
    },
    {
      spot: 'Malibu, CA',
      waveHeight: '3-4 ft',
      condition: 'Good',
      crowdLevel: 'Medium',
      status: 'good'
    },
    {
      spot: 'Bondi Beach, AU',
      waveHeight: '2-3 ft',
      condition: 'Fair',
      crowdLevel: 'Low',
      status: 'fair'
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
        <h1 className="text-3xl font-bold text-ocean-dark mb-2">Surf Dashboard</h1>
        <p className="text-gray-600">Your personalized surf intelligence overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">2.3k</div>
            <div className="text-sm text-gray-600">Community Members</div>
          </CardContent>
        </Card>
      </div>

      {/* Current Conditions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Waves className="w-5 h-5 mr-2" />
            Current Surf Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {surfConditions.map((spot, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
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
                    <Users className="w-4 h-4 mr-1" />
                    {spot.crowdLevel}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Live
                  </div>
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
              <div className="font-medium">View Live Cams</div>
              <div className="text-sm text-gray-600">Check real-time surf conditions</div>
            </button>
            <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">Book Session</div>
              <div className="text-sm text-gray-600">Reserve your next surf spot</div>
            </button>
            <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">Log Session</div>
              <div className="text-sm text-gray-600">Record your surf experience</div>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Surf Forecast</CardTitle>
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
    </div>
  );
};
