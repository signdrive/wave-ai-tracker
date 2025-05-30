
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
    console.log('🗺️ useMapInitialization effect triggered');
    
    if (!validateContainer() || isInitializedRef.current) {
      console.log('🚫 Map container not valid or already initialized');
      return cleanup;
    }

    console.log('🗺️ Starting map initialization...');
    
    let initializationTimeout: NodeJS.Timeout | null = null;

    try {
      // Initialize Leaflet icons first
      initializeLeafletIcons();

      // Create map instance
      const map = L.map(mapRef.current!, DEFAULT_MAP_CONFIG);
      if (!map) {
        throw new Error('Failed to create map instance');
      }

      mapInstanceRef.current = map;
      console.log('✅ Map instance created successfully');

      // Add error handling for the map
      map.on('error', (error) => {
        console.error('❌ Map error:', error);
      });

      // Add tile layer
      const tileLayer = L.tileLayer(TILE_LAYER_CONFIG.url, TILE_LAYER_CONFIG);
      tileLayer.on('tileerror', (error) => {
        console.warn('⚠️ Tile loading error:', error);
      });
      tileLayer.addTo(map);
      console.log('🌍 Tile layer added successfully');

      // Create and add layer group
      const layerGroup = L.layerGroup();
      if (!layerGroup) {
        throw new Error('Failed to create layer group');
      }

      layerGroupRef.current = layerGroup;
      layerGroup.addTo(map);
      console.log('✅ Layer group created and added to map');

      // Mark as ready immediately after setup
      markAsReady();
      console.log('🎯 Map marked as ready');

      // Fallback timeout in case markAsReady doesn't work
      initializationTimeout = setTimeout(() => {
        if (!isInitializedRef.current && mapInstanceRef.current) {
          console.log('🔄 Fallback: forcing map ready state');
          markAsReady();
        }
      }, 1000);

      cleanupRef.current = () => {
        if (initializationTimeout) {
          clearTimeout(initializationTimeout);
          initializationTimeout = null;
        }
      };

    } catch (error) {
      console.error('❌ Error initializing map:', error);
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
