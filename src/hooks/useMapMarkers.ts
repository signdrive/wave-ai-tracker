
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

  // Create markers when everything is ready
  useEffect(() => {
    console.log('🎯 useMapMarkers effect triggered:', {
      hasMapInstance: !!mapInstance,
      hasLayerGroup: !!layerGroup,
      isMapReady,
      isLoading,
      spotsCount: spots.length,
      containerExists: mapInstance?.getContainer() ? 'YES' : 'NO'
    });

    // Essential requirements check with DOM validation
    if (!mapInstance || !layerGroup || isLoading || !isMapReady || spots.length === 0) {
      console.log('❌ Missing prerequisites for marker creation');
      return;
    }

    // Additional check for DOM container
    if (!mapInstance.getContainer()) {
      console.error('❌ Map container DOM element not available');
      return;
    }

    console.log('✅ All prerequisites met, starting marker creation...');

    // Clear existing markers safely
    try {
      markersRef.current.forEach(marker => {
        try {
          marker.remove();
        } catch (e) {
          console.warn('Warning removing marker:', e);
        }
      });
      layerGroup.clearLayers();
      markersRef.current.clear();
      console.log('🧹 Cleared existing markers');
    } catch (error) {
      console.warn('⚠️ Error clearing markers:', error);
    }

    let successCount = 0;
    const bounds = L.latLngBounds([]);

    // Add delay to ensure DOM is fully ready
    const markerTimeout = setTimeout(() => {
      console.log('🚀 Starting marker creation with DOM validation...');

      spots.forEach((spot, index) => {
        try {
          const lat = Number(spot.lat);
          const lon = Number(spot.lon);
          
          console.log(`📍 Processing marker ${index + 1}/${spots.length}: ${spot.full_name} at [${lat}, ${lon}]`);

          if (!isValidCoordinate(lat, lon)) {
            console.warn(`⚠️ Invalid coordinates for ${spot.full_name}: [${lat}, ${lon}]`);
            return;
          }

          // Verify map container still exists before creating marker
          if (!mapInstance.getContainer()) {
            console.error('❌ Map container lost during marker creation');
            return;
          }

          // Create marker with explicit default icon
          const defaultIcon = L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });

          const marker = L.marker([lat, lon], { icon: defaultIcon });
          
          // Add popup
          const popupContent = createPopupContent(spot);
          if (popupContent) {
            marker.bindPopup(popupContent, POPUP_CONFIG);
          }

          // Add click handler
          marker.on('click', (e) => {
            console.log(`🖱️ Marker clicked: ${spot.full_name}`);
            if (e.originalEvent) {
              L.DomEvent.stopPropagation(e.originalEvent);
            }
            marker.openPopup();
            if (onSpotClick) {
              onSpotClick(spot.id);
            }
          });

          // Add to both map and layer group for redundancy
          marker.addTo(mapInstance);
          layerGroup.addLayer(marker);
          
          // Store reference
          markersRef.current.set(spot.id, marker);
          
          // Add to bounds
          bounds.extend([lat, lon]);
          successCount++;
          
          console.log(`✅ Marker ${index + 1} added successfully to both map and layer group`);

        } catch (error) {
          console.error(`❌ Error creating marker for ${spot.full_name}:`, error);
        }
      });

      console.log(`🎉 Marker creation complete: ${successCount}/${spots.length} markers created`);

      // Fit bounds after all markers are added
      if (successCount > 0 && bounds.isValid()) {
        setTimeout(() => {
          try {
            mapInstance.fitBounds(bounds, FIT_BOUNDS_CONFIG);
            console.log('🔍 Map bounds fitted to show all markers');
          } catch (error) {
            console.error('❌ Error fitting bounds:', error);
          }
        }, 200);
      }

      // Force map refresh
      setTimeout(() => {
        try {
          mapInstance.invalidateSize();
          console.log('🔄 Map size invalidated to ensure proper rendering');
        } catch (error) {
          console.warn('⚠️ Error invalidating map size:', error);
        }
      }, 300);

      // Final verification with emergency fallback
      setTimeout(() => {
        const markerCount = markersRef.current.size;
        
        console.log(`🔍 FINAL VERIFICATION:`, {
          markersInRef: markerCount,
          markersCreated: successCount,
          success: markerCount > 0
        });
        
        if (markerCount === 0) {
          console.error('❌ CRITICAL: NO MARKERS VISIBLE! Adding emergency test marker...');
          
          // Emergency test marker
          try {
            const testIcon = L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });
            
            const testMarker = L.marker([34.0522, -118.2437], { icon: testIcon });
            testMarker.bindPopup('🆘 Emergency test marker - if you see this, the system can create markers!');
            testMarker.addTo(mapInstance);
            layerGroup.addLayer(testMarker);
            console.log('🚨 Emergency test marker added to both map and layer group');
          } catch (testError) {
            console.error('❌ Even emergency marker failed:', testError);
          }
        } else {
          console.log(`✅ SUCCESS: ${markerCount} markers are visible on the map`);
        }
      }, 500);

    }, 100); // Delay for DOM readiness

    return () => {
      clearTimeout(markerTimeout);
    };

  }, [mapInstance, layerGroup, spots, isLoading, onSpotClick, isMapReady]);

  // Handle selection changes
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
