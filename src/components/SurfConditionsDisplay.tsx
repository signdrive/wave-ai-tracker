
import React from 'react';
import { Waves, Wind, Thermometer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { errorHandlingService } from '@/services/errorHandlingService';

interface SurfConditions {
  waveHeight: number;
  period: number;
  windSpeed: number;
  windDirection: string;
  temperature: number;
  crowdLevel: number;
  setsPerHour: number;
  lastUpdated: string;
}

interface SurfConditionsDisplayProps {
  conditions?: SurfConditions;
  isLoading: boolean;
}

const SurfConditionsDisplay: React.FC<SurfConditionsDisplayProps> = ({ 
  conditions, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (!conditions) return null;

  // Safe number formatting with error protection
  const safeWaveHeight = errorHandlingService.safeToFixed(conditions.waveHeight, 1);
  const safePeriod = errorHandlingService.safeToFixed(conditions.period, 0);
  const safeWindSpeed = errorHandlingService.safeToFixed(conditions.windSpeed, 0);
  const safeTemperature = errorHandlingService.safeToFixed(conditions.temperature, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex items-center">
        <Waves className="w-4 h-4 mr-2 text-ocean" />
        <div>
          <p className="text-xs text-gray-500">Wave Height</p>
          <p className="font-semibold text-lg">{safeWaveHeight}ft</p>
        </div>
      </div>
      <div className="flex items-center">
        <div>
          <p className="text-xs text-gray-500">Period</p>
          <p className="font-semibold text-lg">{safePeriod}s</p>
        </div>
      </div>
      <div className="flex items-center">
        <Wind className="w-4 h-4 mr-2 text-ocean" />
        <div>
          <p className="text-xs text-gray-500">Wind</p>
          <p className="font-semibold text-lg">{safeWindSpeed}mph {conditions.windDirection || 'N/A'}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Thermometer className="w-4 h-4 mr-2 text-ocean" />
        <div>
          <p className="text-xs text-gray-500">Water Temp</p>
          <p className="font-semibold text-lg">{safeTemperature}°F</p>
        </div>
      </div>
    </div>
  );
};

export default SurfConditionsDisplay;
