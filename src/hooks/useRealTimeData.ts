
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WeatherData } from '@/types/weather';

interface SurfConditions {
  spotId: string;
  waveHeight: number;
  period: number;
  direction: string;
  windSpeed: number;
  windDirection: string;
  temperature: number;
  tideHeight: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  timestamp: string;
}

// Mock data generator for surf conditions
const generateMockSurfConditions = (spotId: string): SurfConditions => {
  const now = new Date();
  const qualities: Array<'poor' | 'fair' | 'good' | 'excellent'> = ['poor', 'fair', 'good', 'excellent'];
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  
  return {
    spotId,
    waveHeight: 1 + Math.random() * 8, // 1-9 feet
    period: 8 + Math.random() * 12, // 8-20 seconds
    direction: directions[Math.floor(Math.random() * directions.length)],
    windSpeed: Math.random() * 25, // 0-25 mph
    windDirection: directions[Math.floor(Math.random() * directions.length)],
    temperature: 60 + Math.random() * 40, // 60-100°F
    tideHeight: -2 + Math.random() * 4, // -2 to 2 feet
    quality: qualities[Math.floor(Math.random() * qualities.length)],
    timestamp: now.toISOString()
  };
};

// Mock data generator for weather data
const generateMockWeatherData = (spotId: string): WeatherData => {
  const now = new Date();
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Overcast', 'Light Rain', 'Rain'];
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  
  const temp = 60 + Math.random() * 40; // 60-100°F
  
  return {
    temperature: temp,
    feelsLike: temp + (Math.random() - 0.5) * 10, // ±5°F variation
    humidity: 30 + Math.random() * 60, // 30-90%
    pressure: 29.5 + Math.random() * 2, // 29.5-31.5 inHg
    visibility: 5 + Math.random() * 10, // 5-15 miles
    windSpeed: Math.random() * 25, // 0-25 mph
    windDirection: directions[Math.floor(Math.random() * directions.length)],
    windGust: Math.random() * 35, // 0-35 mph
    weatherCondition: conditions[Math.floor(Math.random() * conditions.length)],
    weatherIcon: 'sun',
    uvIndex: Math.floor(Math.random() * 11), // 0-10
    timestamp: now.toISOString(),
    source: 'Mock Data'
  };
};

export const useSurfConditions = (spotId: string) => {
  return useQuery({
    queryKey: ['surf-conditions', spotId],
    queryFn: async () => {
      // For now, return mock data
      // In the future, this could call a Supabase edge function or external API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      return generateMockSurfConditions(spotId);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    enabled: !!spotId,
  });
};

export const useWeatherData = (spotId: string) => {
  return useQuery({
    queryKey: ['weather-data', spotId],
    queryFn: async () => {
      // For now, return mock data
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      return generateMockWeatherData(spotId);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes
    enabled: !!spotId,
  });
};

// Re-export for backward compatibility
export { useSurfConditions as useRealTimeData };
