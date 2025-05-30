
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { initializeLeafletIcons } from '@/utils/mapUtils';

export const useMapInitialization = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const isInitializedRef = useRef(false);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || isInitializedRef.current) {
      console.log('❌ Map container ref not ready or already initialized');
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

      // Create layer group immediately after map creation
      const layerGroup = L.layerGroup();
      layerGroup.addTo(map);
      layerGroupRef.current = layerGroup;
      console.log('✅ Layer group created and added to map');
      
      isInitializedRef.current = true;

      // Add tile layer
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 1
      });
      
      tileLayer.addTo(map);
      console.log('🌍 Tile layer added');
      
      // Set map ready immediately after setup
      setIsMapReady(true);
      console.log('✅ Map marked as ready');

      // Force map to render
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          console.log('🔄 Map size invalidated');
        }
      }, 100);

    } catch (error) {
      console.error('❌ Error initializing map:', error);
      isInitializedRef.current = false;
    }

    return () => {
      console.log('🧹 Cleaning up map...');
      setIsMapReady(false);
      
      if (layerGroupRef.current) {
        try {
          layerGroupRef.current.clearLayers();
          layerGroupRef.current = null;
          console.log('✅ Layer group cleaned up');
        } catch (error) {
          console.warn('⚠️ Error cleaning up layer group:', error);
        }
      }
      
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          isInitializedRef.current = false;
          console.log('✅ Map cleaned up successfully');
        } catch (error) {
          console.error('❌ Error during map cleanup:', error);
          mapInstanceRef.current = null;
          isInitializedRef.current = false;
        }
      }
    };
  }, []);

  return { 
    mapRef, 
    mapInstanceRef, 
    layerGroupRef, 
    isMapReady 
  };
};
