
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
}

export const useMapMarkers = ({ 
  mapInstance, 
  layerGroup,
  spots, 
  isLoading, 
  onSpotClick, 
  selectedSpotId 
}: UseMapMarkersProps) => {
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const highlightedIcon = createHighlightedIcon();

  useEffect(() => {
    if (!mapInstance || !layerGroup) {
      console.log('🚫 Map instance or layer group not ready for adding markers');
      return;
    }

    if (isLoading) {
      console.log('⏳ Still loading data, skipping marker update');
      return;
    }

    console.log(`🎯 Processing ${spots.length} spots for map display`);

    // Clear existing markers safely
    try {
      layerGroup.clearLayers();
      markersRef.current.clear();
      console.log('🧹 Cleared existing markers');
    } catch (error) {
      console.error('❌ Error clearing markers:', error);
    }

    if (spots.length === 0) {
      console.log('❗ No spots to display on map');
      return;
    }

    console.log(`📍 Adding ${spots.length} markers to map`);

    let validSpots = 0;
    const bounds = L.latLngBounds([]);

    // Add markers for all spots
    spots.forEach((spot, index) => {
      console.log(`Processing spot ${index + 1}/${spots.length}: ${spot.full_name} at [${spot.lat}, ${spot.lon}]`);
      
      if (!spot.lat || !spot.lon || isNaN(spot.lat) || isNaN(spot.lon)) {
        console.warn(`❌ Skipping spot ${spot.full_name} - invalid coordinates: lat=${spot.lat}, lon=${spot.lon}`);
        return;
      }

      // Check coordinate bounds
      if (spot.lat < -90 || spot.lat > 90 || spot.lon < -180 || spot.lon > 180) {
        console.warn(`❌ Skipping spot ${spot.full_name} - coordinates out of bounds: lat=${spot.lat}, lon=${spot.lon}`);
        return;
      }

      validSpots++;
      const latLng = L.latLng(spot.lat, spot.lon);
      bounds.extend(latLng);

      try {
        const isSelected = selectedSpotId === spot.id;
        const marker = L.marker(latLng, {
          icon: isSelected ? highlightedIcon : undefined
        });

        // Add to layer group
        layerGroup.addLayer(marker);
        
        // Store marker reference
        markersRef.current.set(spot.id, marker);

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

        console.log(`✅ Added marker for ${spot.full_name}`);

      } catch (error) {
        console.error(`❌ Error adding marker for ${spot.full_name}:`, error);
      }
    });

    console.log(`✅ Successfully added ${validSpots} valid markers out of ${spots.length} total spots`);

    // Auto-fit map to show all markers if we have valid spots
    if (validSpots > 0 && bounds.isValid() && mapInstance) {
      console.log('🔍 Fitting map bounds to show all spots');
      try {
        mapInstance.fitBounds(bounds, { 
          padding: [20, 20],
          maxZoom: 10
        });
        console.log('✅ Map bounds fitted successfully');
      } catch (error) {
        console.error('❌ Error fitting bounds:', error);
      }
    } else {
      console.log('❗ No valid spots to fit bounds, keeping default view');
    }

  }, [mapInstance, layerGroup, spots, isLoading, selectedSpotId, onSpotClick, highlightedIcon]);

  // Center map on selected spot
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
