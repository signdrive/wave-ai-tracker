
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Waves, MapPin, TrendingUp } from 'lucide-react';

const SurfLogPage = () => {
  const sessions = [
    {
      id: 1,
      date: '2024-01-15',
      spot: 'Pipeline, Hawaii',
      duration: '2.5 hours',
      waveCount: 23,
      maxWaveHeight: '8 ft',
      rating: 9.2,
      conditions: 'Epic',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      date: '2024-01-12',
      spot: 'Kelly Slater Surf Ranch',
      duration: '1 hour',
      waveCount: 12,
      maxWaveHeight: '6 ft',
      rating: 8.7,
      conditions: 'Perfect',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      date: '2024-01-10',
      spot: 'Malibu, CA',
      duration: '3 hours',
      waveCount: 31,
      maxWaveHeight: '4 ft',
      rating: 7.5,
      conditions: 'Good',
      image: '/placeholder.svg'
    }
  ];

  const stats = {
    totalSessions: 47,
    totalHours: 156,
    totalWaves: 1247,
    avgRating: 8.2,
    favoriteSpot: 'Pipeline, Hawaii',
    bestMonth: 'December 2023'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <NavBar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ocean-dark mb-2">My Surf Log</h1>
            <p className="text-gray-600">Track your surf sessions and analyze your progression</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-ocean">{stats.totalSessions}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalHours}</div>
                <div className="text-sm text-gray-600">Hours Surfed</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalWaves}</div>
                <div className="text-sm text-gray-600">Waves Caught</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.avgRating}</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm font-bold text-purple-600">{stats.favoriteSpot}</div>
                <div className="text-sm text-gray-600">Favorite Spot</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm font-bold text-red-600">{stats.bestMonth}</div>
                <div className="text-sm text-gray-600">Best Month</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{session.spot}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(session.date).toLocaleDateString()}
                          <Clock className="w-4 h-4 ml-3 mr-1" />
                          {session.duration}
                        </div>
                      </div>
                      <Badge className={`${
                        session.rating >= 9 ? 'bg-green-500' :
                        session.rating >= 7 ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}>
                        {session.rating}/10
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        <Waves className="w-4 h-4 mr-2 text-blue-500" />
                        <div>
                          <div className="font-medium">{session.waveCount} waves</div>
                          <div className="text-gray-600">Caught</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                        <div>
                          <div className="font-medium">{session.maxWaveHeight}</div>
                          <div className="text-gray-600">Max Height</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                        <div>
                          <div className="font-medium">{session.conditions}</div>
                          <div className="text-gray-600">Conditions</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                        <div>
                          <div className="font-medium">{session.duration}</div>
                          <div className="text-gray-600">Duration</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SurfLogPage;
