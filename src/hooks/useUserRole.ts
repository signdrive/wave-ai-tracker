
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type UserRole = 'admin' | 'mentor' | 'student';

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: userRole, isLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async (): Promise<UserRole | null> => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return 'student'; // Default fallback
      }

      return data?.role as UserRole;
    },
    enabled: !!user
  });

  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isMentor = (): boolean => hasRole('mentor');
  const isStudent = (): boolean => hasRole('student');

  return {
    userRole,
    isLoading,
    hasRole,
    isAdmin,
    isMentor,
    isStudent
  };
};
