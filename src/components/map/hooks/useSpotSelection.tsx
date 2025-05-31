
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
    console.log('Attempting to select spot with ID:', spotId);
    console.log('Available surfSpots:', surfSpots.length);
    console.log('Available rawSpots:', rawSpots.length);
    
    const spot = surfSpots.find(s => s.id === spotId);
    const rawSpot = rawSpots.find(r => r.id.toString() === spotId);
    
    console.log('Found spot:', spot);
    console.log('Found rawSpot:', rawSpot);
    
    if (spot) {
      setSelectedSpot(spot);
      setSelectedRawSpot(rawSpot);
      console.log('Spot selected successfully:', spot.full_name);
    } else {
      console.warn('No spot found for ID:', spotId);
    }
  };

  // Global function to handle surf spot selection (for popup button)
  useEffect(() => {
    (window as any).selectSurfSpot = (spotId: string) => {
      console.log('selectSurfSpot called with ID:', spotId);
      handleSpotSelection(spotId);
    };

    return () => {
      delete (window as any).selectSurfSpot;
    };
  }, [surfSpots, rawSpots]);

  return { handleSpotSelection };
};
