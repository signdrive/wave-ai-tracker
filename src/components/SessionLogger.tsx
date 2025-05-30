
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trophy, Star, Clock, MapPin, Camera, Plus } from 'lucide-react';
import { pointsRewardService, SurfSession, PointsBreakdown, Achievement } from '@/services/pointsRewardService';
import { useSurfSpots } from '@/hooks/useSurfSpots';
import { toast } from 'sonner';

// Mock user profile for demo
const mockUserProfile = {
  totalPoints: 1250,
  level: 3,
  sessionsCount: 15,
  spotsVisited: ['pipeline', 'mavericks', 'bells-beach'],
  achievements: [],
  streak: 3,
  rank: 'Intermediate',
};

const SessionLogger: React.FC = () => {
  const { surfSpots } = useSurfSpots();
  const [isLogging, setIsLogging] = useState(false);
  const [sessionData, setSessionData] = useState({
    spotId: '',
    duration: '',
    waveHeight: '',
    waveQuality: '3',
    difficulty: 'intermediate' as const,
    notes: '',
    maneuvers: [] as string[],
  });
  const [newManeuver, setNewManeuver] = useState('');
  const [lastSession, setLastSession] = useState<{
    session: SurfSession;
    points: PointsBreakdown;
    achievements: Achievement[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);

    try {
      // Validate session data
      const session: Omit<SurfSession, 'id' | 'timestamp'> = {
        spotId: sessionData.spotId,
        spotName: surfSpots.find(s => s.id === sessionData.spotId)?.full_name || 'Unknown',
        duration: parseInt(sessionData.duration),
        waveConditions: {
          height: parseFloat(sessionData.waveHeight),
          quality: parseInt(sessionData.waveQuality),
        },
        difficulty: sessionData.difficulty,
        notes: sessionData.notes,
        maneuvers: sessionData.maneuvers,
        photos: [], // Would be populated from file uploads
      };

      const validation = pointsRewardService.validateSession(session);
      
      if (!validation.isValid) {
        toast.error(`Validation failed: ${validation.errors.join(', ')}`);
        return;
      }

      // Create full session object
      const fullSession: SurfSession = {
        ...session,
        id: `session-${Date.now()}`,
        timestamp: new Date(),
      };

      // Calculate points and check achievements
      const pointsBreakdown = pointsRewardService.calculateSessionPoints(fullSession, mockUserProfile);
      const newAchievements = pointsRewardService.checkAchievements(fullSession, mockUserProfile);

      // Store the result
      setLastSession({
        session: fullSession,
        points: pointsBreakdown,
        achievements: newAchievements,
      });

      // Reset form
      setSessionData({
        spotId: '',
        duration: '',
        waveHeight: '',
        waveQuality: '3',
        difficulty: 'intermediate',
        notes: '',
        maneuvers: [],
      });
      setNewManeuver('');

      toast.success(`Session logged! You earned ${pointsBreakdown.total} points!`);
      
      if (newAchievements.length > 0) {
        toast.success(`New achievement unlocked: ${newAchievements[0].title}!`);
      }

    } catch (error) {
      console.error('Error logging session:', error);
      toast.error('Failed to log session. Please try again.');
    } finally {
      setIsLogging(false);
    }
  };

  const addManeuver = () => {
    if (newManeuver.trim() && !sessionData.maneuvers.includes(newManeuver.trim())) {
      setSessionData(prev => ({
        ...prev,
        maneuvers: [...prev.maneuvers, newManeuver.trim()],
      }));
      setNewManeuver('');
    }
  };

  const removeManeuver = (maneuver: string) => {
    setSessionData(prev => ({
      ...prev,
      maneuvers: prev.maneuvers.filter(m => m !== maneuver),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Session Logging Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Log Surf Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="spot">Surf Spot</Label>
                <Select value={sessionData.spotId} onValueChange={(value) => setSessionData(prev => ({ ...prev, spotId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a surf spot" />
                  </SelectTrigger>
                  <SelectContent>
                    {surfSpots.slice(0, 10).map(spot => (
                      <SelectItem key={spot.id} value={spot.id}>
                        {spot.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  max="600"
                  value={sessionData.duration}
                  onChange={(e) => setSessionData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="120"
                  required
                />
              </div>
            </div>

            {/* Wave Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="waveHeight">Wave Height (feet)</Label>
                <Input
                  id="waveHeight"
                  type="number"
                  min="0.5"
                  max="30"
                  step="0.5"
                  value={sessionData.waveHeight}
                  onChange={(e) => setSessionData(prev => ({ ...prev, waveHeight: e.target.value }))}
                  placeholder="4.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="waveQuality">Wave Quality</Label>
                <Select value={sessionData.waveQuality} onValueChange={(value) => setSessionData(prev => ({ ...prev, waveQuality: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Poor</SelectItem>
                    <SelectItem value="2">2 - Fair</SelectItem>
                    <SelectItem value="3">3 - Good</SelectItem>
                    <SelectItem value="4">4 - Very Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <Label htmlFor="difficulty">Session Difficulty</Label>
              <Select value={sessionData.difficulty} onValueChange={(value: any) => setSessionData(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Maneuvers */}
            <div>
              <Label>Maneuvers Performed</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newManeuver}
                  onChange={(e) => setNewManeuver(e.target.value)}
                  placeholder="e.g., Bottom turn, Cutback"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addManeuver())}
                />
                <Button type="button" onClick={addManeuver} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {sessionData.maneuvers.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {sessionData.maneuvers.map(maneuver => (
                    <Badge
                      key={maneuver}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeManeuver(maneuver)}
                    >
                      {maneuver} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Session Notes</Label>
              <Textarea
                id="notes"
                value={sessionData.notes}
                onChange={(e) => setSessionData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="How was your session? Any highlights or learnings?"
                rows={3}
              />
            </div>

            <Button type="submit" disabled={isLogging || !sessionData.spotId || !sessionData.duration}>
              {isLogging ? 'Logging Session...' : 'Log Session'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Last Session Results */}
      {lastSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <Trophy className="w-5 h-5 mr-2" />
              Session Logged Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Session Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <MapPin className="w-4 h-4 mr-1" />
                </div>
                <div className="text-sm text-gray-600">Spot</div>
                <div className="font-semibold">{lastSession.session.spotName}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-4 h-4 mr-1" />
                </div>
                <div className="text-sm text-gray-600">Duration</div>
                <div className="font-semibold">{lastSession.session.duration}m</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 mr-1" />
                </div>
                <div className="text-sm text-gray-600">Quality</div>
                <div className="font-semibold">{lastSession.session.waveConditions.quality}/5</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Trophy className="w-4 h-4 mr-1" />
                </div>
                <div className="text-sm text-gray-600">Points</div>
                <div className="font-semibold text-green-600">+{lastSession.points.total}</div>
              </div>
            </div>

            <Separator />

            {/* Points Breakdown */}
            <div>
              <h4 className="font-semibold mb-2">Points Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Session Duration</span>
                  <span>+{lastSession.points.sessionDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wave Quality</span>
                  <span>+{lastSession.points.waveQuality}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty Bonus</span>
                  <span>+{lastSession.points.difficulty}</span>
                </div>
                {lastSession.points.newSpot > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>New Spot Bonus</span>
                    <span>+{lastSession.points.newSpot}</span>
                  </div>
                )}
                {lastSession.points.consistency > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Consistency Bonus</span>
                    <span>+{lastSession.points.consistency}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            {lastSession.achievements.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">New Achievements!</h4>
                <div className="space-y-2">
                  {lastSession.achievements.map(achievement => (
                    <div key={achievement.id} className="flex items-center p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <span className="text-2xl mr-3">{achievement.icon}</span>
                      <div>
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-sm text-gray-600">{achievement.description}</div>
                      </div>
                      <Badge className="ml-auto bg-yellow-500">
                        +{achievement.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionLogger;
