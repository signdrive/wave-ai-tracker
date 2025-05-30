
import { useRef, useState } from 'react';
import L from 'leaflet';

export const useMapContainer = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const isInitializedRef = useRef(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const validateContainer = (): boolean => {
    if (!mapRef.current) return false;
    return true; // Simplified validation
  };

  const markAsReady = () => {
    console.log('🎯 markAsReady called');
    
    try {
      if (mapInstanceRef.current) {
        console.log('✅ Map instance exists, marking as ready');
        mapInstanceRef.current.invalidateSize();
        isInitializedRef.current = true;
        setIsMapReady(true);
        console.log('✅ Map marked as ready successfully');
      } else {
        console.warn('⚠️ No map instance when trying to mark as ready');
      }
    } catch (error) {
      console.error('❌ Error in markAsReady:', error);
    }
  };

  const cleanup = () => {
    console.log('🧹 Starting cleanup...');
    setIsMapReady(false);

    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    
    if (layerGroupRef.current) {
      try {
        layerGroupRef.current.clearLayers();
      } catch (error) {
        console.warn('⚠️ Error cleaning up layer group:', error);
      }
      layerGroupRef.current = null;
    }
    
    if (mapInstanceRef.current) {
      try {
        const mapToCleanup = mapInstanceRef.current;
        mapInstanceRef.current = null;
        isInitializedRef.current = false;
        
        mapToCleanup.off();
        mapToCleanup.remove();
        console.log('✅ Map cleanup completed');
      } catch (error) {
        console.error('❌ Error during map cleanup:', error);
      }
    }
  };

  return {
    mapRef,
    mapInstanceRef,
    layerGroupRef,
    isInitializedRef,
    isMapReady,
    cleanupRef,
    validateContainer,
    markAsReady,
    cleanup
  };
};
