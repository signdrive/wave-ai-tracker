
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
    
    const initTimeout = setTimeout(() => {
      try {
        if (!mapRef.current) {
          console.error('❌ Map container not available during initialization');
          return;
        }

        // Initialize Leaflet icons first
        initializeLeafletIcons();
        console.log('✅ Leaflet icons initialized');

        // Create map instance
        const map = L.map(mapRef.current, {
          ...DEFAULT_MAP_CONFIG,
          preferCanvas: false
        });
        
        mapInstanceRef.current = map;
        console.log('✅ Map instance created');

        // Add tile layer
        const tileLayer = L.tileLayer(TILE_LAYER_CONFIG.url, TILE_LAYER_CONFIG);
        tileLayer.addTo(map);
        console.log('🌍 Tile layer added');

        // Create layer group and add to map
        const layerGroup = L.layerGroup();
        layerGroupRef.current = layerGroup;
        layerGroup.addTo(map);
        console.log('✅ Layer group created and added to map');

        // Mark as ready when map is loaded
        map.whenReady(() => {
          console.log('🎯 Map is ready');
          
          setTimeout(() => {
            try {
              map.invalidateSize(true);
              isInitializedRef.current = true;
              markAsReady();
              console.log('✅ Map initialization complete and ready');
            } catch (error) {
              console.error('❌ Error in final map setup:', error);
            }
          }, 100);
        });

      } catch (error) {
        console.error('❌ Map initialization failed:', error);
        cleanup();
      }
    }, 50);

    return () => {
      clearTimeout(initTimeout);
    };
  }, [validateContainer, isInitializedRef, markAsReady, cleanup, mapRef, mapInstanceRef, layerGroupRef]);

  return { 
    mapRef, 
    mapInstanceRef, 
    layerGroupRef, 
    isMapReady 
  };
};
