
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../../lib/leaflet-fix';

export const useMapInitialization = () => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    console.log('🗺️ Initializing direct Leaflet map...');

    // Initialize map
    mapRef.current = L.map(containerRef.current, {
      center: [34.0522, -118.2437],
      zoom: 6,
      preferCanvas: true,
      zoomControl: true,
      attributionControl: true
    });

    console.log('✅ Map instance created');

    // Add tiles
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    });

    tileLayer.addTo(mapRef.current);
    console.log('✅ Tiles added');

    return () => {
      if (mapRef.current) {
        console.log('🧹 Cleaning up map...');
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return { mapRef, containerRef };
};
