
import React from 'react';
import { useMap } from 'react-leaflet';
import { ZoomControl } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Minus, Locate } from 'lucide-react';

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
    <>
      <ZoomControl position="topright" />
      <div className="leaflet-control-container">
        <div className="leaflet-top leaflet-left">
          <div className="leaflet-control leaflet-bar">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLocateUser}
              className="mb-2 bg-white hover:bg-gray-50"
              title="Find my location"
            >
              <Locate className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapControls;
