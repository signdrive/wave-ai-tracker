
import React from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Locate } from 'lucide-react';

const MapControls: React.FC = () => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 10);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleLocateUser}
        className="bg-white hover:bg-gray-50 shadow-md"
        title="Find my location"
      >
        <Locate className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomIn}
        className="bg-white hover:bg-gray-50 shadow-md"
        title="Zoom in"
      >
        <Plus className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomOut}
        className="bg-white hover:bg-gray-50 shadow-md"
        title="Zoom out"
      >
        <Minus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default MapControls;
