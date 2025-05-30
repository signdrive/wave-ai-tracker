
import { useEffect } from 'react';
import L from 'leaflet';
import { FIT_BOUNDS_CONFIG } from '@/utils/mapConfig';
import { useMarkerState } from './useMarkerState';
import { useMarkerCreation } from './useMarkerCreation';
import { useMarkerSelection } from './useMarkerSelection';

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
    isCreatingMarkersRef, 
    clearMarkers, 
    addMarker, 
    getAllMarkers 
  } = useMarkerState();
  
  const { createMarkerForSpot, addMarkerToMap } = useMarkerCreation();

  // Create markers effect
  useEffect(() => {
    console.log('🎯 useMapMarkers effect triggered:', {
      hasMapInstance: !!mapInstance,
      hasLayerGroup: !!layerGroup,
      isMapReady,
      isLoading,
      spotsCount: spots.length,
      isCreatingMarkers: isCreatingMarkersRef.current
    });

    if (!mapInstance || !layerGroup || isLoading || !isMapReady || spots.length === 0 || isCreatingMarkersRef.current) {
      return;
    }

    // Validate map instance before proceeding
    try {
      if (!mapInstance.getContainer() || !mapInstance._loaded) {
        console.warn('⚠️ Map instance is not ready for marker creation');
        return;
      }
    } catch (error) {
      console.warn('⚠️ Map validation failed:', error);
      return;
    }

    console.log('✅ All prerequisites met, starting marker creation...');
    isCreatingMarkersRef.current = true;

    const createMarkersAsync = async () => {
      try {
        clearMarkers(layerGroup);

        let successCount = 0;
        const bounds = L.latLngBounds([]);

        console.log(`🚀 Processing ${spots.length} surf spots...`);

        for (const [index, spot] of spots.entries()) {
          try {
            const marker = createMarkerForSpot(spot, onSpotClick);
            
            if (marker) {
              const lat = Number(spot.lat);
              const lon = Number(spot.lon);
              
              if (addMarkerToMap(marker, layerGroup)) {
                addMarker(spot.id, marker);
                bounds.extend([lat, lon]);
                successCount++;
                console.log(`✅ Marker ${index + 1} added successfully`);
              }
            }
          } catch (error) {
            console.error(`❌ Error processing marker for ${spot.full_name}:`, error);
          }
        }

        console.log(`🎉 Marker creation complete: ${successCount}/${spots.length} markers created`);

        // Fit bounds if we have markers - with better validation
        if (successCount > 0 && bounds.isValid()) {
          setTimeout(() => {
            try {
              if (mapInstance && mapInstance.getContainer() && mapInstance._loaded) {
                mapInstance.fitBounds(bounds, FIT_BOUNDS_CONFIG);
                console.log('🔍 Map bounds fitted');
              } else {
                console.warn('⚠️ Map not ready for fitBounds');
              }
            } catch (error) {
              console.error('❌ Error fitting bounds:', error);
            }
          }, 200);
        }

        // Force map refresh - with validation
        setTimeout(() => {
          try {
            if (mapInstance && mapInstance.getContainer() && mapInstance._loaded) {
              mapInstance.invalidateSize();
              console.log('🔄 Map size invalidated');
            }
          } catch (error) {
            console.warn('⚠️ Error invalidating map size:', error);
          }
        }, 300);

      } catch (error) {
        console.error('❌ Critical error in marker creation:', error);
      } finally {
        isCreatingMarkersRef.current = false;
      }
    };

    createMarkersAsync();

  }, [mapInstance, layerGroup, spots, isLoading, onSpotClick, isMapReady]);

  // Handle marker selection
  useMarkerSelection({
    selectedSpotId,
    spots,
    mapInstance,
    markersMap: getAllMarkers()
  });

  return { markersRef };
};
