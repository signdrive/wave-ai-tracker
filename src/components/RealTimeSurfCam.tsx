
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useSurfConditions, useWeatherData } from '@/hooks/useRealTimeData';
import { RefreshCw, Thermometer, Wind, Users, Waves, Bell, MapPin, Info } from 'lucide-react';
import WeatherWidget from './WeatherWidget';
import SurfForecast from './SurfForecast';
import HistoricalCharts from './HistoricalCharts';
import FavoriteButton from './FavoriteButton';
import AlertPreferencesDialog from './AlertPreferencesDialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { CameraValidationResult, getCameraStatusIcon, getCameraStatusText } from '@/utils/cameraValidation';
import { Badge } from '@/components/ui/badge';

interface RealTimeSurfCamProps {
  spotId: string;
  spotName: string;
  imageSrc: string;
  cameraStatus?: CameraValidationResult;
  metadata?: {
    lat?: number;
    lon?: number;
    country?: string;
    state?: string;
    waveType?: string;
    difficulty?: string;
    bestSwellDirection?: string;
    bestWind?: string;
    bestTide?: string;
    crowdFactor?: string;
    liveCam?: string;
    [key: string]: any;
  };
}

const RealTimeSurfCam: React.FC<RealTimeSurfCamProps> = ({ 
  spotId, 
  spotName, 
  imageSrc, 
  cameraStatus,
  metadata 
}) => {
  const { data: conditions, isLoading, error, isRefetching } = useSurfConditions(spotId);
  const { data: weatherData, isLoading: isWeatherLoading } = useWeatherData(spotId);
  const { user } = useAuth();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const handleAuthRequired = () => {
    setIsAuthDialogOpen(true);
  };

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
              
              {/* Camera Status Indicator */}
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  {cameraStatus ? getCameraStatusText(cameraStatus.status) : 'Live'}
                </div>
              </div>
              
              <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                {isRefetching && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} Local
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <h3 className="font-bold text-lg">{spotName}</h3>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  {metadata?.country && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {metadata.country}{metadata.state && `, ${metadata.state}`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              {/* Spot Information */}
              {metadata && (
                <div className="mb-4 p-3 bg-sand/30 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {metadata.waveType && (
                      <div>
                        <span className="font-medium text-ocean-dark">Wave Type:</span>
                        <span className="ml-2">{metadata.waveType}</span>
                      </div>
                    )}
                    {metadata.difficulty && (
                      <div>
                        <span className="font-medium text-ocean-dark">Difficulty:</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {metadata.difficulty}
                        </Badge>
                      </div>
                    )}
                    {metadata.bestSwellDirection && (
                      <div>
                        <span className="font-medium text-ocean-dark">Best Swell:</span>
                        <span className="ml-2">{metadata.bestSwellDirection}</span>
                      </div>
                    )}
                    {metadata.bestWind && (
                      <div>
                        <span className="font-medium text-ocean-dark">Best Wind:</span>
                        <span className="ml-2">{metadata.bestWind}</span>
                      </div>
                    )}
                    {metadata.bestTide && (
                      <div>
                        <span className="font-medium text-ocean-dark">Best Tide:</span>
                        <span className="ml-2">{metadata.bestTide}</span>
                      </div>
                    )}
                    {metadata.crowdFactor && (
                      <div>
                        <span className="font-medium text-ocean-dark">Crowd Level:</span>
                        <span className="ml-2">{metadata.crowdFactor}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Camera Status Info */}
                  {cameraStatus && (
                    <div className="mt-3 pt-3 border-t border-sand/50">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Camera Status: {getCameraStatusIcon(cameraStatus.status)} {getCameraStatusText(cameraStatus.status)}</span>
                        {cameraStatus.lastChecked && (
                          <span>Last checked: {new Date(cameraStatus.lastChecked).toLocaleTimeString()}</span>
                        )}
                      </div>
                      {cameraStatus.responseTime && (
                        <div className="text-xs text-gray-500 mt-1">
                          Response time: {cameraStatus.responseTime}ms
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mb-4">
                <FavoriteButton 
                  spotId={spotId} 
                  spotName={spotName} 
                  onAuthRequired={handleAuthRequired}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!user) {
                      handleAuthRequired();
                      return;
                    }
                    setIsAlertDialogOpen(true);
                  }}
                >
                  <Bell className="w-4 h-4 mr-1" />
                  Set Alerts
                </Button>
              </div>

              {/* Live Conditions */}
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

      {/* Alert Preferences Dialog */}
      <AlertPreferencesDialog
        open={isAlertDialogOpen}
        onOpenChange={setIsAlertDialogOpen}
        spotId={spotId}
        spotName={spotName}
      />
    </div>
  );
};

export default RealTimeSurfCam;
