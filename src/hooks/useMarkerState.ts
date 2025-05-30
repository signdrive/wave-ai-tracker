
import { useRef } from 'react';
import L from 'leaflet';

export const useMarkerState = () => {
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const isCreatingMarkersRef = useRef(false);

  const clearMarkers = (layerGroup: L.LayerGroup | null) => {
    console.log('🧹 Clearing existing markers');
    markersRef.current.forEach(marker => {
      try {
        marker.remove();
      } catch (e) {
        console.warn('Error removing marker:', e);
      }
    });
    
    if (layerGroup) {
      layerGroup.clearLayers();
    }
    
    markersRef.current.clear();
    console.log('✅ Markers cleared');
  };

  const addMarker = (spotId: string, marker: L.Marker) => {
    markersRef.current.set(spotId, marker);
  };

  const getMarker = (spotId: string) => {
    return markersRef.current.get(spotId);
  };

  const getAllMarkers = () => {
    return markersRef.current;
  };

  return {
    markersRef,
    isCreatingMarkersRef,
    clearMarkers,
    addMarker,
    getMarker,
    getAllMarkers
  };
};
