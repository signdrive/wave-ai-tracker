
import { useEffect } from 'react';
import L from 'leaflet';
import { useMarkerCreation } from '@/hooks/useMarkerCreation';
import { isValidCoordinate } from '@/utils/coordinateValidation';
import { FIT_BOUNDS_CONFIG } from '@/utils/mapConfig';

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
  const {
    markersRef,
    createMarkerForSpot,
    addMarkerToMap,
    updateMarkerSelection,
    clearMarkers
  } = useMarkerCreation({ layerGroup, onSpotClick });

  // Effect for handling marker creation and updates
  useEffect(() => {
    console.log('🎯 useMapMarkers effect triggered', {
      mapInstance: !!mapInstance,
      layerGroup: !!layerGroup,
      isMapReady,
      isLoading,
      spotsCount: spots.length,
      spotsData: spots.slice(0, 3) // Log first 3 spots for debugging
    });

    if (!mapInstance || !layerGroup || !isMapReady || isLoading) {
      console.log('🚫 Requirements not met for marker creation', {
        mapInstance: !!mapInstance,
        layerGroup: !!layerGroup,
        isMapReady,
        isLoading
      });
      return;
    }

    if (spots.length === 0) {
      console.log('🚫 No spots to display');
      return;
    }

    try {
      console.log(`🎯 Starting to add ${spots.length} markers to map`);
      clearMarkers();

      let addedMarkers = 0;
      const bounds = L.latLngBounds([]);

      spots.forEach((spot, index) => {
        console.log(`🏄‍♂️ Processing spot ${index + 1}/${spots.length}: ${spot.full_name}`, {
          lat: spot.lat,
          lon: spot.lon,
          id: spot.id
        });

        const marker = createMarkerForSpot(spot);
        if (marker && addMarkerToMap(marker, spot)) {
          const lat = Number(spot.lat);
          const lon = Number(spot.lon);
          
          if (isValidCoordinate(lat, lon)) {
            bounds.extend([lat, lon]);
            addedMarkers++;
            console.log(`✅ Successfully added marker ${addedMarkers} for ${spot.full_name}`);
          } else {
            console.warn(`⚠️ Invalid coordinates for ${spot.full_name}: lat=${lat}, lon=${lon}`);
          }
        } else {
          console.error(`❌ Failed to add marker for ${spot.full_name}`);
        }
      });

      console.log(`🎉 Finished adding markers. Total added: ${addedMarkers}/${spots.length}`);

      // Fit bounds if we have markers
      if (addedMarkers > 0 && bounds.isValid()) {
        try {
          setTimeout(() => {
            if (mapInstance?.getContainer?.()) {
              console.log('🔍 Fitting map bounds to show all markers');
              mapInstance.fitBounds(bounds, FIT_BOUNDS_CONFIG);
            }
          }, 300);
        } catch (error) {
          console.error('❌ Error fitting bounds:', error);
        }
      } else {
        console.warn('⚠️ No valid markers to fit bounds for');
      }

    } catch (error) {
      console.error('❌ Unexpected error in marker processing:', error);
    }
  }, [mapInstance, layerGroup, spots, isLoading, isMapReady]);

  // Effect for handling selected spot changes
  useEffect(() => {
    if (!selectedSpotId || !mapInstance || !spots.length) {
      return;
    }

    try {
      const selectedSpot = spots.find(spot => spot.id === selectedSpotId);
      if (!selectedSpot) {
        console.warn(`⚠️ Selected spot ${selectedSpotId} not found`);
        return;
      }

      const lat = Number(selectedSpot.lat);
      const lon = Number(selectedSpot.lon);

      if (!isValidCoordinate(lat, lon)) {
        console.warn(`⚠️ Invalid coordinates for selected spot ${selectedSpot.full_name}`);
        return;
      }

      // Set view safely
      try {
        if (mapInstance.getContainer?.()) {
          mapInstance.setView([lat, lon], 12, { animate: true, duration: 0.5 });
          console.log(`🎯 Centered map on ${selectedSpot.full_name}`);
        }
      } catch (viewError) {
        console.warn('⚠️ Could not set map view:', viewError);
      }
      
      // Update marker icons
      updateMarkerSelection(selectedSpotId);

    } catch (error) {
      console.error('❌ Error in selected spot effect:', error);
    }
  }, [selectedSpotId, spots, mapInstance]);

  return { markersRef };
};
