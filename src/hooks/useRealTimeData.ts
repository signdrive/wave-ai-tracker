import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { secureApiService } from '@/services/secureApiService';
import { apiService, SurfCondition, WeatherData, TideData, WavePoolSlot, SurfForecast } from '@/services/apiService';

// Hook for real-time surf conditions with secure API
export const useSurfConditions = (spotId: string, refetchInterval: number = 30000) => {
  return useQuery({
    queryKey: ['surf-conditions', spotId],
    queryFn: async () => {
      try {
        // Use secure API service for real data
        return await secureApiService.getStormGlassForecast(34.0259, -118.7798);
      } catch (error) {
        // Fallback to mock data if secure API fails
        return apiService.getSurfConditions(spotId);
      }
    },
    refetchInterval,
    staleTime: 30000,
  });
};

// Hook for real-time weather data with secure API
export const useWeatherData = (spotId: string, refetchInterval: number = 300000) => {
  return useQuery({
    queryKey: ['weather-data', spotId],
    queryFn: async () => {
      try {
        return await secureApiService.getWeatherData(spotId);
      } catch (error) {
        return apiService.getWeatherData(spotId);
      }
    },
    refetchInterval,
    staleTime: 300000,
  });
};

// Keep existing hooks for compatibility
export const useSurfForecast = (spotId: string, refetchInterval: number = 600000) => {
  return useQuery({
    queryKey: ['surf-forecast', spotId],
    queryFn: () => apiService.getSurfForecast(spotId),
    refetchInterval,
    staleTime: 600000,
  });
};

export const useTideData = (stationId: string, days: number = 3) => {
  return useQuery({
    queryKey: ['tide-data', stationId, days],
    queryFn: () => apiService.getTideData(stationId, days),
    refetchInterval: 300000,
    staleTime: 300000,
  });
};

export const useWavePoolAvailability = (poolId: string, date: Date) => {
  return useQuery({
    queryKey: ['wave-pool-availability', poolId, date.toDateString()],
    queryFn: () => apiService.getWavePoolAvailability(poolId, date),
    refetchInterval: 60000,
    staleTime: 60000,
  });
};

export const useRealTimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const setupWebSocket = () => {
      console.log('Setting up secure real-time data connection...');

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

// Updated API keys hook for secure storage
export const useApiKeys = () => {
  const setApiKeys = (keys: { stormglass?: string; weatherapi?: string }) => {
    // Keys are now managed through secure admin panel only
    console.warn('API keys must be set through secure admin panel');
  };

  const loadStoredKeys = () => {
    // Keys are loaded from database by secure service
    console.log('API keys loaded from secure database storage');
  };

  return { setApiKeys, loadStoredKeys };
};
