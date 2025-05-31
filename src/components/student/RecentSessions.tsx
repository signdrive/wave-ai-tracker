
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { format } from 'date-fns';

interface Session {
  id: string;
  scheduled_at: string;
  rating?: number;
  mentor_feedback?: string;
  mentor?: {
    full_name: string;
  };
}

interface RecentSessionsProps {
  sessions: Session[];
}

const RecentSessions: React.FC<RecentSessionsProps> = ({ sessions }) => {
  if (sessions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.slice(0, 5).map((session) => (
          <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{session.mentor?.full_name}</h3>
                <Badge variant="outline">Completed</Badge>
                {session.rating && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {session.rating}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {format(new Date(session.scheduled_at), 'PPP')}
              </p>
              {session.mentor_feedback && (
                <p className="text-sm text-gray-700 italic">"{session.mentor_feedback}"</p>
              )}
            </div>
            <Button variant="outline" size="sm">
              Leave Review
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentSessions;
