import React, { useState } from 'react';
import { Trophy, Star, Camera, TrendingUp, Target, Award, Zap, Crown, Medal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChallengesPage from '@/components/challenges/ChallengesPage';
import LeaderboardSystem from '@/components/gamification/LeaderboardSystem';
import PhotoContestSystem from '@/components/gamification/PhotoContestSystem';
import { useAuth } from '@/hooks/useAuth';
import EnhancedAuthDialog from '@/components/EnhancedAuthDialog';

const GamificationHub: React.FC = () => {
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Mock user achievements for display
  const mockAchievements = [
    {
      id: 1,
      name: "First Wave",
      description: "Log your first surf session",
      category: "sessions",
      icon: "🌊",
      rarity: "common",
      unlocked: true,
      progress: 1,
      required: 1
    },
    {
      id: 2,
      name: "Dawn Patrol",
      description: "Surf before 7 AM",
      category: "sessions",
      icon: "🌅",
      rarity: "rare",
      unlocked: true,
      progress: 1,
      required: 1
    },
    {
      id: 3,
      name: "Streak Master",
      description: "Surf 7 days in a row",
      category: "streaks",
      icon: "🔥",
      rarity: "epic",
      unlocked: false,
      progress: 3,
      required: 7
    },
    {
      id: 4,
      name: "Explorer",
      description: "Visit 10 different surf spots",
      category: "exploration",
      icon: "🗺️",
      rarity: "rare",
      unlocked: false,
      progress: 4,
      required: 10
    },
    {
      id: 5,
      name: "Photo Pro",
      description: "Win a photo contest",
      category: "social",
      icon: "📸",
      rarity: "legendary",
      unlocked: false,
      progress: 0,
      required: 1
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200';
      case 'legendary': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-300 dark:from-yellow-900 dark:to-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sessions': return <Target className="w-4 h-4" />;
      case 'streaks': return <Zap className="w-4 h-4" />;
      case 'exploration': return <TrendingUp className="w-4 h-4" />;
      case 'social': return <Star className="w-4 h-4" />;
      case 'challenges': return <Trophy className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Surf Gamification Hub
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Complete challenges, earn achievements, climb leaderboards, and participate in photo contests
            </p>
          </div>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Challenges & Achievements
                </CardTitle>
                <CardDescription>
                  Complete daily, weekly, and monthly surf challenges to earn points and unlock exclusive badges
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-500" />
                  Global Leaderboards
                </CardTitle>
                <CardDescription>
                  Compete with surfers worldwide and see how you rank in different categories
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-500" />
                  Photo Contests
                </CardTitle>
                <CardDescription>
                  Share your best surf photography in monthly contests and vote for community favorites
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-orange-500" />
                  Rare Achievements
                </CardTitle>
                <CardDescription>
                  Unlock rare and legendary badges by completing epic milestones and special events
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Button 
            onClick={() => setShowAuthDialog(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Join the Competition
          </Button>
        </div>
        
        <EnhancedAuthDialog 
          open={showAuthDialog} 
          onOpenChange={setShowAuthDialog}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🏆 Gamification Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Compete, achieve, and level up your surfing journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">1,247</div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">Total Points</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">Level 8</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Current Level</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">12</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Achievements</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">#24</div>
              <div className="text-sm text-green-600 dark:text-green-400">Global Rank</div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Showcase */}
        <Card className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-500" />
              Recent Achievements
            </CardTitle>
            <CardDescription>Your latest unlocked badges and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {mockAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.unlocked 
                      ? `${getRarityColor(achievement.rarity)} shadow-lg` 
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-60'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h4 className="font-semibold text-sm mb-1">{achievement.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                      {achievement.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {achievement.rarity}
                      </Badge>
                      {getCategoryIcon(achievement.category)}
                    </div>
                    
                    {!achievement.unlocked && (
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${(achievement.progress / achievement.required) * 100}%` }}
                        ></div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-1">
                      {achievement.unlocked ? '✓ Unlocked' : `${achievement.progress}/${achievement.required}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="leaderboards" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Leaderboards
            </TabsTrigger>
            <TabsTrigger value="contests" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Photo Contests
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-6">
            <ChallengesPage />
          </TabsContent>

          <TabsContent value="leaderboards" className="space-y-6">
            <LeaderboardSystem />
          </TabsContent>

          <TabsContent value="contests" className="space-y-6">
            <PhotoContestSystem />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-purple-500" />
                  All Achievements
                </CardTitle>
                <CardDescription>
                  Complete these milestones to earn exclusive badges and points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockAchievements.map((achievement) => (
                    <Card 
                      key={achievement.id}
                      className={`transition-all ${
                        achievement.unlocked 
                          ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
                          : 'hover:shadow-md'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{achievement.name}</h4>
                              <Badge className={getRarityColor(achievement.rarity)} variant="outline">
                                {achievement.rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              {achievement.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                {getCategoryIcon(achievement.category)}
                                <span className="text-xs text-gray-500 capitalize">
                                  {achievement.category}
                                </span>
                              </div>
                              
                              {achievement.unlocked ? (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  ✓ Unlocked
                                </Badge>
                              ) : (
                                <div className="text-xs text-gray-500">
                                  {achievement.progress}/{achievement.required}
                                </div>
                              )}
                            </div>
                            
                            {!achievement.unlocked && (
                              <div className="mt-3">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                                    style={{ width: `${(achievement.progress / achievement.required) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GamificationHub;