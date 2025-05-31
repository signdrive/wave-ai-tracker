
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Session {
  id: string;
  scheduled_at: string;
  status: string;
  mentor?: {
    full_name: string;
  };
}

interface PendingSessionsProps {
  sessions: Session[];
}

const PendingSessions: React.FC<PendingSessionsProps> = ({ sessions }) => {
  if (sessions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approval</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{session.mentor?.full_name}</h3>
                <Badge variant="secondary">{session.status}</Badge>
              </div>
              <p className="text-sm text-gray-600">
                {format(new Date(session.scheduled_at), 'PPP')} at{' '}
                {format(new Date(session.scheduled_at), 'p')}
              </p>
            </div>
            <p className="text-sm text-gray-500">Waiting for mentor confirmation</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PendingSessions;
