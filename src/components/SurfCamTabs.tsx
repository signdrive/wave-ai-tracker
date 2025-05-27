
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SurfLocation {
  name: string;
  imageSrc: string;
}

interface SurfCamTabsProps {
  surfLocations: Record<string, SurfLocation>;
  onLocationChange: (location: string) => void;
}

const SurfCamTabs: React.FC<SurfCamTabsProps> = ({ surfLocations, onLocationChange }) => {
  const getTabLabel = (key: string) => {
    switch (key) {
      case 'pipeline': return 'Pipeline';
      case 'mavericks': return 'Mavericks';
      case 'nazare': return 'Nazaré';
      case 'snapper': return 'Snapper Rocks';
      case 'jeffreys': return 'Jeffreys Bay';
      case 'teahupoo': return "Teahupo'o";
      case 'uluwatu': return 'Uluwatu';
      case 'hossegor': return 'Hossegor';
      case 'mundaka': return 'Mundaka';
      case 'trestles': return 'Trestles';
      case 'bells': return 'Bells Beach';
      case 'ericeira': return 'Ericeira';
      default: return key;
    }
  };

  return (
    <div className="mb-8">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-4">
        {Object.keys(surfLocations).slice(0, 6).map((key) => (
          <TabsTrigger key={key} value={key} className="text-xs md:text-sm">
            {getTabLabel(key)}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {Object.keys(surfLocations).slice(6).map((key) => (
          <TabsTrigger key={key} value={key} className="text-xs md:text-sm">
            {getTabLabel(key)}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};

export default SurfCamTabs;
