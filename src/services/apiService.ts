// API service for handling all external data sources
import { secureApiKeyManager } from './secureApiKeyManager';

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

interface ForecastDay {
  date: string;
  timestamp: number;
  waveHeight: {
    min: number;
    max: number;
    avg: number;
  };
  period: number;
  swellDirection: number; // degrees (0-360)
  swellDirectionText: string;
  windSpeed: number;
  windDirection: string;
  rating: number; // 1-5 stars
  conditions: string;
  bestTimes: string[];
}

interface SurfForecast {
  spotId: string;
  spotName: string;
  generated: string;
  days: ForecastDay[];
}

class ApiService {
  private surflineApiKey: string = '';
  private tidesApiKey: string = '';
  private weatherApiKey: string = ''; // Removed hardcoded key
  private baseUrls = {
    surfline: 'https://services.surfline.com/kbyg',
    noaa: 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter',
    stormglass: 'https://api.stormglass.io/v2',
    openweather: 'https://api.openweathermap.org/data/2.5',
    weatherapi: 'https://api.weatherapi.com/v1'
  };

  async initializeApiKeys() {
    // Load API keys securely from the key manager
    this.weatherApiKey = await secureApiKeyManager.getApiKey('weatherapi') || '';
    this.surflineApiKey = await secureApiKeyManager.getApiKey('surfline') || '';
    this.tidesApiKey = await secureApiKeyManager.getApiKey('tides') || '';
  }

  setApiKeys(keys: { surfline?: string; tides?: string; weather?: string }) {
    if (keys.surfline) this.surflineApiKey = keys.surfline;
    if (keys.tides) this.tidesApiKey = keys.tides;
    if (keys.weather) this.weatherApiKey = keys.weather;
  }

  async getSurfConditions(spotId: string): Promise<SurfCondition> {
    try {
      // Ensure API keys are loaded
      if (!this.weatherApiKey) {
        await this.initializeApiKeys();
      }

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
      // First try to get real weather data if we have coordinates
      const spotCoordinates = this.getSpotCoordinates(spotId);
      
      if (spotCoordinates && this.weatherApiKey) {
        const response = await fetch(
          `${this.baseUrls.weatherapi}/current.json?key=${this.weatherApiKey}&q=${spotCoordinates.lat},${spotCoordinates.lon}&aqi=no`
        );
        
        if (response.ok) {
          const data = await response.json();
          const weatherData: WeatherData = {
            temperature: Math.round(data.current.temp_f),
            feelsLike: Math.round(data.current.feelslike_f),
            humidity: data.current.humidity,
            pressure: Math.round(data.current.pressure_mb),
            visibility: Math.round(data.current.vis_miles),
            windSpeed: Math.round(data.current.wind_mph),
            windDirection: data.current.wind_dir,
            windGust: Math.round(data.current.gust_mph || data.current.wind_mph * 1.2),
            weatherCondition: data.current.condition.text,
            weatherIcon: data.current.condition.icon,
            uvIndex: data.current.uv
          };
          
          console.log('Fetched real weather data for spot:', spotId, weatherData);
          return weatherData;
        }
      }
      
      // Fallback to mock data
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

  private getSpotCoordinates(spotId: string): { lat: number; lon: number } | null {
    // Basic coordinate mapping for popular surf spots
    const spotCoordinates: Record<string, { lat: number; lon: number }> = {
      'pipeline': { lat: 21.6597, lon: -158.0575 },
      'mavericks': { lat: 37.4912, lon: -122.5008 },
      'snapper': { lat: -28.1667, lon: 153.5500 },
      'jeffreys': { lat: -34.0508, lon: 24.9094 },
      'bells': { lat: -38.3667, lon: 144.2833 },
      'cloudbreak': { lat: -17.8500, lon: 177.2000 },
      'teahupoo': { lat: -17.8333, lon: -149.2667 },
      'mundaka': { lat: 43.4167, lon: -2.7000 },
      'uluwatu': { lat: -8.8292, lon: 115.0850 },
      'trestles': { lat: 33.3900, lon: -117.5850 }
    };
    
    return spotCoordinates[spotId.toLowerCase()] || null;
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

  async getSurfForecast(spotId: string): Promise<SurfForecast> {
    try {
      const spotNames: Record<string, string> = {
        pipeline: 'Pipeline, Oahu',
        mavericks: 'Mavericks, California',
        snapper: 'Snapper Rocks, Australia',
        jeffreys: 'Jeffreys Bay, South Africa'
      };

      const swellDirections = [
        { degrees: 0, text: 'N' },
        { degrees: 45, text: 'NE' },
        { degrees: 90, text: 'E' },
        { degrees: 135, text: 'SE' },
        { degrees: 180, text: 'S' },
        { degrees: 225, text: 'SW' },
        { degrees: 270, text: 'W' },
        { degrees: 315, text: 'NW' }
      ];

      const conditions = ['Poor', 'Fair', 'Good', 'Very Good', 'Epic'];
      const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

      const mockForecast: SurfForecast = {
        spotId,
        spotName: spotNames[spotId] || `Spot ${spotId}`,
        generated: new Date().toISOString(),
        days: []
      };

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        const swellDir = swellDirections[Math.floor(Math.random() * swellDirections.length)];
        const minWave = Math.random() * 3 + 1;
        const maxWave = minWave + Math.random() * 4 + 1;
        const rating = Math.floor(Math.random() * 5) + 1;
        
        const bestTimes = [];
        if (rating >= 3) {
          bestTimes.push('6-9 AM');
          if (rating >= 4) bestTimes.push('4-6 PM');
        }

        mockForecast.days.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          timestamp: date.getTime(),
          waveHeight: {
            min: Number(minWave.toFixed(1)),
            max: Number(maxWave.toFixed(1)),
            avg: Number(((minWave + maxWave) / 2).toFixed(1))
          },
          period: Math.floor(Math.random() * 8) + 8,
          swellDirection: swellDir.degrees,
          swellDirectionText: swellDir.text,
          windSpeed: Math.floor(Math.random() * 15) + 5,
          windDirection: windDirections[Math.floor(Math.random() * windDirections.length)],
          rating,
          conditions: conditions[rating - 1],
          bestTimes
        });
      }

      console.log('Generated surf forecast for:', spotId, mockForecast);
      return mockForecast;
    } catch (error) {
      console.error('Error fetching surf forecast:', error);
      throw error;
    }
  }

  async getHistoricalWaveData(spotId: string, days: number) {
    try {
      const mockData = {
        avgWaveHeight: 0,
        maxWaveHeight: 0,
        minWaveHeight: 0,
        dailyData: [] as Array<{ date: string; waveHeight: number }>
      };

      let totalWaveHeight = 0;
      let maxHeight = 0;
      let minHeight = Infinity;

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const waveHeight = Math.random() * 8 + 1;
        totalWaveHeight += waveHeight;
        maxHeight = Math.max(maxHeight, waveHeight);
        minHeight = Math.min(minHeight, waveHeight);

        mockData.dailyData.push({
          date: date.toISOString(),
          waveHeight: Number(waveHeight.toFixed(1))
        });
      }

      mockData.avgWaveHeight = totalWaveHeight / days;
      mockData.maxWaveHeight = maxHeight;
      mockData.minWaveHeight = minHeight;

      console.log('Generated historical wave data for:', spotId, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching historical wave data:', error);
      throw error;
    }
  }

  async getHistoricalWindData(spotId: string, days: number) {
    try {
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const directionCounts: Record<string, number> = {};
      
      const mockData = {
        avgWindSpeed: 0,
        maxWindSpeed: 0,
        dominantDirection: '',
        dailyData: [] as Array<{ date: string; windSpeed: number; direction: string }>
      };

      let totalWindSpeed = 0;
      let maxSpeed = 0;

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const windSpeed = Math.random() * 20 + 5;
        const direction = directions[Math.floor(Math.random() * directions.length)];
        
        totalWindSpeed += windSpeed;
        maxSpeed = Math.max(maxSpeed, windSpeed);
        directionCounts[direction] = (directionCounts[direction] || 0) + 1;

        mockData.dailyData.push({
          date: date.toISOString(),
          windSpeed: Number(windSpeed.toFixed(1)),
          direction
        });
      }

      mockData.avgWindSpeed = totalWindSpeed / days;
      mockData.maxWindSpeed = maxSpeed;
      mockData.dominantDirection = Object.keys(directionCounts).reduce((a, b) => 
        directionCounts[a] > directionCounts[b] ? a : b
      );

      console.log('Generated historical wind data for:', spotId, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching historical wind data:', error);
      throw error;
    }
  }

  async getHistoricalCrowdData(spotId: string, days: number) {
    try {
      const timeSlots = ['6-9 AM', '9-12 PM', '12-3 PM', '3-6 PM', '6-9 PM'];
      const slotCounts: Record<string, number> = {};
      
      const mockData = {
        lowCrowdDays: 0,
        moderateCrowdDays: 0,
        highCrowdDays: 0,
        bestTimeSlot: '',
        dailyData: [] as Array<{ date: string; crowdLevel: number }>
      };

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const crowdLevel = Math.random() * 100;
        const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        
        if (crowdLevel < 30) mockData.lowCrowdDays++;
        else if (crowdLevel < 70) mockData.moderateCrowdDays++;
        else mockData.highCrowdDays++;
        
        slotCounts[timeSlot] = (slotCounts[timeSlot] || 0) + (100 - crowdLevel);

        mockData.dailyData.push({
          date: date.toISOString(),
          crowdLevel: Number(crowdLevel.toFixed(0))
        });
      }

      mockData.bestTimeSlot = Object.keys(slotCounts).reduce((a, b) => 
        slotCounts[a] > slotCounts[b] ? a : b
      );

      console.log('Generated historical crowd data for:', spotId, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching historical crowd data:', error);
      throw error;
    }
  }

  async getHistoricalTemperatureData(spotId: string, days: number) {
    try {
      const mockData = {
        avgAirTemp: 0,
        avgWaterTemp: 0,
        tempRange: 0,
        dailyData: [] as Array<{ date: string; airTemp: number; waterTemp: number }>
      };

      let totalAirTemp = 0;
      let totalWaterTemp = 0;
      let minTemp = Infinity;
      let maxTemp = -Infinity;

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const airTemp = Math.random() * 20 + 65;
        const waterTemp = airTemp - Math.random() * 10 - 5;
        
        totalAirTemp += airTemp;
        totalWaterTemp += waterTemp;
        minTemp = Math.min(minTemp, Math.min(airTemp, waterTemp));
        maxTemp = Math.max(maxTemp, Math.max(airTemp, waterTemp));

        mockData.dailyData.push({
          date: date.toISOString(),
          airTemp: Number(airTemp.toFixed(1)),
          waterTemp: Number(waterTemp.toFixed(1))
        });
      }

      mockData.avgAirTemp = totalAirTemp / days;
      mockData.avgWaterTemp = totalWaterTemp / days;
      mockData.tempRange = maxTemp - minTemp;

      console.log('Generated historical temperature data for:', spotId, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching historical temperature data:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export type { SurfCondition, WeatherData, TideData, WavePoolSlot, ForecastDay, SurfForecast };
