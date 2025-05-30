
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

  // Create markers when map and data are ready
  useEffect(() => {
    console.log('🎯 useMapMarkers effect triggered:', {
      hasMapInstance: !!mapInstance,
      hasLayerGroup: !!layerGroup,
      isMapReady,
      isLoading,
      spotsCount: spots.length
    });

    // Don't proceed if essential components are missing
    if (!mapInstance || !layerGroup || isLoading) {
      console.log('❌ Missing prerequisites, skipping marker creation');
      return;
    }

    // Don't proceed if no spots
    if (spots.length === 0) {
      console.log('❌ No spots to display');
      return;
    }

    console.log('✅ All prerequisites met, creating markers...');

    // Clear existing markers
    layerGroup.clearLayers();
    markersRef.current.clear();
    console.log('🧹 Cleared existing markers');

    let successCount = 0;
    const bounds = L.latLngBounds([]);
    let hasBounds = false;

    // Create markers immediately
    spots.forEach((spot, index) => {
      try {
        const lat = Number(spot.lat);
        const lon = Number(spot.lon);
        
        console.log(`📍 Processing spot ${index + 1}/${spots.length}: ${spot.full_name} at [${lat}, ${lon}]`);

        if (!isValidCoordinate(lat, lon)) {
          console.warn(`⚠️ Invalid coordinates for ${spot.full_name}: [${lat}, ${lon}]`);
          return;
        }

        // Create marker
        const marker = L.marker([lat, lon]);
        console.log(`✅ Created marker for ${spot.full_name}`);

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

        // Add to layer group
        marker.addTo(layerGroup);
        console.log(`✅ Added marker to layer group for ${spot.full_name}`);
        
        // Store reference
        markersRef.current.set(spot.id, marker);
        
        // Add to bounds
        bounds.extend([lat, lon]);
        hasBounds = true;
        successCount++;

      } catch (error) {
        console.error(`❌ Error creating marker for ${spot.full_name}:`, error);
      }
    });

    console.log(`🎉 Marker creation complete: ${successCount}/${spots.length} markers created`);

    // Fit bounds
    if (successCount > 0 && hasBounds && bounds.isValid()) {
      setTimeout(() => {
        try {
          mapInstance.fitBounds(bounds, FIT_BOUNDS_CONFIG);
          console.log('🔍 Map bounds fitted');
        } catch (error) {
          console.error('❌ Error fitting bounds:', error);
        }
      }, 100);
    }

    // Verify markers are visible
    setTimeout(() => {
      const layerCount = layerGroup.getLayers().length;
      console.log(`🔍 Final verification: ${layerCount} layers in layer group`);
      
      if (layerCount === 0) {
        console.error('❌ CRITICAL: No markers visible after creation!');
      } else {
        console.log('✅ SUCCESS: Markers are visible on map');
      }
    }, 200);

  }, [mapInstance, layerGroup, spots, isLoading, onSpotClick]);

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
