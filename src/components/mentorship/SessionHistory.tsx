
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, MapPin, Clock, Star, Video } from 'lucide-react';
import { useMentorship } from '@/hooks/useMentorship';

const SessionHistory: React.FC = () => {
  const { sessions, sessionsLoading } = useMentorship();

  if (sessionsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading session history...</div>
        </CardContent>
      </Card>
    );
  }

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="w-5 h-5 mr-2" />
          Session History
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {sortedSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No sessions yet.</p>
              <p className="text-sm">Your session history will appear here.</p>
            </div>
          ) : (
            sortedSessions.map((session) => (
              <Card key={session.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">Session at {session.spot_id}</h3>
                        <Badge
                          variant={
                            session.status === 'confirmed'
                              ? 'default'
                              : session.status === 'completed'
                              ? 'secondary'
                              : session.status === 'cancelled'
                              ? 'destructive'
                              : 'outline'
                          }
                        >
                          {session.status}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(session.scheduled_at).toLocaleDateString()} at{' '}
                          {new Date(session.scheduled_at).toLocaleTimeString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {session.duration_minutes} minutes
                        </div>
                      </div>

                      {session.session_notes && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Notes: {session.session_notes}
                        </p>
                      )}

                      {session.mentor_feedback && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                          <p className="text-sm">
                            <strong>Mentor Feedback:</strong> {session.mentor_feedback}
                          </p>
                        </div>
                      )}

                      {session.student_feedback && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                          <p className="text-sm">
                            <strong>Student Feedback:</strong> {session.student_feedback}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      {session.rating && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{session.rating}/5</span>
                        </div>
                      )}

                      {session.video_call_url && (
                        <Button size="sm" variant="outline">
                          <Video className="w-4 h-4 mr-1" />
                          Join Call
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionHistory;
