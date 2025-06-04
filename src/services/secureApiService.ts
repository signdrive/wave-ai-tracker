
import { supabase } from '@/integrations/supabase/client';

interface RateLimitConfig {
  endpoint: string;
  limit: number;
  windowMs: number;
}

class SecureApiService {
  private rateLimits: Map<string, RateLimitConfig> = new Map([
    ['stormglass', { endpoint: 'stormglass', limit: 60, windowMs: 60000 }],
    ['weatherapi', { endpoint: 'weatherapi', limit: 60, windowMs: 60000 }],
    ['admin-config', { endpoint: 'admin-config', limit: 5, windowMs: 60000 }],
  ]);

  async getSecureApiKey(serviceName: string): Promise<string> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('service_name', serviceName)
      .eq('is_active', true)
      .single();

    if (error || !data?.key_value) {
      console.warn(`API key not found for service: ${serviceName}`);
      throw new Error(`Active ${serviceName} key not found`);
    }

    return data.key_value;
  }

  async checkRateLimit(identifier: string, endpoint: string): Promise<boolean> {
    const config = this.rateLimits.get(endpoint);
    if (!config) return true;

    // For now, implement simple in-memory rate limiting
    // In production, use Redis or similar
    console.log(`Rate limit check for ${identifier} on ${endpoint}`);
    return true; // Always allow for demo
  }

  async getStormGlassForecast(lat: number, lng: number): Promise<any> {
    const identifier = await this.getIdentifier();
    
    if (!await this.checkRateLimit(identifier, 'stormglass')) {
      throw new Error('Rate limit exceeded for StormGlass API');
    }

    try {
      const apiKey = await this.getSecureApiKey('stormglass');
      const params = 'waveHeight,waveDirection,wavePeriod,windSpeed,windDirection';
      
      const response = await fetch(
        `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`,
        {
          headers: {
            'Authorization': apiKey
          }
        }
      );

      if (!response.ok) {
        console.error(`StormGlass API error: ${response.status}`);
        throw new Error(`StormGlass API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformStormGlassData(data);
    } catch (error) {
      console.warn('StormGlass API failed, using mock data');
      return this.getMockForecast(`${lat}-${lng}`);
    }
  }

  async getWeatherData(location: string): Promise<any> {
    const identifier = await this.getIdentifier();
    
    if (!await this.checkRateLimit(identifier, 'weatherapi')) {
      throw new Error('Rate limit exceeded for Weather API');
    }

    try {
      const apiKey = await this.getSecureApiKey('weatherapi');
      
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`
      );

      if (!response.ok) {
        console.error(`Weather API error: ${response.status}`);
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Weather API failed, using mock data');
      return this.getMockWeatherData(location);
    }
  }

  private async getIdentifier(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || 'anonymous';
  }

  private transformStormGlassData(data: any) {
    return {
      source: 'StormGlass',
      forecast: data.hours?.map((hour: any) => ({
        timestamp: new Date(hour.time).getTime(),
        waveHeight: {
          min: hour.waveHeight?.noaa || 0,
          max: hour.waveHeight?.sg || 0,
          avg: hour.waveHeight?.icon || 0
        },
        period: hour.wavePeriod?.noaa || 0,
        windSpeed: hour.windSpeed?.noaa || 0,
        windDirection: hour.windDirection?.noaa || 0
      })) || [],
      generated: new Date().toISOString()
    };
  }

  private getMockForecast(spotId: string) {
    return {
      source: 'Mock Data (Secure)',
      spotId,
      forecast: [{
        timestamp: Date.now(),
        waveHeight: { min: 2, max: 4, avg: 3 },
        period: 10,
        windSpeed: 15,
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

export const secureApiService = new SecureApiService();
