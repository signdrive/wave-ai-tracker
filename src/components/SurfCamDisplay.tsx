
import React, { useState } from 'react';
import { Tabs } from "@/components/ui/tabs";
import SurfCamHeader from './SurfCamHeader';
import SurfCamTabs from './SurfCamTabs';
import SurfCamContent from './SurfCamContent';
import { useRealTimeUpdates } from '@/hooks/useRealTimeData';

const SurfCamDisplay: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("pipeline");
  
  // Set up real-time updates
  useRealTimeUpdates();

  const surfLocations = {
    "pipeline": {
      name: "Pipeline, Oahu",
      imageSrc: "https://images.unsplash.com/photo-1535682215715-c31b9db51592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    "mavericks": {
      name: "Mavericks, California",
      imageSrc: "https://images.unsplash.com/photo-1565142453412-4e95c3ff81b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    "nazare": {
      name: "Nazaré, Portugal",
      imageSrc: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    "snapper": {
      name: "Snapper Rocks, Australia",
      imageSrc: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1173&q=80"
    },
    "jeffreys": {
      name: "Jeffreys Bay, South Africa",
      imageSrc: "https://images.unsplash.com/photo-1626450787667-830beef2d6bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    "teahupoo": {
      name: "Teahupo'o, Tahiti",
      imageSrc: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    "uluwatu": {
      name: "Uluwatu, Bali",
      imageSrc: "https://images.unsplash.com/photo-1573160103600-f42db24835d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    "hossegor": {
      name: "Hossegor, France",
      imageSrc: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    "mundaka": {
      name: "Mundaka, Spain",
      imageSrc: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    "trestles": {
      name: "Trestles, California",
      imageSrc: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    "bells": {
      name: "Bells Beach, Australia",
      imageSrc: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    "ericeira": {
      name: "Ericeira, Portugal",
      imageSrc: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    }
  };

  return (
    <section id="surf-cams" className="py-16">
      <div className="container mx-auto px-4">
        <SurfCamHeader />

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="pipeline" onValueChange={setSelectedLocation}>
            <SurfCamTabs 
              surfLocations={surfLocations}
              onLocationChange={setSelectedLocation}
            />
            <SurfCamContent surfLocations={surfLocations} />
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default SurfCamDisplay;
