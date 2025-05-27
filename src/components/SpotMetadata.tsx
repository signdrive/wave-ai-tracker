
import React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CameraValidationResult, getCameraStatusIcon, getCameraStatusText } from '@/utils/cameraValidation';

interface SpotMetadataProps {
  metadata?: {
    lat?: number;
    lon?: number;
    country?: string;
    state?: string;
    waveType?: string;
    difficulty?: string;
    bestSwellDirection?: string;
    bestWind?: string;
    bestTide?: string;
    crowdFactor?: string;
    [key: string]: any;
  };
  cameraStatus?: CameraValidationResult;
}

const SpotMetadata: React.FC<SpotMetadataProps> = ({ metadata, cameraStatus }) => {
  if (!metadata) return null;

  return (
    <div className="mb-4 p-3 bg-sand/30 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        {metadata.waveType && (
          <div>
            <span className="font-medium text-ocean-dark">Wave Type:</span>
            <span className="ml-2">{metadata.waveType}</span>
          </div>
        )}
        {metadata.difficulty && (
          <div>
            <span className="font-medium text-ocean-dark">Difficulty:</span>
            <Badge variant="outline" className="ml-2 text-xs">
              {metadata.difficulty}
            </Badge>
          </div>
        )}
        {metadata.bestSwellDirection && (
          <div>
            <span className="font-medium text-ocean-dark">Best Swell:</span>
            <span className="ml-2">{metadata.bestSwellDirection}</span>
          </div>
        )}
        {metadata.bestWind && (
          <div>
            <span className="font-medium text-ocean-dark">Best Wind:</span>
            <span className="ml-2">{metadata.bestWind}</span>
          </div>
        )}
        {metadata.bestTide && (
          <div>
            <span className="font-medium text-ocean-dark">Best Tide:</span>
            <span className="ml-2">{metadata.bestTide}</span>
          </div>
        )}
        {metadata.crowdFactor && (
          <div>
            <span className="font-medium text-ocean-dark">Crowd Level:</span>
            <span className="ml-2">{metadata.crowdFactor}</span>
          </div>
        )}
      </div>
      
      {/* Camera Status Info */}
      {cameraStatus && (
        <div className="mt-3 pt-3 border-t border-sand/50">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Camera Status: {getCameraStatusIcon(cameraStatus.status)} {getCameraStatusText(cameraStatus.status)}</span>
            {cameraStatus.lastChecked && (
              <span>Last checked: {new Date(cameraStatus.lastChecked).toLocaleTimeString()}</span>
            )}
          </div>
          {cameraStatus.responseTime && (
            <div className="text-xs text-gray-500 mt-1">
              Response time: {cameraStatus.responseTime}ms
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpotMetadata;
