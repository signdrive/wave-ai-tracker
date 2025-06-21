
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import PremiumGate from '@/components/PremiumGate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Waves, MapPin, TrendingUp, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client'; // Assuming supabase client

// Import new components
import SessionLogger from '@/components/SessionLogger'; // Assuming SessionLogger is in components root
import PerformanceSnapshotView from '@/components/surf-log-insights/PerformanceSnapshotView';
import PreferredConditionsView from '@/components/surf-log-insights/PreferredConditionsView';

// Define types for the fetched data (mirroring Edge Function return types)
interface ConditionSnapshotData {
  waveHeight_ft?: number | null;
  wavePeriod_s?: number | null;
  waveDirection_cardinal?: string | null;
  windSpeed_mph_range?: string | null;
  windDirection_cardinal?: string | null;
  // Add other fields if they are part of the snapshot and needed for display
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
  raw_sessions_for_debug?: SurfSessionEntry[]; // Use this for the sessions list
}

const fetchSurfLogInsights = async (): Promise<SurfLogInsightsData> => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error("User not authenticated.");

  const { data, error } = await supabase.functions.invoke('get-surf-log-insights');
  if (error) throw error;
  return data;
};


const SurfLogPage = () => {
  const queryClient = useQueryClient();

  const {
    data: insightsData,
    isLoading: isLoadingInsights,
    error: insightsError,
    refetch: refetchInsights
  } = useQuery<SurfLogInsightsData, Error>({
    queryKey: ['surfLogInsights'],
    queryFn: fetchSurfLogInsights,
    staleTime: 5 * 60 * 1000 // 5 minutes stale time
  });

  const sessions = insightsData?.raw_sessions_for_debug || [];

  // For MVP, pick the preferred conditions for the most frequented spot or the first one available
  const preferredConditionsForDisplay = insightsData?.performance_snapshot?.most_frequented_spot_id
    ? insightsData.preferred_conditions_by_spot.find(
        (p) => p.spot_id === insightsData.performance_snapshot?.most_frequented_spot_id
      )
    : insightsData?.preferred_conditions_by_spot?.[0];


  const formatDurationFromMinutes = (minutes: number | null | undefined) => {
    if (minutes == null || minutes <= 0) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0 && remainingMinutes > 0) return `${hours}h ${remainingMinutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${remainingMinutes}m`;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <NavBar />
      <main className="pt-16">
        <PremiumGate> {/* Assuming PremiumGate handles its own auth/state */}
          <div className="container mx-auto px-4 py-8 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-ocean-dark mb-2">My Surf Log</h1>
              <p className="text-gray-600 dark:text-gray-400">Track your surf sessions and analyze your progression.</p>
            </div>

            {/* Session Logger Form */}
            <SessionLogger onSessionSaved={refetchInsights} />

            {/* Performance Snapshot View */}
            <PerformanceSnapshotView
              snapshotData={insightsData?.performance_snapshot}
              isLoading={isLoadingInsights}
              error={insightsError as Error | undefined} // Cast for type compatibility
            />

            {/* Preferred Conditions View - for most frequented or first available spot */}
            {insightsData && (insightsData.preferred_conditions_by_spot.length > 0 || insightsData.performance_snapshot.total_sessions > 0) && (
               <PreferredConditionsView
                conditions={preferredConditionsForDisplay}
                isLoading={isLoadingInsights}
                error={insightsError as Error | undefined}
              />
            )}


            {/* Recent Sessions List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingInsights && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-ocean" />
                    <p className="ml-2">Loading sessions...</p>
                  </div>
                )}
                {insightsError && (
                  <div className="flex items-center justify-center py-8 text-red-500">
                    <AlertTriangle className="w-8 h-8 mr-2" />
                    <p>Error loading sessions: {insightsError.message}</p>
                  </div>
                )}
                {!isLoadingInsights && !insightsError && sessions.length === 0 && (
                  <p className="text-center py-8 text-gray-500">No surf sessions logged yet. Use the form above to add your first session!</p>
                )}
                {sessions.length > 0 && (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{session.spot_name || session.spot_id}</h3>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(session.session_date).toLocaleDateString()}
                              <Clock className="w-4 h-4 ml-3 mr-1" />
                              {formatDurationFromMinutes(session.duration_minutes)}
                            </div>
                          </div>
                          {session.rating && (
                            <Badge className={`${
                              session.rating >= 4 ? 'bg-green-500' :
                              session.rating >= 3 ? 'bg-blue-500' :
                              'bg-yellow-500' // Rating is 1-5
                            }`}>
                              {session.rating}/5 stars
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center">
                            <Waves className="w-4 h-4 mr-2 text-blue-500" />
                            <div>
                              <div className="font-medium">{session.wave_count ?? 'N/A'} waves</div>
                              <div className="text-gray-600 dark:text-gray-400">Caught</div>
                            </div>
                          </div>

                          {/* Conditions Snapshot display - simplified for MVP */}
                          {session.conditions_snapshot?.waveHeight_ft && (
                            <div className="flex items-center">
                              <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                              <div>
                                <div className="font-medium">{session.conditions_snapshot.waveHeight_ft.toFixed(1)} ft</div>
                                <div className="text-gray-600 dark:text-gray-400">Wave Height</div>
                              </div>
                            </div>
                          )}
                          {session.conditions_snapshot?.windSpeed_mph_range && (
                             <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-purple-500" /> {/* Using MapPin as generic icon */}
                              <div>
                                <div className="font-medium">{session.conditions_snapshot.windSpeed_mph_range}</div>
                                <div className="text-gray-600 dark:text-gray-400">Wind</div>
                              </div>
                            </div>
                          )}
                          {session.notes && (
                            <div className="col-span-2 md:col-span-4 mt-2">
                               <p className="text-xs text-gray-500 dark:text-gray-400"><strong>Notes:</strong> {session.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </PremiumGate>
      </main>
      <Footer />
    </div>
  );
};

export default SurfLogPage;
