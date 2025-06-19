
// Open-Meteo API service based on https://github.com/open-meteo/open-meteo
import { OpenMeteoResponse, OpenMeteoError, WEATHER_CODE_MAPPINGS } from '@/types/openMeteo';

export class OpenMeteoService {
  private readonly baseUrl = 'https://api.open-meteo.com/v1';
  private readonly retryAttempts = 2;
  private readonly retryDelay = 1000;
  
  /**
   * Fetch current weather data
   * Based on API documentation from Open-Meteo GitHub repo
   */
  async getCurrentWeather(lat: number, lng: number): Promise<OpenMeteoResponse> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lng.toString(),
      current_weather: 'true',
      timezone: 'auto'
    });
    
    return this.fetchWithRetry(`${this.baseUrl}/forecast?${params}`);
  }

  /**
   * Fetch detailed forecast with hourly and daily data
   * Includes comprehensive weather parameters as per GitHub repo examples
   */
  async getForecast(lat: number, lng: number, days: number = 7): Promise<OpenMeteoResponse> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lng.toString(),
      current_weather: 'true',
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation_probability',
        'precipitation',
        'rain',
        'weather_code',
        'pressure_msl',
        'cloud_cover',
        'visibility',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
        'uv_index'
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'uv_index_max',
        'precipitation_sum',
        'rain_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_gusts_10m_max',
        'wind_direction_10m_dominant'
      ].join(','),
      timezone: 'auto',
      forecast_days: days.toString()
    });
    
    return this.fetchWithRetry(`${this.baseUrl}/forecast?${params}`);
  }

  /**
   * Fetch historical weather data
   * Based on Open-Meteo historical API endpoints
   */
  async getHistoricalWeather(
    lat: number, 
    lng: number, 
    startDate: string, 
    endDate: string
  ): Promise<OpenMeteoResponse> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lng.toString(),
      start_date: startDate,
      end_date: endDate,
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'rain_sum',
        'wind_speed_10m_max',
        'wind_direction_10m_dominant'
      ].join(','),
      timezone: 'auto'
    });
    
    return this.fetchWithRetry(`${this.baseUrl}/historical?${params}`);
  }

  /**
   * Robust fetch with retry logic and error handling
   * Implements rate limiting respect as discussed in GitHub issues
   */
  private async fetchWithRetry(url: string): Promise<OpenMeteoResponse> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`Open-Meteo API call attempt ${attempt}: ${url}`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Wave-AI-Tracker/1.0'
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!response.ok) {
          if (response.status === 429) {
            // Rate limit hit - wait longer before retry
            const waitTime = this.retryDelay * attempt * 2;
            console.warn(`Rate limited by Open-Meteo API, waiting ${waitTime}ms`);
            await this.sleep(waitTime);
            throw new Error(`Rate limited: ${response.status}`);
          }
          
          if (response.status >= 500) {
            // Server error - retry
            throw new Error(`Server error: ${response.status}`);
          }
          
          // Client error - don't retry
          const errorData: OpenMeteoError = await response.json().catch(() => ({ 
            error: true, 
            reason: `HTTP ${response.status}` 
          }));
          throw new Error(`Open-Meteo API error: ${errorData.reason || response.statusText}`);
        }

        const data: OpenMeteoResponse = await response.json();
        console.log('Open-Meteo API response received successfully');
        return data;
        
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.retryAttempts && this.shouldRetry(error as Error)) {
          console.warn(`Open-Meteo API attempt ${attempt} failed, retrying...`, error);
          await this.sleep(this.retryDelay * attempt);
        }
      }
    }
    
    console.error('Open-Meteo API failed after all retry attempts:', lastError);
    throw lastError!;
  }

  private shouldRetry(error: Error): boolean {
    return error.message.includes('Rate limited') || 
           error.message.includes('Server error') ||
           error.message.includes('fetch');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Transform weather code to human-readable description
   * Based on WMO Weather interpretation codes from Open-Meteo docs
   */
  getWeatherDescription(code: number): { description: string; icon: string; emoji: string } {
    return WEATHER_CODE_MAPPINGS[code] || { 
      description: 'Unknown', 
      icon: 'unknown', 
      emoji: '❓' 
    };
  }

  /**
   * Convert wind direction degrees to compass direction
   */
  getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  }

  /**
   * Convert Celsius to Fahrenheit
   */
  celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32;
  }

  /**
   * Convert km/h to mph
   */
  kmhToMph(kmh: number): number {
    return kmh * 0.621371;
  }
}

export const openMeteoService = new OpenMeteoService();
