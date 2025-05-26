
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AlertPreference {
  id: string;
  spot_id: string;
  min_wave_height?: number;
  max_wave_height?: number;
  preferred_wind_direction?: string;
  max_wind_speed?: number;
  max_crowd_level?: number;
  notifications_enabled: boolean;
}

export const useAlertPreferences = (spotId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: alertPreferences = [], isLoading } = useQuery({
    queryKey: ['alert-preferences', user?.id, spotId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('alert_preferences')
        .select('*');

      if (spotId) {
        query = query.eq('spot_id', spotId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AlertPreference[];
    },
    enabled: !!user,
  });

  const saveAlertPreferenceMutation = useMutation({
    mutationFn: async (preferences: Omit<AlertPreference, 'id'>) => {
      if (!user) throw new Error('User not authenticated');

      // Check if preference already exists
      const { data: existing } = await supabase
        .from('alert_preferences')
        .select('id')
        .eq('user_id', user.id)
        .eq('spot_id', preferences.spot_id)
        .single();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('alert_preferences')
          .update({
            ...preferences,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('alert_preferences')
          .insert({
            user_id: user.id,
            ...preferences,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-preferences', user?.id] });
    },
  });

  const deleteAlertPreferenceMutation = useMutation({
    mutationFn: async (preferenceId: string) => {
      const { error } = await supabase
        .from('alert_preferences')
        .delete()
        .eq('id', preferenceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-preferences', user?.id] });
    },
  });

  return {
    alertPreferences,
    isLoading,
    saveAlertPreference: saveAlertPreferenceMutation.mutate,
    deleteAlertPreference: deleteAlertPreferenceMutation.mutate,
    isSaving: saveAlertPreferenceMutation.isPending,
    isDeleting: deleteAlertPreferenceMutation.isPending,
  };
};
