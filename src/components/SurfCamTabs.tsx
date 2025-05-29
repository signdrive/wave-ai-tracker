
import React from 'react';
import { TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import CameraStatusIndicator from './CameraStatusIndicator';
import { CameraValidationResult } from '@/utils/cameraValidation';

interface SurfCamTabsProps {
  surfLocations: Record<string, any>;
  onLocationChange: (location: string) => void;
  cameraStatuses: Record<string, CameraValidationResult>;
}

const SurfCamTabs: React.FC<SurfCamTabsProps> = ({
  surfLocations,
  onLocationChange,
  cameraStatuses
}) => {
  const locations = Object.entries(surfLocations).slice(0, 6); // Show first 6 for demo

  return (
    <>
      {locations.map(([id, location]) => (
        <TabsTrigger
          key={id}
          value={id}
          className="flex flex-col items-center p-2 relative"
          onClick={() => onLocationChange(id)}
        >
          <div className="absolute top-1 right-1">
            <CameraStatusIndicator status={cameraStatuses[id]} size="sm" />
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
    </>
  );
};

export default SurfCamTabs;
