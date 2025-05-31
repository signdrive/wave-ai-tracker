
import React from 'react';
import { useMapInitialization } from './hooks/useMapInitialization';
import { useSurfSpotMarkers } from './hooks/useSurfSpotMarkers';
import { useMentorMarkers } from './hooks/useMentorMarkers';
import { useSpotSelection } from './hooks/useSpotSelection';
import MapLoadingOverlay from './MapLoadingOverlay';

interface MapContainerProps {
  surfSpots: any[];
  rawSpots: any[];
  isLoading: boolean;
  viewMode: 'spots' | 'mentors' | 'both';
  selectedSpot: any;
  setSelectedSpot: (spot: any) => void;
  setSelectedRawSpot: (spot: any) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  surfSpots,
  rawSpots,
  isLoading,
  viewMode,
  selectedSpot,
  setSelectedSpot,
  setSelectedRawSpot
}) => {
  const { mapRef, containerRef } = useMapInitialization();
  const { handleSpotSelection } = useSpotSelection({
    surfSpots,
    rawSpots,
    setSelectedSpot,
    setSelectedRawSpot
  });

  useSurfSpotMarkers({
    mapRef,
    surfSpots,
    isLoading,
    viewMode,
    handleSpotSelection
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
