
import React, { useEffect, useState } from 'react';
import { MapContainer } from 'react-leaflet';
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
  className = '',
  ...props 
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render on server-side
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
      preferCanvas={true}
      {...props}
    >
      {children}
    </MapContainer>
  );
};

export default SafeLeafletMap;
