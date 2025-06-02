
// Enhanced API service with real integrations
interface RealSurfApiConfig {
  surflineApiKey?: string;
  magicSeaweedApiKey?: string;
  stormglassApiKey?: string;
  weatherApiKey?: string;
}

interface SurflineSpot {
  _id: string;
  name: string;
  lat: number;
  lon: number;
  forecasts: {
    wave: {
      min: number;
      max: number;
      plus: boolean;
    };
    wind: {
      speed: number;
      direction: number;
    };
    weather: {
      condition: string;
      temperature: number;
    };
  };
}

interface MagicSeaweedForecast {
  timestamp: number;
  localTimestamp: number;
  issueTimestamp: number;
  fadedRating: number;
  solidRating: number;
  swell: {
    minBreakingHeight: number;
    maxBreakingHeight: number;
    unit: string;
    components: {
      combined: {
        height: number;
        period: number;
        direction: number;
        compassDirection: string;
      };
    };
  };
  wind: {
    speed: number;
    direction: number;
    compassDirection: string;
    chill: number;
    gusts: number;
    unit: string;
  };
}

class RealApiService {
  private config: RealSurfApiConfig = {};
  private baseUrls = {
    surfline: 'https://services.surfline.com/kbyg',
    magicseaweed: 'https://magicseaweed.com/api',
    stormglass: 'https://api.stormglass.io/v2',
    weatherapi: 'https://api.weatherapi.com/v1'
  };

  setApiKeys(config: RealSurfApiConfig) {
    this.config = { ...this.config, ...config };
    
    // Note: In production, keys should be stored securely on the backend
    Object.entries(config).forEach(([key, value]) => {
      if (value) sessionStorage.setItem(`api-key-${key}`, value);
    });
  }

  loadStoredKeys() {
    const keys = [
      'surflineApiKey',
      'magicSeaweedApiKey', 
      'stormglassApiKey',
      'weatherApiKey'
    ];
    
    keys.forEach(key => {
      const stored = sessionStorage.getItem(`api-key-${key}`);
      if (stored) {
        this.config[key as keyof RealSurfApiConfig] = stored;
      }
    });
  }

  async getSurflineForecast(spotId: string): Promise<any> {
    if (!this.config.surflineApiKey) {
      return this.getMockForecast(spotId);
    }

    try {
      const response = await fetch(
        `${this.baseUrls.surfline}/spots/forecasts/wave?spotId=${spotId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.surflineApiKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Surfline API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSurflineData(data);
    } catch (error) {
      return this.getMockForecast(spotId);
    }
  }

  async getMagicSeaweedForecast(spotId: string): Promise<any> {
    if (!this.config.magicSeaweedApiKey) {
      return this.getMockForecast(spotId);
    }

    try {
      const response = await fetch(
        `${this.baseUrls.magicseaweed}/${this.config.magicSeaweedApiKey}/forecast/?spot_id=${spotId}`
      );

      if (!response.ok) {
        throw new Error(`Magic Seaweed API error: ${response.status}`);
      }

      const data: MagicSeaweedForecast[] = await response.json();
      return this.transformMagicSeaweedData(data);
    } catch (error) {
      return this.getMockForecast(spotId);
    }
  }

  async getStormGlassForecast(lat: number, lng: number): Promise<any> {
    if (!this.config.stormglassApiKey) {
      return this.getMockForecast(`${lat}-${lng}`);
    }

    try {
      const params = 'waveHeight,waveDirection,wavePeriod,windSpeed,windDirection';
      const response = await fetch(
        `${this.baseUrls.stormglass}/weather/point?lat=${lat}&lng=${lng}&params=${params}`,
        {
          headers: {
            'Authorization': this.config.stormglassApiKey
          }
        }
      );

      if (!response.ok) {
        throw new Error(`StormGlass API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformStormGlassData(data);
    } catch (error) {
      return this.getMockForecast(`${lat}-${lng}`);
    }
  }

  private transformSurflineData(data: any) {
    // Transform Surfline data to our format
    return {
      source: 'Surfline',
      spotId: data.associated?.location?.spotId || 'unknown',
      forecast: data.data?.wave || [],
      generated: new Date().toISOString()
    };
  }

  private transformMagicSeaweedData(data: MagicSeaweedForecast[]) {
    // Transform Magic Seaweed data to our format
    return {
      source: 'Magic Seaweed',
      forecast: data.map(item => ({
        timestamp: item.timestamp,
        waveHeight: {
          min: item.swell.minBreakingHeight,
          max: item.swell.maxBreakingHeight,
          avg: (item.swell.minBreakingHeight + item.swell.maxBreakingHeight) / 2
        },
        period: item.swell.components.combined.period,
        windSpeed: item.wind.speed,
        windDirection: item.wind.compassDirection,
        rating: item.solidRating
      })),
      generated: new Date().toISOString()
    };
  }

  private transformStormGlassData(data: any) {
    // Transform StormGlass data to our format
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
    // Fallback mock data when APIs aren't available
    return {
      source: 'Mock Data',
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

  async validateCameraFeed(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      return response.ok || response.status === 0;
    } catch {
      return false;
    }
  }
}

export const realApiService = new RealApiService();
export type { RealSurfApiConfig, SurflineSpot, MagicSeaweedForecast };
