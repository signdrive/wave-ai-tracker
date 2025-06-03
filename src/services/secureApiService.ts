
import { supabase } from '@/integrations/supabase/client';

interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  conditions: string;
}

interface SurfData {
  waveHeight: number;
  period: number;
  direction: number;
  rating: number;
}

class SecureApiService {
  private async getApiKey(serviceName: string): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/get-api-keys?service=${serviceName}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) return null;
      
      const { api_key } = await response.json();
      return api_key;
    } catch (error) {
      console.error(`Failed to get ${serviceName} API key:`, error);
      return null;
    }
  }

  async getStormglassData(lat: number, lng: number): Promise<SurfData | null> {
    const apiKey = await this.getApiKey('stormglass');
    if (!apiKey) return null;

    try {
      const params = 'waveHeight,wavePeriod,waveDirection';
      const response = await fetch(
        `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`,
        {
          headers: { 'Authorization': apiKey }
        }
      );

      if (!response.ok) throw new Error(`StormGlass API error: ${response.status}`);

      const data = await response.json();
      const current = data.hours?.[0];

      return {
        waveHeight: current?.waveHeight?.sg || 0,
        period: current?.wavePeriod?.sg || 0,
        direction: current?.waveDirection?.sg || 0,
        rating: Math.min(5, Math.max(1, Math.floor((current?.waveHeight?.sg || 1) * 2)))
      };
    } catch (error) {
      console.error('StormGlass API error:', error);
      return null;
    }
  }

  async getWeatherApiData(lat: number, lng: number): Promise<WeatherData | null> {
    const apiKey = await this.getApiKey('weatherapi');
    if (!apiKey) return null;

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lng}&aqi=no`
      );

      if (!response.ok) throw new Error(`WeatherAPI error: ${response.status}`);

      const data = await response.json();

      return {
        temperature: Math.round(data.current.temp_f),
        windSpeed: Math.round(data.current.wind_mph),
        windDirection: data.current.wind_dir,
        conditions: data.current.condition.text
      };
    } catch (error) {
      console.error('WeatherAPI error:', error);
      return null;
    }
  }

  async getMockData(): Promise<{ surf: SurfData; weather: WeatherData }> {
    return {
      surf: {
        waveHeight: Math.random() * 6 + 1,
        period: Math.random() * 5 + 8,
        direction: Math.random() * 360,
        rating: Math.floor(Math.random() * 5) + 1
      },
      weather: {
        temperature: Math.floor(Math.random() * 20) + 65,
        windSpeed: Math.floor(Math.random() * 15) + 5,
        windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        conditions: ['Sunny', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)]
      }
    };
  }
}

export const secureApiService = new SecureApiService();
