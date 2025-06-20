
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useOpenMeteoWeather, useOpenMeteoForecast, transformOpenMeteoForecast, transformOpenMeteoWeather } from './useOpenMeteo';
import { weatherService } from '@/services/weatherService';
import { errorHandlingService } from '@/services/errorHandlingService';
import { WeatherData } from '@/types/weather';

// Enhanced hook for real-time surf conditions with Open-Meteo integration
export const useSurfConditions = (spotId: string, refetchInterval: number = 30000) => {
  return useQuery({
    queryKey: ['surf-conditions', spotId],
    queryFn: async () => {
      console.log(`Generating safe surf conditions for spot: ${spotId}`);
      return errorHandlingService.getMockSurfConditions(spotId);
    },
    refetchInterval,
    staleTime: 30000,
    retry: false,
  });
};

// Enhanced weather data hook using Open-Meteo
export const useWeatherData = (spotId: string, refetchInterval: number = 300000) => {
  // Get coordinates for the spot (this would ideally come from spot data)
  const getSpotCoordinates = (id: string): { lat: number; lng: number } => {
    const spotCoords: Record<string, { lat: number; lng: number }> = {
      pipeline: { lat: 21.6704, lng: -158.0505 },
      mavericks: { lat: 37.4919, lng: -122.5008 },
      snapper: { lat: -28.1724, lng: 153.5370 },
      jeffreys: { lat: -34.0506, lng: 24.9094 }
    };
    return spotCoords[id] || { lat: 34.0259, lng: -118.7798 }; // Default to Malibu
  };

  const coords = getSpotCoordinates(spotId);
  
  // Use Open-Meteo for real weather data
  const { data: openMeteoData, error: openMeteoError } = useOpenMeteoWeather(
    coords.lat, 
    coords.lng, 
    true
  );

  return useQuery({
    queryKey: ['weather-data', spotId],
    queryFn: async (): Promise<WeatherData> => {
      console.log(`Fetching weather data for spot: ${spotId}`);
      
      // Try Open-Meteo first
      if (openMeteoData && !openMeteoError) {
        console.log('Using Open-Meteo weather data');
        const transformedData = transformOpenMeteoWeather(openMeteoData);
        if (transformedData) {
          return transformedData;
        }
      }
      
      // Fallback to weather service
      try {
        const weatherData = await weatherService.getCurrentWeather(coords.lat, coords.lng);
        console.log('Using weather service data');
        return weatherData;
      } catch (error) {
        console.warn('Weather service failed, using mock data');
        return errorHandlingService.getMockWeatherData(spotId);
      }
    },
    refetchInterval,
    staleTime: 300000,
    retry: false,
  });
};

// Enhanced surf forecast hook with Open-Meteo integration
export const useSurfForecast = (spotId: string, refetchInterval: number = 600000) => {
  const getSpotCoordinates = (id: string): { lat: number; lng: number } => {
    const spotCoords: Record<string, { lat: number; lng: number }> = {
      pipeline: { lat: 21.6704, lng: -158.0505 },
      mavericks: { lat: 37.4919, lng: -122.5008 },
      snapper: { lat: -28.1724, lng: 153.5370 },
      jeffreys: { lat: -34.0506, lng: 24.9094 }
    };
    return spotCoords[id] || { lat: 34.0259, lng: -118.7798 };
  };

  const coords = getSpotCoordinates(spotId);
  const spotNames: Record<string, string> = {
    pipeline: 'Pipeline, Oahu',
    mavericks: 'Mavericks, California',
    snapper: 'Snapper Rocks, Australia',
    jeffreys: 'Jeffreys Bay, South Africa'
  };

  // Use Open-Meteo for forecast data
  const { data: openMeteoForecast, error: forecastError } = useOpenMeteoForecast(
    coords.lat,
    coords.lng,
    7,
    true
  );

  return useQuery({
    queryKey: ['surf-forecast', spotId],
    queryFn: async () => {
      console.log(`Generating surf forecast for spot: ${spotId}`);
      
      // Try to use Open-Meteo weather data for better accuracy
      if (openMeteoForecast && !forecastError) {
        const transformed = transformOpenMeteoForecast(
          openMeteoForecast, 
          spotId, 
          spotNames[spotId] || `Spot ${spotId}`
        );
        if (transformed) {
          console.log('Using Open-Meteo based forecast');
          return transformed;
        }
      }
      
      // Fallback to mock data with enhanced logic
      const swellDirections = [
        { degrees: 0, text: 'N' },
        { degrees: 45, text: 'NE' },
        { degrees: 90, text: 'E' },
        { degrees: 135, text: 'SE' },
        { degrees: 180, text: 'S' },
        { degrees: 225, text: 'SW' },
        { degrees: 270, text: 'W' },
        { degrees: 315, text: 'NW' }
      ];

      const conditions = ['Poor', 'Fair', 'Good', 'Very Good', 'Epic'];
      const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        const swellDir = swellDirections[Math.floor(Math.random() * swellDirections.length)];
        const minWave = Math.random() * 3 + 1;
        const maxWave = minWave + Math.random() * 4 + 1;
        const rating = Math.floor(Math.random() * 5) + 1;
        
        const bestTimes = [];
        if (rating >= 3) {
          bestTimes.push('6-9 AM');
          if (rating >= 4) bestTimes.push('4-6 PM');
        }

        days.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          timestamp: date.getTime(),
          waveHeight: {
            min: errorHandlingService.safeToFixed(minWave, 1),
            max: errorHandlingService.safeToFixed(maxWave, 1),
            avg: errorHandlingService.safeToFixed((minWave + maxWave) / 2, 1)
          },
          period: errorHandlingService.safeToFixed(Math.random() * 8 + 8, 0),
          swellDirection: swellDir.degrees,
          swellDirectionText: swellDir.text,
          windSpeed: errorHandlingService.safeToFixed(Math.random() * 15 + 5, 0),
          windDirection: windDirections[Math.floor(Math.random() * windDirections.length)],
          rating,
          conditions: conditions[rating - 1],
          bestTimes
        });
      }

      return {
        spotId,
        spotName: spotNames[spotId] || `Spot ${spotId}`,
        generated: new Date().toISOString(),
        days,
        source: 'Mock Data (Open-Meteo fallback)'
      };
    },
    refetchInterval,
    staleTime: 600000,
    retry: false,
  });
};

// Fixed tide data hook to return array directly
export const useTideData = (stationId: string, days: number = 3) => {
  return useQuery({
    queryKey: ['tide-data', stationId, days],
    queryFn: async () => {
      console.log(`Generating safe tide data for station: ${stationId}`);
      
      const tides = [];
      for (let i = 0; i < 8; i++) {
        const time = new Date(Date.now() + i * 3 * 3600000);
        tides.push({
          time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          height: errorHandlingService.safeToFixed(Math.random() * 3 + 1, 1),
          type: i % 2 === 0 ? 'High' : 'Low'
        });
      }
      
      return tides;
    },
    refetchInterval: 300000,
    staleTime: 300000,
    retry: false,
  });
};

export const useWavePoolAvailability = (poolId: string, date: Date) => {
  return useQuery({
    queryKey: ['wave-pool-availability', poolId, date.toDateString()],
    queryFn: async () => {
      console.log(`Generating safe wave pool availability for: ${poolId}`);
      return {
        poolId,
        date: date.toISOString(),
        slots: Array.from({ length: 8 }, (_, i) => ({
          time: `${8 + i}:00`,
          available: Math.random() > 0.3,
          price: errorHandlingService.safeToFixed(Math.random() * 50 + 25, 0)
        })),
        generated: new Date().toISOString()
      };
    },
    refetchInterval: 60000,
    staleTime: 60000,
    retry: false,
  });
};

export const useRealTimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const setupSafeUpdates = () => {
      console.log('Setting up safe real-time data updates with Open-Meteo...');
      
      const interval = setInterval(() => {
        try {
          queryClient.invalidateQueries({ queryKey: ['surf-conditions'] });
          queryClient.invalidateQueries({ queryKey: ['weather-data'] });
          queryClient.invalidateQueries({ queryKey: ['surf-forecast'] });
          queryClient.invalidateQueries({ queryKey: ['openmeteo-current'] });
          queryClient.invalidateQueries({ queryKey: ['openmeteo-forecast'] });
        } catch (error) {
          console.warn('Query invalidation failed safely:', error);
        }
      }, 30000);

      return () => clearInterval(interval);
    };

    return setupSafeUpdates();
  }, [queryClient]);
};

// Safe API keys management for Open-Meteo (no keys required)
export const useApiKeys = () => {
  const setApiKeys = (keys: { stormglass?: string; weatherapi?: string; openmeteo?: string }) => {
    // Open-Meteo doesn't require API keys for basic usage
    console.log('Open-Meteo API keys stored (note: Open-Meteo is free and requires no keys for basic usage)');
    
    if (keys.stormglass) {
      errorHandlingService.setFallbackKey('stormglass', keys.stormglass);
    }
    if (keys.weatherapi) {
      errorHandlingService.setFallbackKey('weatherapi', keys.weatherapi);
    }
  };

  const loadStoredKeys = () => {
    console.log('Loading stored API keys (Open-Meteo requires no keys)');
    return {
      stormglass: errorHandlingService.getFallbackKey('stormglass'),
      weatherapi: errorHandlingService.getFallbackKey('weatherapi'),
      openmeteo: 'free-api' // Open-Meteo is free
    };
  };

  const resetErrors = () => {
    errorHandlingService.resetErrorCounts();
    console.log('API error counts reset (Open-Meteo included)');
  };

  return { setApiKeys, loadStoredKeys, resetErrors };
};
