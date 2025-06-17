
// Real data service - NO MOCK DATA ALLOWED
import { supabase } from '@/integrations/supabase/client';

interface RealApiConfig {
  stormglassApiKey?: string;
  weatherApiKey?: string;
  noaaApiKey?: string;
}

interface RealCrowdData {
  spotId: string;
  predictedLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
  source: 'user_reports' | 'camera_analysis' | 'api_prediction';
  timestamp: string;
}

interface RealWeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  waveHeight: number;
  source: 'stormglass' | 'noaa' | 'weatherapi';
  timestamp: string;
}

class RealDataService {
  private apiKeys: RealApiConfig = {};
  private retryAttempts = 3;
  private retryDelay = 1000; // ms

  async loadApiKeys(): Promise<void> {
    try {
      // Load from Supabase secrets - REAL API KEYS ONLY
      const { data, error } = await supabase
        .from('api_keys')
        .select('service_name, key_value')
        .eq('is_active', true);

      if (error) {
        throw new Error(`Failed to load API keys: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('No active API keys found. Please configure API keys in the admin panel.');
      }

      data.forEach(key => {
        if (key.service_name === 'stormglass') this.apiKeys.stormglassApiKey = key.key_value;
        if (key.service_name === 'weatherapi') this.apiKeys.weatherApiKey = key.key_value;
        if (key.service_name === 'noaa') this.apiKeys.noaaApiKey = key.key_value;
      });

      console.log('Real API keys loaded successfully');
    } catch (error) {
      console.error('API key loading failed:', error);
      throw new Error('Real data unavailable: API keys not configured. Please add valid API keys in admin settings.');
    }
  }

  async getRealCrowdData(spotId: string): Promise<RealCrowdData> {
    // Step 1: Try Supabase function with proper auth
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Authentication required for crowd data access');
      }

      const { data, error } = await supabase.functions.invoke('get-crowd-prediction', {
        body: { spot_id: spotId },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        throw new Error(`Crowd prediction API error: ${error.message}`);
      }

      if (data && data.predicted_level) {
        return {
          spotId,
          predictedLevel: data.predicted_level,
          confidence: data.confidence || 0.8,
          source: data.source || 'api_prediction',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Supabase crowd data failed:', error);
    }

    // Step 2: Try direct database query for user reports
    try {
      const { data, error } = await supabase
        .from('crowd_reports')
        .select('reported_level, created_at')
        .eq('spot_id', spotId)
        .gte('created_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data && data.length > 0) {
        // Calculate average from recent reports
        const levels = data.map(r => r.reported_level === 'Low' ? 1 : r.reported_level === 'Medium' ? 2 : 3);
        const avgLevel = levels.reduce((a, b) => a + b, 0) / levels.length;
        
        return {
          spotId,
          predictedLevel: avgLevel <= 1.5 ? 'Low' : avgLevel <= 2.5 ? 'Medium' : 'High',
          confidence: Math.min(data.length / 5, 1),
          source: 'user_reports',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Database crowd query failed:', error);
    }

    // FAILURE - No mock data allowed
    throw new Error(`Real crowd data unavailable for spot ${spotId}. Solutions:
    1. Ensure user authentication is working
    2. Check Supabase function 'get-crowd-prediction' is deployed
    3. Add crowd reports for this spot in the database
    4. Configure proper RLS policies for crowd_reports table`);
  }

  async getRealWeatherData(lat: number, lon: number): Promise<RealWeatherData> {
    await this.loadApiKeys();

    // Try StormGlass API first (marine weather specialist)
    if (this.apiKeys.stormglassApiKey) {
      try {
        const response = await this.retryApiCall(async () => {
          const res = await fetch(
            `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lon}&params=waveHeight,windSpeed,windDirection,airTemperature`,
            {
              headers: {
                'Authorization': this.apiKeys.stormglassApiKey!
              }
            }
          );
          
          if (!res.ok) {
            throw new Error(`StormGlass API error: ${res.status} - ${res.statusText}`);
          }
          
          return res.json();
        });

        const current = response.hours?.[0];
        if (current) {
          return {
            temperature: current.airTemperature?.noaa || current.airTemperature?.sg || 0,
            windSpeed: current.windSpeed?.noaa || current.windSpeed?.sg || 0,
            windDirection: current.windDirection?.noaa || current.windDirection?.sg || 0,
            waveHeight: current.waveHeight?.noaa || current.waveHeight?.sg || 0,
            source: 'stormglass',
            timestamp: new Date().toISOString()
          };
        }
      } catch (error) {
        console.error('StormGlass API failed:', error);
      }
    }

    // Try WeatherAPI as fallback
    if (this.apiKeys.weatherApiKey) {
      try {
        const response = await this.retryApiCall(async () => {
          const res = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${this.apiKeys.weatherApiKey}&q=${lat},${lon}&aqi=no`
          );
          
          if (!res.ok) {
            throw new Error(`WeatherAPI error: ${res.status} - ${res.statusText}`);
          }
          
          return res.json();
        });

        return {
          temperature: response.current.temp_f,
          windSpeed: response.current.wind_mph,
          windDirection: this.directionToNumber(response.current.wind_dir),
          waveHeight: 0, // WeatherAPI doesn't provide wave data
          source: 'weatherapi',
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('WeatherAPI failed:', error);
      }
    }

    // FAILURE - No mock data allowed
    throw new Error(`Real weather data unavailable for coordinates ${lat}, ${lon}. Solutions:
    1. Register for StormGlass API key at: https://stormglass.io/
    2. Register for WeatherAPI key at: https://www.weatherapi.com/
    3. Add API keys through admin panel: /admin/api-config
    4. Ensure API keys have sufficient credits/quota
    5. Check network connectivity and API endpoints`);
  }

  private async retryApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.retryAttempts) {
          console.warn(`API call attempt ${attempt} failed, retrying in ${this.retryDelay}ms:`, error);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        }
      }
    }
    
    throw lastError!;
  }

  private directionToNumber(direction: string): number {
    const directions: Record<string, number> = {
      'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
      'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
      'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
      'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    };
    return directions[direction] || 0;
  }
}

export const realDataService = new RealDataService();
export type { RealCrowdData, RealWeatherData };
