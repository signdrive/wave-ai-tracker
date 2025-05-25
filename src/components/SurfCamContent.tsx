
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import RealTimeSurfCam from './RealTimeSurfCam';

interface SurfLocation {
  name: string;
  imageSrc: string;
}

interface SurfCamContentProps {
  surfLocations: Record<string, SurfLocation>;
}

const SurfCamContent: React.FC<SurfCamContentProps> = ({ surfLocations }) => {
  return (
    <>
      {Object.entries(surfLocations).map(([key, location]) => (
        <TabsContent key={key} value={key} className="mt-0">
          <RealTimeSurfCam
            spotId={key}
            spotName={location.name}
            imageSrc={location.imageSrc}
          />
        </TabsContent>
      ))}
    </>
  );
};

export default SurfCamContent;
