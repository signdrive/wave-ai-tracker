
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Calendar, Clock, Star, DollarSign } from 'lucide-react';

const MentorDashboard: React.FC = () => {
  const { user } = useAuth();

  // Fetch mentor sessions
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['mentor-sessions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentorship_sessions')
        .select(`
          *,
          student:profiles!mentorship_sessions_student_id_fkey(full_name, email)
        `)
        .eq('mentor_id', user?.id)
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Fetch mentor profile
  const { data: mentorProfile } = useQuery({
    queryKey: ['mentor-profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  const upcomingSessions = sessions.filter(s => 
    new Date(s.scheduled_at) > new Date() && s.status === 'confirmed'
  );
  const pendingSessions = sessions.filter(s => s.status === 'pending');
  const completedSessions = sessions.filter(s => s.status === 'completed');

  const totalEarnings = completedSessions.reduce((sum, session) => {
    return sum + (mentorProfile?.hourly_rate || 0) * (session.duration_minutes / 60);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
            <p className="text-gray-600">Welcome back, {mentorProfile?.full_name}</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {mentorProfile?.certification_level}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <Clock className="w-8 h-8 text-blue-500" />
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
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold">${totalEarnings.toFixed(0)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approval */}
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
                      <h3 className="font-semibold">
                        {session.student && typeof session.student === 'object' && 'full_name' in session.student 
                          ? session.student.full_name 
                          : 'Unknown Student'}
                      </h3>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {format(new Date(session.scheduled_at), 'PPP')} at{' '}
                      {format(new Date(session.scheduled_at), 'p')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Decline
                    </Button>
                    <Button size="sm">
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

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
                      <h3 className="font-semibold">
                        {session.student && typeof session.student === 'object' && 'full_name' in session.student 
                          ? session.student.full_name 
                          : 'Unknown Student'}
                      </h3>
                      <Badge variant="outline">Confirmed</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {format(new Date(session.scheduled_at), 'PPP')} at{' '}
                      {format(new Date(session.scheduled_at), 'p')}
                    </p>
                    <p className="text-sm text-gray-600">Duration: {session.duration_minutes} minutes</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Message Student
                    </Button>
                    <Button size="sm">
                      Start Session
                    </Button>
                  </div>
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
                      <h3 className="font-semibold">
                        {session.student && typeof session.student === 'object' && 'full_name' in session.student 
                          ? session.student.full_name 
                          : 'Unknown Student'}
                      </h3>
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
                    <p className="text-sm text-green-600">
                      Earned: ${((mentorProfile?.hourly_rate || 0) * (session.duration_minutes / 60)).toFixed(0)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {sessions.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Sessions Yet</h3>
              <p className="text-gray-600">
                Students will be able to book sessions with you once your profile is complete
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
