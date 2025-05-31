
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, type MapContainerProps } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SafeMapProps extends Omit<MapContainerProps, 'children'> {
  children?: React.ReactNode;
}

const SafeMap: React.FC<SafeMapProps> = ({ children, ...props }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Fix Leaflet default marker icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
    
    setIsMounted(true);
  }, []);

  // Prevent SSR issues - only render on client
  if (!isMounted || typeof window === 'undefined') {
    return (
      <div className="h-[100vh] w-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500 animate-pulse">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      style={{ height: '100vh', width: '100%' }}
      className="z-0"
      scrollWheelZoom={true}
      attributionControl={true}
      zoomControl={true}
      {...props}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};

export default SafeMap;
