
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SurfSpot } from '@/types/surfSpots';
import { MapPin, Waves, Wind, Thermometer, Clock, Camera, Star } from 'lucide-react';
import { useSurfConditions, useWeatherData } from '@/hooks/useRealTimeData';

interface SurfSpotPopupProps {
  spot: SurfSpot;
}

const SurfSpotPopup: React.FC<SurfSpotPopupProps> = ({ spot }) => {
  const { data: conditions, isLoading: conditionsLoading } = useSurfConditions(spot.id);
  const { data: weather, isLoading: weatherLoading } = useWeatherData(spot.id);

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

  const getConditionRating = () => {
    if (!conditions || !weather) return null;
    
    // Simple rating algorithm based on wave height and wind
    let rating = 3; // Start with average
    
    if (conditions.waveHeight >= 3 && conditions.waveHeight <= 8) rating += 1;
    if (conditions.windSpeed < 10) rating += 1;
    if (conditions.windSpeed > 20) rating -= 1;
    if (conditions.crowdLevel < 30) rating += 1;
    
    return Math.max(1, Math.min(5, rating));
  };

  const rating = getConditionRating();

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
          {rating && (
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
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

      {/* Live Conditions */}
      {conditions && weather && !conditionsLoading && !weatherLoading && (
        <div className="bg-gradient-to-r from-ocean/10 to-sand/20 p-3 rounded-md">
          <h4 className="font-medium text-sm mb-2 flex items-center">
            <Waves className="w-4 h-4 mr-1" />
            Live Conditions
            <span className="ml-2 text-xs text-gray-500">
              Updated {new Date(conditions.lastUpdated).toLocaleTimeString()}
            </span>
          </h4>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <Waves className="w-4 h-4 text-blue-500" />
              <div>
                <span className="text-gray-600">Waves:</span>
                <p className="font-medium">{conditions.waveHeight.toFixed(1)}ft</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-gray-500" />
              <div>
                <span className="text-gray-600">Wind:</span>
                <p className="font-medium">{conditions.windSpeed}mph {conditions.windDirection}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-red-500" />
              <div>
                <span className="text-gray-600">Water:</span>
                <p className="font-medium">{conditions.temperature}°F</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <div>
                <span className="text-gray-600">Crowd:</span>
                <p className="font-medium">{Math.round(conditions.crowdLevel)}/10</p>
              </div>
            </div>
          </div>
          
          {/* Period and sets */}
          <div className="mt-2 pt-2 border-t border-white/30">
            <div className="flex justify-between text-xs">
              <span>Period: {conditions.period}s</span>
              <span>Sets/hr: {conditions.setsPerHour}</span>
            </div>
          </div>
        </div>
      )}

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
