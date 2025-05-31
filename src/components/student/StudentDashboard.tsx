
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import StudentStats from './StudentStats';
import UpcomingSessions from './UpcomingSessions';
import PendingSessions from './PendingSessions';
import RecentSessions from './RecentSessions';
import EmptyState from './EmptyState';

interface Session {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  rating?: number;
  mentor_feedback?: string;
  video_call_url?: string;
  mentor?: {
    full_name: string;
  } | null;
}

interface StudentDashboardProps {
  onBookSession: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onBookSession }) => {
  const { user } = useAuth();

  // Fetch student sessions
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['student-sessions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentorship_sessions')
        .select(`
          *,
          mentor:profiles!mentorship_sessions_mentor_id_fkey(full_name, email)
        `)
        .eq('student_id', user?.id)
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      return data || [];
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

  // Process sessions with proper typing and null safety
  const processedSessions: Session[] = sessions.map(session => {
    // Extract mentor data safely - use early return pattern
    const mentorData = session.mentor;
    
    if (!mentorData || typeof mentorData !== 'object' || !('full_name' in mentorData) || typeof mentorData.full_name !== 'string') {
      return {
        ...session,
        mentor: null
      };
    }

    return {
      ...session,
      mentor: { full_name: mentorData.full_name }
    };
  });

  const totalSessions = processedSessions.length;
  const upcomingSessions = processedSessions.filter(s => 
    new Date(s.scheduled_at) > new Date() && s.status === 'confirmed'
  );
  const pendingSessions = processedSessions.filter(s => s.status === 'pending');
  const completedSessions = processedSessions.filter(s => s.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-gray-600">Track your surf mentorship progress</p>
          </div>
        </div>

        <StudentStats
          totalSessions={totalSessions}
          upcomingSessions={upcomingSessions.length}
          completedSessions={completedSessions.length}
          pendingSessions={pendingSessions.length}
        />

        <PendingSessions sessions={pendingSessions} />
        <UpcomingSessions sessions={upcomingSessions} />
        <RecentSessions sessions={completedSessions} />

        {totalSessions === 0 && (
          <EmptyState onBookSession={onBookSession} />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
