
import React from 'react';
import { RefreshCw, MapPin } from 'lucide-react';
import CameraStatusIndicator from './CameraStatusIndicator';
import { CameraValidationResult } from '@/utils/cameraValidation';

interface SurfCamVideoProps {
  spotName: string;
  imageSrc: string;
  cameraStatus?: CameraValidationResult;
  isRefetching: boolean;
  metadata?: {
    country?: string;
    state?: string;
    [key: string]: any;
  };
}

const SurfCamVideo: React.FC<SurfCamVideoProps> = ({
  spotName,
  imageSrc,
  cameraStatus,
  isRefetching,
  metadata
}) => {
  return (
    <div className="relative aspect-video overflow-hidden rounded-t-lg">
      <img 
        src={imageSrc} 
        alt={spotName} 
        className="w-full h-full object-cover"
      />
      
      {/* Camera Status Indicator */}
      <div className="absolute top-4 left-4 flex gap-2">
        <CameraStatusIndicator status={cameraStatus} />
      </div>
      
      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
        {isRefetching && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
        {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} Local
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
        <h3 className="font-bold text-lg">{spotName}</h3>
        <div className="flex items-center gap-2 text-sm opacity-90">
          {metadata?.country && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {metadata.country}{metadata.state && `, ${metadata.state}`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurfCamVideo;
