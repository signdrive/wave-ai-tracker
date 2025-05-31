
import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen } from 'lucide-react';
import BookingFlow from '../booking/BookingFlow';
import StudentStats from './StudentStats';
import UpcomingSessions from './UpcomingSessions';
import PendingSessions from './PendingSessions';
import RecentSessions from './RecentSessions';
import EmptyState from './EmptyState';

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
          mentor:profiles(full_name, email)
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
      <StudentStats
        totalSessions={sessions.length}
        upcomingSessions={upcomingSessions.length}
        completedSessions={completedSessions.length}
        pendingSessions={pendingSessions.length}
      />

      {/* Upcoming Sessions */}
      <UpcomingSessions sessions={upcomingSessions} />

      {/* Pending Sessions */}
      <PendingSessions sessions={pendingSessions} />

      {/* Recent Sessions */}
      <RecentSessions sessions={completedSessions} />

      {/* Empty State */}
      {sessions.length === 0 && (
        <EmptyState onBookSession={() => setShowBooking(true)} />
      )}
    </div>
  );
};

export default StudentDashboard;
