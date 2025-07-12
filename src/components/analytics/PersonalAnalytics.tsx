import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Calendar, Clock, Target, Star, MapPin, 
  Waves, ThermometerSun, Wind, Activity 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SurfSession {
  id: string;
  session_date: string;
  spot_id: string;
  spot_name: string;
  duration_minutes: number;
  wave_count: number;
  rating: number;
  notes: string;
  conditions_snapshot: any;
}

interface AnalyticsData {
  totalSessions: number;
  totalHours: number;
  averageRating: number;
  favoriteSpot: string;
  longestSession: number;
  bestMonth: string;
  progressScore: number;
}

const PersonalAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SurfSession[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');

  useEffect(() => {
    if (user) {
      loadSurfSessions();
    }
  }, [user, timeRange]);

  useEffect(() => {
    if (sessions.length > 0) {
      calculateAnalytics();
    }
  }, [sessions]);

  const loadSurfSessions = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('surf_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('session_date', { ascending: false });

      // Apply time filter
      if (timeRange !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (timeRange) {
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }
        
        query = query.gte('session_date', startDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      setSessions(data || []);
    } catch (error) {
      console.error('Error loading surf sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load surf sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = () => {
    if (sessions.length === 0) {
      setAnalytics(null);
      return;
    }

    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((sum, session) => sum + (session.duration_minutes || 0), 0);
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10;
    
    const ratingsWithValues = sessions.filter(s => s.rating > 0);
    const averageRating = ratingsWithValues.length > 0 
      ? Math.round(ratingsWithValues.reduce((sum, session) => sum + session.rating, 0) / ratingsWithValues.length * 10) / 10
      : 0;

    // Find favorite spot
    const spotCounts: { [key: string]: number } = {};
    sessions.forEach(session => {
      if (session.spot_name) {
        spotCounts[session.spot_name] = (spotCounts[session.spot_name] || 0) + 1;
      }
    });
    const favoriteSpot = Object.keys(spotCounts).reduce((a, b) => 
      spotCounts[a] > spotCounts[b] ? a : b, 'N/A'
    );

    // Find longest session
    const longestSession = Math.max(...sessions.map(s => s.duration_minutes || 0));

    // Find best month (most sessions)
    const monthCounts: { [key: string]: number } = {};
    sessions.forEach(session => {
      const month = new Date(session.session_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    const bestMonth = Object.keys(monthCounts).reduce((a, b) => 
      monthCounts[a] > monthCounts[b] ? a : b, 'N/A'
    );

    // Calculate progress score (based on recent activity, ratings, consistency)
    const recentSessions = sessions.slice(0, 5);
    const recentAvgRating = recentSessions.length > 0 
      ? recentSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / recentSessions.length
      : 0;
    const progressScore = Math.min(100, Math.round(
      (totalSessions * 2) + (recentAvgRating * 20) + (totalHours * 0.5)
    ));

    setAnalytics({
      totalSessions,
      totalHours,
      averageRating,
      favoriteSpot,
      longestSession,
      bestMonth,
      progressScore
    });
  };

  const getSessionsPerMonth = () => {
    const monthlyData: { [key: string]: number } = {};
    
    sessions.forEach(session => {
      const monthKey = new Date(session.session_date).toLocaleDateString('en-US', { 
        month: 'short', 
        year: '2-digit' 
      });
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, count]) => ({ month, sessions: count }))
      .slice(0, 6)
      .reverse();
  };

  const getRatingDistribution = () => {
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    sessions.forEach(session => {
      if (session.rating >= 1 && session.rating <= 5) {
        ratingCounts[session.rating as keyof typeof ratingCounts]++;
      }
    });

    return Object.entries(ratingCounts).map(([rating, count]) => ({
      rating: `${rating} star${rating !== '1' ? 's' : ''}`,
      count,
      percentage: sessions.length > 0 ? Math.round(count / sessions.length * 100) : 0
    }));
  };

  const getTopSpots = () => {
    const spotCounts: { [key: string]: number } = {};
    
    sessions.forEach(session => {
      if (session.spot_name) {
        spotCounts[session.spot_name] = (spotCounts[session.spot_name] || 0) + 1;
      }
    });

    return Object.entries(spotCounts)
      .map(([spot, count]) => ({ spot, sessions: count }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign in to view analytics</h2>
          <p className="text-muted-foreground">Create an account to track your surf sessions and view detailed analytics!</p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <BarChart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No surf sessions yet</h2>
          <p className="text-muted-foreground mb-4">Start logging your surf sessions to see detailed analytics and insights!</p>
          <Button onClick={() => window.location.href = '/surf-log'}>
            Log Your First Session
          </Button>
        </div>
      </div>
    );
  }

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header with Time Range Filter */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Personal Analytics</h1>
          <p className="text-xl text-muted-foreground">Detailed insights into your surf sessions</p>
        </div>
        
        <div className="flex gap-2">
          {(['week', 'month', 'year', 'all'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === 'all' ? 'All Time' : range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Statistics */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{analytics.totalSessions}</div>
              <div className="text-sm text-muted-foreground">Total Sessions</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{analytics.totalHours}h</div>
              <div className="text-sm text-muted-foreground">Time in Water</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{analytics.averageRating}</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{analytics.progressScore}</div>
              <div className="text-sm text-muted-foreground">Progress Score</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress & Achievements */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Surf Progress</span>
                <span>{analytics.progressScore}/100</span>
              </div>
              <Progress value={analytics.progressScore} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <MapPin className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <div className="font-medium">Favorite Spot</div>
                <div className="text-sm text-muted-foreground">{analytics.favoriteSpot}</div>
              </div>
              
              <div className="text-center">
                <Clock className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <div className="font-medium">Longest Session</div>
                <div className="text-sm text-muted-foreground">{analytics.longestSession} min</div>
              </div>
              
              <div className="text-center">
                <Calendar className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <div className="font-medium">Best Month</div>
                <div className="text-sm text-muted-foreground">{analytics.bestMonth}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions per Month */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getSessionsPerMonth()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Session Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getRatingDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ rating, percentage }) => `${rating}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {getRatingDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Surf Spots */}
        <Card>
          <CardHeader>
            <CardTitle>Top Surf Spots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTopSpots().map((spot, index) => (
                <div key={spot.spot} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{spot.spot}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {spot.sessions} session{spot.sessions !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">{session.spot_name || 'Unknown Spot'}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(session.session_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < (session.rating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {session.duration_minutes || 0} min
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalAnalytics;