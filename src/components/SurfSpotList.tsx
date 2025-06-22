
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SurfSpot } from '@/types/surfSpots';
import { MapPin, Waves, Star, Eye } from 'lucide-react';
import CameraStatusIndicator from './CameraStatusIndicator';
import { CameraValidationResult } from '@/utils/cameraValidation';

interface SurfSpotListProps {
  spots: SurfSpot[];
  cameraStatuses?: Record<string, CameraValidationResult>;
  onSpotSelect: (spotId: string) => void;
  selectedSpot?: string;
}

const SurfSpotList: React.FC<SurfSpotListProps> = ({
  spots,
  cameraStatuses = {},
  onSpotSelect,
  selectedSpot
}) => {
  const getDifficultyColor = (difficulty: string) => {
    if (difficulty.toLowerCase().includes('beginner')) return 'bg-green-500 text-white';
    if (difficulty.toLowerCase().includes('intermediate')) return 'bg-yellow-500 text-black';
    if (difficulty.toLowerCase().includes('advanced') || difficulty.toLowerCase().includes('expert')) return 'bg-red-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const getBreakTypeIcon = (waveType: string) => {
    if (waveType.toLowerCase().includes('reef')) return '🪨';
    if (waveType.toLowerCase().includes('point')) return '⛰️';
    if (waveType.toLowerCase().includes('beach')) return '🏖️';
    return '🌊';
  };

  return (
    <div className="space-y-3">
      {spots.map((spot) => (
        <Card 
          key={spot.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedSpot === spot.id ? 'ring-2 ring-ocean' : ''
          }`}
          onClick={() => onSpotSelect(spot.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-ocean-dark mb-1">
                  {spot.full_name}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {spot.country}{spot.state && `, ${spot.state}`}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <Badge className={getDifficultyColor(spot.difficulty)}>
                  {spot.difficulty}
                </Badge>
                {spot.live_cam && (
                  <CameraStatusIndicator 
                    status={cameraStatuses[spot.id]} 
                    className="text-xs"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-ocean/5 p-2 rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Wave Type</span>
                  <span>{getBreakTypeIcon(spot.wave_type)}</span>
                </div>
                <p className="text-sm font-medium">{spot.wave_type}</p>
              </div>
              
              <div className="bg-sand/50 p-2 rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Best Swell</span>
                  <Waves className="w-3 h-3 text-ocean" />
                </div>
                <p className="text-sm font-medium">{spot.best_swell_direction}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Best: {spot.best_wind} • {spot.best_tide}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSpotSelect(spot.id);
                }}
                className="text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {spots.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Waves className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No surf spots found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default SurfSpotList;
