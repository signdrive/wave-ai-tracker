
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SurfSpot } from '@/types/surfSpots';
import { MapPin, Waves, Wind, Thermometer, Clock, Camera, Star } from 'lucide-react';

interface SurfSpotPopupProps {
  spot: SurfSpot;
}

const SurfSpotPopup: React.FC<SurfSpotPopupProps> = ({ spot }) => {
  const getDifficultyColor = (difficulty: string) => {
    if (difficulty.toLowerCase().includes('beginner')) return 'bg-green-500';
    if (difficulty.toLowerCase().includes('intermediate')) return 'bg-yellow-500';
    if (difficulty.toLowerCase().includes('advanced') || difficulty.toLowerCase().includes('expert')) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const getBreakTypeIcon = (waveType: string) => {
    if (waveType.toLowerCase().includes('reef')) return '🪨';
    if (waveType.toLowerCase().includes('point')) return '⛰️';
    if (waveType.toLowerCase().includes('beach')) return '🏖️';
    return '🌊';
  };

  return (
    <div className="w-full max-w-sm space-y-3">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg text-ocean-dark">{spot.full_name}</h3>
          <div className="flex items-center space-x-1">
            <Badge variant="outline" className="text-xs">
              {spot.country}
            </Badge>
            {spot.live_cam && (
              <Badge className="bg-green-500 text-xs">
                <Camera className="w-3 h-3 mr-1" />
                Live
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {spot.lat.toFixed(4)}, {spot.lon.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Wave Type & Difficulty */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-ocean/5 p-2 rounded-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Wave Type</span>
            <span className="text-lg">{getBreakTypeIcon(spot.wave_type)}</span>
          </div>
          <p className="text-sm font-medium">{spot.wave_type}</p>
        </div>
        
        <div className="bg-sand/50 p-2 rounded-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Difficulty</span>
            <div className={`w-3 h-3 rounded-full ${getDifficultyColor(spot.difficulty)}`}></div>
          </div>
          <p className="text-sm font-medium">{spot.difficulty}</p>
        </div>
      </div>

      {/* Best Conditions */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Optimal Conditions</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-600">Swell:</span>
            <p className="font-medium">{spot.best_swell_direction}</p>
          </div>
          <div>
            <span className="text-gray-600">Wind:</span>
            <p className="font-medium">{spot.best_wind}</p>
          </div>
          <div>
            <span className="text-gray-600">Tide:</span>
            <p className="font-medium">{spot.best_tide}</p>
          </div>
          <div>
            <span className="text-gray-600">Crowd:</span>
            <p className="font-medium">{spot.crowd_factor}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-2">
        <Button size="sm" className="flex-1" variant="outline">
          View Details
        </Button>
        {spot.live_cam && (
          <Button size="sm" className="flex-1">
            <Camera className="w-3 h-3 mr-1" />
            Live Cam
          </Button>
        )}
      </div>
    </div>
  );
};

export default SurfSpotPopup;
