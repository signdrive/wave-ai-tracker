
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import RealTimeSurfCam from './RealTimeSurfCam';

interface SurfCamContentProps {
  surfLocations: Record<string, any>;
  cameraStatuses: Record<string, any>;
}

const SurfCamContent: React.FC<SurfCamContentProps> = ({
  surfLocations,
  cameraStatuses
}) => {
  return (
    <>
      {Object.entries(surfLocations).map(([spotId, location]) => (
        <TabsContent key={spotId} value={spotId} className="mt-4">
          <RealTimeSurfCam
            spotId={spotId}
            spotName={location.name}
            imageSrc={location.imageSrc}
            cameraStatus={cameraStatuses[spotId]}
            metadata={location.metadata}
          />
        </TabsContent>
      ))}
    </>
  );
};

export default SurfCamContent;
