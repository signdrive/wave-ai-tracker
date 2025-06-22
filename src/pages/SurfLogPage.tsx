
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import PremiumGate from '@/components/PremiumGate';
import SessionLogger from '@/components/SessionLogger';
import SurfLogHeader from '@/components/surf-log/SurfLogHeader';
import SurfLogInsights from '@/components/surf-log/SurfLogInsights';
import RecentSessionsList from '@/components/surf-log/RecentSessionsList';
import { useSurfLogInsights } from '@/hooks/useSurfLogInsights';

const SurfLogPage = () => {
  const queryClient = useQueryClient();

  const {
    data: insightsData,
    isLoading: isLoadingInsights,
    error: insightsError,
    refetch: refetchInsights
  } = useSurfLogInsights();

  const sessions = insightsData?.raw_sessions_for_debug || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <main className="pt-16">
        <PremiumGate>
          <div className="container mx-auto px-4 py-8 space-y-8">
            <SurfLogHeader />

            {/* Session Logger Form */}
            <SessionLogger onSessionSaved={refetchInsights} />

            {/* Surf Log Insights */}
            <SurfLogInsights 
              insightsData={insightsData}
              isLoading={isLoadingInsights}
              error={insightsError as Error | undefined}
            />

            {/* Recent Sessions List */}
            <RecentSessionsList 
              sessions={sessions}
              isLoading={isLoadingInsights}
              error={insightsError as Error | null}
            />
          </div>
        </PremiumGate>
      </main>
    </div>
  );
};

export default SurfLogPage;
