
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { createHighlightedIcon, createPopupContent } from '@/utils/mapUtils';

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
  const highlightedIcon = createHighlightedIcon();

  useEffect(() => {
    if (!mapInstance || !layerGroup || !isMapReady || isLoading) {
      console.log('🚫 Waiting for map requirements:', {
        mapInstance: !!mapInstance,
        layerGroup: !!layerGroup,
        isMapReady,
        isLoading,
        spotsCount: spots.length
      });
      return;
    }

    console.log(`🎯 Starting to add ${spots.length} markers to map`);

    // Clear existing markers
    try {
      layerGroup.clearLayers();
      markersRef.current.clear();
      console.log('🧹 Cleared existing markers');
    } catch (error) {
      console.error('❌ Error clearing markers:', error);
    }

    if (spots.length === 0) {
      console.log('❗ No spots to display');
      return;
    }

    let addedMarkers = 0;
    const bounds = L.latLngBounds([]);

    spots.forEach((spot, index) => {
      try {
        // Validate coordinates
        const lat = Number(spot.lat);
        const lon = Number(spot.lon);
        
        if (isNaN(lat) || isNaN(lon)) {
          console.warn(`❌ Invalid coordinates for ${spot.full_name}: lat=${spot.lat}, lon=${spot.lon}`);
          return;
        }

        // Create marker with default icon first
        const marker = L.marker([lat, lon]);
        
        // Add to layer group
        layerGroup.addLayer(marker);
        addedMarkers++;
        
        // Store marker reference
        markersRef.current.set(spot.id, marker);

        // Extend bounds
        bounds.extend([lat, lon]);

        // Add click handler
        marker.on('click', () => {
          console.log(`🖱️ Marker clicked for spot: ${spot.full_name}`);
          if (onSpotClick) {
            onSpotClick(spot.id);
          }
        });
        
        // Create and bind popup
        const popupContent = createPopupContent(spot);
        marker.bindPopup(popupContent, { maxWidth: 300 });

        // Apply selection styling if needed
        if (selectedSpotId === spot.id) {
          marker.setIcon(highlightedIcon);
        }

        console.log(`✅ Added marker ${addedMarkers}/${spots.length}: ${spot.full_name} at [${lat}, ${lon}]`);

      } catch (error) {
        console.error(`❌ Error adding marker for ${spot.full_name}:`, error);
      }
    });

    console.log(`🎉 Successfully added ${addedMarkers} markers to map`);

    // Fit bounds if we have markers
    if (addedMarkers > 0 && bounds.isValid()) {
      try {
        setTimeout(() => {
          if (mapInstance) {
            mapInstance.fitBounds(bounds, { 
              padding: [20, 20],
              maxZoom: 10
            });
            console.log('🔍 Map bounds fitted to show all markers');
          }
        }, 100);
      } catch (error) {
        console.error('❌ Error fitting bounds:', error);
      }
    }

  }, [mapInstance, layerGroup, spots, isLoading, selectedSpotId, onSpotClick, highlightedIcon, isMapReady]);

  // Handle selected spot changes
  useEffect(() => {
    if (selectedSpotId && mapInstance) {
      const selectedSpot = spots.find(spot => spot.id === selectedSpotId);
      if (selectedSpot && selectedSpot.lat && selectedSpot.lon) {
        mapInstance.setView([selectedSpot.lat, selectedSpot.lon], 12);
        console.log(`🎯 Centered map on ${selectedSpot.full_name}`);
        
        // Update marker icons
        markersRef.current.forEach((marker, spotId) => {
          const isSelected = spotId === selectedSpotId;
          marker.setIcon(isSelected ? highlightedIcon : new L.Icon.Default());
        });
      }
    }
  }, [selectedSpotId, spots, mapInstance, highlightedIcon]);

  return { markersRef };
};
