// API service for handling all external data sources
interface SurfCondition {
  location: string;
  waveHeight: number;
  period: number;
  windSpeed: number;
  windDirection: string;
  crowdLevel: number;
  setsPerHour: number;
  temperature: number;
  lastUpdated: string;
}

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  visibility: number;
  windSpeed: number;
  windDirection: string;
  windGust: number;
  weatherCondition: string;
  weatherIcon: string;
  uvIndex: number;
}

interface TideData {
  time: string;
  height: number;
  type?: 'High' | 'Low';
  timestamp: number;
}

interface WavePoolSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
  waveSettings: {
    height: number;
    length: number;
    style: string;
  };
}

class ApiService {
  private surflineApiKey: string = '';
  private tidesApiKey: string = '';
  private weatherApiKey: string = '';
  private baseUrls = {
    surfline: 'https://services.surfline.com/kbyg',
    noaa: 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter',
    stormglass: 'https://api.stormglass.io/v2',
    openweather: 'https://api.openweathermap.org/data/2.5'
  };

  setApiKeys(keys: { surfline?: string; tides?: string; weather?: string }) {
    if (keys.surfline) this.surflineApiKey = keys.surfline;
    if (keys.tides) this.tidesApiKey = keys.tides;
    if (keys.weather) this.weatherApiKey = keys.weather;
  }

  async getSurfConditions(spotId: string): Promise<SurfCondition> {
    try {
      // Mock data for now - replace with actual API calls once keys are provided
      const mockData: SurfCondition = {
        location: `Spot ${spotId}`,
        waveHeight: Math.random() * 8 + 1,
        period: Math.random() * 10 + 8,
        windSpeed: Math.random() * 15 + 5,
        windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        crowdLevel: Math.random() * 100,
        setsPerHour: Math.floor(Math.random() * 15) + 5,
        temperature: Math.random() * 15 + 60,
        lastUpdated: new Date().toISOString()
      };
      
      return mockData;
    } catch (error) {
      console.error('Error fetching surf conditions:', error);
      throw error;
    }
  }

  async getWeatherData(spotId: string): Promise<WeatherData> {
    try {
      // Mock data for now - replace with actual API calls once keys are provided
      const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Foggy'];
      
      const mockWeather: WeatherData = {
        temperature: Math.floor(Math.random() * 20) + 65,
        feelsLike: Math.floor(Math.random() * 20) + 65,
        humidity: Math.floor(Math.random() * 40) + 40,
        pressure: Math.floor(Math.random() * 50) + 1000,
        visibility: Math.floor(Math.random() * 10) + 5,
        windSpeed: Math.floor(Math.random() * 15) + 5,
        windDirection: windDirections[Math.floor(Math.random() * windDirections.length)],
        windGust: Math.floor(Math.random() * 20) + 10,
        weatherCondition: conditions[Math.floor(Math.random() * conditions.length)],
        weatherIcon: 'sunny',
        uvIndex: Math.floor(Math.random() * 11)
      };
      
      console.log('Generated mock weather data for spot:', spotId, mockWeather);
      return mockWeather;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  async getTideData(stationId: string, days: number = 3): Promise<TideData[]> {
    try {
      // Mock data for now - replace with actual API calls once keys are provided
      const mockTides: TideData[] = [];
      const now = new Date();
      
      for (let day = 0; day < days; day++) {
        for (let hour = 0; hour < 24; hour += 3) {
          const time = new Date(now.getTime() + (day * 24 + hour) * 60 * 60 * 1000);
          const height = Math.sin((hour / 24) * Math.PI * 2) * 2 + 2;
          const isExtreme = hour % 6 === 0;
          
          mockTides.push({
            time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            height: Number(height.toFixed(1)),
            type: isExtreme ? (height > 2 ? 'High' : 'Low') : undefined,
            timestamp: time.getTime()
          });
        }
      }
      
      return mockTides;
    } catch (error) {
      console.error('Error fetching tide data:', error);
      throw error;
    }
  }

  async getWavePoolAvailability(poolId: string, date: Date): Promise<WavePoolSlot[]> {
    try {
      // Mock data for now - replace with actual API calls once keys are provided
      const slots: WavePoolSlot[] = [];
      const baseTime = new Date(date);
      baseTime.setHours(8, 0, 0, 0);
      
      for (let i = 0; i < 9; i++) {
        const time = new Date(baseTime.getTime() + i * 60 * 60 * 1000);
        slots.push({
          id: `${poolId}-${i}`,
          time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          available: Math.random() > 0.3,
          price: Math.floor(Math.random() * 50) + 100,
          waveSettings: {
            height: Math.random() * 6 + 2,
            length: Math.floor(Math.random() * 20) + 10,
            style: ['Barrel', 'Performance', 'Aerial', 'Beginner'][Math.floor(Math.random() * 4)]
          }
        });
      }
      
      return slots;
    } catch (error) {
      console.error('Error fetching wave pool availability:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export type { SurfCondition, WeatherData, TideData, WavePoolSlot };
