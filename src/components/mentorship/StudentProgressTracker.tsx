
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Award, BookOpen } from 'lucide-react';
import { useMentorship } from '@/hooks/useMentorship';

const StudentProgressTracker: React.FC = () => {
  const { sessions, userRole } = useMentorship();
  
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const totalHours = completedSessions.reduce((acc, s) => acc + s.duration_minutes, 0) / 60;
  const averageRating = completedSessions.reduce((acc, s) => acc + (s.rating || 0), 0) / completedSessions.length || 0;

  // Mock skill progression data (in a real app, this would come from the database)
  const skills = [
    { name: 'Paddling Technique', progress: 75, level: 'Intermediate' },
    { name: 'Wave Reading', progress: 60, level: 'Beginner+' },
    { name: 'Pop-up Speed', progress: 80, level: 'Intermediate' },
    { name: 'Balance & Control', progress: 45, level: 'Beginner' },
    { name: 'Safety Awareness', progress: 90, level: 'Advanced' },
  ];

  const achievements = [
    { name: 'First Session', description: 'Completed your first mentoring session', earned: true },
    { name: '10 Hours Logged', description: 'Accumulated 10 hours of training', earned: totalHours >= 10 },
    { name: 'Consistent Learner', description: 'Completed 5 sessions', earned: completedSessions.length >= 5 },
    { name: 'High Performer', description: 'Maintained 4+ star average rating', earned: averageRating >= 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sessions Completed</p>
                <p className="text-2xl font-bold">{completedSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Hours</p>
                <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Skill Development
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill.name}</span>
                  <Badge variant="outline">{skill.level}</Badge>
                </div>
                <Progress value={skill.progress} className="h-2" />
                <div className="text-sm text-gray-600 text-right">
                  {skill.progress}% Complete
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  achievement.earned
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Award
                    className={`w-6 h-6 mt-1 ${
                      achievement.earned ? 'text-green-500' : 'text-gray-400'
                    }`}
                  />
                  <div>
                    <h3
                      className={`font-semibold ${
                        achievement.earned ? 'text-green-900 dark:text-green-100' : 'text-gray-600'
                      }`}
                    >
                      {achievement.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        achievement.earned ? 'text-green-700 dark:text-green-200' : 'text-gray-500'
                      }`}
                    >
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProgressTracker;
