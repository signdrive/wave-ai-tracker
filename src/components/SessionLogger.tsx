
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Waves, Clock, Star, MapPin, Camera } from 'lucide-react';

interface SurfSession {
  id: string;
  date: string;
  spot: string;
  duration: number; // minutes
  waveHeight: string;
  conditions: string;
  rating: number; // 1-5 stars
  notes: string;
  photos?: string[];
  boardUsed?: string;
  crowdLevel: string;
}

interface SessionLoggerProps {
  currentSpot?: string;
  onSessionSaved: (session: SurfSession) => void;
}

const SessionLogger: React.FC<SessionLoggerProps> = ({ 
  currentSpot = '',
  onSessionSaved 
}) => {
  const [isLogging, setIsLogging] = useState(false);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [currentSession, setCurrentSession] = useState<Partial<SurfSession>>({
    spot: currentSpot,
    rating: 3,
    crowdLevel: 'moderate'
  });
  const [recentSessions, setRecentSessions] = useState<SurfSession[]>([]);

  useEffect(() => {
    // Load recent sessions from localStorage
    const saved = localStorage.getItem('surf-sessions');
    if (saved) {
      setRecentSessions(JSON.parse(saved));
    }
  }, []);

  const startSession = () => {
    setIsLogging(true);
    setSessionStart(new Date());
    setCurrentSession({
      ...currentSession,
      spot: currentSpot || currentSession.spot,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const endSession = () => {
    if (!sessionStart) return;

    const duration = Math.round((new Date().getTime() - sessionStart.getTime()) / (1000 * 60));
    
    const completedSession: SurfSession = {
      id: Date.now().toString(),
      date: currentSession.date || new Date().toISOString().split('T')[0],
      spot: currentSession.spot || 'Unknown Spot',
      duration,
      waveHeight: currentSession.waveHeight || '2-4ft',
      conditions: currentSession.conditions || 'Good',
      rating: currentSession.rating || 3,
      notes: currentSession.notes || '',
      boardUsed: currentSession.boardUsed,
      crowdLevel: currentSession.crowdLevel || 'moderate'
    };

    const updatedSessions = [completedSession, ...recentSessions].slice(0, 20);
    setRecentSessions(updatedSessions);
    localStorage.setItem('surf-sessions', JSON.stringify(updatedSessions));
    
    onSessionSaved(completedSession);
    setIsLogging(false);
    setSessionStart(null);
    setCurrentSession({ rating: 3, crowdLevel: 'moderate' });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-4">
      {/* Active Session Tracker */}
      <Card className={`${isLogging ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Waves className="w-5 h-5 mr-2 text-ocean" />
              Session Tracker
            </div>
            {isLogging && (
              <Badge className="bg-green-500">
                <Clock className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLogging ? (
            <div className="space-y-3">
              <Input
                placeholder="Surf spot name"
                value={currentSession.spot || ''}
                onChange={(e) => setCurrentSession({...currentSession, spot: e.target.value})}
              />
              <Button onClick={startSession} className="w-full bg-ocean hover:bg-ocean-dark">
                Start Surf Session
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{currentSession.spot}</span>
                  <span className="text-sm text-gray-500">
                    {sessionStart && formatDuration(Math.round((new Date().getTime() - sessionStart.getTime()) / (1000 * 60)))}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Select value={currentSession.waveHeight} onValueChange={(value) => setCurrentSession({...currentSession, waveHeight: value})}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Wave height" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2ft">1-2ft</SelectItem>
                      <SelectItem value="2-4ft">2-4ft</SelectItem>
                      <SelectItem value="4-6ft">4-6ft</SelectItem>
                      <SelectItem value="6-8ft">6-8ft</SelectItem>
                      <SelectItem value="8ft+">8ft+</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={currentSession.conditions} onValueChange={(value) => setCurrentSession({...currentSession, conditions: value})}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Epic">Epic</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-2">
                  <label className="text-sm text-gray-600">Session Rating:</label>
                  <div className="flex space-x-1 mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 cursor-pointer ${
                          i < (currentSession.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                        onClick={() => setCurrentSession({...currentSession, rating: i + 1})}
                      />
                    ))}
                  </div>
                </div>

                <Textarea
                  placeholder="Session notes..."
                  value={currentSession.notes || ''}
                  onChange={(e) => setCurrentSession({...currentSession, notes: e.target.value})}
                  className="mt-2"
                  rows={2}
                />
              </div>

              <Button onClick={endSession} className="w-full bg-green-600 hover:bg-green-700">
                End Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-ocean" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentSessions.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Waves className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No sessions logged yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.slice(0, 5).map((session) => (
                <div key={session.id} className="border rounded-md p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      <span className="font-medium">{session.spot}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{getRatingStars(session.rating)}</div>
                      <Badge variant="outline" className="text-xs">
                        {formatDuration(session.duration)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-2">
                    <span>{session.date}</span>
                    <span>{session.waveHeight}</span>
                    <span>{session.conditions}</span>
                  </div>
                  
                  {session.notes && (
                    <p className="text-sm text-gray-700 mt-2">{session.notes}</p>
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

export default SessionLogger;
