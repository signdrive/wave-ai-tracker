import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import ChallengeCard from './ChallengeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Star, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'milestone';
  criteria: any;
  reward_points: number;
  badge_name: string;
  badge_icon: string;
  is_active: boolean;
}

interface ChallengeProgress {
  id: string;
  challenge_id: string;
  progress_data: any;
  is_completed: boolean;
  completed_at?: string;
}

interface UserStats {
  total_points: number;
  current_streak: number;
  longest_streak: number;
  total_sessions: number;
  achievements_count: number;
  level: number;
}

const ChallengesPage: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [progress, setProgress] = useState<ChallengeProgress[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadChallengesAndProgress();
      loadUserStats();
    }
  }, [user]);

  const loadChallengesAndProgress = async () => {
    try {
      // Load challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('type', { ascending: true });

      if (challengesError) throw challengesError;

      // Load user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_challenge_progress')
        .select('*')
        .eq('user_id', user?.id);

      if (progressError) throw progressError;

      setChallenges((challengesData || []) as Challenge[]);
      setProgress(progressData || []);
    } catch (error) {
      console.error('Error loading challenges:', error);
      toast({
        title: "Error",
        description: "Failed to load challenges",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setUserStats(data || {
        total_points: 0,
        current_streak: 0,
        longest_streak: 0,
        total_sessions: 0,
        achievements_count: 0,
        level: 1
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const getProgressForChallenge = (challengeId: string) => {
    return progress.find(p => p.challenge_id === challengeId);
  };

  const categorizedChallenges = {
    daily: challenges.filter(c => c.type === 'daily'),
    weekly: challenges.filter(c => c.type === 'weekly'),
    monthly: challenges.filter(c => c.type === 'monthly'),
    milestone: challenges.filter(c => c.type === 'milestone'),
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading challenges...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign in to view challenges</h2>
          <p className="text-muted-foreground">Create an account to start earning achievements and tracking your surf progress!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Surf Challenges</h1>
        <p className="text-xl text-muted-foreground">Complete challenges and earn achievements!</p>
      </div>

      {/* User Stats */}
      {userStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-primary">{userStats.total_points}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-primary">Level {userStats.level}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-primary">{userStats.achievements_count}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-primary">{userStats.current_streak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Daily Challenges */}
      {categorizedChallenges.daily.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Badge className="bg-emerald-500">Daily</Badge>
            Daily Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorizedChallenges.daily.map(challenge => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                progress={getProgressForChallenge(challenge.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Weekly Challenges */}
      {categorizedChallenges.weekly.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Badge className="bg-blue-500">Weekly</Badge>
            Weekly Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorizedChallenges.weekly.map(challenge => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                progress={getProgressForChallenge(challenge.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Monthly Challenges */}
      {categorizedChallenges.monthly.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Badge className="bg-purple-500">Monthly</Badge>
            Monthly Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorizedChallenges.monthly.map(challenge => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                progress={getProgressForChallenge(challenge.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Milestone Challenges */}
      {categorizedChallenges.milestone.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Badge className="bg-orange-500">Milestone</Badge>
            Milestone Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorizedChallenges.milestone.map(challenge => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                progress={getProgressForChallenge(challenge.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ChallengesPage;