
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
    console.log('🎯 handleSpotSelection called with ID:', spotId, 'Type:', typeof spotId);
    console.log('🗄️ Available surfSpots:', surfSpots.length);
    console.log('🗄️ Available rawSpots:', rawSpots.length);
    
    if (!spotId) {
      console.warn('❌ No spotId provided');
      return;
    }

    // Convert spotId to string for consistent comparison
    const spotIdStr = String(spotId);
    
    // Find the spot in surfSpots (database spots)
    let spot = surfSpots.find(s => String(s.id) === spotIdStr);
    
    // Find the corresponding raw spot data
    let rawSpot = rawSpots.find(r => String(r.id) === spotIdStr);
    
    console.log('✅ Found spot:', spot ? spot.full_name : 'NOT FOUND');
    console.log('✅ Found rawSpot:', rawSpot ? rawSpot.name : 'NOT FOUND');
    
    // Debug: log first few spots to see their structure
    if (surfSpots.length > 0 && !spot) {
      console.log('🔍 First surfSpot structure:', surfSpots[0]);
      console.log('🔍 Available spot IDs:', surfSpots.slice(0, 5).map(s => ({ 
        id: s.id, 
        type: typeof s.id, 
        name: s.full_name,
        stringId: String(s.id)
      })));
    }
    
    if (spot) {
      console.log('🎉 Setting selected spot:', spot.full_name);
      console.log('🎉 Spot data:', spot);
      
      // Set the selected spot
      setSelectedSpot(spot);
      
      // Set the raw spot data if found
      if (rawSpot) {
        console.log('🎉 Setting selected raw spot:', rawSpot.name);
        setSelectedRawSpot(rawSpot);
      } else {
        console.log('⚠️ No raw spot found, setting null');
        setSelectedRawSpot(null);
      }
    } else {
      console.warn('❌ No spot found for ID:', spotIdStr);
      console.log('🔍 Searching spotId:', spotIdStr, 'in available IDs:', surfSpots.map(s => String(s.id)));
    }
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
