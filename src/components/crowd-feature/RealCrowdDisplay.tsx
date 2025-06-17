
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { realDataService } from '@/services/realDataService';

interface RealCrowdDisplayProps {
  spotId: string;
}

const RealCrowdDisplay: React.FC<RealCrowdDisplayProps> = ({ spotId }) => {
  const { data: crowdData, isLoading, error, refetch } = useQuery({
    queryKey: ['realCrowdData', spotId],
    queryFn: () => realDataService.getRealCrowdData(spotId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false, // No retries - fail fast and show real error
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'High': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading real crowd data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 space-y-2">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Real data unavailable</span>
        </div>
        <div className="text-xs text-gray-600">{error.message}</div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </div>
    );
  }

  if (!crowdData) {
    return <div className="text-sm text-gray-400">No real crowd data available</div>;
  }

  return (
    <div className="text-sm">
      <div className="flex items-center space-x-2">
        <span>Crowd Level:</span>
        <Badge className={`px-2 py-0.5 text-xs font-medium rounded-md ${getLevelColor(crowdData.predictedLevel)}`}>
          {crowdData.predictedLevel}
        </Badge>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        <div>Source: {crowdData.source}</div>
        <div>Confidence: {Math.round(crowdData.confidence * 100)}%</div>
        <div>Updated: {new Date(crowdData.timestamp).toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

export default RealCrowdDisplay;
