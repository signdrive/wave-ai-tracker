
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Wind, Waves, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { realDataService } from '@/services/realDataService';

interface RealWeatherDisplayProps {
  lat: number;
  lon: number;
  locationName?: string;
}

const RealWeatherDisplay: React.FC<RealWeatherDisplayProps> = ({ lat, lon, locationName }) => {
  const { data: weatherData, isLoading, error, refetch } = useQuery({
    queryKey: ['realWeatherData', lat, lon],
    queryFn: () => realDataService.getRealWeatherData(lat, lon),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
    refetchOnWindowFocus: true,
    refetchInterval: 15 * 60 * 1000, // Refresh every 15 minutes
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading real weather data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Real Weather Data Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600">{error.message}</div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Real Data
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No real weather data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Real Weather - {locationName || `${lat}, ${lon}`}</span>
          <div className="text-xs text-gray-500">
            Source: {weatherData.source}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Thermometer className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{Math.round(weatherData.temperature)}°F</div>
            <div className="text-sm text-gray-500">Temperature</div>
          </div>
          
          <div className="text-center">
            <Wind className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{Math.round(weatherData.windSpeed)} mph</div>
            <div className="text-sm text-gray-500">{weatherData.windDirection}°</div>
          </div>
          
          {weatherData.waveHeight > 0 && (
            <div className="text-center">
              <Waves className="h-8 w-8 mx-auto mb-2 text-cyan-500" />
              <div className="text-2xl font-bold">{weatherData.waveHeight.toFixed(1)} ft</div>
              <div className="text-sm text-gray-500">Wave Height</div>
            </div>
          )}
          
          <div className="text-center">
            <div className="text-xs text-gray-500">Last Updated</div>
            <div className="text-sm font-medium">
              {new Date(weatherData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealWeatherDisplay;
