
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { openMeteoService } from '../openMeteoService';
import { OpenMeteoResponse } from '@/types/openMeteo';

// Mock response based on Open-Meteo GitHub repo examples
const mockOpenMeteoResponse: OpenMeteoResponse = {
  latitude: 52.52,
  longitude: 13.41,
  generationtime_ms: 0.123,
  utc_offset_seconds: 7200,
  timezone: 'Europe/Berlin',
  timezone_abbreviation: 'CEST',
  elevation: 38.0,
  current_weather: {
    temperature: 21.3,
    windspeed: 10.2,
    winddirection: 230,
    weathercode: 1,
    is_day: 1,
    time: '2023-06-15T12:00'
  }
};

// Mock fetch
global.fetch = vi.fn();
const mockFetch = fetch as vi.MockedFunction<typeof fetch>;

describe('OpenMeteoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentWeather', () => {
    it('should fetch current weather successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenMeteoResponse),
      } as Response);

      const result = await openMeteoService.getCurrentWeather(52.52, 13.41);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.open-meteo.com/v1/forecast'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Accept': 'application/json',
            'User-Agent': 'Wave-AI-Tracker/1.0'
          })
        })
      );

      expect(result).toEqual(mockOpenMeteoResponse);
    });

    it('should handle rate limiting (429 error) per GitHub Issue #23', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          statusText: 'Too Many Requests',
          json: () => Promise.resolve({ error: true, reason: 'Rate limited' }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockOpenMeteoResponse),
        } as Response);

      const result = await openMeteoService.getCurrentWeather(52.52, 13.41);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockOpenMeteoResponse);
    });

    it('should handle server errors with retry', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockOpenMeteoResponse),
        } as Response);

      const result = await openMeteoService.getCurrentWeather(52.52, 13.41);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockOpenMeteoResponse);
    });

    it('should throw error after max retries', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(
        openMeteoService.getCurrentWeather(52.52, 13.41)
      ).rejects.toThrow('Server error: 500');

      expect(mockFetch).toHaveBeenCalledTimes(2); // Initial + 1 retry
    });

    it('should not retry on client errors (4xx)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ error: true, reason: 'Invalid coordinates' }),
      } as Response);

      await expect(
        openMeteoService.getCurrentWeather(52.52, 13.41)
      ).rejects.toThrow('Open-Meteo API error: Invalid coordinates');

      expect(mockFetch).toHaveBeenCalledTimes(1); // No retry on client error
    });
  });

  describe('weather code mappings', () => {
    it('should return correct weather description for clear sky', () => {
      const result = openMeteoService.getWeatherDescription(0);
      expect(result).toEqual({
        description: 'Clear sky',
        icon: 'clear-day',
        emoji: '☀️'
      });
    });

    it('should return correct weather description for thunderstorm', () => {
      const result = openMeteoService.getWeatherDescription(95);
      expect(result).toEqual({
        description: 'Thunderstorm',
        icon: 'thunderstorm',
        emoji: '⛈️'
      });
    });

    it('should return unknown for invalid weather code', () => {
      const result = openMeteoService.getWeatherDescription(999);
      expect(result).toEqual({
        description: 'Unknown',
        icon: 'unknown',
        emoji: '❓'
      });
    });
  });

  describe('utility functions', () => {
    it('should convert wind direction degrees to compass', () => {
      expect(openMeteoService.getWindDirection(0)).toBe('N');
      expect(openMeteoService.getWindDirection(90)).toBe('E');
      expect(openMeteoService.getWindDirection(180)).toBe('S');
      expect(openMeteoService.getWindDirection(270)).toBe('W');
      expect(openMeteoService.getWindDirection(45)).toBe('NE');
    });

    it('should convert Celsius to Fahrenheit correctly', () => {
      expect(openMeteoService.celsiusToFahrenheit(0)).toBe(32);
      expect(openMeteoService.celsiusToFahrenheit(100)).toBe(212);
      expect(openMeteoService.celsiusToFahrenheit(-40)).toBe(-40);
    });

    it('should convert km/h to mph correctly', () => {
      expect(openMeteoService.kmhToMph(100)).toBeCloseTo(62.14, 1);
      expect(openMeteoService.kmhToMph(0)).toBe(0);
    });
  });

  describe('getForecast', () => {
    it('should include correct parameters for detailed forecast', async () => {
      const forecastResponse = {
        ...mockOpenMeteoResponse,
        hourly: {
          time: ['2023-06-15T00:00', '2023-06-15T01:00'],
          temperature_2m: [20.0, 19.5],
          relative_humidity_2m: [65, 70],
          apparent_temperature: [22.0, 21.0],
          precipitation_probability: [10, 15],
          precipitation: [0.0, 0.1],
          rain: [0.0, 0.1],
          weather_code: [1, 2],
          pressure_msl: [1013.2, 1013.0],
          cloud_cover: [25, 30],
          visibility: [24140, 24140],
          wind_speed_10m: [10.2, 9.8],
          wind_direction_10m: [230, 235],
          wind_gusts_10m: [15.0, 14.5],
          uv_index: [6.5, 5.2]
        },
        daily: {
          time: ['2023-06-15'],
          weather_code: [1],
          temperature_2m_max: [25.0],
          temperature_2m_min: [18.0],
          apparent_temperature_max: [27.0],
          apparent_temperature_min: [20.0],
          sunrise: ['2023-06-15T04:52'],
          sunset: ['2023-06-15T21:18'],
          daylight_duration: [59160.0],
          sunshine_duration: [45000.0],
          uv_index_max: [8.2],
          uv_index_clear_sky_max: [9.1],
          precipitation_sum: [0.2],
          rain_sum: [0.2],
          showers_sum: [0.0],
          snowfall_sum: [0.0],
          precipitation_hours: [1.0],
          precipitation_probability_max: [20],
          wind_speed_10m_max: [12.5],
          wind_gusts_10m_max: [18.0],
          wind_direction_10m_dominant: [230],
          shortwave_radiation_sum: [25.8],
          et0_fao_evapotranspiration: [5.2]
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(forecastResponse),
      } as Response);

      const result = await openMeteoService.getForecast(52.52, 13.41, 7);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('hourly=' + encodeURIComponent([
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
        ].join(','))),
        expect.any(Object)
      );

      expect(result).toEqual(forecastResponse);
    });
  });
});
