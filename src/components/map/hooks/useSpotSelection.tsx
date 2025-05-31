
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
    console.log('🎯 Attempting to select spot with ID:', spotId);
    console.log('🗄️ Available surfSpots:', surfSpots.length);
    console.log('🗄️ Available rawSpots:', rawSpots.length);
    
    // Try different ID matching strategies for surfSpots
    let spot = surfSpots.find(s => s.id === spotId);
    if (!spot) {
      spot = surfSpots.find(s => s.id?.toString() === spotId);
    }
    if (!spot) {
      spot = surfSpots.find(s => String(s.id) === String(spotId));
    }
    
    // Try different ID matching strategies for rawSpots
    let rawSpot = rawSpots.find(r => r.id === spotId);
    if (!rawSpot) {
      rawSpot = rawSpots.find(r => r.id?.toString() === spotId);
    }
    if (!rawSpot) {
      rawSpot = rawSpots.find(r => String(r.id) === String(spotId));
    }
    
    console.log('✅ Found spot:', spot ? spot.full_name : 'NOT FOUND');
    console.log('✅ Found rawSpot:', rawSpot ? rawSpot.name : 'NOT FOUND');
    
    // Debug: log first few spots to see their structure
    if (surfSpots.length > 0) {
      console.log('🔍 First surfSpot structure:', surfSpots[0]);
    }
    if (rawSpots.length > 0) {
      console.log('🔍 First rawSpot structure:', rawSpots[0]);
    }
    
    if (spot) {
      console.log('🎉 Setting selected spot:', spot.full_name);
      setSelectedSpot(spot);
      
      if (rawSpot) {
        console.log('🎉 Setting selected raw spot:', rawSpot.name);
        setSelectedRawSpot(rawSpot);
      } else {
        console.log('⚠️ No raw spot found, setting null');
        setSelectedRawSpot(null);
      }
    } else {
      console.warn('❌ No spot found for ID:', spotId);
      // Log available IDs for debugging
      console.log('🔍 Available spot IDs:', surfSpots.slice(0, 5).map(s => ({ id: s.id, type: typeof s.id, name: s.full_name })));
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
