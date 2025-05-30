
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { initializeLeafletIcons } from '@/utils/mapUtils';
import { useMapContainer } from '@/hooks/useMapContainer';
import { DEFAULT_MAP_CONFIG, TILE_LAYER_CONFIG } from '@/utils/mapConfig';

export const useMapInitialization = () => {
  const {
    mapRef,
    mapInstanceRef,
    layerGroupRef,
    isInitializedRef,
    isMapReady,
    cleanupRef,
    validateContainer,
    markAsReady,
    cleanup
  } = useMapContainer();

  useEffect(() => {
    console.log('🗺️ Map initialization effect triggered');
    
    if (!validateContainer() || isInitializedRef.current) {
      console.log('🚫 Container invalid or already initialized');
      return cleanup;
    }

    console.log('🔧 Starting map initialization...');
    
    try {
      // Initialize Leaflet icons
      initializeLeafletIcons();

      // Create map instance
      const map = L.map(mapRef.current!, DEFAULT_MAP_CONFIG);
      mapInstanceRef.current = map;
      console.log('✅ Map instance created');

      // Add tile layer
      const tileLayer = L.tileLayer(TILE_LAYER_CONFIG.url, TILE_LAYER_CONFIG);
      tileLayer.addTo(map);
      console.log('🌍 Tile layer added');

      // Create layer group for markers
      const layerGroup = L.layerGroup();
      layerGroupRef.current = layerGroup;
      layerGroup.addTo(map);
      console.log('✅ Layer group created and added');

      // Mark as ready
      isInitializedRef.current = true;
      markAsReady();
      console.log('🎯 Map marked as ready');

    } catch (error) {
      console.error('❌ Map initialization failed:', error);
      cleanup();
    }

    return cleanup;
  }, [validateContainer, isInitializedRef, markAsReady, cleanup]);

  return { 
    mapRef, 
    mapInstanceRef, 
    layerGroupRef, 
    isMapReady 
  };
};
