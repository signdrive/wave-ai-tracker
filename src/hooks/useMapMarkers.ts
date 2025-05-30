
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { isValidCoordinate } from '@/utils/coordinateValidation';
import { createPopupContent, createHighlightedIcon } from '@/utils/mapUtils';
import { POPUP_CONFIG, FIT_BOUNDS_CONFIG } from '@/utils/mapConfig';

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
  const isCreatingMarkersRef = useRef(false);

  // Create markers effect - always called, but with internal guards
  useEffect(() => {
    console.log('🎯 useMapMarkers effect triggered:', {
      hasMapInstance: !!mapInstance,
      hasLayerGroup: !!layerGroup,
      isMapReady,
      isLoading,
      spotsCount: spots.length,
      isCreatingMarkers: isCreatingMarkersRef.current
    });

    // Internal guards instead of early returns to prevent hook violations
    if (!mapInstance || !layerGroup || isLoading || !isMapReady || spots.length === 0 || isCreatingMarkersRef.current) {
      if (!mapInstance || !layerGroup || !isMapReady) {
        console.log('❌ Missing prerequisites for marker creation');
      }
      return;
    }

    console.log('✅ All prerequisites met, starting marker creation...');
    isCreatingMarkersRef.current = true;

    const createMarkersAsync = async () => {
      try {
        // Clear existing markers
        markersRef.current.forEach(marker => {
          try {
            marker.remove();
          } catch (e) {
            console.warn('Error removing marker:', e);
          }
        });
        layerGroup.clearLayers();
        markersRef.current.clear();
        console.log('🧹 Cleared existing markers');

        // Create default icon
        const defaultIcon = L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        let successCount = 0;
        const bounds = L.latLngBounds([]);

        console.log(`🚀 Processing ${spots.length} surf spots...`);

        for (const [index, spot] of spots.entries()) {
          try {
            const lat = Number(spot.lat);
            const lon = Number(spot.lon);
            
            console.log(`📍 Processing spot ${index + 1}/${spots.length}: ${spot.full_name} at [${lat}, ${lon}]`);

            if (!isValidCoordinate(lat, lon)) {
              console.warn(`⚠️ Invalid coordinates for ${spot.full_name}: [${lat}, ${lon}]`);
              continue;
            }

            // Create marker
            const marker = L.marker([lat, lon], { icon: defaultIcon });
            
            // Add popup
            const popupContent = createPopupContent(spot);
            if (popupContent) {
              marker.bindPopup(popupContent, POPUP_CONFIG);
            }

            // Add click handler with error prevention
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

            // Add to layer group
            layerGroup.addLayer(marker);
            
            // Store reference
            markersRef.current.set(spot.id, marker);
            
            // Add to bounds
            bounds.extend([lat, lon]);
            successCount++;
            
            console.log(`✅ Marker ${index + 1} created and added successfully`);

          } catch (error) {
            console.error(`❌ Error creating marker for ${spot.full_name}:`, error);
          }
        }

        console.log(`🎉 Marker creation complete: ${successCount}/${spots.length} markers created`);

        // Fit bounds if we have markers
        if (successCount > 0 && bounds.isValid()) {
          setTimeout(() => {
            try {
              if (mapInstance && mapInstance.getContainer()) {
                mapInstance.fitBounds(bounds, FIT_BOUNDS_CONFIG);
                console.log('🔍 Map bounds fitted');
              }
            } catch (error) {
              console.error('❌ Error fitting bounds:', error);
            }
          }, 100);
        }

        // Force map refresh
        setTimeout(() => {
          try {
            if (mapInstance && mapInstance.getContainer()) {
              mapInstance.invalidateSize();
              console.log('🔄 Map size invalidated');
            }
          } catch (error) {
            console.warn('⚠️ Error invalidating map size:', error);
          }
        }, 200);

      } catch (error) {
        console.error('❌ Critical error in marker creation:', error);
      } finally {
        isCreatingMarkersRef.current = false;
      }
    };

    createMarkersAsync();

  }, [mapInstance, layerGroup, spots, isLoading, onSpotClick, isMapReady]);

  // Handle selection changes - always called
  useEffect(() => {
    if (!selectedSpotId || !mapInstance) return;

    console.log(`🎯 Updating selection for spot: ${selectedSpotId}`);

    markersRef.current.forEach((marker, spotId) => {
      try {
        if (spotId === selectedSpotId) {
          const highlightIcon = createHighlightedIcon();
          marker.setIcon(highlightIcon);
          marker.openPopup();
        } else {
          const defaultIcon = L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          marker.setIcon(defaultIcon);
        }
      } catch (error) {
        console.warn(`⚠️ Error updating marker for spot ${spotId}:`, error);
      }
    });

    // Center on selected spot
    const selectedSpot = spots.find(s => s.id === selectedSpotId);
    if (selectedSpot) {
      const lat = Number(selectedSpot.lat);
      const lon = Number(selectedSpot.lon);
      if (isValidCoordinate(lat, lon)) {
        mapInstance.setView([lat, lon], 12, { animate: true });
      }
    }
  }, [selectedSpotId, spots, mapInstance]);

  return { markersRef };
};
