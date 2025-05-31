
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SafeLeafletMapProps {
  children: React.ReactNode;
  center: [number, number];
  zoom: number;
  style?: React.CSSProperties;
  className?: string;
}

const SafeLeafletMap: React.FC<SafeLeafletMapProps> = ({ 
  children, 
  center, 
  zoom, 
  style = { height: '100%', width: '100%' },
  className = ''
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Fix Leaflet default marker icons for React-Leaflet v4
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
      <div style={style} className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={style}
      className={className}
      scrollWheelZoom={true}
      attributionControl={true}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};

export default SafeLeafletMap;
