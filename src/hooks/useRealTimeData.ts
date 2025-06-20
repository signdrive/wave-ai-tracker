
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
  crowdLevel: number;
  setsPerHour: number;
  lastUpdated: string;
}

interface TideDataPoint {
  time: string;
  height: number;
  type?: 'High' | 'Low';
}

interface SurfForecastDay {
  date: string;
  timestamp: number;
  waveHeight: {
    min: string;
    max: string;
    avg: string;
  };
  period: string;
  swellDirection: number;
  swellDirectionText: string;
  windSpeed: string;
  windDirection: string;
  rating: number;
  conditions: string;
  bestTimes: string[];
}

interface SurfForecast {
  spotId: string;
  spotName: string;
  generated: string;
  days: SurfForecastDay[];
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
    timestamp: now.toISOString(),
    crowdLevel: Math.floor(Math.random() * 10) + 1, // 1-10
    setsPerHour: Math.floor(Math.random() * 20) + 5, // 5-25
    lastUpdated: now.toISOString()
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

// Mock tide data generator
const generateMockTideData = (stationId: string): TideDataPoint[] => {
  const mockTides: TideDataPoint[] = [];
  for (let i = 0; i < 24; i++) {
    const time = new Date(Date.now() + i * 60 * 60 * 1000);
    mockTides.push({
      time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      height: Math.sin(i * Math.PI / 6) * 3 + 3, // Sine wave pattern
      type: i % 6 === 0 ? 'High' : i % 6 === 3 ? 'Low' : undefined
    });
  }
  return mockTides;
};

// Mock surf forecast generator
const generateMockSurfForecast = (spotId: string, spotName: string): SurfForecast => {
  const days: SurfForecastDay[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
    const waveHeight = 2 + Math.random() * 6;
    
    days.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      timestamp: date.getTime(),
      waveHeight: {
        min: (waveHeight - 1).toFixed(1),
        max: (waveHeight + 1).toFixed(1),
        avg: waveHeight.toFixed(1)
      },
      period: (10 + Math.random() * 8).toFixed(0),
      swellDirection: Math.random() * 360,
      swellDirectionText: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      windSpeed: (5 + Math.random() * 20).toFixed(0),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      rating: Math.ceil(Math.random() * 5),
      conditions: ['Sunny', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
      bestTimes: Math.random() > 0.5 ? ['6-9 AM', '4-6 PM'] : ['6-9 AM']
    });
  }
  
  return {
    spotId,
    spotName,
    generated: new Date().toISOString(),
    days
  };
};

export const useSurfConditions = (spotId: string) => {
  return useQuery({
    queryKey: ['surf-conditions', spotId],
    queryFn: async () => {
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
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      return generateMockWeatherData(spotId);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes
    enabled: !!spotId,
  });
};

export const useTideData = (stationId: string, days: number = 1) => {
  return useQuery({
    queryKey: ['tide-data', stationId, days],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 400)); // Simulate API delay
      return generateMockTideData(stationId);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 30 * 60 * 1000, // 30 minutes
    enabled: !!stationId,
  });
};

export const useSurfForecast = (spotId: string) => {
  return useQuery({
    queryKey: ['surf-forecast', spotId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay
      const spotName = `Spot ${spotId}`;
      return generateMockSurfForecast(spotId, spotName);
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 2 * 60 * 60 * 1000, // 2 hours
    enabled: !!spotId,
  });
};

export const useApiKeys = () => {
  const loadStoredKeys = () => {
    // Mock implementation
    console.log('Loading stored API keys...');
  };

  return { loadStoredKeys };
};

export const useRealTimeUpdates = () => {
  // Mock implementation for real-time updates
  console.log('Setting up real-time updates...');
};

// Re-export for backward compatibility
export { useSurfConditions as useRealTimeData };
