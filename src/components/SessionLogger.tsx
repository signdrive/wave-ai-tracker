
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, Clock, MapPin, Star, Plus } from 'lucide-react';
import { pointsRewardService } from '@/services/pointsRewardService';
import { useToast } from '@/hooks/use-toast';

interface SessionLoggerProps {
  currentSpot?: string;
  onSessionSaved?: (session: any) => void;
}

const SessionLogger: React.FC<SessionLoggerProps> = ({ 
  currentSpot = 'Malibu',
  onSessionSaved 
}) => {
  const [session, setSession] = useState({
    spot: currentSpot,
    date: new Date().toISOString().split('T')[0],
    duration: '',
    waveHeight: '',
    waveQuality: '',
    conditions: '',
    notes: '',
    rating: 5
  });
  
  const [userStats, setUserStats] = useState({
    totalSessions: 42,
    totalPoints: 1250,
    currentLevel: 'Advanced',
    streak: 7,
    badges: ['Early Bird', 'Wave Hunter', 'Consistency King']
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate points for this session
    const points = pointsRewardService.calculateSessionPoints({
      duration: parseInt(session.duration) || 0,
      waveQuality: session.waveQuality as any,
      conditions: session.conditions,
      rating: session.rating,
      isNewSpot: session.spot !== currentSpot
    });

    const sessionData = {
      ...session,
      id: Date.now(),
      points,
      timestamp: new Date().toISOString()
    };

    // Update user stats
    setUserStats(prev => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
      totalPoints: prev.totalPoints + points,
      streak: prev.streak + 1
    }));

    // Call the callback if provided
    onSessionSaved?.(sessionData);

    toast({
      title: "Session Logged! 🏄‍♂️",
      description: `Earned ${points} points! Total: ${userStats.totalPoints + points}`,
    });

    // Reset form
    setSession({
      spot: currentSpot,
      date: new Date().toISOString().split('T')[0],
      duration: '',
      waveHeight: '',
      waveQuality: '',
      conditions: '',
      notes: '',
      rating: 5
    });
  };

  return (
    <div className="space-y-6">
      {/* User Stats Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Your Surf Stats & Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{userStats.totalSessions}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{userStats.totalPoints}</div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{userStats.currentLevel}</div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{userStats.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {userStats.badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {badge}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Logger Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2 text-ocean" />
            Log New Surf Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="spot">Surf Spot</Label>
                <Input
                  id="spot"
                  value={session.spot}
                  onChange={(e) => setSession({ ...session, spot: e.target.value })}
                  placeholder="Enter surf spot name"
                />
              </div>
              
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={session.date}
                  onChange={(e) => setSession({ ...session, date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={session.duration}
                  onChange={(e) => setSession({ ...session, duration: e.target.value })}
                  placeholder="90"
                />
              </div>
              
              <div>
                <Label htmlFor="waveHeight">Wave Height (ft)</Label>
                <Input
                  id="waveHeight"
                  value={session.waveHeight}
                  onChange={(e) => setSession({ ...session, waveHeight: e.target.value })}
                  placeholder="3-5"
                />
              </div>
              
              <div>
                <Label htmlFor="waveQuality">Wave Quality</Label>
                <Select value={session.waveQuality} onValueChange={(value) => setSession({ ...session, waveQuality: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="conditions">Conditions</Label>
              <Input
                id="conditions"
                value={session.conditions}
                onChange={(e) => setSession({ ...session, conditions: e.target.value })}
                placeholder="Offshore winds, clean faces"
              />
            </div>

            <div>
              <Label htmlFor="rating">Session Rating</Label>
              <div className="flex items-center space-x-2 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSession({ ...session, rating: star })}
                    className={`text-2xl ${star <= session.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={session.notes}
                onChange={(e) => setSession({ ...session, notes: e.target.value })}
                placeholder="How was the session? Any notable waves or experiences?"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full">
              <Trophy className="w-4 h-4 mr-2" />
              Log Session & Earn Points
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionLogger;
