
// Centralized error handling and fallback system
class ErrorHandlingService {
  private fallbackKeys: Record<string, string> = {};
  private errorCounts: Map<string, number> = new Map();
  private maxRetries = 3;
  private isInitialized = false;

  // Initialize with safe defaults to prevent API calls
  initialize() {
    if (this.isInitialized) return;
    
    // Set safe defaults to prevent API calls
    this.fallbackKeys = {
      stormglass: 'demo-key',
      weatherapi: 'demo-key',
      noaa: 'demo-key'
    };
    
    this.isInitialized = true;
    console.log('Error handling service initialized with safe defaults');
  }

  // Safe number conversion with toFixed protection
  safeToFixed(value: any, digits: number = 2): string {
    if (value === null || value === undefined || value === '') {
      return digits === 0 ? '0' : '0.' + '0'.repeat(digits);
    }
    
    const num = Number(value);
    if (Number.isNaN(num) || !Number.isFinite(num)) {
      return digits === 0 ? '0' : '0.' + '0'.repeat(digits);
    }
    
    try {
      return num.toFixed(digits);
    } catch (error) {
      console.warn('toFixed error caught:', error);
      return digits === 0 ? '0' : '0.' + '0'.repeat(digits);
    }
  }

  // Safe API call wrapper with fallbacks - NO DIRECT SUPABASE CALLS
  async safeApiCall<T>(
    apiCall: () => Promise<T>,
    fallback: T,
    context: string = 'unknown'
  ): Promise<T> {
    this.initialize();
    
    const errorKey = `api_error_${context}`;
    const currentErrors = this.errorCounts.get(errorKey) || 0;

    if (currentErrors >= this.maxRetries) {
      console.warn(`Max retries exceeded for ${context}, using fallback`);
      return fallback;
    }

    try {
      const result = await apiCall();
      // Reset error count on success
      this.errorCounts.delete(errorKey);
      return result;
    } catch (error) {
      this.errorCounts.set(errorKey, currentErrors + 1);
      console.error(`API call failed for ${context}:`, error);
      
      // Log to console for debugging
      console.warn(`Using fallback for ${context} due to error:`, error instanceof Error ? error.message : 'Unknown error');
      
      return fallback;
    }
  }

  // Store fallback keys in localStorage (no Supabase calls)
  setFallbackKey(service: string, key: string): void {
    if (key && key.trim()) {
      this.fallbackKeys[service] = key;
      try {
        localStorage.setItem(`fallback_${service}_key`, key);
      } catch (error) {
        console.warn('Could not save to localStorage:', error);
      }
    }
  }

  // Get fallback key (no Supabase calls)
  getFallbackKey(service: string): string | null {
    this.initialize();
    return this.fallbackKeys[service] || (() => {
      try {
        return localStorage.getItem(`fallback_${service}_key`);
      } catch (error) {
        console.warn('Could not read from localStorage:', error);
        return null;
      }
    })();
  }

  // Reset error counts (useful for manual retry)
  resetErrorCounts(): void {
    this.errorCounts.clear();
  }

  // Get mock data for development
  getMockSurfConditions(spotId: string) {
    return {
      waveHeight: Number(this.safeToFixed(Math.random() * 4 + 2, 1)),
      period: Number(this.safeToFixed(Math.random() * 5 + 8, 0)),
      windSpeed: Number(this.safeToFixed(Math.random() * 15 + 5, 0)),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      temperature: Number(this.safeToFixed(Math.random() * 10 + 20, 0)),
      crowdLevel: Math.floor(Math.random() * 5) + 1,
      setsPerHour: Math.floor(Math.random() * 20) + 10,
      lastUpdated: new Date().toISOString(),
      spotId
    };
  }

  // Get mock weather data
  getMockWeatherData(spotName: string) {
    return {
      temperature: Number(this.safeToFixed(Math.random() * 15 + 15, 0)),
      feelsLike: Number(this.safeToFixed(Math.random() * 15 + 15, 0)),
      humidity: Number(this.safeToFixed(Math.random() * 40 + 40, 0)),
      pressure: Number(this.safeToFixed(Math.random() * 50 + 1000, 0)),
      visibility: Number(this.safeToFixed(Math.random() * 10 + 5, 0)),
      windSpeed: Number(this.safeToFixed(Math.random() * 20 + 5, 0)),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      windGust: Number(this.safeToFixed(Math.random() * 25 + 10, 0)),
      weatherCondition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Overcast'][Math.floor(Math.random() * 4)],
      weatherIcon: '☀️',
      uvIndex: Number(this.safeToFixed(Math.random() * 8 + 1, 0)),
      location: spotName
    };
  }
}

export const errorHandlingService = new ErrorHandlingService();

// Global toFixed protection - monkey patch for safety
const originalToFixed = Number.prototype.toFixed;
Number.prototype.toFixed = function(digits?: number) {
  if (typeof this !== 'number' || !Number.isFinite(this)) {
    console.warn('toFixed called on invalid number:', this);
    const safeDigits = digits || 0;
    return safeDigits === 0 ? '0' : '0.' + '0'.repeat(safeDigits);
  }
  return originalToFixed.call(this, digits);
};
