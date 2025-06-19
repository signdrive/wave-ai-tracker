
// Generated from https://github.com/open-meteo/open-meteo API specification
export interface OpenMeteoCurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface OpenMeteoHourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  rain: number[];
  showers: number[];
  snowfall: number[];
  snow_depth: number[];
  weather_code: number[];
  pressure_msl: number[];
  surface_pressure: number[];
  cloud_cover: number[];
  visibility: number[];
  evapotranspiration: number[];
  et0_fao_evapotranspiration: number[];
  vapour_pressure_deficit: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  wind_gusts_10m: number[];
  uv_index: number[];
  uv_index_clear_sky: number[];
}

export interface OpenMeteoDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  daylight_duration: number[];
  sunshine_duration: number[];
  uv_index_max: number[];
  uv_index_clear_sky_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
  shortwave_radiation_sum: number[];
  et0_fao_evapotranspiration: number[];
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather?: OpenMeteoCurrentWeather;
  hourly?: OpenMeteoHourly;
  daily?: OpenMeteoDaily;
}

export interface OpenMeteoError {
  error: boolean;
  reason: string;
}

// Weather code mappings based on WMO Weather interpretation codes
export const WEATHER_CODE_MAPPINGS: Record<number, { description: string; icon: string; emoji: string }> = {
  0: { description: 'Clear sky', icon: 'clear-day', emoji: '☀️' },
  1: { description: 'Mainly clear', icon: 'partly-cloudy-day', emoji: '🌤️' },
  2: { description: 'Partly cloudy', icon: 'partly-cloudy-day', emoji: '⛅' },
  3: { description: 'Overcast', icon: 'cloudy', emoji: '☁️' },
  45: { description: 'Fog', icon: 'fog', emoji: '🌫️' },
  48: { description: 'Depositing rime fog', icon: 'fog', emoji: '🌫️' },
  51: { description: 'Light drizzle', icon: 'drizzle', emoji: '🌦️' },
  53: { description: 'Moderate drizzle', icon: 'drizzle', emoji: '🌦️' },
  55: { description: 'Dense drizzle', icon: 'drizzle', emoji: '🌦️' },
  56: { description: 'Light freezing drizzle', icon: 'sleet', emoji: '🌨️' },
  57: { description: 'Dense freezing drizzle', icon: 'sleet', emoji: '🌨️' },
  61: { description: 'Slight rain', icon: 'rain', emoji: '🌧️' },
  63: { description: 'Moderate rain', icon: 'rain', emoji: '🌧️' },
  65: { description: 'Heavy rain', icon: 'rain', emoji: '🌧️' },
  66: { description: 'Light freezing rain', icon: 'sleet', emoji: '🌨️' },
  67: { description: 'Heavy freezing rain', icon: 'sleet', emoji: '🌨️' },
  71: { description: 'Slight snow fall', icon: 'snow', emoji: '❄️' },
  73: { description: 'Moderate snow fall', icon: 'snow', emoji: '❄️' },
  75: { description: 'Heavy snow fall', icon: 'snow', emoji: '❄️' },
  77: { description: 'Snow grains', icon: 'snow', emoji: '❄️' },
  80: { description: 'Slight rain showers', icon: 'rain', emoji: '🌦️' },
  81: { description: 'Moderate rain showers', icon: 'rain', emoji: '🌦️' },
  82: { description: 'Violent rain showers', icon: 'rain', emoji: '🌦️' },
  85: { description: 'Slight snow showers', icon: 'snow', emoji: '🌨️' },
  86: { description: 'Heavy snow showers', icon: 'snow', emoji: '🌨️' },
  95: { description: 'Thunderstorm', icon: 'thunderstorm', emoji: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: 'thunderstorm', emoji: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'thunderstorm', emoji: '⛈️' }
};
