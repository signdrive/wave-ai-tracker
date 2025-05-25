
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
      case 'snapper': return 'Snapper Rocks';
      case 'jeffreys': return 'Jeffreys Bay';
      default: return key;
    }
  };

  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
      {Object.keys(surfLocations).map((key) => (
        <TabsTrigger key={key} value={key}>
          {getTabLabel(key)}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default SurfCamTabs;
