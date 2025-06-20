
import { useQuery } from '@tanstack/react-query';
import { openMeteoService } from '@/services/openMeteoService';
import { OpenMeteoResponse } from '@/types/openMeteo';
import { WeatherData } from '@/types/weather';

/**
 * Hook for fetching current weather from Open-Meteo
 * Implements caching strategy respecting API rate limits
 */
export const useOpenMeteoWeather = (lat: number, lng: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['openmeteo-current', lat, lng],
    queryFn: () => openMeteoService.getCurrentWeather(lat, lng),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 15 * 60 * 1000, // Refresh every 15 minutes
    enabled: enabled && !isNaN(lat) && !isNaN(lng),
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx), only on network/server errors
      if (error && typeof error === 'object' && 'message' in error && 
          typeof error.message === 'string' && error.message.includes('Open-Meteo API error')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Hook for fetching detailed forecast from Open-Meteo
 */
export const useOpenMeteoForecast = (
  lat: number, 
  lng: number, 
  days: number = 7, 
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['openmeteo-forecast', lat, lng, days],
    queryFn: () => openMeteoService.getForecast(lat, lng, days),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 60 * 60 * 1000, // Refresh every hour
    enabled: enabled && !isNaN(lat) && !isNaN(lng),
    retry: 1,
  });
};

/**
 * Hook for fetching historical weather data
 */
export const useOpenMeteoHistorical = (
  lat: number,
  lng: number,
  startDate: string,
  endDate: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['openmeteo-historical', lat, lng, startDate, endDate],
    queryFn: () => openMeteoService.getHistoricalWeather(lat, lng, startDate, endDate),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (historical data doesn't change)
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    enabled: enabled && !isNaN(lat) && !isNaN(lng) && startDate && endDate,
    retry: 1,
  });
};

/**
 * Transform Open-Meteo response to match existing weather data interface
 */
export const transformOpenMeteoWeather = (data: OpenMeteoResponse): WeatherData | null => {
  const current = data.current_weather;
  if (!current) return null;

  const weatherInfo = openMeteoService.getWeatherDescription(current.weathercode);
  
  return {
    temperature: openMeteoService.celsiusToFahrenheit(current.temperature),
    feelsLike: openMeteoService.celsiusToFahrenheit(current.temperature), // Open-Meteo doesn't provide feels like in current
    humidity: 0, // Not available in current weather, would need hourly data
    pressure: 0, // Not available in current weather, would need hourly data
    visibility: 0, // Not available in current weather, would need hourly data
    windSpeed: openMeteoService.kmhToMph(current.windspeed),
    windDirection: openMeteoService.getWindDirection(current.winddirection),
    windGust: openMeteoService.kmhToMph(current.windspeed), // Gust not in current, using speed
    weatherCondition: weatherInfo.description,
    weatherIcon: weatherInfo.icon,
    uvIndex: 0, // Not available in current weather, would need hourly data
    timestamp: current.time,
    source: 'Open-Meteo'
  };
};

/**
 * Transform Open-Meteo forecast to match existing surf forecast interface
 */
export const transformOpenMeteoForecast = (data: OpenMeteoResponse, spotId: string, spotName: string) => {
  if (!data.daily) return null;

  const days = data.daily.time.map((date, index) => {
    const weatherCode = data.daily!.weather_code[index];
    const weatherInfo = openMeteoService.getWeatherDescription(weatherCode);
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      timestamp: new Date(date).getTime(),
      waveHeight: {
        min: "1.0", // Mock data - Open-Meteo doesn't provide wave data
        max: "3.0",
        avg: "2.0"
      },
      period: "10", // Mock data
      swellDirection: data.daily!.wind_direction_10m_dominant?.[index] || 180,
      swellDirectionText: openMeteoService.getWindDirection(data.daily!.wind_direction_10m_dominant?.[index] || 180),
      windSpeed: Math.round(openMeteoService.kmhToMph(data.daily!.wind_speed_10m_max?.[index] || 0)).toString(),
      windDirection: openMeteoService.getWindDirection(data.daily!.wind_direction_10m_dominant?.[index] || 180),
      rating: Math.min(5, Math.max(1, Math.round((data.daily!.temperature_2m_max?.[index] || 20) / 5))),
      conditions: weatherInfo.description,
      bestTimes: data.daily!.uv_index_max?.[index] > 6 ? ['6-9 AM', '4-6 PM'] : ['6-9 AM']
    };
  });

  return {
    spotId,
    spotName,
    generated: new Date().toISOString(),
    days: days.slice(0, 7) // Limit to 7 days
  };
};
