
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { CameraValidationResult } from '@/utils/cameraValidation';

interface CameraValidationDashboardProps {
  cameraStatuses: Record<string, CameraValidationResult>;
  totalCameras: number;
  isValidating: boolean;
  onValidateAll: () => void;
}

const CameraValidationDashboard: React.FC<CameraValidationDashboardProps> = ({
  cameraStatuses,
  totalCameras,
  isValidating,
  onValidateAll
}) => {
  const validatedCameras = Object.keys(cameraStatuses).length;
  const liveCameras = Object.values(cameraStatuses).filter(status => status.status === 'LIVE').length;
  const placeholderCameras = Object.values(cameraStatuses).filter(s => s.status === 'PLACEHOLDER').length;
  const offlineCameras = Object.values(cameraStatuses).filter(s => s.status === 'OFFLINE').length;

  return (
    <div className="mb-6 p-4 bg-sand/30 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Live: {liveCameras}
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            Placeholder: {placeholderCameras}
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            Offline: {offlineCameras}
          </span>
          <span className="text-gray-600">
            Total: {totalCameras} spots
          </span>
        </div>
        
        <Button
          onClick={onValidateAll}
          disabled={isValidating}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {isValidating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          {isValidating ? 'Validating...' : 'Validate All Cameras'}
        </Button>
      </div>
      
      {validatedCameras > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          Last validation: {validatedCameras}/{totalCameras} cameras checked
        </div>
      )}
    </div>
  );
};

export default CameraValidationDashboard;
