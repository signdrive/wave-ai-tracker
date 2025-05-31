
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
    
    // Find the spot in both arrays
    const spot = surfSpots.find(s => s.id === spotId);
    const rawSpot = rawSpots.find(r => r.id.toString() === spotId);
    
    console.log('✅ Found spot:', spot ? spot.full_name : 'NOT FOUND');
    console.log('✅ Found rawSpot:', rawSpot ? rawSpot.name : 'NOT FOUND');
    
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
      console.log('🔍 Available spot IDs:', surfSpots.slice(0, 5).map(s => s.id));
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
