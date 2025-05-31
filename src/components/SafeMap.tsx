
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

    console.log('🗺️ Starting map initialization...');

    // Fix Leaflet default marker icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    try {
      // Create map instance
      const map = L.map(mapRef.current, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: true,
      });

      console.log('🗺️ Map instance created');

      // Add tile layer
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });

      tileLayer.addTo(map);
      console.log('🗺️ Tile layer added');

      mapInstanceRef.current = map;

      // Wait for map to be ready
      map.whenReady(() => {
        console.log('✅ Map is ready!');
        setIsMapReady(true);
      });

      // Also set ready after a short timeout as backup
      setTimeout(() => {
        if (!isMapReady) {
          console.log('⏰ Fallback: Setting map ready after timeout');
          setIsMapReady(true);
        }
      }, 1000);

    } catch (error) {
      console.error('❌ Error initializing map:', error);
      // Set ready anyway to prevent infinite loading
      setIsMapReady(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        console.log('🧹 Cleaning up map...');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsMapReady(false);
      }
    };
  }, []);

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
