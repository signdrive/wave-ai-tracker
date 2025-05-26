import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useSurfConditions, useWeatherData } from '@/hooks/useRealTimeData';
import { RefreshCw, Thermometer, Wind, Users, Waves } from 'lucide-react';
import WeatherWidget from './WeatherWidget';
import SurfForecast from './SurfForecast';
import HistoricalCharts from './HistoricalCharts';

interface RealTimeSurfCamProps {
  spotId: string;
  spotName: string;
  imageSrc: string;
}

const RealTimeSurfCam: React.FC<RealTimeSurfCamProps> = ({ spotId, spotName, imageSrc }) => {
  const { data: conditions, isLoading, error, isRefetching } = useSurfConditions(spotId);
  const { data: weatherData, isLoading: isWeatherLoading } = useWeatherData(spotId);

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-red-500">Error loading surf conditions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weather Widget */}
      <WeatherWidget 
        weatherData={weatherData} 
        isLoading={isWeatherLoading} 
        spotName={spotName}
      />

      {/* Current Surf Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Surf Cam Video */}
        <div className="md:col-span-2">
          <Card>
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <img 
                src={imageSrc} 
                alt={spotName} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Live
              </div>
              <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                {isRefetching && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} Local
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <h3 className="font-bold text-lg">{spotName}</h3>
                <p className="text-sm opacity-90">Real-time conditions</p>
              </div>
            </div>

            <CardContent className="p-4">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
              ) : conditions ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <Waves className="w-4 h-4 mr-2 text-ocean" />
                    <div>
                      <p className="text-xs text-gray-500">Wave Height</p>
                      <p className="font-semibold text-lg">{conditions.waveHeight.toFixed(1)}ft</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div>
                      <p className="text-xs text-gray-500">Period</p>
                      <p className="font-semibold text-lg">{conditions.period.toFixed(0)}s</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Wind className="w-4 h-4 mr-2 text-ocean" />
                    <div>
                      <p className="text-xs text-gray-500">Wind</p>
                      <p className="font-semibold text-lg">{conditions.windSpeed.toFixed(0)}mph {conditions.windDirection}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="w-4 h-4 mr-2 text-ocean" />
                    <div>
                      <p className="text-xs text-gray-500">Water Temp</p>
                      <p className="font-semibold text-lg">{conditions.temperature.toFixed(0)}°F</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Real-time Analysis */}
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Live Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : conditions ? (
                <>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Crowd Level</label>
                      <span className="text-sm text-gray-500">
                        {conditions.crowdLevel < 30 ? 'Low' : conditions.crowdLevel < 70 ? 'Moderate' : 'High'}
                      </span>
                    </div>
                    <Progress value={conditions.crowdLevel} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="bg-sand/50 p-3 rounded-md">
                      <p className="text-sm font-medium text-ocean-dark">Sets Per Hour</p>
                      <p className="text-sm text-gray-600">{conditions.setsPerHour} sets detected</p>
                    </div>

                    <div className="bg-sand/50 p-3 rounded-md">
                      <p className="text-sm font-medium text-ocean-dark">Last Update</p>
                      <p className="text-sm text-gray-600">
                        {new Date(conditions.lastUpdated).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </p>
                    </div>

                    <div className="bg-sand/50 p-3 rounded-md">
                      <p className="text-sm font-medium text-ocean-dark">Conditions</p>
                      <p className="text-sm text-gray-600">
                        {conditions.waveHeight > 6 ? 'Epic' : conditions.waveHeight > 4 ? 'Good' : conditions.waveHeight > 2 ? 'Fair' : 'Small'} waves today
                      </p>
                    </div>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 7-Day Surf Forecast */}
      <SurfForecast spotId={spotId} spotName={spotName} />

      {/* Historical Analytics Charts */}
      <HistoricalCharts spotId={spotId} spotName={spotName} />
    </div>
  );
};

export default RealTimeSurfCam;
