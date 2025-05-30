
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

  // Main effect for adding markers
  useEffect(() => {
    console.log('🎯 useMapMarkers: Main marker effect triggered', {
      mapInstance: !!mapInstance,
      layerGroup: !!layerGroup,
      isMapReady,
      isLoading,
      spotsCount: spots.length,
      firstFewSpots: spots.slice(0, 3).map(s => ({ name: s.full_name, lat: s.lat, lon: s.lon, id: s.id }))
    });

    // Check all prerequisites
    if (!mapInstance || !layerGroup || !isMapReady || isLoading) {
      console.log('🚫 Prerequisites not met for marker creation:', {
        hasMapInstance: !!mapInstance,
        hasLayerGroup: !!layerGroup,
        isMapReady,
        isLoading
      });
      return;
    }

    if (spots.length === 0) {
      console.log('🚫 No spots to display');
      clearMarkers();
      return;
    }

    console.log('🎯 All prerequisites met. Starting marker creation process...');

    try {
      // Clear existing markers first
      clearMarkers();

      let successfullyAdded = 0;
      const bounds = L.latLngBounds([]);
      let boundsValid = false;

      console.log(`📍 Processing ${spots.length} surf spots...`);

      spots.forEach((spot, index) => {
        try {
          const lat = Number(spot.lat);
          const lon = Number(spot.lon);
          
          console.log(`🏄‍♂️ Processing spot ${index + 1}/${spots.length}: ${spot.full_name}`, {
            id: spot.id,
            lat,
            lon,
            country: spot.country,
            isValidCoords: isValidCoordinate(lat, lon)
          });

          if (!isValidCoordinate(lat, lon)) {
            console.warn(`⚠️ Skipping ${spot.full_name} - invalid coordinates: lat=${lat}, lon=${lon}`);
            return;
          }

          // Create marker
          const marker = createMarkerForSpot(spot);
          if (!marker) {
            console.error(`❌ Failed to create marker for ${spot.full_name}`);
            return;
          }

          // Add to map
          const added = addMarkerToMap(marker, spot);
          if (!added) {
            console.error(`❌ Failed to add marker to map for ${spot.full_name}`);
            return;
          }

          // Add to bounds
          bounds.extend([lat, lon]);
          boundsValid = true;
          successfullyAdded++;

          console.log(`✅ Successfully added marker for ${spot.full_name} (${successfullyAdded}/${spots.length})`);
        } catch (spotError) {
          console.error(`❌ Error processing spot ${spot.full_name}:`, spotError);
        }
      });

      console.log(`🎉 Marker creation completed: ${successfullyAdded}/${spots.length} markers added successfully`);

      // Fit bounds if we have valid markers
      if (successfullyAdded > 0 && boundsValid && bounds.isValid()) {
        console.log('🔍 Fitting map bounds to show all markers...');
        setTimeout(() => {
          try {
            if (mapInstance && mapInstance.getContainer?.()) {
              mapInstance.fitBounds(bounds, FIT_BOUNDS_CONFIG);
              console.log('✅ Map bounds fitted successfully');
            }
          } catch (boundsError) {
            console.error('❌ Error fitting bounds:', boundsError);
          }
        }, 500);
      } else {
        console.warn(`⚠️ Cannot fit bounds: successfullyAdded=${successfullyAdded}, boundsValid=${boundsValid}`);
      }

    } catch (error) {
      console.error('❌ Critical error in marker processing:', error);
    }
  }, [mapInstance, layerGroup, spots, isLoading, isMapReady, createMarkerForSpot, addMarkerToMap, clearMarkers]);

  // Separate effect for handling selected spot changes
  useEffect(() => {
    if (!selectedSpotId || !mapInstance || !spots.length || !isMapReady) {
      return;
    }

    try {
      const selectedSpot = spots.find(spot => spot.id === selectedSpotId);
      if (!selectedSpot) {
        console.warn(`⚠️ Selected spot ${selectedSpotId} not found in spots array`);
        return;
      }

      const lat = Number(selectedSpot.lat);
      const lon = Number(selectedSpot.lon);

      if (!isValidCoordinate(lat, lon)) {
        console.warn(`⚠️ Invalid coordinates for selected spot ${selectedSpot.full_name}: lat=${lat}, lon=${lon}`);
        return;
      }

      // Center map on selected spot
      try {
        if (mapInstance.getContainer?.()) {
          mapInstance.setView([lat, lon], 12, { animate: true, duration: 0.5 });
          console.log(`🎯 Map centered on selected spot: ${selectedSpot.full_name}`);
        }
      } catch (viewError) {
        console.warn('⚠️ Could not set map view:', viewError);
      }
      
      // Update marker selection
      updateMarkerSelection(selectedSpotId);

    } catch (error) {
      console.error('❌ Error handling selected spot:', error);
    }
  }, [selectedSpotId, spots, mapInstance, isMapReady, updateMarkerSelection]);

  return { markersRef };
};
