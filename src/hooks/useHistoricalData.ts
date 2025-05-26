
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';

export const useHistoricalWaveData = (spotId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['historical-wave-data', spotId, days],
    queryFn: () => apiService.getHistoricalWaveData(spotId, days),
    staleTime: 300000, // 5 minutes
  });
};

export const useHistoricalWindData = (spotId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['historical-wind-data', spotId, days],
    queryFn: () => apiService.getHistoricalWindData(spotId, days),
    staleTime: 300000,
  });
};

export const useHistoricalCrowdData = (spotId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['historical-crowd-data', spotId, days],
    queryFn: () => apiService.getHistoricalCrowdData(spotId, days),
    staleTime: 300000,
  });
};

export const useHistoricalTemperatureData = (spotId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['historical-temperature-data', spotId, days],
    queryFn: () => apiService.getHistoricalTemperatureData(spotId, days),
    staleTime: 300000,
  });
};
