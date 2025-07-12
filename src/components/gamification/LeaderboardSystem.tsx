import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Crown, TrendingUp, Users, MapPin, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Leaderboard {
  id: string;
  name: string;
  description: string;
  category: 'global' | 'local' | 'spot_specific';
  location?: string;
  spot_id?: string;
  metric: string;
  time_period: 'all_time' | 'yearly' | 'monthly' | 'weekly';
  is_active: boolean;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  score: number;
  rank: number;
  profile?: {
    full_name: string;
    avatar_url?: string;
  };
}

const LeaderboardSystem: React.FC = () => {
  const { user } = useAuth();
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<string>('');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    loadLeaderboards();
  }, []);

  useEffect(() => {
    if (selectedLeaderboard) {
      loadLeaderboardEntries(selectedLeaderboard);
    }
  }, [selectedLeaderboard, user]);

  const loadLeaderboards = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboards')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;

      setLeaderboards((data || []) as Leaderboard[]);
      if (data && data.length > 0) {
        setSelectedLeaderboard(data[0].id);
      }
    } catch (error) {
      console.error('Error loading leaderboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboardEntries = async (leaderboardId: string) => {
    try {
      // First, generate/update leaderboard entries based on the metric
      await generateLeaderboardEntries(leaderboardId);

      // Then fetch the entries with profile information
      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('leaderboard_id', leaderboardId)
        .order('rank', { ascending: true })
        .limit(50);

      if (error) throw error;

      const formattedEntries = (data || []).map(entry => ({
        ...entry,
        profile: entry.profiles as any
      }));

      setEntries(formattedEntries);

      // Find user's position if they're logged in
      if (user) {
        const userEntry = formattedEntries.find(entry => entry.user_id === user.id);
        setUserPosition(userEntry || null);
      }
    } catch (error) {
      console.error('Error loading leaderboard entries:', error);
    }
  };

  const generateLeaderboardEntries = async (leaderboardId: string) => {
    const leaderboard = leaderboards.find(lb => lb.id === leaderboardId);
    if (!leaderboard) return;

    try {
      // Get current period dates
      const now = new Date();
      let periodStart: Date;
      let periodEnd = now;

      switch (leaderboard.time_period) {
        case 'weekly':
          periodStart = new Date(now);
          periodStart.setDate(now.getDate() - 7);
          break;
        case 'monthly':
          periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'yearly':
          periodStart = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          periodStart = new Date('1970-01-01');
      }

      // Generate entries based on metric
      let query = supabase.from('user_stats').select('user_id, total_points, total_sessions, current_streak');
      
      if (leaderboard.time_period !== 'all_time') {
        // For time-specific leaderboards, we'd need to calculate from session data
        // This is a simplified version - in production, you'd aggregate from sessions
      }

      const { data: userStats, error } = await query;
      if (error) throw error;

      // Create leaderboard entries
      const entries = (userStats || [])
        .map(stat => {
          let score = 0;
          switch (leaderboard.metric) {
            case 'total_points':
              score = stat.total_points || 0;
              break;
            case 'sessions_count':
              score = stat.total_sessions || 0;
              break;
            case 'streak_days':
              score = stat.current_streak || 0;
              break;
            default:
              score = stat.total_points || 0;
          }
          return {
            leaderboard_id: leaderboardId,
            user_id: stat.user_id,
            score,
            period_start: periodStart.toISOString(),
            period_end: periodEnd.toISOString()
          };
        })
        .filter(entry => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1
        }));

      // Upsert entries
      if (entries.length > 0) {
        await supabase
          .from('leaderboard_entries')
          .upsert(entries, {
            onConflict: 'leaderboard_id,user_id,period_start'
          });
      }
    } catch (error) {
      console.error('Error generating leaderboard entries:', error);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
    if (rank <= 10) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'total_points': return 'Points';
      case 'sessions_count': return 'Sessions';
      case 'streak_days': return 'Streak Days';
      case 'wave_count': return 'Waves';
      default: return 'Score';
    }
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'yearly': return 'This Year';
      case 'all_time': return 'All Time';
      default: return period;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading leaderboards...</p>
        </div>
      </div>
    );
  }

  const currentLeaderboard = leaderboards.find(lb => lb.id === selectedLeaderboard);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🏆 Leaderboards</h2>
        <p className="text-gray-600 dark:text-gray-300">
          See how you rank against the global surf community
        </p>
      </div>

      {/* Leaderboard Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Select Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedLeaderboard} onValueChange={setSelectedLeaderboard}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a leaderboard" />
            </SelectTrigger>
            <SelectContent>
              {leaderboards.map((leaderboard) => (
                <SelectItem key={leaderboard.id} value={leaderboard.id}>
                  <div className="flex items-center gap-2">
                    {leaderboard.category === 'global' && <Users className="w-4 h-4" />}
                    {leaderboard.category === 'spot_specific' && <MapPin className="w-4 h-4" />}
                    {leaderboard.category === 'local' && <Clock className="w-4 h-4" />}
                    <span>{leaderboard.name}</span>
                    <Badge variant="outline">{getPeriodLabel(leaderboard.time_period)}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {currentLeaderboard && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {currentLeaderboard.description}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">
                  {currentLeaderboard.category === 'global' ? 'Global' : 
                   currentLeaderboard.category === 'local' ? 'Local' : 'Spot'}
                </Badge>
                <Badge variant="outline">
                  {getMetricLabel(currentLeaderboard.metric)}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Position */}
      {userPosition && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">Your Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${getRankBadgeColor(userPosition.rank)}`}>
                {getRankIcon(userPosition.rank)}
              </div>
              <div>
                <div className="font-semibold">Rank #{userPosition.rank}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {userPosition.score} {getMetricLabel(currentLeaderboard?.metric || '')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Rankings
          </CardTitle>
          <CardDescription>
            {currentLeaderboard?.name} - {getPeriodLabel(currentLeaderboard?.time_period || '')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No entries yet</h3>
              <p className="text-gray-500">Be the first to appear on this leaderboard!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                    entry.user_id === user?.id 
                      ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankBadgeColor(entry.rank)}`}>
                      {entry.rank <= 3 ? getRankIcon(entry.rank) : `#${entry.rank}`}
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={entry.profile?.avatar_url} />
                      <AvatarFallback>
                        {entry.profile?.full_name?.split(' ').map(n => n[0]).join('') || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {entry.profile?.full_name || 'Anonymous Surfer'}
                      {entry.user_id === user?.id && (
                        <Badge variant="outline" className="ml-2">You</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {entry.score} {getMetricLabel(currentLeaderboard?.metric || '')}
                    </div>
                  </div>
                  
                  {entry.rank <= 3 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {entry.rank === 1 ? 'Champion' : entry.rank === 2 ? 'Runner-up' : 'Third Place'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardSystem;