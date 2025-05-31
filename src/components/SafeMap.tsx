
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
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    console.log('🚀 Starting map initialization...');

    const initializeMap = async () => {
      try {
        // Wait a bit to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!mapRef.current) {
          throw new Error('Map container not available');
        }

        console.log('🔧 Fixing Leaflet default marker icons...');
        
        // Fix Leaflet default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        console.log('🗺️ Creating map instance...');

        // Create map instance
        const map = L.map(mapRef.current, {
          center,
          zoom,
          zoomControl: true,
          attributionControl: true,
          preferCanvas: false,
        });

        console.log('🌍 Adding tile layer...');

        // Add tile layer
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          crossOrigin: true
        });

        await new Promise((resolve, reject) => {
          tileLayer.on('load', () => {
            console.log('✅ Tile layer loaded successfully');
            resolve(true);
          });
          
          tileLayer.on('tileerror', (e) => {
            console.warn('⚠️ Tile loading error:', e);
            // Don't reject, just continue
            resolve(true);
          });
          
          // Timeout after 5 seconds
          setTimeout(() => {
            console.log('⏰ Tile loading timeout, continuing anyway');
            resolve(true);
          }, 5000);
          
          tileLayer.addTo(map);
        });

        mapInstanceRef.current = map;

        // Wait for map to be ready
        map.whenReady(() => {
          console.log('✅ Map is ready!');
          
          // Force a size recalculation
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.invalidateSize();
              setIsMapReady(true);
              console.log('🎉 Map initialization complete!');
            }
          }, 100);
        });

      } catch (error) {
        console.error('❌ Error initializing map:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        console.log('🧹 Cleaning up map...');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsMapReady(false);
      }
    };
  }, [center, zoom]);

  if (initError) {
    return (
      <div style={style} className={`${className} bg-red-50 flex items-center justify-center`}>
        <div className="text-center p-4">
          <div className="text-red-600 font-semibold mb-2">Map Error</div>
          <div className="text-red-500 text-sm">{initError}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
