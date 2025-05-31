
import { useEffect } from 'react';

interface UseSpotSelectionProps {
  surfSpots: any[];
  rawSpots: any[];
  setSelectedSpot: (spot: any) => void;
  setSelectedRawSpot: (spot: any) => void;
}

export const useSpotSelection = ({ 
  surfSpots, 
  rawSpots, 
  setSelectedSpot, 
  setSelectedRawSpot 
}: UseSpotSelectionProps) => {
  const handleSpotSelection = (spotId: string) => {
    console.log('');
    console.log('🎯 === SPOT SELECTION HANDLER CALLED ===');
    console.log('🎯 Input spotId:', spotId, 'Type:', typeof spotId);
    console.log('🎯 Available surfSpots:', surfSpots.length);
    console.log('🎯 Available rawSpots:', rawSpots.length);
    console.log('🎯 setSelectedSpot function:', typeof setSelectedSpot);
    console.log('🎯 setSelectedRawSpot function:', typeof setSelectedRawSpot);
    
    if (!spotId) {
      console.warn('❌ No spotId provided');
      return;
    }

    // Convert spotId to string for consistent comparison
    const spotIdStr = String(spotId);
    console.log('🔍 Searching for spotId:', spotIdStr);
    
    // Find the spot in surfSpots (database spots)
    let spot = surfSpots.find(s => String(s.id) === spotIdStr);
    
    // Find the corresponding raw spot data
    let rawSpot = rawSpots.find(r => String(r.id) === spotIdStr);
    
    console.log('✅ Found spot:', spot ? `${spot.full_name} (${spot.id})` : 'NOT FOUND');
    console.log('✅ Found rawSpot:', rawSpot ? `${rawSpot.name} (${rawSpot.id})` : 'NOT FOUND');
    
    // Debug: log first few spots to see their structure
    if (surfSpots.length > 0 && !spot) {
      console.log('🔍 First surfSpot structure:', surfSpots[0]);
      console.log('🔍 Available spot IDs:', surfSpots.slice(0, 5).map(s => ({ 
        id: s.id, 
        type: typeof s.id, 
        name: s.full_name,
        stringId: String(s.id)
      })));
      console.log('🔍 Looking for ID that matches:', spotIdStr);
    }
    
    if (spot) {
      console.log('🎉 SPOT FOUND! Setting selected spot:', spot.full_name);
      console.log('🎉 Spot data being set:', spot);
      
      try {
        // Set the selected spot
        console.log('📝 Calling setSelectedSpot...');
        setSelectedSpot(spot);
        console.log('✅ setSelectedSpot called successfully');
        
        // Set the raw spot data if found
        if (rawSpot) {
          console.log('📝 Calling setSelectedRawSpot with rawSpot...');
          setSelectedRawSpot(rawSpot);
          console.log('✅ setSelectedRawSpot called successfully');
        } else {
          console.log('📝 Calling setSelectedRawSpot with null...');
          setSelectedRawSpot(null);
          console.log('✅ setSelectedRawSpot(null) called successfully');
        }
        
        console.log('🎉 SELECTION COMPLETE!');
        
      } catch (error) {
        console.error('❌ Error setting selected spot:', error);
      }
    } else {
      console.warn('❌ No spot found for ID:', spotIdStr);
      console.log('🔍 All available spot IDs:', surfSpots.map(s => String(s.id)));
    }
    
    console.log('🎯 === SPOT SELECTION HANDLER COMPLETE ===');
    console.log('');
  };

  // Global function to handle surf spot selection (for popup button)
  useEffect(() => {
    console.log('🌐 Setting up global selectSurfSpot function');
    (window as any).selectSurfSpot = (spotId: string) => {
      console.log('🌐 Global selectSurfSpot called with ID:', spotId);
      handleSpotSelection(spotId);
    };

    return () => {
      console.log('🧹 Cleaning up global selectSurfSpot function');
      delete (window as any).selectSurfSpot;
    };
  }, [surfSpots, rawSpots, setSelectedSpot, setSelectedRawSpot]);

  return { handleSpotSelection };
};
