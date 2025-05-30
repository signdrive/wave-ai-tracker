
import L from 'leaflet';
import { isValidCoordinate } from '@/utils/coordinateValidation';
import { createPopupContent } from '@/utils/mapUtils';
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

export const useMarkerCreation = () => {
  const createDefaultIcon = () => {
    return L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  const createMarkerForSpot = (
    spot: DatabaseSurfSpot,
    onSpotClick?: (spotId: string) => void
  ): L.Marker | null => {
    try {
      const lat = Number(spot.lat);
      const lon = Number(spot.lon);
      
      console.log(`📍 Creating marker for ${spot.full_name} at [${lat}, ${lon}]`);

      if (!isValidCoordinate(lat, lon)) {
        console.warn(`⚠️ Invalid coordinates for ${spot.full_name}: [${lat}, ${lon}]`);
        return null;
      }

      const defaultIcon = createDefaultIcon();
      const marker = L.marker([lat, lon], { icon: defaultIcon });
      
      // Add popup
      const popupContent = createPopupContent(spot);
      if (popupContent) {
        marker.bindPopup(popupContent, POPUP_CONFIG);
      }

      // Add click handler
      marker.on('click', (e) => {
        try {
          console.log(`🖱️ Marker clicked: ${spot.full_name}`);
          if (e.originalEvent) {
            L.DomEvent.stopPropagation(e.originalEvent);
          }
          marker.openPopup();
          if (onSpotClick) {
            onSpotClick(spot.id);
          }
        } catch (clickError) {
          console.error('Error in marker click handler:', clickError);
        }
      });

      console.log(`✅ Marker created for ${spot.full_name}`);
      return marker;

    } catch (error) {
      console.error(`❌ Error creating marker for ${spot.full_name}:`, error);
      return null;
    }
  };

  const addMarkerToMap = (marker: L.Marker, layerGroup: L.LayerGroup): boolean => {
    try {
      layerGroup.addLayer(marker);
      return true;
    } catch (error) {
      console.error('❌ Error adding marker to layer group:', error);
      return false;
    }
  };

  return {
    createDefaultIcon,
    createMarkerForSpot,
    addMarkerToMap
  };
};
