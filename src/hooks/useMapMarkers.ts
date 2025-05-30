
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { isValidCoordinate } from '@/utils/coordinateValidation';
import { createPopupContent, createHighlightedIcon } from '@/utils/mapUtils';
import { POPUP_CONFIG, FIT_BOUNDS_CONFIG } from '@/utils/mapConfig';

interface DatabaseSurfSpot {
  id: string;
  full_name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
  difficulty: string;
  wave_type: string;
  best_swell_direction: string;
  best_wind: string;
  best_tide: string;
  crowd_factor: string;
}

interface UseMapMarkersProps {
  mapInstance: L.Map | null;
  layerGroup: L.LayerGroup | null;
  spots: DatabaseSurfSpot[];
  isLoading: boolean;
  onSpotClick?: (spotId: string) => void;
  selectedSpotId?: string;
  isMapReady?: boolean;
}

export const useMapMarkers = ({ 
  mapInstance, 
  layerGroup,
  spots, 
  isLoading, 
  onSpotClick, 
  selectedSpotId,
  isMapReady = true
}: UseMapMarkersProps) => {
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Create markers when everything is ready
  useEffect(() => {
    console.log('🎯 useMapMarkers effect triggered:', {
      hasMapInstance: !!mapInstance,
      hasLayerGroup: !!layerGroup,
      isMapReady,
      isLoading,
      spotsCount: spots.length
    });

    // Essential requirements check
    if (!mapInstance || !layerGroup || isLoading || !isMapReady || spots.length === 0) {
      console.log('❌ Missing prerequisites for marker creation');
      return;
    }

    console.log('✅ All prerequisites met, creating markers immediately...');

    // Clear existing markers
    try {
      layerGroup.clearLayers();
      markersRef.current.clear();
      console.log('🧹 Cleared existing markers');
    } catch (error) {
      console.warn('⚠️ Error clearing markers:', error);
    }

    let successCount = 0;
    const bounds = L.latLngBounds([]);

    // Create and add markers immediately
    spots.forEach((spot, index) => {
      try {
        const lat = Number(spot.lat);
        const lon = Number(spot.lon);
        
        console.log(`📍 Creating marker ${index + 1}/${spots.length}: ${spot.full_name}`);

        if (!isValidCoordinate(lat, lon)) {
          console.warn(`⚠️ Invalid coordinates for ${spot.full_name}`);
          return;
        }

        // Create marker
        const marker = L.marker([lat, lon]);
        
        // Add popup
        const popupContent = createPopupContent(spot);
        if (popupContent) {
          marker.bindPopup(popupContent, POPUP_CONFIG);
        }

        // Add click handler
        marker.on('click', (e) => {
          console.log(`🖱️ Marker clicked: ${spot.full_name}`);
          if (e.originalEvent) {
            L.DomEvent.stopPropagation(e.originalEvent);
          }
          marker.openPopup();
          if (onSpotClick) {
            onSpotClick(spot.id);
          }
        });

        // Add directly to layer group
        layerGroup.addLayer(marker);
        markersRef.current.set(spot.id, marker);
        
        // Add to bounds
        bounds.extend([lat, lon]);
        successCount++;
        
        console.log(`✅ Marker ${index + 1} added successfully`);

      } catch (error) {
        console.error(`❌ Error creating marker for ${spot.full_name}:`, error);
      }
    });

    console.log(`🎉 Marker creation complete: ${successCount}/${spots.length} markers created`);

    // Fit bounds to show all markers
    if (successCount > 0 && bounds.isValid()) {
      try {
        setTimeout(() => {
          mapInstance.fitBounds(bounds, FIT_BOUNDS_CONFIG);
          console.log('🔍 Map bounds fitted to show all markers');
        }, 100);
      } catch (error) {
        console.error('❌ Error fitting bounds:', error);
      }
    }

    // Final verification with detailed check
    setTimeout(() => {
      const layerCount = layerGroup.getLayers().length;
      const mapLayerCount = mapInstance.eachLayer ? Object.keys(mapInstance._layers || {}).length : 'unknown';
      
      console.log(`🔍 FINAL VERIFICATION:`, {
        layersInLayerGroup: layerCount,
        totalMapLayers: mapLayerCount,
        markersInRef: markersRef.current.size,
        success: layerCount > 0
      });
      
      if (layerCount === 0) {
        console.error('❌ CRITICAL: NO MARKERS IN LAYER GROUP!');
      } else {
        console.log(`✅ SUCCESS: ${layerCount} markers are in the layer group`);
      }
    }, 500);

  }, [mapInstance, layerGroup, spots, isLoading, onSpotClick, isMapReady]);

  // Handle selection changes
  useEffect(() => {
    if (!selectedSpotId || !mapInstance) return;

    console.log(`🎯 Updating selection for spot: ${selectedSpotId}`);

    markersRef.current.forEach((marker, spotId) => {
      try {
        if (spotId === selectedSpotId) {
          const highlightIcon = createHighlightedIcon();
          marker.setIcon(highlightIcon);
          marker.openPopup();
        } else {
          marker.setIcon(new L.Icon.Default());
        }
      } catch (error) {
        console.warn(`⚠️ Error updating marker for spot ${spotId}:`, error);
      }
    });

    // Center on selected spot
    const selectedSpot = spots.find(s => s.id === selectedSpotId);
    if (selectedSpot) {
      const lat = Number(selectedSpot.lat);
      const lon = Number(selectedSpot.lon);
      if (isValidCoordinate(lat, lon)) {
        mapInstance.setView([lat, lon], 12, { animate: true });
      }
    }
  }, [selectedSpotId, spots, mapInstance]);

  return { markersRef };
};
