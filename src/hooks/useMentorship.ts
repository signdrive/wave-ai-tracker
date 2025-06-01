
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
      
      return data;
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
      
      return data || [];
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
      
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: Partial<MentorshipSession>) => {
      const { data, error } = await supabase
        .from('mentorship_sessions')
        .insert([sessionData])
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
      const { data, error } = await supabase
        .from('mentorship_sessions')
        .update(updates)
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
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
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
