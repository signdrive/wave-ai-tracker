
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
    // Always call cleanup function, even if we return early
    const performCleanup = cleanup;

    if (!validateContainer() || isInitializedRef.current) {
      return performCleanup;
    }

    console.log('🗺️ Initializing map...');
    
    let initializationTimeout: NodeJS.Timeout | null = null;

    try {
      initializeLeafletIcons();

      const map = L.map(mapRef.current!, DEFAULT_MAP_CONFIG);
      if (!map) {
        throw new Error('Failed to create map instance');
      }

      mapInstanceRef.current = map;
      console.log('✅ Map instance created');

      map.on('error', (error) => {
        console.error('❌ Map error:', error);
      });

      const tileLayer = L.tileLayer(TILE_LAYER_CONFIG.url, TILE_LAYER_CONFIG);
      tileLayer.on('tileerror', (error) => {
        console.warn('⚠️ Tile loading error:', error);
      });
      tileLayer.addTo(map);
      console.log('🌍 Tile layer added');

      const layerGroup = L.layerGroup();
      if (!layerGroup) {
        throw new Error('Failed to create layer group');
      }

      layerGroupRef.current = layerGroup;
      layerGroup.addTo(map);
      console.log('✅ Layer group created and added to map');

      // Set up ready state detection
      map.whenReady(() => {
        console.log('🎯 Map whenReady callback triggered');
        setTimeout(markAsReady, 100);
      });

      // Fallback timeout
      initializationTimeout = setTimeout(() => {
        if (!isInitializedRef.current && mapInstanceRef.current) {
          console.log('🔄 Fallback map ready initialization');
          markAsReady();
        }
      }, 2000);

      cleanupRef.current = () => {
        if (initializationTimeout) {
          clearTimeout(initializationTimeout);
          initializationTimeout = null;
        }
      };

    } catch (error) {
      console.error('❌ Error initializing map:', error);
      performCleanup();
    }

    return performCleanup;
  }, [validateContainer, isInitializedRef, markAsReady, cleanup]);

  return { 
    mapRef, 
    mapInstanceRef, 
    layerGroupRef, 
    isMapReady 
  };
};
