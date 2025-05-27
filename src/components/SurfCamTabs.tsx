
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCameraStatusIcon } from '@/utils/cameraValidation';
import { CameraValidationResult } from '@/utils/cameraValidation';

interface SurfLocation {
  name: string;
  imageSrc: string;
  metadata?: {
    cameraStatus?: string;
    [key: string]: any;
  };
}

interface SurfCamTabsProps {
  surfLocations: Record<string, SurfLocation>;
  onLocationChange: (location: string) => void;
  cameraStatuses?: Record<string, CameraValidationResult>;
}

const SurfCamTabs: React.FC<SurfCamTabsProps> = ({ 
  surfLocations, 
  onLocationChange, 
  cameraStatuses = {} 
}) => {
  const getTabLabel = (key: string) => {
    const statusIcon = cameraStatuses[key] ? getCameraStatusIcon(cameraStatuses[key].status) : '⚪';
    
    const labels: Record<string, string> = {
      'pipeline': 'Pipeline',
      'mavericks': 'Mavericks',
      'nazare': 'Nazaré',
      'snapper': 'Snapper',
      'jeffreys': 'Jeffreys',
      'teahupoo': "Teahupo'o",
      'uluwatu': 'Uluwatu',
      'hossegor': 'Hossegor',
      'mundaka': 'Mundaka',
      'trestles': 'Trestles',
      'bells': 'Bells',
      'ericeira': 'Ericeira',
      'huntington': 'Huntington',
      'malibu': 'Malibu',
      'raglan': 'Raglan',
      'gold_coast': 'Gold Coast',
      'cloudbreak': 'Cloudbreak',
      'steamer_lane': 'Steamer Lane',
      'bondi': 'Bondi',
      'rincon': 'Rincon',
      'taghazout': 'Taghazout',
      'fuerteventura': 'Fuerteventura',
      'biarritz': 'Biarritz',
      'manly': 'Manly',
      'margaret_river': 'Margaret River'
    };
    
    const label = labels[key] || key;
    return `${statusIcon} ${label}`;
  };

  const locationKeys = Object.keys(surfLocations);
  const firstRowKeys = locationKeys.slice(0, 6);
  const secondRowKeys = locationKeys.slice(6, 12);
  const thirdRowKeys = locationKeys.slice(12, 18);
  const fourthRowKeys = locationKeys.slice(18);

  return (
    <div className="mb-8 space-y-2">
      {/* First row */}
      <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full">
        {firstRowKeys.map((key) => (
          <TabsTrigger key={key} value={key} className="text-xs md:text-sm">
            {getTabLabel(key)}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {/* Second row */}
      {secondRowKeys.length > 0 && (
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full">
          {secondRowKeys.map((key) => (
            <TabsTrigger key={key} value={key} className="text-xs md:text-sm">
              {getTabLabel(key)}
            </TabsTrigger>
          ))}
        </TabsList>
      )}
      
      {/* Third row */}
      {thirdRowKeys.length > 0 && (
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full">
          {thirdRowKeys.map((key) => (
            <TabsTrigger key={key} value={key} className="text-xs md:text-sm">
              {getTabLabel(key)}
            </TabsTrigger>
          ))}
        </TabsList>
      )}
      
      {/* Fourth row */}
      {fourthRowKeys.length > 0 && (
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full">
          {fourthRowKeys.map((key) => (
            <TabsTrigger key={key} value={key} className="text-xs md:text-sm">
              {getTabLabel(key)}
            </TabsTrigger>
          ))}
        </TabsList>
      )}
    </div>
  );
};

export default SurfCamTabs;
