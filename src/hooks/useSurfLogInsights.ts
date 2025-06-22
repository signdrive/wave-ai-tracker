
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ConditionSnapshotData {
  waveHeight_ft?: number | null;
  wavePeriod_s?: number | null;
  waveDirection_cardinal?: string | null;
  windSpeed_mph_range?: string | null;
  windDirection_cardinal?: string | null;
}

interface SurfSessionEntry {
  id: string;
  session_date: string;
  spot_id: string;
  spot_name?: string | null;
  rating?: number | null;
  duration_minutes?: number | null;
  wave_count?: number | null;
  notes?: string | null;
  conditions_snapshot?: ConditionSnapshotData | null;
}

interface PerformanceSnapshotData {
  total_sessions: number;
  average_rating: number | null;
  most_frequented_spot_id?: string | null;
  most_frequented_spot_name?: string | null;
  total_duration_minutes: number;
  total_wave_count: number;
}

interface PreferredConditionSpotData {
  spot_id: string;
  spot_name?: string | null;
  session_count: number;
  avg_waveHeight_ft?: number | null;
  mode_waveDirection_cardinal?: string | null;
  mode_windSpeed_mph_range?: string | null;
  mode_windDirection_cardinal?: string | null;
}

interface SurfLogInsightsData {
  performance_snapshot: PerformanceSnapshotData;
  preferred_conditions_by_spot: PreferredConditionSpotData[];
  raw_sessions_for_debug?: SurfSessionEntry[];
}

const fetchSurfLogInsights = async (): Promise<SurfLogInsightsData> => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error("User not authenticated.");

  const { data, error } = await supabase.functions.invoke('get-surf-log-insights');
  if (error) throw error;
  return data;
};

export const useSurfLogInsights = () => {
  return useQuery({
    queryKey: ['surf-log-insights'],
    queryFn: fetchSurfLogInsights,
  });
};

export type { SurfLogInsightsData, SurfSessionEntry };
