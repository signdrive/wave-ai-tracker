import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, Target, Star } from 'lucide-react';

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
  progress_data: any;
  is_completed: boolean;
  completed_at?: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  progress?: ChallengeProgress;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, progress }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-emerald-500';
      case 'weekly': return 'bg-blue-500';
      case 'monthly': return 'bg-purple-500';
      case 'milestone': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Clock className="w-4 h-4" />;
      case 'weekly': return <Target className="w-4 h-4" />;
      case 'monthly': return <Star className="w-4 h-4" />;
      case 'milestone': return <Trophy className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const calculateProgress = () => {
    if (!progress || progress.is_completed) return progress?.is_completed ? 100 : 0;
    
    const progressData = progress.progress_data || {};
    const criteria = challenge.criteria;
    
    if (criteria.session_count) {
      const current = progressData.sessions_logged || 0;
      return Math.min(100, (current / criteria.session_count) * 100);
    }
    
    if (criteria.consecutive_days) {
      const current = progressData.current_streak || 0;
      return Math.min(100, (current / criteria.consecutive_days) * 100);
    }
    
    if (criteria.unique_spots) {
      const current = progressData.unique_spots_count || 0;
      return Math.min(100, (current / criteria.unique_spots) * 100);
    }
    
    return 0;
  };

  const progressPercentage = calculateProgress();
  const isCompleted = progress?.is_completed || false;

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
      isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''
    }`}>
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{challenge.badge_icon}</span>
            <div>
              <CardTitle className="text-lg">{challenge.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={`text-white ${getTypeColor(challenge.type)}`}>
                  {getTypeIcon(challenge.type)}
                  <span className="ml-1 capitalize">{challenge.type}</span>
                </Badge>
                <Badge variant="outline" className="text-yellow-600">
                  {challenge.reward_points} pts
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground mb-4">{challenge.description}</p>
        
        {!isCompleted && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
        
        {isCompleted && (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <Trophy className="w-4 h-4" />
            Completed!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;