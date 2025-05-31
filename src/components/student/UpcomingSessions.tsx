
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import { format } from 'date-fns';

interface Session {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  video_call_url?: string;
  mentor?: {
    full_name: string;
  };
}

interface UpcomingSessionsProps {
  sessions: Session[];
}

const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({ sessions }) => {
  if (sessions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{session.mentor?.full_name}</h3>
                <Badge variant="outline">{session.status}</Badge>
              </div>
              <p className="text-sm text-gray-600">
                {format(new Date(session.scheduled_at), 'PPP')} at{' '}
                {format(new Date(session.scheduled_at), 'p')}
              </p>
              <p className="text-sm text-gray-600">Duration: {session.duration_minutes} minutes</p>
            </div>
            <div className="flex gap-2">
              {session.video_call_url && (
                <Button size="sm">
                  <Video className="w-4 h-4 mr-1" />
                  Join Call
                </Button>
              )}
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingSessions;
