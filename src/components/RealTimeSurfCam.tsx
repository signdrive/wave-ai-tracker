
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSurfConditions, useWeatherData } from '@/hooks/useRealTimeData';
import { Bell } from 'lucide-react';
import WeatherWidget from './WeatherWidget';
import SurfForecast from './SurfForecast';
import HistoricalCharts from './HistoricalCharts';
import FavoriteButton from './FavoriteButton';
import AlertPreferencesDialog from './AlertPreferencesDialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { CameraValidationResult } from '@/utils/cameraValidation';
import SurfCamVideo from './SurfCamVideo';
import SpotMetadata from './SpotMetadata';
import SurfConditionsDisplay from './SurfConditionsDisplay';
import LiveAnalysisPanel from './LiveAnalysisPanel';
import { WeatherData } from '@/types/weather';

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
  const { data: rawWeatherData, isLoading: isWeatherLoading } = useWeatherData(spotId);
  const { user } = useAuth();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  // Transform weather data to ensure it matches WeatherData interface
  const weatherData: WeatherData | undefined = rawWeatherData ? {
    temperature: rawWeatherData.temperature || 0,
    feelsLike: rawWeatherData.feelsLike || rawWeatherData.temperature || 0,
    humidity: rawWeatherData.humidity || 0,
    pressure: rawWeatherData.pressure || 0,
    visibility: rawWeatherData.visibility || 0,
    windSpeed: rawWeatherData.windSpeed || 0,
    windDirection: rawWeatherData.windDirection || 'N',
    windGust: rawWeatherData.windGust || rawWeatherData.windSpeed || 0,
    weatherCondition: rawWeatherData.weatherCondition || 'Unknown',
    weatherIcon: rawWeatherData.weatherIcon || 'unknown',
    uvIndex: rawWeatherData.uvIndex || 0,
    timestamp: rawWeatherData.timestamp || new Date().toISOString(),
    source: rawWeatherData.source || 'Unknown'
  } : undefined;

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
            <SurfCamVideo
              spotName={spotName}
              imageSrc={imageSrc}
              cameraStatus={cameraStatus}
              isRefetching={isRefetching}
              metadata={metadata}
            />

            <CardContent className="p-4">
              {/* Spot Information */}
              <SpotMetadata metadata={metadata} cameraStatus={cameraStatus} />

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
              <SurfConditionsDisplay conditions={conditions} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>

        {/* Real-time Analysis */}
        <LiveAnalysisPanel conditions={conditions} isLoading={isLoading} />
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
