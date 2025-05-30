
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
    const lat = Number(spot.lat);
    const lon = Number(spot.lon);
    
    console.log(`🔨 Creating marker for ${spot.full_name}`, { lat, lon, id: spot.id });
    
    if (!isValidCoordinate(lat, lon)) {
      console.warn(`❌ Invalid coordinates for ${spot.full_name}: lat=${lat}, lon=${lon}`);
      return null;
    }

    try {
      const marker = L.marker([lat, lon]);
      
      if (!marker) {
        console.error(`❌ Failed to create marker for ${spot.full_name}`);
        return null;
      }

      console.log(`✅ Marker created for ${spot.full_name}`);

      // Create and bind popup
      try {
        const popupContent = createPopupContent(spot);
        if (popupContent) {
          marker.bindPopup(popupContent, POPUP_CONFIG);
          console.log(`✅ Popup bound for ${spot.full_name}`);
        }
      } catch (popupError) {
        console.warn(`⚠️ Failed to create popup for ${spot.full_name}:`, popupError);
      }

      // Add click handler
      marker.on('click', (e) => {
        try {
          console.log(`🖱️ Marker clicked for spot: ${spot.full_name}`);
          
          if (e.originalEvent) {
            L.DomEvent.stopPropagation(e.originalEvent);
          }
          
          try {
            marker.openPopup();
          } catch (popupError) {
            console.warn('⚠️ Failed to open popup:', popupError);
          }
          
          if (onSpotClick) {
            try {
              onSpotClick(spot.id);
            } catch (callbackError) {
              console.error('❌ Error in onSpotClick callback:', callbackError);
            }
          }
        } catch (clickError) {
          console.error(`❌ Error handling click for ${spot.full_name}:`, clickError);
        }
      });

      return marker;
    } catch (error) {
      console.error(`❌ Error creating marker for ${spot.full_name}:`, error);
      return null;
    }
  };

  const addMarkerToMap = (marker: L.Marker, spot: DatabaseSurfSpot): boolean => {
    if (!layerGroup) {
      console.error('❌ No layer group available to add marker');
      return false;
    }

    try {
      markersRef.current.set(spot.id, marker);
      marker.addTo(layerGroup);
      console.log(`✅ Marker added to map for ${spot.full_name}`);
      return true;
    } catch (error) {
      console.error(`❌ Error adding marker to map for ${spot.full_name}:`, error);
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
            console.warn('⚠️ Could not open popup for selected marker:', popupError);
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
      if (layerGroup) {
        layerGroup.clearLayers();
        console.log(`🧹 Cleared ${markersRef.current.size} existing markers from layer group`);
      }
      markersRef.current.clear();
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
