
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

const fetchCrowdPrediction = async (spotId: string): Promise<CrowdPrediction> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.warn('No session available, using mock data');
      return getMockCrowdPrediction(spotId);
    }

    // Try the edge function with proper error handling
    const baseUrl = `https://psvnvptqcbeyayridgqx.supabase.co/functions/v1/get-crowd-prediction?spot_id=${encodeURIComponent(spotId)}`;
    
    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      console.warn(`Crowd prediction API failed (${response.status}), using mock data`);
      return getMockCrowdPrediction(spotId);
    }

    const result = await response.json();
    return result as CrowdPrediction;
  } catch (error) {
    console.warn('Error fetching crowd prediction, using mock data:', error);
    return getMockCrowdPrediction(spotId);
  }
};

const SpotCrowdDisplay: React.FC<SpotCrowdDisplayProps> = ({ spotId }) => {
  const { data: prediction, isLoading, isError, error } = useQuery({
    queryKey: ['crowdPrediction', spotId],
    queryFn: () => fetchCrowdPrediction(spotId),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1, // Only retry once to avoid spam
    retryDelay: 2000, // Wait 2 seconds before retry
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

  if (isError && !prediction) {
    return (
      <div className="flex items-center space-x-2 text-sm text-orange-500">
        <AlertTriangle className="h-4 w-4" />
        <span>Using estimated crowd data</span>
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
        ({prediction.source === 'mock_heuristic' ? 'estimated' : prediction.source.replace(/_/g, ' ')})
      </span>
    </div>
  );
};

export default SpotCrowdDisplay;
