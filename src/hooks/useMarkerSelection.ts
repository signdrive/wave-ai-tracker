
import { useEffect } from 'react';
import L from 'leaflet';
import { createHighlightedIcon } from '@/utils/mapUtils';
import { isValidCoordinate } from '@/utils/coordinateValidation';

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

interface UseMarkerSelectionProps {
  selectedSpotId?: string;
  spots: DatabaseSurfSpot[];
  mapInstance: L.Map | null;
  markersMap: Map<string, L.Marker>;
}

export const useMarkerSelection = ({ 
  selectedSpotId, 
  spots, 
  mapInstance, 
  markersMap 
}: UseMarkerSelectionProps) => {
  
  useEffect(() => {
    if (!selectedSpotId || !mapInstance) return;

    console.log(`🎯 Updating selection for spot: ${selectedSpotId}`);

    // Validate map instance before proceeding
    try {
      if (!mapInstance.getContainer()) {
        console.warn('⚠️ Map instance is not ready or has been destroyed');
        return;
      }
    } catch (error) {
      console.warn('⚠️ Map instance validation failed:', error);
      return;
    }

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

    markersMap.forEach((marker, spotId) => {
      try {
        if (spotId === selectedSpotId) {
          const highlightIcon = createHighlightedIcon();
          marker.setIcon(highlightIcon);
          marker.openPopup();
        } else {
          const defaultIcon = createDefaultIcon();
          marker.setIcon(defaultIcon);
        }
      } catch (error) {
        console.warn(`⚠️ Error updating marker for spot ${spotId}:`, error);
      }
    });

    // Center on selected spot with additional validation
    const selectedSpot = spots.find(s => s.id === selectedSpotId);
    if (selectedSpot) {
      const lat = Number(selectedSpot.lat);
      const lon = Number(selectedSpot.lon);
      if (isValidCoordinate(lat, lon)) {
        try {
          // Double-check map is still valid before setView
          if (mapInstance.getContainer()) {
            setTimeout(() => {
              try {
                if (mapInstance.getContainer()) {
                  mapInstance.setView([lat, lon], 12, { animate: true });
                  console.log(`✅ Map centered on ${selectedSpot.full_name}`);
                }
              } catch (setViewError) {
                console.warn('⚠️ Error in delayed setView:', setViewError);
              }
            }, 100);
          }
        } catch (error) {
          console.warn('⚠️ Error setting map view:', error);
        }
      }
    }
  }, [selectedSpotId, spots, mapInstance, markersMap]);
};
