
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle } from 'lucide-react';

interface CrowdPrediction {
  spot_id: string;
  predicted_level: 'Low' | 'Medium' | 'High';
  source: string;
}

interface SpotCrowdDisplayProps {
  spotId: string;
}

// Fallback function for mock crowd data
const getMockCrowdPrediction = (spotId: string): CrowdPrediction => {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();
  
  let level: 'Low' | 'Medium' | 'High' = 'Medium';
  
  // Simple heuristic: weekends = higher crowd, weekdays during work hours = lower
  if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
    level = hour >= 10 && hour <= 16 ? 'High' : 'Medium';
  } else { // Weekday
    level = hour >= 9 && hour <= 17 ? 'Low' : 'Medium';
  }
  
  return {
    spot_id: spotId,
    predicted_level: level,
    source: 'mock_heuristic'
  };
};

const SpotCrowdDisplay: React.FC<SpotCrowdDisplayProps> = ({ spotId }) => {
  const { data: prediction, isLoading } = useQuery({
    queryKey: ['crowdPrediction', spotId],
    queryFn: () => {
      // Always return mock data to prevent API calls
      console.log('Using mock crowd prediction data for spot:', spotId);
      return Promise.resolve(getMockCrowdPrediction(spotId));
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false, // Don't retry to prevent repeated errors
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
  });

  const getBadgeVariant = (level?: 'Low' | 'Medium' | 'High'): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (!level) return 'outline';
    switch (level) {
      case 'Low':
        return 'default';
      case 'Medium':
        return 'secondary';
      case 'High':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const levelColorClasses = {
    Low: 'bg-green-100 text-green-800 border-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    High: 'bg-red-100 text-red-800 border-red-300',
    default: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const getCurrentLevelColor = (level?: 'Low' | 'Medium' | 'High') => {
    return level ? levelColorClasses[level] : levelColorClasses.default;
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading crowd info...</span>
      </div>
    );
  }

  if (!prediction) {
    return <div className="text-sm text-gray-400">No crowd data available.</div>;
  }

  return (
    <div className="text-sm">
      Crowd Level: {' '}
      <Badge
        className={`px-2 py-0.5 text-xs font-medium rounded-md ${getCurrentLevelColor(prediction.predicted_level)}`}
      >
        {prediction.predicted_level}
      </Badge>
      <span className="text-xs text-gray-500 ml-1">
        (estimated)
      </span>
    </div>
  );
};

export default SpotCrowdDisplay;
