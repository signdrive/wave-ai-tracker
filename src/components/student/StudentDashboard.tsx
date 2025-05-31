
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Video, Star, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import BookingFlow from '../booking/BookingFlow';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showBooking, setShowBooking] = React.useState(false);

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['student-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('mentorship_sessions')
        .select(`
          *,
          mentor:profiles!mentorship_sessions_mentor_id_fkey(full_name, email)
        `)
        .eq('student_id', user.id)
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const upcomingSessions = sessions.filter(s => 
    s.status === 'confirmed' && new Date(s.scheduled_at) > new Date()
  );

  const pendingSessions = sessions.filter(s => s.status === 'pending');
  const completedSessions = sessions.filter(s => s.status === 'completed');

  if (showBooking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Book a Session</h2>
          <Button variant="outline" onClick={() => setShowBooking(false)}>
            Back to Dashboard
          </Button>
        </div>
        <BookingFlow onBookingComplete={() => setShowBooking(false)} />
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Student Dashboard</h2>
        <Button onClick={() => setShowBooking(true)}>
          <BookOpen className="w-4 h-4 mr-2" />
          Book a Session
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-ocean" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingSessions.length}</p>
              </div>
              <Video className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{completedSessions.length}</p>
              </div>
              <Star className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{pendingSessions.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
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
      )}

      {/* Pending Sessions */}
      {pendingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Approval</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingSessions.map((session) => (
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
      )}

      {/* Recent Sessions */}
      {completedSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedSessions.slice(0, 5).map((session) => (
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
      )}

      {/* Empty State */}
      {sessions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start Your Surf Journey</h3>
            <p className="text-gray-600 mb-6">
              Book your first session with a certified surf mentor to improve your skills
            </p>
            <Button onClick={() => setShowBooking(true)}>
              Book Your First Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentDashboard;
