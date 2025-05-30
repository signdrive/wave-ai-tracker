
import React, { useEffect } from 'react';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useMapMarkers } from '@/hooks/useMapMarkers';

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

interface DatabaseSurfSpotMapProps {
  spots: DatabaseSurfSpot[];
  isLoading: boolean;
  onSpotClick?: (spotId: string) => void;
  selectedSpotId?: string;
}

const DatabaseSurfSpotMap: React.FC<DatabaseSurfSpotMapProps> = ({ 
  spots,
  isLoading,
  onSpotClick,
  selectedSpotId
}) => {
  console.log('🗺️ DatabaseSurfSpotMap render:', {
    spotsCount: spots.length,
    isLoading,
    selectedSpotId,
    sampleSpots: spots.slice(0, 3).map(s => ({
      id: s.id,
      name: s.full_name,
      lat: s.lat,
      lon: s.lon
    }))
  });

  const { mapRef, mapInstanceRef, layerGroupRef, isMapReady } = useMapInitialization();
  
  console.log('🗺️ Map initialization state:', {
    hasMapRef: !!mapRef.current,
    hasMapInstance: !!mapInstanceRef.current,
    hasLayerGroup: !!layerGroupRef.current,
    isMapReady
  });

  // Use the simplified markers hook
  useMapMarkers({
    mapInstance: mapInstanceRef.current,
    layerGroup: layerGroupRef.current,
    spots,
    isLoading,
    onSpotClick,
    selectedSpotId,
    isMapReady
  });

  // Handle spot selection messages from popups
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'selectSpot' && onSpotClick) {
        console.log('📨 Spot selection message received:', event.data.spotId);
        onSpotClick(event.data.spotId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSpotClick]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean mx-auto mb-2"></div>
          <p className="text-gray-600">Loading surf spots...</p>
          <p className="text-sm text-gray-500 mt-1">Connecting to database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[400px]"
        style={{ minHeight: '400px', width: '100%', height: '100%' }}
      />
      
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md">
        🗄️ {spots.length} spots
      </div>

      <div className="absolute bottom-2 left-2 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white shadow-md">
        ✅ Live Data
      </div>

      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Initializing map...</p>
          </div>
        </div>
      )}

      {spots.length === 0 && !isLoading && isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center p-6">
            <p className="text-lg font-medium text-gray-700 mb-2">No surf spots found</p>
            <p className="text-sm text-gray-500">Check database connection</p>
          </div>
        </div>
      )}

      {/* Debug status */}
      <div className="absolute bottom-2 right-2 bg-blue-500/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-white shadow-md">
        Map: {isMapReady ? '✅' : '⏳'} | Data: {spots.length} | Loading: {isLoading ? '⏳' : '✅'}
      </div>
    </div>
  );
};

export default DatabaseSurfSpotMap;
