
import React from 'react';
import { CameraValidationResult, getCameraStatusIcon, getCameraStatusText } from '@/utils/cameraValidation';

interface CameraStatusIndicatorProps {
  status?: CameraValidationResult;
  showDetails?: boolean;
  className?: string;
}

const CameraStatusIndicator: React.FC<CameraStatusIndicatorProps> = ({ 
  status, 
  showDetails = false,
  className = ""
}) => {
  if (!status) {
    return (
      <div className={`bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center ${className}`}>
        <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
        Live
      </div>
    );
  }

  return (
    <div className={`bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center ${className}`}>
      <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
        status.status === 'LIVE' ? 'bg-green-500' : 
        status.status === 'PLACEHOLDER' ? 'bg-yellow-500' : 'bg-red-500'
      }`}></div>
      {getCameraStatusText(status.status)}
      {showDetails && status.lastChecked && (
        <span className="ml-2 text-xs opacity-75">
          ({new Date(status.lastChecked).toLocaleTimeString()})
        </span>
      )}
    </div>
  );
};

export default CameraStatusIndicator;
