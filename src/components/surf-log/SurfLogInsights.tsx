
import React from 'react';
import PerformanceSnapshotView from '@/components/surf-log-insights/PerformanceSnapshotView';
import PreferredConditionsView from '@/components/surf-log-insights/PreferredConditionsView';

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
}

interface SurfLogInsightsProps {
  insightsData?: SurfLogInsightsData;
  isLoading: boolean;
  error: Error | undefined;
}

const SurfLogInsights: React.FC<SurfLogInsightsProps> = ({ insightsData, isLoading, error }) => {
  // For MVP, pick the preferred conditions for the most frequented spot or the first one available
  const preferredConditionsForDisplay = insightsData?.performance_snapshot?.most_frequented_spot_id
    ? insightsData.preferred_conditions_by_spot.find(
        (p) => p.spot_id === insightsData.performance_snapshot?.most_frequented_spot_id
      )
    : insightsData?.preferred_conditions_by_spot?.[0];

  return (
    <>
      {/* Performance Snapshot View */}
      <PerformanceSnapshotView
        snapshotData={insightsData?.performance_snapshot}
        isLoading={isLoading}
        error={error}
      />

      {/* Preferred Conditions View - for most frequented or first available spot */}
      {insightsData && (insightsData.preferred_conditions_by_spot.length > 0 || insightsData.performance_snapshot.total_sessions > 0) && (
         <PreferredConditionsView
          conditions={preferredConditionsForDisplay}
          isLoading={isLoading}
          error={error}
        />
      )}
    </>
  );
};

export default SurfLogInsights;
