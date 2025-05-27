
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import RealTimeSurfCam from './RealTimeSurfCam';
import { CameraValidationResult } from '@/utils/cameraValidation';

interface SurfLocation {
  name: string;
  imageSrc: string;
  metadata?: {
    [key: string]: any;
  };
}

interface SurfCamContentProps {
  surfLocations: Record<string, SurfLocation>;
  cameraStatuses?: Record<string, CameraValidationResult>;
}

const SurfCamContent: React.FC<SurfCamContentProps> = ({ 
  surfLocations, 
  cameraStatuses = {} 
}) => {
  return (
    <>
      {Object.entries(surfLocations).map(([key, location]) => (
        <TabsContent key={key} value={key} className="mt-0">
          <RealTimeSurfCam
            spotId={key}
            spotName={location.name}
            imageSrc={location.imageSrc}
            cameraStatus={cameraStatuses[key]}
            metadata={location.metadata}
          />
        </TabsContent>
      ))}
    </>
  );
};

export default SurfCamContent;
