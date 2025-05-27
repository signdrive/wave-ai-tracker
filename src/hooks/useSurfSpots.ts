
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SurfSpot, SurfSpotsData } from '@/types/surfSpots';
import { CameraValidator, CameraValidationResult } from '@/utils/cameraValidation';
import surfSpotsData from '@/data/surfSpots.json';

export const useSurfSpots = () => {
  const [cameraStatuses, setCameraStatuses] = useState<Record<string, CameraValidationResult>>({});
  const [isValidating, setIsValidating] = useState(false);

  // Load surf spots data
  const { data: surfSpots = [], isLoading } = useQuery({
    queryKey: ['surf-spots'],
    queryFn: (): SurfSpot[] => {
      const data = surfSpotsData as SurfSpotsData;
      return data.surf_spots;
    },
    staleTime: Infinity, // Data doesn't change often
  });

  // Convert to the format expected by existing components
  const surfLocations = surfSpots.reduce((acc, spot) => {
    acc[spot.id] = {
      name: spot.full_name,
      imageSrc: spot.imageSrc,
      // Add additional metadata
      metadata: {
        lat: spot.lat,
        lon: spot.lon,
        country: spot.country,
        state: spot.state,
        waveType: spot.wave_type,
        difficulty: spot.difficulty,
        bestSwellDirection: spot.best_swell_direction,
        bestWind: spot.best_wind,
        bestTide: spot.best_tide,
        crowdFactor: spot.crowd_factor,
        liveCam: spot.live_cam,
        backupCam: spot.backup_cam,
        cameraStatus: cameraStatuses[spot.id]?.status || 'PLACEHOLDER'
      }
    };
    return acc;
  }, {} as Record<string, any>);

  // Validate all cameras
  const validateAllCameras = async () => {
    if (surfSpots.length === 0) return;
    
    setIsValidating(true);
    console.log('Starting camera validation for', surfSpots.length, 'surf spots...');
    
    try {
      const results = await CameraValidator.validateCameraBatch(surfSpots, 3);
      const statusMap = results.reduce((acc, result) => {
        acc[result.spotId] = result;
        return acc;
      }, {} as Record<string, CameraValidationResult>);
      
      setCameraStatuses(statusMap);
      console.log('Camera validation completed:', statusMap);
    } catch (error) {
      console.error('Camera validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  // Validate a single camera
  const validateCamera = async (spotId: string) => {
    const spot = surfSpots.find(s => s.id === spotId);
    if (!spot) return;

    console.log('Validating camera for', spot.name);
    const result = await CameraValidator.validateCamera(spot);
    setCameraStatuses(prev => ({ ...prev, [spotId]: result }));
    return result;
  };

  return {
    surfSpots,
    surfLocations,
    cameraStatuses,
    isLoading,
    isValidating,
    validateAllCameras,
    validateCamera,
    getSurfSpotById: (id: string) => surfSpots.find(spot => spot.id === id),
    getSurfSpotsByCountry: (country: string) => surfSpots.filter(spot => spot.country === country),
    getSurfSpotsByDifficulty: (difficulty: string) => surfSpots.filter(spot => spot.difficulty.includes(difficulty))
  };
};
