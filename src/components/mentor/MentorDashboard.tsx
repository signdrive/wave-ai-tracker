
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, DollarSign, Users, Video, Star, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const MentorDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['mentor-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('mentorship_sessions')
        .select(`
          *,
          student:profiles!mentorship_sessions_student_id_fkey(full_name, email)
        `)
        .eq('mentor_id', user.id)
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const { data: earnings = 0 } = useQuery({
    queryKey: ['mentor-earnings', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('hourly_rate')
        .eq('id', user.id)
        .single();

      const completedSessions = sessions.filter(s => s.status === 'completed');
      const totalHours = completedSessions.reduce((sum, session) => 
        sum + (session.duration_minutes / 60), 0);
      
      return totalHours * (profile?.hourly_rate || 0);
    },
    enabled: !!user && sessions.length > 0
  });

  const upcomingSessions = sessions.filter(s => 
    s.status === 'confirmed' && new Date(s.scheduled_at) > new Date()
  );

  const recentSessions = sessions.filter(s => s.status === 'completed').slice(0, 5);

  const averageRating = sessions
    .filter(s => s.rating)
    .reduce((sum, s, _, arr) => sum + s.rating / arr.length, 0);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
              <Users className="w-8 h-8 text-ocean" />
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
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Earnings</p>
                <p className="text-2xl font-bold">${earnings.toFixed(0)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="recent">Recent Sessions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming sessions</p>
                <p className="text-sm text-gray-500">Sessions will appear here when students book with you</p>
              </CardContent>
            </Card>
          ) : (
            upcomingSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{session.student?.full_name}</h3>
                        <Badge variant="outline">{session.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {format(new Date(session.scheduled_at), 'PPP')} at{' '}
                        {format(new Date(session.scheduled_at), 'p')}
                      </p>
                      <p className="text-sm text-gray-600">Duration: {session.duration_minutes} minutes</p>
                      {session.spot_id && (
                        <p className="text-sm text-gray-600">Spot: {session.spot_id}</p>
                      )}
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
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {recentSessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{session.student?.full_name}</h3>
                      <Badge variant="secondary">Completed</Badge>
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
                    {session.student_feedback && (
                      <p className="text-sm text-gray-700 italic">"{session.student_feedback}"</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{sessions.length}</p>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{averageRating.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {sessions.filter(s => s.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-600">Completed Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorDashboard;
