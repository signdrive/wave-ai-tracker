
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { initializeLeafletIcons } from '@/utils/mapUtils';

export const useMapInitialization = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      console.log('❌ Map container ref not ready');
      return;
    }

    console.log('🗺️ Initializing map...');
    initializeLeafletIcons();

    try {
      // Initialize map centered on California (where most spots are)
      const map = L.map(mapRef.current, {
        center: [34.0522, -118.2437],
        zoom: 6,
        zoomControl: true,
        preferCanvas: false
      });
      
      mapInstanceRef.current = map;
      console.log('✅ Map instance created');

      // Add tile layer with error handling
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 1
      });
      
      tileLayer.addTo(map);
      console.log('🌍 Tile layer added');
      
      // Add event listeners for debugging
      tileLayer.on('loading', () => {
        console.log('🔄 Map tiles loading...');
      });
      
      tileLayer.on('load', () => {
        console.log('✅ Map tiles loaded successfully');
      });

      tileLayer.on('tileerror', (e) => {
        console.error('❌ Tile loading error:', e);
      });

      // Force map to render
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          console.log('🔄 Map size invalidated');
        }
      }, 100);

      console.log('✅ Map initialized successfully');

    } catch (error) {
      console.error('❌ Error initializing map:', error);
    }

    return () => {
      console.log('🧹 Cleaning up map...');
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return { mapRef, mapInstanceRef };
};
