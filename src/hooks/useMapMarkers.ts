
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
  const processingRef = useRef(false);

  // Validate coordinates
  const isValidCoordinate = (lat: number, lon: number): boolean => {
    return !isNaN(lat) && !isNaN(lon) && 
           lat >= -90 && lat <= 90 && 
           lon >= -180 && lon <= 180 &&
           (lat !== 0 || lon !== 0); // Exclude null island
  };

  // Effect for handling marker creation and updates - always runs consistently
  useEffect(() => {
    console.log('🎯 useMapMarkers effect triggered', {
      mapInstance: !!mapInstance,
      layerGroup: !!layerGroup,
      isMapReady,
      isLoading,
      spotsCount: spots.length,
      processing: processingRef.current
    });

    // Early return conditions - but effect still runs
    if (!mapInstance || !layerGroup || !isMapReady || isLoading || processingRef.current) {
      console.log('🚫 Requirements not met for marker creation');
      return;
    }

    if (spots.length === 0) {
      console.log('❗ No spots to display');
      return;
    }

    processingRef.current = true;

    try {
      console.log(`🎯 Starting to add ${spots.length} markers to map`);

      // Clear existing markers safely
      try {
        layerGroup.clearLayers();
        markersRef.current.clear();
        console.log('🧹 Cleared existing markers');
      } catch (error) {
        console.error('❌ Error clearing markers:', error);
      }

      let addedMarkers = 0;
      const bounds = L.latLngBounds([]);

      // Process each spot
      spots.forEach((spot) => {
        try {
          const lat = Number(spot.lat);
          const lon = Number(spot.lon);
          
          if (!isValidCoordinate(lat, lon)) {
            console.warn(`❌ Invalid coordinates for ${spot.full_name}: lat=${lat}, lon=${lon}`);
            return;
          }

          console.log(`📍 Creating marker for ${spot.full_name} at [${lat}, ${lon}]`);

          // Create marker with default Leaflet icon
          const marker = L.marker([lat, lon]);
          
          if (!marker) {
            console.error(`❌ Failed to create marker for ${spot.full_name}`);
            return;
          }

          // Store marker reference before adding to map
          markersRef.current.set(spot.id, marker);

          // Add marker to layer group
          marker.addTo(layerGroup);

          // Extend bounds
          bounds.extend([lat, lon]);

          // Create and bind popup with error handling
          try {
            const popupContent = createPopupContent(spot);
            if (popupContent) {
              marker.bindPopup(popupContent, { 
                maxWidth: 300,
                closeButton: true,
                autoPan: true,
                autoClose: false,
                closeOnEscapeKey: true
              });
            }
          } catch (popupError) {
            console.warn(`⚠️ Failed to create popup for ${spot.full_name}:`, popupError);
          }

          // Add click handler with error boundary
          marker.on('click', (e) => {
            try {
              console.log(`🖱️ Marker clicked for spot: ${spot.full_name}`);
              
              // Prevent event from bubbling
              if (e.originalEvent) {
                L.DomEvent.stopPropagation(e.originalEvent);
              }
              
              // Open the popup safely
              try {
                marker.openPopup();
              } catch (popupError) {
                console.warn('⚠️ Failed to open popup:', popupError);
              }
              
              // Trigger the spot click callback if provided
              if (onSpotClick && typeof onSpotClick === 'function') {
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

          // Apply selection styling if needed
          if (selectedSpotId === spot.id) {
            try {
              const highlightedIcon = createHighlightedIcon();
              marker.setIcon(highlightedIcon);
            } catch (iconError) {
              console.warn(`⚠️ Failed to set highlighted icon for ${spot.full_name}:`, iconError);
            }
          }

          addedMarkers++;
          console.log(`✅ Successfully added marker for ${spot.full_name}`);

        } catch (error) {
          console.error(`❌ Error adding marker for ${spot.full_name}:`, error);
        }
      });

      console.log(`🎉 Finished adding markers. Total added: ${addedMarkers}/${spots.length}`);

      // Fit bounds if we have markers and bounds are valid
      if (addedMarkers > 0 && bounds.isValid()) {
        try {
          setTimeout(() => {
            if (mapInstance && mapInstance.getContainer && mapInstance.getContainer()) {
              mapInstance.fitBounds(bounds, { 
                padding: [20, 20],
                maxZoom: 10,
                animate: true,
                duration: 0.5
              });
              console.log('🔍 Map bounds fitted to show all markers');
            }
          }, 300);
        } catch (error) {
          console.error('❌ Error fitting bounds:', error);
        }
      }

    } catch (error) {
      console.error('❌ Unexpected error in marker processing:', error);
    } finally {
      processingRef.current = false;
    }

  }, [mapInstance, layerGroup, spots, isLoading, selectedSpotId, onSpotClick, isMapReady]);

  // Effect for handling selected spot changes - always runs consistently  
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
        if (mapInstance.getContainer && mapInstance.getContainer()) {
          mapInstance.setView([lat, lon], 12, { animate: true, duration: 0.5 });
          console.log(`🎯 Centered map on ${selectedSpot.full_name}`);
        }
      } catch (viewError) {
        console.warn('⚠️ Could not set map view:', viewError);
      }
      
      // Update marker icons safely
      markersRef.current.forEach((marker, spotId) => {
        try {
          const isSelected = spotId === selectedSpotId;
          if (isSelected) {
            const highlightedIcon = createHighlightedIcon();
            marker.setIcon(highlightedIcon);
            // Try to open popup
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

    } catch (error) {
      console.error('❌ Error in selected spot effect:', error);
    }
  }, [selectedSpotId, spots, mapInstance]);

  return { markersRef };
};
