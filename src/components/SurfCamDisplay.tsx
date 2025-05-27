
import React, { useState } from 'react';
import { Tabs } from "@/components/ui/tabs";
import SurfCamHeader from './SurfCamHeader';
import SurfCamTabs from './SurfCamTabs';
import SurfCamContent from './SurfCamContent';
import { useSurfSpots } from '@/hooks/useSurfSpots';
import { useRealTimeUpdates } from '@/hooks/useRealTimeData';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle } from 'lucide-react';
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
  const validatedCameras = Object.keys(cameraStatuses).length;
  const liveCameras = Object.values(cameraStatuses).filter(status => status.status === 'LIVE').length;

  return (
    <section id="surf-cams" className="py-16">
      <div className="container mx-auto px-4">
        <SurfCamHeader />

        <div className="max-w-6xl mx-auto">
          {/* Camera Status Dashboard */}
          <div className="mb-6 p-4 bg-sand/30 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Live: {liveCameras}
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  Placeholder: {Object.values(cameraStatuses).filter(s => s.status === 'PLACEHOLDER').length}
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Offline: {Object.values(cameraStatuses).filter(s => s.status === 'OFFLINE').length}
                </span>
                <span className="text-gray-600">
                  Total: {totalCameras} spots
                </span>
              </div>
              
              <Button
                onClick={validateAllCameras}
                disabled={isValidating}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {isValidating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {isValidating ? 'Validating...' : 'Validate All Cameras'}
              </Button>
            </div>
            
            {validatedCameras > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                Last validation: {validatedCameras}/{totalCameras} cameras checked
              </div>
            )}
          </div>

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
