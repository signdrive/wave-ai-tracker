
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AppSetting {
  id: number;
  feature_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAppSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async (): Promise<AppSetting[]> => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .order('feature_name');

      if (error) throw error;
      return data || [];
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ featureName, isActive }: { featureName: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('app_settings')
        .update({ is_active: isActive })
        .eq('feature_name', featureName);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
      toast({
        title: "Setting Updated",
        description: "Feature setting has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update feature setting.",
        variant: "destructive",
      });
    }
  });

  const toggleFeature = (featureName: string, isActive: boolean) => {
    updateSettingMutation.mutate({ featureName, isActive });
  };

  const isFeatureActive = (featureName: string): boolean => {
    const setting = settings.find(s => s.feature_name === featureName);
    return setting?.is_active || false;
  };

  return {
    settings,
    isLoading,
    toggleFeature,
    isFeatureActive,
    isUpdating: updateSettingMutation.isPending
  };
};
