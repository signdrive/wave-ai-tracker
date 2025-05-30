
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
  const { mapRef, mapInstanceRef } = useMapInitialization();
  
  useMapMarkers({
    mapInstance: mapInstanceRef.current,
    spots,
    isLoading,
    onSpotClick,
    selectedSpotId
  });

  // Handle spot selection from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'selectSpot' && onSpotClick) {
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
          <p className="text-gray-600">Loading surf spots from database...</p>
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
        🗄️ {spots.length} database spots
      </div>

      <div className="absolute bottom-2 left-2 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white shadow-md">
        ✅ Live Supabase Data
      </div>
    </div>
  );
};

export default DatabaseSurfSpotMap;
