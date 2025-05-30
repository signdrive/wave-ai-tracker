
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
      return;
    }

    console.log('🗺️ Initializing map...');
    initializeLeafletIcons();

    try {
      // Initialize map centered on California
      const map = L.map(mapRef.current, {
        center: [34.0522, -118.2437],
        zoom: 6,
        zoomControl: true,
        preferCanvas: false
      });
      
      mapInstanceRef.current = map;
      console.log('✅ Map instance created');

      // Add tile layer first
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 1
      });
      
      tileLayer.addTo(map);
      console.log('🌍 Tile layer added');

      // Create layer group after map and tiles are ready
      const layerGroup = L.layerGroup();
      layerGroupRef.current = layerGroup;
      layerGroup.addTo(map);
      console.log('✅ Layer group created and added to map');
      
      isInitializedRef.current = true;
      
      // Wait for map to be fully rendered before marking as ready
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          setIsMapReady(true);
          console.log('✅ Map marked as ready');
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
        } catch (error) {
          console.warn('⚠️ Error cleaning up layer group:', error);
        }
      }
      
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          isInitializedRef.current = false;
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
