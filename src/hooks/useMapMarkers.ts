
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
    console.log('🎯 useMapMarkers effect triggered', {
      mapInstance: !!mapInstance,
      layerGroup: !!layerGroup,
      isMapReady,
      isLoading,
      spotsCount: spots.length
    });

    if (!mapInstance || !layerGroup || !isMapReady || isLoading) {
      console.log('🚫 Requirements not met for marker creation');
      return;
    }

    if (spots.length === 0) {
      console.log('❗ No spots to display');
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

    let addedMarkers = 0;
    const bounds = L.latLngBounds([]);

    spots.forEach((spot) => {
      try {
        // Validate coordinates
        const lat = Number(spot.lat);
        const lon = Number(spot.lon);
        
        if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
          console.warn(`❌ Invalid coordinates for ${spot.full_name}: lat=${spot.lat}, lon=${spot.lon}`);
          return;
        }

        console.log(`📍 Creating marker for ${spot.full_name} at [${lat}, ${lon}]`);

        // Create marker with default Leaflet icon
        const marker = L.marker([lat, lon]);
        
        // Store marker reference
        markersRef.current.set(spot.id, marker);

        // Add marker to layer group
        marker.addTo(layerGroup);
        addedMarkers++;

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

        console.log(`✅ Successfully added marker ${addedMarkers} for ${spot.full_name}`);

      } catch (error) {
        console.error(`❌ Error adding marker for ${spot.full_name}:`, error);
      }
    });

    console.log(`🎉 Finished adding markers. Total added: ${addedMarkers}/${spots.length}`);

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
        }, 200);
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
