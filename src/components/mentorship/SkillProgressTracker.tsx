
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, Trophy, Calendar } from 'lucide-react';
import { useMentorship } from '@/hooks/useMentorship';

const SkillProgressTracker: React.FC = () => {
  const { sessions, profile } = useMentorship();
  
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const currentLevel = profile?.skill_level || 1;
  const totalHours = completedSessions.reduce((acc, s) => acc + s.duration_minutes, 0) / 60;

  // Calculate progress to next level (each level requires 10 hours)
  const hoursForNextLevel = currentLevel * 10;
  const progressToNextLevel = Math.min((totalHours / hoursForNextLevel) * 100, 100);

  const skillAreas = [
    {
      name: 'Wave Reading',
      current: 65,
      target: 80,
      recent: [60, 62, 65],
      tips: 'Practice identifying wave patterns and timing'
    },
    {
      name: 'Paddling Power',
      current: 75,
      target: 90,
      recent: [70, 73, 75],
      tips: 'Focus on technique over speed'
    },
    {
      name: 'Pop-up Speed',
      current: 50,
      target: 70,
      recent: [45, 48, 50],
      tips: 'Practice dry land pop-ups daily'
    },
    {
      name: 'Board Control',
      current: 40,
      target: 60,
      recent: [35, 38, 40],
      tips: 'Work on balance exercises'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Level & Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Your Surfing Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-blue-600">Level {currentLevel}</div>
              <p className="text-gray-600">
                {totalHours.toFixed(1)} hours logged
              </p>
            </div>
            <Badge className="bg-blue-500 text-lg px-3 py-1">
              {currentLevel < 5 ? 'Beginner' : currentLevel < 8 ? 'Intermediate' : 'Advanced'}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {currentLevel + 1}</span>
              <span>{progressToNextLevel.toFixed(0)}%</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
            <p className="text-sm text-gray-500">
              {Math.max(0, hoursForNextLevel - totalHours).toFixed(1)} more hours needed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Skill Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Skill Development
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {skillAreas.map((skill, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{skill.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {skill.current}% / {skill.target}%
                    </span>
                    <Target className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
                
                <div className="relative">
                  <Progress value={skill.current} className="h-2" />
                  <div 
                    className="absolute top-0 h-2 w-1 bg-orange-500"
                    style={{ left: `${skill.target}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <p className="text-gray-600">{skill.tips}</p>
                  <div className="flex items-center space-x-1">
                    <span>Trend:</span>
                    {skill.recent.map((val, i) => (
                      <span 
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === skill.recent.length - 1 ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions Impact */}
      {completedSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Recent Session Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">
                      {new Date(session.scheduled_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {session.duration_minutes} minutes at {session.spot_id}
                    </p>
                  </div>
                  <div className="text-right">
                    {session.rating && (
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{session.rating}/5</span>
                      </div>
                    )}
                    <p className="text-sm text-green-600">+2 skill points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Setting */}
      <Card>
        <CardHeader>
          <CardTitle>Set Your Next Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Based on your progress, here are some recommended goals:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" className="p-4 h-auto">
                <div className="text-left">
                  <div className="font-medium">Improve Wave Reading</div>
                  <div className="text-sm text-gray-500">Target: 80% by next month</div>
                </div>
              </Button>
              <Button variant="outline" className="p-4 h-auto">
                <div className="text-left">
                  <div className="font-medium">Master Pop-up Technique</div>
                  <div className="text-sm text-gray-500">Target: 70% in 2 weeks</div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillProgressTracker;
