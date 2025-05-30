
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, MapPin, Waves, Clock, Target, Download } from 'lucide-react';

interface SurfAnalytics {
  sessionsThisMonth: number;
  averageSessionTime: number;
  totalWaves: number;
  favoriteSpot: string;
  skillProgress: number;
  weeklyStats: Array<{
    day: string;
    sessions: number;
    waves: number;
    hours: number;
  }>;
  spotFrequency: Array<{
    spot: string;
    visits: number;
    color: string;
  }>;
  conditionPreferences: Array<{
    condition: string;
    rating: number;
  }>;
}

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analytics, setAnalytics] = useState<SurfAnalytics>({
    sessionsThisMonth: 18,
    averageSessionTime: 95,
    totalWaves: 247,
    favoriteSpot: 'Malibu',
    skillProgress: 78,
    weeklyStats: [
      { day: 'Mon', sessions: 2, waves: 12, hours: 2.5 },
      { day: 'Tue', sessions: 1, waves: 8, hours: 1.8 },
      { day: 'Wed', sessions: 3, waves: 18, hours: 3.2 },
      { day: 'Thu', sessions: 0, waves: 0, hours: 0 },
      { day: 'Fri', sessions: 2, waves: 15, hours: 2.1 },
      { day: 'Sat', sessions: 4, waves: 22, hours: 4.5 },
      { day: 'Sun', sessions: 3, waves: 19, hours: 3.8 }
    ],
    spotFrequency: [
      { spot: 'Malibu', visits: 8, color: '#0EA5E9' },
      { spot: 'Venice', visits: 5, color: '#10B981' },
      { spot: 'Manhattan Beach', visits: 3, color: '#F59E0B' },
      { spot: 'Redondo', visits: 2, color: '#EF4444' }
    ],
    conditionPreferences: [
      { condition: '3-4ft Clean', rating: 9.2 },
      { condition: '2-3ft Glassy', rating: 8.8 },
      { condition: '4-6ft Offshore', rating: 9.5 },
      { condition: '1-2ft Small', rating: 6.5 },
      { condition: '6ft+ Big', rating: 8.0 }
    ]
  });

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const exportData = () => {
    const csvData = analytics.weeklyStats.map(stat => 
      `${stat.day},${stat.sessions},${stat.waves},${stat.hours}`
    ).join('\n');
    
    const header = 'Day,Sessions,Waves,Hours\n';
    const blob = new Blob([header + csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'surf-analytics.csv';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ocean-dark">Surf Analytics</h2>
          <p className="text-gray-600">Track your progress and optimize your sessions</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d' | '1y') => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="text-2xl font-bold text-ocean-dark">{analytics.sessionsThisMonth}</p>
              </div>
              <Calendar className="w-8 h-8 text-ocean opacity-60" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% vs last month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Session</p>
                <p className="text-2xl font-bold text-ocean-dark">{formatTime(analytics.averageSessionTime)}</p>
              </div>
              <Clock className="w-8 h-8 text-ocean opacity-60" />
            </div>
            <div className="mt-2">
              <Badge className="bg-blue-100 text-blue-800">
                Optimal range
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Waves</p>
                <p className="text-2xl font-bold text-ocean-dark">{analytics.totalWaves}</p>
              </div>
              <Waves className="w-8 h-8 text-ocean opacity-60" />
            </div>
            <div className="mt-2">
              <Badge className="bg-purple-100 text-purple-800">
                {Math.round(analytics.totalWaves / analytics.sessionsThisMonth)} avg/session
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Favorite Spot</p>
                <p className="text-lg font-bold text-ocean-dark">{analytics.favoriteSpot}</p>
              </div>
              <MapPin className="w-8 h-8 text-ocean opacity-60" />
            </div>
            <div className="mt-2">
              <Badge className="bg-yellow-100 text-yellow-800">
                Most visited
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Skill Progress</p>
                <p className="text-2xl font-bold text-ocean-dark">{analytics.skillProgress}%</p>
              </div>
              <Target className="w-8 h-8 text-ocean opacity-60" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${analytics.skillProgress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#0EA5E9" name="Sessions" />
                <Bar dataKey="waves" fill="#10B981" name="Waves" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Spot Frequency Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Favorite Spots</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.spotFrequency}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="visits"
                  label={({ spot, visits }) => `${spot}: ${visits}`}
                >
                  {analytics.spotFrequency.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Condition Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Condition Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.conditionPreferences.map((condition, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="font-medium">{condition.condition}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-ocean h-2 rounded-full" 
                      style={{ width: `${(condition.rating / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{condition.rating}/10</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-medium text-blue-800 mb-2">🎯 Performance Insight</h4>
              <p className="text-blue-700 text-sm">
                Your wave count per session has increased 23% this month. You're catching more waves and improving your positioning skills.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h4 className="font-medium text-green-800 mb-2">🏄‍♂️ Skill Recommendation</h4>
              <p className="text-green-700 text-sm">
                Based on your progress, you're ready to try steeper waves. Consider surfing during higher tide at Malibu for more challenging conditions.
              </p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
              <h4 className="font-medium text-purple-800 mb-2">📅 Optimal Timing</h4>
              <p className="text-purple-700 text-sm">
                Your best sessions happen on weekends between 7-10 AM. Saturday mornings show 40% higher wave counts than other times.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
