
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
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Prevent multiple initializations
    if (!mapRef.current || isInitializedRef.current) {
      return;
    }

    // Validate container element
    if (!mapRef.current.offsetParent && mapRef.current.style.display !== 'block') {
      console.warn('⚠️ Map container not visible, deferring initialization');
      return;
    }

    console.log('🗺️ Initializing map...');
    
    let map: L.Map | null = null;
    let layerGroup: L.LayerGroup | null = null;
    let initializationTimeout: NodeJS.Timeout | null = null;

    try {
      // Initialize Leaflet icons safely
      initializeLeafletIcons();

      // Create map with error handling
      map = L.map(mapRef.current, {
        center: [34.0522, -118.2437],
        zoom: 6,
        zoomControl: true,
        preferCanvas: false,
        attributionControl: true,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 60
      });

      if (!map) {
        throw new Error('Failed to create map instance');
      }

      mapInstanceRef.current = map;
      console.log('✅ Map instance created');

      // Add error handler for map
      map.on('error', (error) => {
        console.error('❌ Map error:', error);
      });

      // Add tile layer with error handling
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 1,
        errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
        crossOrigin: true
      });

      tileLayer.on('tileerror', (error) => {
        console.warn('⚠️ Tile loading error:', error);
      });

      tileLayer.addTo(map);
      console.log('🌍 Tile layer added');

      // Create layer group with validation
      layerGroup = L.layerGroup();
      if (!layerGroup) {
        throw new Error('Failed to create layer group');
      }

      layerGroupRef.current = layerGroup;
      layerGroup.addTo(map);
      console.log('✅ Layer group created and added to map');

      // Set up robust ready state detection
      const markReady = () => {
        if (isInitializedRef.current) return; // Prevent double initialization
        
        try {
          if (mapInstanceRef.current && mapInstanceRef.current.getContainer()) {
            // Validate map state
            const container = mapInstanceRef.current.getContainer();
            if (!container || !container.offsetParent) {
              console.warn('⚠️ Map container invalid during ready check');
              return;
            }

            mapInstanceRef.current.invalidateSize();
            isInitializedRef.current = true;
            setIsMapReady(true);
            console.log('✅ Map marked as ready');

            // Clear timeout if successful
            if (initializationTimeout) {
              clearTimeout(initializationTimeout);
              initializationTimeout = null;
            }
          }
        } catch (error) {
          console.error('❌ Error in markReady:', error);
        }
      };

      // Primary ready detection
      map.whenReady(() => {
        console.log('🎯 Map whenReady callback triggered');
        // Add small delay to ensure DOM is fully rendered
        setTimeout(markReady, 100);
      });

      // Fallback timeout for ready state
      initializationTimeout = setTimeout(() => {
        if (!isInitializedRef.current && mapInstanceRef.current) {
          console.log('🔄 Fallback map ready initialization');
          markReady();
        }
      }, 2000);

      // Store cleanup function
      cleanupRef.current = () => {
        if (initializationTimeout) {
          clearTimeout(initializationTimeout);
          initializationTimeout = null;
        }
      };

    } catch (error) {
      console.error('❌ Error initializing map:', error);
      isInitializedRef.current = false;
      setIsMapReady(false);
      
      // Clean up partial initialization
      if (map) {
        try {
          map.remove();
        } catch (cleanupError) {
          console.warn('⚠️ Error during cleanup:', cleanupError);
        }
      }
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
    }

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up map...');
      setIsMapReady(false);

      // Run stored cleanup
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      
      // Clean up layer group
      if (layerGroupRef.current) {
        try {
          layerGroupRef.current.clearLayers();
        } catch (error) {
          console.warn('⚠️ Error cleaning up layer group:', error);
        }
        layerGroupRef.current = null;
      }
      
      // Clean up map instance
      if (mapInstanceRef.current) {
        try {
          const mapToCleanup = mapInstanceRef.current;
          mapInstanceRef.current = null; // Clear reference first
          isInitializedRef.current = false;
          
          // Remove all event listeners
          mapToCleanup.off();
          
          // Remove map
          mapToCleanup.remove();
          console.log('✅ Map cleanup completed');
        } catch (error) {
          console.error('❌ Error during map cleanup:', error);
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
