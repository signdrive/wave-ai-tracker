
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

    // Always use fallback keys to prevent Supabase API calls
    const fallbackKey = errorHandlingService.getFallbackKey(serviceName);
    if (fallbackKey && fallbackKey !== 'demo-key') {
      return fallbackKey;
    }

    console.warn(`No API key available for ${serviceName}, using demo mode`);
    return 'demo-key';
  }

  async getStormGlassForecast(lat: number, lng: number): Promise<any> {
    const mockForecast = this.getMockForecast(`${lat}-${lng}`);

    return errorHandlingService.safeApiCall(
      async () => {
        const apiKey = await this.getSecureApiKey('stormglass');
        if (!apiKey || apiKey === 'demo-key') {
          throw new Error('StormGlass API key not available - using mock data');
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
        if (!apiKey || apiKey === 'demo-key') {
          throw new Error('Weather API key not available - using mock data');
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
          min: errorHandlingService.safeToFixed(hour.waveHeight?.noaa || 0, 1),
          max: errorHandlingService.safeToFixed(hour.waveHeight?.sg || 0, 1),
          avg: errorHandlingService.safeToFixed(hour.waveHeight?.icon || 0, 1)
        },
        period: errorHandlingService.safeToFixed(hour.wavePeriod?.noaa || 0, 0),
        windSpeed: errorHandlingService.safeToFixed(hour.windSpeed?.noaa || 0, 0),
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
        waveHeight: { 
          min: errorHandlingService.safeToFixed(2.0, 1), 
          max: errorHandlingService.safeToFixed(4.0, 1), 
          avg: errorHandlingService.safeToFixed(3.0, 1) 
        },
        period: errorHandlingService.safeToFixed(10.0, 0),
        windSpeed: errorHandlingService.safeToFixed(15.0, 0),
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
        temp_c: Number(errorHandlingService.safeToFixed(22, 0)),
        condition: { text: 'Sunny' },
        wind_kph: Number(errorHandlingService.safeToFixed(15, 0)),
        wind_dir: 'SW'
      }
    };
  }
}

export const enhancedSecureApiService = new EnhancedSecureApiService();
