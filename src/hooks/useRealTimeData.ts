
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { apiService, SurfCondition, TideData, WavePoolSlot } from '@/services/apiService';

// Hook for real-time surf conditions
export const useSurfConditions = (spotId: string, refetchInterval: number = 30000) => {
  return useQuery({
    queryKey: ['surf-conditions', spotId],
    queryFn: () => apiService.getSurfConditions(spotId),
    refetchInterval,
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

// Hook for real-time tide data
export const useTideData = (stationId: string, days: number = 3) => {
  return useQuery({
    queryKey: ['tide-data', stationId, days],
    queryFn: () => apiService.getTideData(stationId, days),
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 300000,
  });
};

// Hook for wave pool availability
export const useWavePoolAvailability = (poolId: string, date: Date) => {
  return useQuery({
    queryKey: ['wave-pool-availability', poolId, date.toDateString()],
    queryFn: () => apiService.getWavePoolAvailability(poolId, date),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 60000,
  });
};

// Hook for setting up real-time updates
export const useRealTimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Set up WebSocket connection for real-time updates
    const setupWebSocket = () => {
      // This would connect to a WebSocket server for live updates
      console.log('Setting up real-time data connection...');
      
      // Simulate periodic updates
      const interval = setInterval(() => {
        // Invalidate queries to trigger refetch
        queryClient.invalidateQueries({ queryKey: ['surf-conditions'] });
      }, 30000);

      return () => clearInterval(interval);
    };

    return setupWebSocket();
  }, [queryClient]);
};

// Hook for API key management
export const useApiKeys = () => {
  const setApiKeys = (keys: { surfline?: string; tides?: string }) => {
    apiService.setApiKeys(keys);
    // Store keys in localStorage for persistence
    if (keys.surfline) localStorage.setItem('surfline-api-key', keys.surfline);
    if (keys.tides) localStorage.setItem('tides-api-key', keys.tides);
  };

  const loadStoredKeys = () => {
    const surflineKey = localStorage.getItem('surfline-api-key');
    const tidesKey = localStorage.getItem('tides-api-key');
    
    if (surflineKey || tidesKey) {
      apiService.setApiKeys({
        surfline: surflineKey || undefined,
        tides: tidesKey || undefined
      });
    }
  };

  return { setApiKeys, loadStoredKeys };
};
