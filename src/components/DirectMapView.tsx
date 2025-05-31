
import { useState } from 'react';
import { useSupabaseSurfSpots } from '@/hooks/useSupabaseSurfSpots';
import SurfSpotInfoPanel from './SurfSpotInfoPanel';
import MapTabsHeader from './map/MapTabsHeader';
import MapContainer from './map/MapContainer';

const testMentors = [
  {
    id: '1',
    name: 'Pipeline Pro',
    lat: 21.6633,
    lng: -158.0667,
    bio: 'Expert at Pipeline, 20+ years experience',
    hourly_rate: 150,
    is_available: true
  },
  {
    id: '2',
    name: 'Malibu Mike',
    lat: 34.0522,
    lng: -118.2437,
    bio: 'Perfect waves instructor in Malibu',
    hourly_rate: 120,
    is_available: false
  },
  {
    id: '3',
    name: 'Santa Cruz Sam',
    lat: 36.9741,
    lng: -122.0308,
    bio: 'Cold water surfing specialist',
    hourly_rate: 100,
    is_available: true
  }
];

export default function DirectMapView() {
  const [viewMode, setViewMode] = useState<'spots' | 'mentors' | 'both'>('spots');
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [selectedRawSpot, setSelectedRawSpot] = useState<any>(null);
  
  const { surfSpots, rawSpots, isLoading, error } = useSupabaseSurfSpots();

  // Create a safer spot selection handler
  const handleSpotSelection = (spotId: string) => {
    console.log('🎯 DirectMapView handleSpotSelection called with:', spotId);
    
    // Find both the database spot and raw spot
    const dbSpot = surfSpots.find(s => String(s.id) === String(spotId));
    const rawSpot = rawSpots.find(r => String(r.id) === String(spotId));
    
    console.log('🔍 Found database spot:', dbSpot ? `${dbSpot.full_name}` : 'NOT FOUND');
    console.log('🔍 Found raw spot:', rawSpot ? `${rawSpot.name}` : 'NOT FOUND');
    
    if (dbSpot) {
      console.log('✅ Setting selected spots...');
      setSelectedSpot(dbSpot);
      setSelectedRawSpot(rawSpot || null);
      console.log('✅ State updated successfully');
    } else {
      console.warn('❌ No spot found for ID:', spotId);
      console.log('Available spot IDs:', surfSpots.map(s => ({ id: s.id, name: s.full_name })));
    }
  };

  console.log('🗺️ DirectMapView render state:', {
    viewMode,
    selectedSpot: selectedSpot ? `${selectedSpot.full_name} (${selectedSpot.id})` : 'none',
    selectedRawSpot: selectedRawSpot ? `${selectedRawSpot.name} (${selectedRawSpot.id})` : 'none',
    surfSpotsCount: surfSpots.length,
    rawSpotsCount: rawSpots.length,
    isLoading,
    handleSpotSelectionType: typeof handleSpotSelection
  });

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-600">Error loading surf spots: {error.message}</div>
      </div>
    );
  }

  const availableMentors = testMentors.filter(mentor => mentor.is_available).length;

  return (
    <div className="h-full w-full flex flex-col">
      <MapTabsHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        surfSpotsCount={surfSpots.length}
        availableMentorsCount={availableMentors}
      />

      <MapContainer
        surfSpots={surfSpots}
        rawSpots={rawSpots}
        isLoading={isLoading}
        viewMode={viewMode}
        selectedSpot={selectedSpot}
        onSpotSelection={handleSpotSelection}
      />

      {/* Information Panel - Simplified */}
      {selectedSpot ? (
        <div className="bg-white border-t max-h-96 overflow-y-auto">
          <div className="p-2 bg-blue-100 text-sm font-medium">
            📍 SELECTED: {selectedSpot.full_name} (ID: {selectedSpot.id})
          </div>
          <SurfSpotInfoPanel 
            selectedSpot={selectedSpot}
            rawSpotData={selectedRawSpot}
          />
        </div>
      ) : (
        <div className="bg-gray-50 border-t p-4 text-center text-gray-500">
          <div>Click on a surf spot marker to view details</div>
          <div className="text-xs mt-2 text-gray-400">
            Debug: {surfSpots.length} spots loaded | Selected: {selectedSpot ? 'YES' : 'NO'}
          </div>
        </div>
      )}
    </div>
  );
}
