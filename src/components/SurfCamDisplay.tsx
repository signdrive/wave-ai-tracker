
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import SurfCamHeader from './SurfCamHeader';
import RealTimeSurfCam from './RealTimeSurfCam';
import CameraValidationDashboard from './CameraValidationDashboard';
import CameraStatusIndicator from './CameraStatusIndicator';
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
  const locations = Object.entries(surfLocations).slice(0, 6); // Show first 6 for demo

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

          <Tabs value={selectedLocation} onValueChange={setSelectedLocation}>
            <TabsList className="grid w-full grid-cols-6 mb-8">
              {locations.map(([id, location]) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="flex flex-col items-center p-2 relative"
                >
                  <div className="absolute top-1 right-1">
                    <CameraStatusIndicator 
                      status={cameraStatuses[id]} 
                      className="text-xs px-2 py-0.5"
                    />
                  </div>
                  
                  <div className="text-center">
                    <div className="font-medium text-sm">{location.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {location.metadata?.country || 'Unknown'}
                    </div>
                    
                    {location.metadata?.liveCam && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Live
                      </Badge>
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Individual TabsContent for each location */}
            {locations.map(([id, location]) => (
              <TabsContent key={id} value={id}>
                <RealTimeSurfCam
                  spotId={id}
                  spotName={location.name}
                  imageSrc={location.imageSrc}
                  cameraStatus={cameraStatuses[id]}
                  metadata={location.metadata}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default SurfCamDisplay;
