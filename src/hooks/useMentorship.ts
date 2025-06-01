
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile, MentorshipSession, MentorAvailability, UserRole } from '@/types/mentorship';
import { useToast } from '@/hooks/use-toast';

export const useMentorship = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user role
  const { data: userRole, isLoading: roleLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async (): Promise<UserRole | null> => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase.rpc('get_user_role', {
        _user_id: user.id
      });
      
      if (error) {
        console.error('Error fetching user role:', error);
        return 'student'; // Default to student
      }
      
      return data || 'student';
    },
    enabled: !!user?.id,
  });

  // Get user profile with mentorship data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      // Transform the database result to match our interface
      return {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        user_type: data.user_type as UserRole,
        certification_level: data.certification_level,
        skill_level: data.skill_level,
        years_experience: data.years_experience,
        hourly_rate: data.hourly_rate,
        bio: data.bio,
        timezone: data.timezone,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    },
    enabled: !!user?.id,
  });

  // Get mentors (for students)
  const { data: mentors = [], isLoading: mentorsLoading } = useQuery({
    queryKey: ['mentors'],
    queryFn: async (): Promise<UserProfile[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'mentor');
      
      if (error) {
        console.error('Error fetching mentors:', error);
        return [];
      }
      
      // Transform the database results to match our interface
      return (data || []).map(item => ({
        id: item.id,
        email: item.email,
        full_name: item.full_name,
        user_type: item.user_type as UserRole,
        certification_level: item.certification_level,
        skill_level: item.skill_level,
        years_experience: item.years_experience,
        hourly_rate: item.hourly_rate,
        bio: item.bio,
        timezone: item.timezone,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    },
  });

  // Get user's sessions
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['mentorship-sessions', user?.id],
    queryFn: async (): Promise<MentorshipSession[]> => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('mentorship_sessions')
        .select('*')
        .or(`mentor_id.eq.${user.id},student_id.eq.${user.id}`)
        .order('scheduled_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching sessions:', error);
        return [];
      }
      
      // Transform the database results to match our interface
      return (data || []).map(item => ({
        id: item.id,
        mentor_id: item.mentor_id,
        student_id: item.student_id,
        spot_id: item.spot_id,
        scheduled_at: item.scheduled_at,
        duration_minutes: item.duration_minutes,
        status: item.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
        session_notes: item.session_notes,
        mentor_feedback: item.mentor_feedback,
        student_feedback: item.student_feedback,
        rating: item.rating,
        wave_conditions: item.wave_conditions,
        video_call_url: item.video_call_url,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    },
    enabled: !!user?.id,
  });

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: Partial<MentorshipSession>) => {
      // Transform our interface to database format
      const dbData = {
        mentor_id: sessionData.mentor_id,
        student_id: sessionData.student_id,
        spot_id: sessionData.spot_id!,
        scheduled_at: sessionData.scheduled_at!,
        duration_minutes: sessionData.duration_minutes,
        status: sessionData.status,
        session_notes: sessionData.session_notes,
        wave_conditions: sessionData.wave_conditions,
        video_call_url: sessionData.video_call_url,
      };

      const { data, error } = await supabase
        .from('mentorship_sessions')
        .insert([dbData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship-sessions'] });
      toast({
        title: "Session Created",
        description: "Your mentorship session has been successfully booked.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
      console.error('Session creation error:', error);
    },
  });

  // Update session mutation
  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MentorshipSession> }) => {
      // Transform our interface to database format
      const dbUpdates = {
        status: updates.status,
        session_notes: updates.session_notes,
        mentor_feedback: updates.mentor_feedback,
        student_feedback: updates.student_feedback,
        rating: updates.rating,
        wave_conditions: updates.wave_conditions,
        video_call_url: updates.video_call_url,
      };

      const { data, error } = await supabase
        .from('mentorship_sessions')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship-sessions'] });
      toast({
        title: "Session Updated",
        description: "Session details have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update session. Please try again.",
        variant: "destructive",
      });
      console.error('Session update error:', error);
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user?.id) throw new Error('No user ID');
      
      // Transform our interface to database format
      const dbUpdates = {
        full_name: updates.full_name,
        user_type: updates.user_type,
        certification_level: updates.certification_level,
        skill_level: updates.skill_level,
        years_experience: updates.years_experience,
        hourly_rate: updates.hourly_rate,
        bio: updates.bio,
        timezone: updates.timezone,
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error('Profile update error:', error);
    },
  });

  return {
    // Data
    userRole,
    profile,
    mentors,
    sessions,
    
    // Loading states
    roleLoading,
    profileLoading,
    mentorsLoading,
    sessionsLoading,
    
    // Mutations
    createSession: createSessionMutation.mutate,
    updateSession: updateSessionMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    
    // Loading states for mutations
    isCreatingSession: createSessionMutation.isPending,
    isUpdatingSession: updateSessionMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
};
