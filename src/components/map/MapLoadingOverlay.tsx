
import React from 'react';

interface MapLoadingOverlayProps {
  isLoading: boolean;
}

const MapLoadingOverlay: React.FC<MapLoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <div className="text-gray-600">Loading surf spots...</div>
      </div>
    </div>
  );
};

export default MapLoadingOverlay;
