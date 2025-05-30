
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

  // Clear all markers
  const clearMarkers = () => {
    console.log('🧹 Clearing markers...');
    if (layerGroup) {
      layerGroup.clearLayers();
    }
    markersRef.current.clear();
  };

  // Create and add markers
  useEffect(() => {
    console.log('🎯 useMapMarkers effect triggered:', {
      hasMapInstance: !!mapInstance,
      hasLayerGroup: !!layerGroup,
      isMapReady,
      isLoading,
      spotsCount: spots.length,
      firstSpot: spots[0] ? {
        id: spots[0].id,
        name: spots[0].full_name,
        lat: spots[0].lat,
        lon: spots[0].lon
      } : null
    });

    // Prerequisites check
    if (!mapInstance || !layerGroup || !isMapReady || isLoading || spots.length === 0) {
      console.log('❌ Prerequisites not met for markers');
      return;
    }

    console.log('✅ All prerequisites met, creating markers...');

    // Clear existing markers
    clearMarkers();

    let successCount = 0;
    const bounds = L.latLngBounds([]);
    let hasBounds = false;

    spots.forEach((spot, index) => {
      try {
        const lat = Number(spot.lat);
        const lon = Number(spot.lon);
        
        console.log(`📍 Processing spot ${index + 1}/${spots.length}: ${spot.full_name}`, {
          id: spot.id,
          lat,
          lon,
          valid: isValidCoordinate(lat, lon)
        });

        if (!isValidCoordinate(lat, lon)) {
          console.warn(`⚠️ Invalid coordinates for ${spot.full_name}`);
          return;
        }

        // Create marker
        const marker = L.marker([lat, lon]);
        
        // Create popup content
        const popupContent = createPopupContent(spot);
        if (popupContent) {
          marker.bindPopup(popupContent, POPUP_CONFIG);
        }

        // Add click handler
        marker.on('click', (e) => {
          console.log(`🖱️ Marker clicked: ${spot.full_name} (${spot.id})`);
          L.DomEvent.stopPropagation(e.originalEvent);
          marker.openPopup();
          if (onSpotClick) {
            onSpotClick(spot.id);
          }
        });

        // Add to layer group
        marker.addTo(layerGroup);
        
        // Store reference
        markersRef.current.set(spot.id, marker);
        
        // Add to bounds
        bounds.extend([lat, lon]);
        hasBounds = true;
        successCount++;

        console.log(`✅ Marker ${successCount} added successfully: ${spot.full_name}`);
      } catch (error) {
        console.error(`❌ Error creating marker for ${spot.full_name}:`, error);
      }
    });

    console.log(`🎉 Marker creation complete: ${successCount}/${spots.length} markers added`);

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

  }, [mapInstance, layerGroup, spots, isLoading, isMapReady, onSpotClick]);

  // Handle selected spot changes
  useEffect(() => {
    if (!selectedSpotId || !mapInstance || !isMapReady) return;

    console.log(`🎯 Updating selection for spot: ${selectedSpotId}`);

    markersRef.current.forEach((marker, spotId) => {
      if (spotId === selectedSpotId) {
        // Highlight selected marker
        const highlightIcon = createHighlightedIcon();
        marker.setIcon(highlightIcon);
        marker.openPopup();
      } else {
        // Reset other markers to default
        marker.setIcon(new L.Icon.Default());
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
