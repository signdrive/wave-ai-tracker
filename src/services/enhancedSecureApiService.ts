
import { supabase } from '@/integrations/supabase/client';
import { errorHandlingService } from './errorHandlingService';

interface ApiKeyResponse {
  key_value?: string;
}

class EnhancedSecureApiService {
  private rateLimits: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly RATE_WINDOW = 60000; // 1 minute
  private readonly MAX_REQUESTS = 10;

  async getSecureApiKey(serviceName: string): Promise<string> {
    // Check rate limit first
    if (!this.checkRateLimit(`api_key_${serviceName}`)) {
      throw new Error(`Rate limit exceeded for ${serviceName}`);
    }

    return errorHandlingService.safeApiCall(
      async () => {
        const { data, error } = await supabase
          .from('api_keys')
          .select('key_value')
          .eq('service_name', serviceName)
          .eq('is_active', true)
          .single();

        if (error) {
          throw new Error(`Database error: ${error.message}`);
        }

        if (!data?.key_value) {
          throw new Error(`No active key found for ${serviceName}`);
        }

        return data.key_value;
      },
      // Fallback to stored key or empty string
      errorHandlingService.getFallbackKey(serviceName) || '',
      `get_api_key_${serviceName}`
    );
  }

  async getStormGlassForecast(lat: number, lng: number): Promise<any> {
    const mockForecast = this.getMockForecast(`${lat}-${lng}`);

    return errorHandlingService.safeApiCall(
      async () => {
        const apiKey = await this.getSecureApiKey('stormglass');
        if (!apiKey) {
          throw new Error('StormGlass API key not available');
        }

        const params = 'waveHeight,waveDirection,wavePeriod,windSpeed,windDirection';
        const response = await fetch(
          `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`,
          {
            headers: { 'Authorization': apiKey },
            signal: AbortSignal.timeout(10000) // 10 second timeout
          }
        );

        if (!response.ok) {
          throw new Error(`StormGlass API error: ${response.status}`);
        }

        const data = await response.json();
        return this.transformStormGlassData(data);
      },
      mockForecast,
      'stormglass_forecast'
    );
  }

  async getWeatherData(location: string): Promise<any> {
    const mockWeather = this.getMockWeatherData(location);

    return errorHandlingService.safeApiCall(
      async () => {
        const apiKey = await this.getSecureApiKey('weatherapi');
        if (!apiKey) {
          throw new Error('Weather API key not available');
        }

        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`,
          {
            signal: AbortSignal.timeout(10000)
          }
        );

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        return await response.json();
      },
      mockWeather,
      'weather_data'
    );
  }

  private checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const limit = this.rateLimits.get(identifier);

    if (!limit || now > limit.resetTime) {
      this.rateLimits.set(identifier, { count: 1, resetTime: now + this.RATE_WINDOW });
      return true;
    }

    if (limit.count >= this.MAX_REQUESTS) {
      return false;
    }

    limit.count++;
    return true;
  }

  private transformStormGlassData(data: any) {
    return {
      source: 'StormGlass',
      forecast: data.hours?.map((hour: any) => ({
        timestamp: new Date(hour.time).getTime(),
        waveHeight: {
          min: errorHandlingService.safeToFixed(hour.waveHeight?.noaa || 0),
          max: errorHandlingService.safeToFixed(hour.waveHeight?.sg || 0),
          avg: errorHandlingService.safeToFixed(hour.waveHeight?.icon || 0)
        },
        period: errorHandlingService.safeToFixed(hour.wavePeriod?.noaa || 0),
        windSpeed: errorHandlingService.safeToFixed(hour.windSpeed?.noaa || 0),
        windDirection: hour.windDirection?.noaa || 0
      })) || [],
      generated: new Date().toISOString()
    };
  }

  private getMockForecast(spotId: string) {
    return {
      source: 'Mock Data (Secure Fallback)',
      spotId,
      forecast: [{
        timestamp: Date.now(),
        waveHeight: { min: '2.0', max: '4.0', avg: '3.0' },
        period: '10.0',
        windSpeed: '15.0',
        windDirection: 'SW',
        rating: 3
      }],
      generated: new Date().toISOString()
    };
  }

  private getMockWeatherData(location: string) {
    return {
      location: { name: location },
      current: {
        temp_c: 22,
        condition: { text: 'Sunny' },
        wind_kph: 15,
        wind_dir: 'SW'
      }
    };
  }
}

export const enhancedSecureApiService = new EnhancedSecureApiService();
