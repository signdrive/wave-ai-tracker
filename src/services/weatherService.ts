
import { openMeteoService } from './openMeteoService';
import { transformOpenMeteoWeather } from '@/hooks/useOpenMeteo';

/**
 * Weather service using Open-Meteo as the primary data source
 * Replaces previous API integrations with GitHub-sourced Open-Meteo implementation
 */
class WeatherService {
  /**
   * Get current weather conditions
   */
  async getCurrentWeather(lat: number, lng: number) {
    try {
      console.log(`Fetching weather from Open-Meteo for coordinates: ${lat}, ${lng}`);
      
      const data = await openMeteoService.getCurrentWeather(lat, lng);
      const transformed = transformOpenMeteoWeather(data);
      
      if (!transformed) {
        throw new Error('Invalid weather data received from Open-Meteo');
      }
      
      return transformed;
    } catch (error) {
      console.error('Weather service error:', error);
      
      // Return mock data as fallback
      return this.getMockWeatherData(lat, lng);
    }
  }

  /**
   * Get detailed weather forecast
   */
  async getWeatherForecast(lat: number, lng: number, days: number = 7) {
    try {
      console.log(`Fetching ${days}-day forecast from Open-Meteo for coordinates: ${lat}, ${lng}`);
      
      const data = await openMeteoService.getForecast(lat, lng, days);
      
      return {
        source: 'Open-Meteo',
        location: { lat, lng },
        current: data.current_weather ? transformOpenMeteoWeather(data) : null,
        forecast: data.daily ? this.transformDailyForecast(data.daily) : [],
        generated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Weather forecast error:', error);
      
      // Return mock forecast as fallback
      return this.getMockForecastData(lat, lng, days);
    }
  }

  /**
   * Get historical weather data
   */
  async getHistoricalWeather(lat: number, lng: number, startDate: string, endDate: string) {
    try {
      console.log(`Fetching historical weather from Open-Meteo: ${startDate} to ${endDate}`);
      
      const data = await openMeteoService.getHistoricalWeather(lat, lng, startDate, endDate);
      
      return {
        source: 'Open-Meteo Historical',
        location: { lat, lng },
        period: { startDate, endDate },
        data: data.daily ? this.transformHistoricalData(data.daily) : [],
        generated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Historical weather error:', error);
      
      // Return mock historical data as fallback
      return this.getMockHistoricalData(lat, lng, startDate, endDate);
    }
  }

  private transformDailyForecast(daily: any) {
    return daily.time.map((date: string, index: number) => ({
      date,
      temperature: {
        max: openMeteoService.celsiusToFahrenheit(daily.temperature_2m_max?.[index] || 20),
        min: openMeteoService.celsiusToFahrenheit(daily.temperature_2m_min?.[index] || 15)
      },
      weather: openMeteoService.getWeatherDescription(daily.weather_code?.[index] || 0),
      precipitation: daily.precipitation_sum?.[index] || 0,
      windSpeed: openMeteoService.kmhToMph(daily.wind_speed_10m_max?.[index] || 0),
      windDirection: openMeteoService.getWindDirection(daily.wind_direction_10m_dominant?.[index] || 0),
      uvIndex: daily.uv_index_max?.[index] || 0
    }));
  }

  private transformHistoricalData(daily: any) {
    return daily.time.map((date: string, index: number) => ({
      date,
      temperature: {
        max: openMeteoService.celsiusToFahrenheit(daily.temperature_2m_max?.[index] || 20),
        min: openMeteoService.celsiusToFahrenheit(daily.temperature_2m_min?.[index] || 15)
      },
      weather: openMeteoService.getWeatherDescription(daily.weather_code?.[index] || 0),
      precipitation: daily.precipitation_sum?.[index] || 0,
      windSpeed: openMeteoService.kmhToMph(daily.wind_speed_10m_max?.[index] || 0),
      windDirection: openMeteoService.getWindDirection(daily.wind_direction_10m_dominant?.[index] || 0)
    }));
  }

  private getMockWeatherData(lat: number, lng: number) {
    console.log('Using mock weather data fallback');
    return {
      temperature: 72,
      feelsLike: 75,
      humidity: 65,
      pressure: 1013,
      visibility: 10,
      windSpeed: 12,
      windDirection: 'SW',
      windGust: 15,
      weatherCondition: 'Partly Cloudy',
      weatherIcon: 'partly-cloudy-day',
      uvIndex: 6,
      timestamp: new Date().toISOString(),
      source: 'Mock Data (Open-Meteo fallback)'
    };
  }

  private getMockForecastData(lat: number, lng: number, days: number) {
    console.log('Using mock forecast data fallback');
    const forecast = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        temperature: {
          max: 70 + Math.random() * 10,
          min: 60 + Math.random() * 10
        },
        weather: { description: 'Partly Cloudy', icon: 'partly-cloudy-day', emoji: '⛅' },
        precipitation: Math.random() * 5,
        windSpeed: 10 + Math.random() * 10,
        windDirection: 'SW',
        uvIndex: 5 + Math.random() * 3
      });
    }
    
    return {
      source: 'Mock Data (Open-Meteo fallback)',
      location: { lat, lng },
      current: this.getMockWeatherData(lat, lng),
      forecast,
      generated: new Date().toISOString()
    };
  }

  private getMockHistoricalData(lat: number, lng: number, startDate: string, endDate: string) {
    console.log('Using mock historical data fallback');
    const start = new Date(startDate);
    const end = new Date(endDate);
    const data = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      data.push({
        date: d.toISOString().split('T')[0],
        temperature: {
          max: 65 + Math.random() * 15,
          min: 55 + Math.random() * 10
        },
        weather: { description: 'Variable', icon: 'partly-cloudy-day', emoji: '🌤️' },
        precipitation: Math.random() * 3,
        windSpeed: 8 + Math.random() * 12,
        windDirection: 'W'
      });
    }
    
    return {
      source: 'Mock Historical Data (Open-Meteo fallback)',
      location: { lat, lng },
      period: { startDate, endDate },
      data,
      generated: new Date().toISOString()
    };
  }
}

export const weatherService = new WeatherService();
