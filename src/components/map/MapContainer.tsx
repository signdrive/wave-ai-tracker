
import React from 'react';
import { useMapInitialization } from './hooks/useMapInitialization';
import { useSurfSpotMarkers } from './hooks/useSurfSpotMarkers';
import { useMentorMarkers } from './hooks/useMentorMarkers';
import MapLoadingOverlay from './MapLoadingOverlay';

interface MapContainerProps {
  surfSpots: any[];
  rawSpots: any[];
  isLoading: boolean;
  viewMode: 'spots' | 'mentors' | 'both';
  selectedSpot: any;
  onSpotSelection: (spotId: string) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  surfSpots,
  rawSpots,
  isLoading,
  viewMode,
  selectedSpot,
  onSpotSelection
}) => {
  const { mapRef, containerRef } = useMapInitialization();

  console.log('🗺️ MapContainer render:', {
    surfSpotsCount: surfSpots.length,
    onSpotSelectionType: typeof onSpotSelection,
    selectedSpot: selectedSpot ? selectedSpot.full_name : 'none'
  });

  useSurfSpotMarkers({
    mapRef,
    surfSpots,
    isLoading,
    viewMode,
    handleSpotSelection: onSpotSelection
  });

  useMentorMarkers({ mapRef, viewMode });

  return (
    <div className="flex-1 relative">
      <div 
        ref={containerRef} 
        className="h-full w-full"
        style={{
          background: '#f8fafc',
          zIndex: 10
        }}
      />
      <MapLoadingOverlay isLoading={isLoading} />
    </div>
  );
};

export default MapContainer;
