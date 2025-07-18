
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSurfConditions, useWeatherData } from '@/hooks/useRealTimeData';
import { Bell } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import AlertPreferencesDialog from './AlertPreferencesDialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { CameraValidationResult } from '@/utils/cameraValidation';
import SurfCamVideo from './SurfCamVideo';
import SpotMetadata from './SpotMetadata';
import SurfConditionsDisplay from './SurfConditionsDisplay';
import LiveAnalysisPanel from './LiveAnalysisPanel';

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
