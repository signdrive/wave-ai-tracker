
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
      // Initialize Leaflet icons first
      initializeLeafletIcons();
      console.log('✅ Leaflet icons initialized');

      // Create map instance
      const map = L.map(mapRef.current!, DEFAULT_MAP_CONFIG);
      mapInstanceRef.current = map;
      console.log('✅ Map instance created');

      // Add tile layer
      const tileLayer = L.tileLayer(TILE_LAYER_CONFIG.url, TILE_LAYER_CONFIG);
      tileLayer.addTo(map);
      console.log('🌍 Tile layer added');

      // Create layer group for markers and immediately add to map
      const layerGroup = L.layerGroup();
      layerGroupRef.current = layerGroup;
      map.addLayer(layerGroup); // This is the key fix - explicitly add to map
      console.log('✅ Layer group created and added to map');

      // Wait for map to be fully loaded before marking as ready
      map.whenReady(() => {
        console.log('🎯 Map is ready, invalidating size and marking as ready');
        map.invalidateSize();
        isInitializedRef.current = true;
        markAsReady();
        console.log('✅ Map initialization complete and ready');
      });

    } catch (error) {
      console.error('❌ Map initialization failed:', error);
      cleanup();
    }

    return cleanup;
  }, [validateContainer, isInitializedRef, markAsReady, cleanup, mapRef, mapInstanceRef, layerGroupRef]);

  return { 
    mapRef, 
    mapInstanceRef, 
    layerGroupRef, 
    isMapReady 
  };
};
