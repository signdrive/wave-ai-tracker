
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wind, Thermometer, Eye, Droplets, Gauge } from 'lucide-react';

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

interface WeatherWidgetProps {
  weatherData?: WeatherData;
  isLoading: boolean;
  spotName: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weatherData, isLoading, spotName }) => {
  const getWindDirectionDegrees = (direction: string) => {
    const directions = {
      'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
      'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
      'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
      'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    };
    return directions[direction as keyof typeof directions] || 0;
  };

  const getWeatherEmoji = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return '☀️';
      case 'partly cloudy': return '⛅';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'stormy': return '⛈️';
      case 'foggy': return '🌫️';
      default: return '🌤️';
    }
  };

  const getUVLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return { level: 'Low', color: 'text-green-600' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-600' };
    if (uvIndex <= 7) return { level: 'High', color: 'text-orange-600' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-600' };
    return { level: 'Extreme', color: 'text-purple-600' };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Thermometer className="w-4 h-4 mr-2" />
            Weather Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) return null;

  const uvData = getUVLevel(weatherData.uvIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Thermometer className="w-4 h-4 mr-2" />
            Weather at {spotName}
          </div>
          <div className="flex items-center text-2xl">
            {getWeatherEmoji(weatherData.weatherCondition)}
            <span className="ml-2 text-lg font-normal">{weatherData.weatherCondition}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Temperature Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-ocean/5 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Temperature</span>
              <Thermometer className="w-4 h-4 text-ocean" />
            </div>
            <div className="text-2xl font-bold text-ocean-dark">{weatherData.temperature}°F</div>
            <div className="text-xs text-gray-500">Feels like {weatherData.feelsLike}°F</div>
          </div>
          
          <div className="bg-sand/50 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">UV Index</span>
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">{weatherData.uvIndex}</div>
            <div className={`text-xs font-medium ${uvData.color}`}>{uvData.level}</div>
          </div>
        </div>

        {/* Wind Section */}
        <div className="bg-ocean/5 p-4 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Wind Conditions</span>
            <Wind className="w-4 h-4 text-ocean" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div 
                  className="w-6 h-6 flex items-center justify-center"
                  style={{ transform: `rotate(${getWindDirectionDegrees(weatherData.windDirection)}deg)` }}
                >
                  ↑
                </div>
              </div>
              <div className="text-lg font-bold">{weatherData.windSpeed} mph</div>
              <div className="text-xs text-gray-500">{weatherData.windDirection}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{weatherData.windGust} mph</div>
              <div className="text-xs text-gray-500">Gusts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{weatherData.windDirection}</div>
              <div className="text-xs text-gray-500">Direction</div>
            </div>
          </div>
        </div>

        {/* Additional Conditions */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Droplets className="w-4 h-4 text-blue-500" />
            </div>
            <div className="font-semibold">{weatherData.humidity}%</div>
            <div className="text-xs text-gray-500">Humidity</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Gauge className="w-4 h-4 text-gray-600" />
            </div>
            <div className="font-semibold">{weatherData.pressure} mb</div>
            <div className="text-xs text-gray-500">Pressure</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Eye className="w-4 h-4 text-gray-600" />
            </div>
            <div className="font-semibold">{weatherData.visibility} mi</div>
            <div className="text-xs text-gray-500">Visibility</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
