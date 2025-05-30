
import { useRef } from 'react';
import L from 'leaflet';
import { createHighlightedIcon, createPopupContent } from '@/utils/mapUtils';
import { isValidCoordinate } from '@/utils/coordinateValidation';
import { POPUP_CONFIG } from '@/utils/mapConfig';

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

interface UseMarkerCreationProps {
  layerGroup: L.LayerGroup | null;
  onSpotClick?: (spotId: string) => void;
}

export const useMarkerCreation = ({ layerGroup, onSpotClick }: UseMarkerCreationProps) => {
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  const createMarkerForSpot = (spot: DatabaseSurfSpot): L.Marker | null => {
    try {
      const lat = Number(spot.lat);
      const lon = Number(spot.lon);
      
      console.log(`🔨 Creating marker for ${spot.full_name}`, { 
        id: spot.id, 
        lat, 
        lon, 
        isValid: isValidCoordinate(lat, lon) 
      });
      
      if (!isValidCoordinate(lat, lon)) {
        console.warn(`❌ Invalid coordinates for ${spot.full_name}: lat=${lat}, lon=${lon}`);
        return null;
      }

      // Create marker with default icon
      const marker = L.marker([lat, lon]);
      
      if (!marker) {
        console.error(`❌ Failed to create Leaflet marker for ${spot.full_name}`);
        return null;
      }

      console.log(`✅ Leaflet marker created successfully for ${spot.full_name}`);

      // Create and bind popup
      try {
        const popupContent = createPopupContent(spot);
        if (popupContent) {
          marker.bindPopup(popupContent, POPUP_CONFIG);
          console.log(`✅ Popup content bound for ${spot.full_name}`);
        } else {
          console.warn(`⚠️ No popup content created for ${spot.full_name}`);
        }
      } catch (popupError) {
        console.warn(`⚠️ Failed to create/bind popup for ${spot.full_name}:`, popupError);
      }

      // Add click handler
      marker.on('click', (e) => {
        try {
          console.log(`🖱️ Marker clicked for spot: ${spot.full_name} (ID: ${spot.id})`);
          
          // Prevent event propagation
          if (e.originalEvent) {
            L.DomEvent.stopPropagation(e.originalEvent);
          }
          
          // Open popup
          try {
            marker.openPopup();
            console.log(`✅ Popup opened for ${spot.full_name}`);
          } catch (popupError) {
            console.warn(`⚠️ Failed to open popup for ${spot.full_name}:`, popupError);
          }
          
          // Call click callback
          if (onSpotClick) {
            try {
              onSpotClick(spot.id);
              console.log(`✅ onSpotClick callback executed for ${spot.full_name}`);
            } catch (callbackError) {
              console.error(`❌ Error in onSpotClick callback for ${spot.full_name}:`, callbackError);
            }
          }
        } catch (clickError) {
          console.error(`❌ Error handling click for ${spot.full_name}:`, clickError);
        }
      });

      return marker;
    } catch (error) {
      console.error(`❌ Critical error creating marker for ${spot.full_name}:`, error);
      return null;
    }
  };

  const addMarkerToMap = (marker: L.Marker, spot: DatabaseSurfSpot): boolean => {
    if (!layerGroup) {
      console.error(`❌ No layer group available to add marker for ${spot.full_name}`);
      return false;
    }

    try {
      // Store marker reference
      markersRef.current.set(spot.id, marker);
      
      // Add to layer group (which is already added to the map)
      marker.addTo(layerGroup);
      
      console.log(`✅ Marker successfully added to layer group for ${spot.full_name}`);
      return true;
    } catch (error) {
      console.error(`❌ Error adding marker to layer group for ${spot.full_name}:`, error);
      return false;
    }
  };

  const updateMarkerSelection = (selectedSpotId: string | undefined) => {
    console.log(`🎯 Updating marker selection for spot: ${selectedSpotId}`);
    
    markersRef.current.forEach((marker, spotId) => {
      try {
        const isSelected = spotId === selectedSpotId;
        if (isSelected) {
          const highlightedIcon = createHighlightedIcon();
          marker.setIcon(highlightedIcon);
          try {
            marker.openPopup();
          } catch (popupError) {
            console.warn(`⚠️ Could not open popup for selected marker ${spotId}:`, popupError);
          }
        } else {
          marker.setIcon(new L.Icon.Default());
        }
      } catch (iconError) {
        console.warn(`⚠️ Error updating marker icon for spot ${spotId}:`, iconError);
      }
    });
  };

  const clearMarkers = () => {
    try {
      console.log(`🧹 Clearing ${markersRef.current.size} existing markers...`);
      
      if (layerGroup) {
        layerGroup.clearLayers();
        console.log(`✅ Layer group cleared successfully`);
      }
      
      markersRef.current.clear();
      console.log(`✅ Marker references cleared`);
    } catch (error) {
      console.error('❌ Error clearing markers:', error);
    }
  };

  return {
    markersRef,
    createMarkerForSpot,
    addMarkerToMap,
    updateMarkerSelection,
    clearMarkers
  };
};
