
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

  // Main effect to create and manage markers
  useEffect(() => {
    console.log('🎯 useMapMarkers: Starting marker management', {
      hasMapInstance: !!mapInstance,
      hasLayerGroup: !!layerGroup,
      isMapReady,
      isLoading,
      spotsCount: spots.length
    });

    // Prerequisites check
    if (!mapInstance || !layerGroup || !isMapReady || isLoading || spots.length === 0) {
      console.log('❌ Prerequisites not met, skipping marker creation');
      return;
    }

    console.log('✅ All prerequisites met, creating markers directly...');

    // Clear existing markers
    console.log('🧹 Clearing existing markers...');
    layerGroup.clearLayers();
    markersRef.current.clear();

    let successCount = 0;
    const bounds = L.latLngBounds([]);
    let hasBounds = false;

    // Create markers directly - no complex logic
    spots.forEach((spot, index) => {
      try {
        const lat = Number(spot.lat);
        const lon = Number(spot.lon);
        
        console.log(`📍 Creating marker ${index + 1}/${spots.length}: ${spot.full_name}`, {
          id: spot.id,
          lat,
          lon,
          valid: isValidCoordinate(lat, lon)
        });

        if (!isValidCoordinate(lat, lon)) {
          console.warn(`⚠️ Invalid coordinates for ${spot.full_name}`);
          return;
        }

        // Create marker with default icon
        const marker = L.marker([lat, lon]);
        
        console.log(`✅ Leaflet marker created for ${spot.full_name}`);

        // Create popup content
        const popupContent = createPopupContent(spot);
        if (popupContent) {
          marker.bindPopup(popupContent, POPUP_CONFIG);
          console.log(`✅ Popup bound for ${spot.full_name}`);
        }

        // Add click handler
        marker.on('click', (e) => {
          console.log(`🖱️ Marker clicked: ${spot.full_name} (${spot.id})`);
          if (e.originalEvent) {
            L.DomEvent.stopPropagation(e.originalEvent);
          }
          marker.openPopup();
          if (onSpotClick) {
            onSpotClick(spot.id);
          }
        });

        // Add marker directly to layer group
        marker.addTo(layerGroup);
        console.log(`✅ Marker added to layer group for ${spot.full_name}`);
        
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

    console.log(`🎉 Marker creation complete: ${successCount}/${spots.length} markers created and added`);

    // Fit bounds if we have markers
    if (successCount > 0 && hasBounds && bounds.isValid()) {
      setTimeout(() => {
        try {
          mapInstance.fitBounds(bounds, FIT_BOUNDS_CONFIG);
          console.log('🔍 Map bounds fitted to markers');
        } catch (error) {
          console.error('❌ Error fitting bounds:', error);
        }
      }, 100);
    }

    // Verify markers are visible
    setTimeout(() => {
      const layerCount = layerGroup.getLayers().length;
      console.log(`🔍 Verification: Layer group contains ${layerCount} layers`);
      
      if (layerCount === 0) {
        console.error('❌ CRITICAL: No layers found in layer group after marker creation!');
      } else {
        console.log('✅ SUCCESS: Markers are present in layer group');
      }
    }, 200);

  }, [mapInstance, layerGroup, spots, isLoading, isMapReady, onSpotClick]);

  // Handle selected spot changes
  useEffect(() => {
    if (!selectedSpotId || !mapInstance || !isMapReady) return;

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
        console.warn(`⚠️ Error updating marker icon for spot ${spotId}:`, error);
      }
    });

    // Center map on selected spot
    const selectedSpot = spots.find(s => s.id === selectedSpotId);
    if (selectedSpot) {
      const lat = Number(selectedSpot.lat);
      const lon = Number(selectedSpot.lon);
      if (isValidCoordinate(lat, lon)) {
        mapInstance.setView([lat, lon], 12, { animate: true });
      }
    }
  }, [selectedSpotId, spots, mapInstance, isMapReady]);

  return { markersRef };
};
