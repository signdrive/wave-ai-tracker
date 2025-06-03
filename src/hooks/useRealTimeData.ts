
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { apiService, SurfCondition, WeatherData, TideData, WavePoolSlot, SurfForecast } from '@/services/apiService';

// Hook for real-time surf conditions
export const useSurfConditions = (spotId: string, refetchInterval: number = 30000) => {
  return useQuery({
    queryKey: ['surf-conditions', spotId],
    queryFn: () => apiService.getSurfConditions(spotId),
    refetchInterval,
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

// Hook for real-time weather data
export const useWeatherData = (spotId: string, refetchInterval: number = 300000) => {
  return useQuery({
    queryKey: ['weather-data', spotId],
    queryFn: () => apiService.getWeatherData(spotId),
    refetchInterval,
    staleTime: 300000, // Consider data stale after 5 minutes
  });
};

// Hook for surf forecast data
export const useSurfForecast = (spotId: string, refetchInterval: number = 600000) => {
  return useQuery({
    queryKey: ['surf-forecast', spotId],
    queryFn: () => apiService.getSurfForecast(spotId),
    refetchInterval,
    staleTime: 600000, // Consider data stale after 10 minutes
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
    const setupWebSocket = () => {
      console.log('Setting up real-time data connection...');
      
      const interval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: ['surf-conditions'] });
        queryClient.invalidateQueries({ queryKey: ['weather-data'] });
        queryClient.invalidateQueries({ queryKey: ['surf-forecast'] });
      }, 30000);

      return () => clearInterval(interval);
    };

    return setupWebSocket();
  }, [queryClient]);
};
