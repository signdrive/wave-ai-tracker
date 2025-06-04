
import { supabase } from '@/integrations/supabase/client';

interface RateLimitConfig {
  endpoint: string;
  limit: number;
  windowMs: number;
}

interface SecurityLogEntry {
  action: string;
  endpoint: string;
  ip_address?: string;
  user_agent?: string;
  status_code: number;
  details?: any;
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
      await this.logSecurityEvent({
        action: 'API_KEY_FETCH_FAILED',
        endpoint: serviceName,
        status_code: 404,
        details: { service: serviceName, error: error?.message }
      });
      throw new Error(`Active ${serviceName} key not found`);
    }

    return data.key_value;
  }

  async checkRateLimit(identifier: string, endpoint: string): Promise<boolean> {
    const config = this.rateLimits.get(endpoint);
    if (!config) return true;

    const windowStart = new Date(Date.now() - config.windowMs);
    
    // Get current count in window
    const { data: existing } = await supabase
      .from('rate_limits')
      .select('request_count')
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart.toISOString())
      .single();

    if (existing && existing.request_count >= config.limit) {
      await this.logSecurityEvent({
        action: 'RATE_LIMIT_EXCEEDED',
        endpoint,
        status_code: 429,
        details: { identifier, limit: config.limit, count: existing.request_count }
      });
      return false;
    }

    // Update or create rate limit record
    if (existing) {
      await supabase
        .from('rate_limits')
        .update({ request_count: existing.request_count + 1 })
        .eq('identifier', identifier)
        .eq('endpoint', endpoint)
        .gte('window_start', windowStart.toISOString());
    } else {
      await supabase
        .from('rate_limits')
        .insert({
          identifier,
          endpoint,
          request_count: 1,
          window_start: new Date().toISOString()
        });
    }

    return true;
  }

  async logSecurityEvent(event: SecurityLogEntry): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase
      .from('security_logs')
      .insert({
        user_id: user?.id || null,
        ip_address: event.ip_address || 'unknown',
        action: event.action,
        endpoint: event.endpoint,
        user_agent: event.user_agent || navigator.userAgent,
        status_code: event.status_code,
        details: event.details
      });
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
        await this.logSecurityEvent({
          action: 'API_CALL_FAILED',
          endpoint: 'stormglass',
          status_code: response.status,
          details: { lat, lng, status: response.statusText }
        });
        throw new Error(`StormGlass API error: ${response.status}`);
      }

      const data = await response.json();
      
      await this.logSecurityEvent({
        action: 'API_CALL_SUCCESS',
        endpoint: 'stormglass',
        status_code: 200,
        details: { lat, lng }
      });

      return this.transformStormGlassData(data);
    } catch (error) {
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
        await this.logSecurityEvent({
          action: 'API_CALL_FAILED',
          endpoint: 'weatherapi',
          status_code: response.status,
          details: { location, status: response.statusText }
        });
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      await this.logSecurityEvent({
        action: 'API_CALL_SUCCESS',
        endpoint: 'weatherapi',
        status_code: 200,
        details: { location }
      });

      return data;
    } catch (error) {
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
      source: 'Mock Data (Rate Limited)',
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
