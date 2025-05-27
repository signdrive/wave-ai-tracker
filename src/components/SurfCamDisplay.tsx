
import React, { useState } from 'react';
import { Tabs } from "@/components/ui/tabs";
import SurfCamHeader from './SurfCamHeader';
import SurfCamTabs from './SurfCamTabs';
import SurfCamContent from './SurfCamContent';
import CameraValidationDashboard from './CameraValidationDashboard';
import { useSurfSpots } from '@/hooks/useSurfSpots';
import { useRealTimeUpdates } from '@/hooks/useRealTimeData';
import { Skeleton } from '@/components/ui/skeleton';

const SurfCamDisplay: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("pipeline");
  const { 
    surfLocations, 
    isLoading, 
    isValidating, 
    validateAllCameras,
    cameraStatuses 
  } = useSurfSpots();
  
  // Set up real-time updates
  useRealTimeUpdates();

  if (isLoading) {
    return (
      <section id="surf-cams" className="py-16">
        <div className="container mx-auto px-4">
          <SurfCamHeader />
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </section>
    );
  }

  const totalCameras = Object.keys(surfLocations).length;

  return (
    <section id="surf-cams" className="py-16">
      <div className="container mx-auto px-4">
        <SurfCamHeader />

        <div className="max-w-6xl mx-auto">
          {/* Camera Status Dashboard */}
          <CameraValidationDashboard
            cameraStatuses={cameraStatuses}
            totalCameras={totalCameras}
            isValidating={isValidating}
            onValidateAll={validateAllCameras}
          />

          <Tabs defaultValue="pipeline" onValueChange={setSelectedLocation}>
            <SurfCamTabs 
              surfLocations={surfLocations}
              onLocationChange={setSelectedLocation}
              cameraStatuses={cameraStatuses}
            />
            <SurfCamContent 
              surfLocations={surfLocations}
              cameraStatuses={cameraStatuses}
            />
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default SurfCamDisplay;
