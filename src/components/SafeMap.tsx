
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SafeMapProps {
  center: [number, number];
  zoom: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const SafeMap: React.FC<SafeMapProps> = ({ 
  center, 
  zoom, 
  children,
  style = { height: '100vh', width: '100%' },
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    console.log('🗺️ Initializing map...');

    // Fix Leaflet default marker icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    // Create map instance
    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: true,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Set ready immediately
    setIsMapReady(true);
    console.log('✅ Map ready!');

    return () => {
      if (mapInstanceRef.current) {
        console.log('🧹 Cleaning up map...');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsMapReady(false);
      }
    };
  }, [center, zoom]);

  if (!isMapReady) {
    return (
      <div style={style} className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-gray-600">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        style={style}
        className={className}
      />
      {isMapReady && mapInstanceRef.current && children && 
        React.Children.map(children, child =>
          React.cloneElement(child as React.ReactElement, { 
            map: mapInstanceRef.current 
          })
        )
      }
    </div>
  );
};

export default SafeMap;
