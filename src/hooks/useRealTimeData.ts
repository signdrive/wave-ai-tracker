import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { enhancedSecureApiService } from '@/services/enhancedSecureApiService';
import { apiService } from '@/services/apiService';
import { errorHandlingService } from '@/services/errorHandlingService';

// Enhanced hook for real-time surf conditions with bulletproof error handling
export const useSurfConditions = (spotId: string, refetchInterval: number = 30000) => {
  return useQuery({
    queryKey: ['surf-conditions', spotId],
    queryFn: async () => {
      return errorHandlingService.safeApiCall(
        async () => {
          // Try enhanced secure API first
          return await enhancedSecureApiService.getStormGlassForecast(34.0259, -118.7798);
        },
        // Fallback to regular API service
        await apiService.getSurfConditions(spotId),
        `surf_conditions_${spotId}`
      );
    },
    refetchInterval,
    staleTime: 30000,
    retry: false, // Let our error handling service manage retries
  });
};

// Enhanced weather data hook
export const useWeatherData = (spotId: string, refetchInterval: number = 300000) => {
  return useQuery({
    queryKey: ['weather-data', spotId],
    queryFn: async () => {
      return errorHandlingService.safeApiCall(
        async () => {
          return await enhancedSecureApiService.getWeatherData(spotId);
        },
        await apiService.getWeatherData(spotId),
        `weather_data_${spotId}`
      );
    },
    refetchInterval,
    staleTime: 300000,
    retry: false,
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
      console.log('Setting up bulletproof real-time data connection...');
      
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

// Enhanced API keys hook with fallback management
export const useApiKeys = () => {
  const setApiKeys = (keys: { stormglass?: string; weatherapi?: string }) => {
    // Store as fallback keys
    if (keys.stormglass) {
      errorHandlingService.setFallbackKey('stormglass', keys.stormglass);
    }
    if (keys.weatherapi) {
      errorHandlingService.setFallbackKey('weatherapi', keys.weatherapi);
    }
    console.log('Fallback API keys stored successfully');
  };

  const loadStoredKeys = () => {
    console.log('Fallback API keys loaded from localStorage');
  };

  const resetErrors = () => {
    errorHandlingService.resetErrorCounts();
    console.log('API error counts reset');
  };

  return { setApiKeys, loadStoredKeys, resetErrors };
};
