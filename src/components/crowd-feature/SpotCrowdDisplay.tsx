
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

const fetchCrowdPrediction = async (spotId: string): Promise<CrowdPrediction> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    throw new Error(sessionError?.message || 'User not authenticated');
  }

  // Use query parameters instead of body for GET request
  const { data, error } = await supabase.functions.invoke('get-crowd-prediction', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${session.access_token}`,
    },
    // Add spot_id as query parameter in the URL
    body: undefined,
  });

  // Manually construct URL with query parameter since Supabase client doesn't support query params directly
  const baseUrl = `${supabase.supabaseUrl}/functions/v1/get-crowd-prediction?spot_id=${encodeURIComponent(spotId)}`;
  
  const response = await fetch(baseUrl, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return result as CrowdPrediction;
};

const SpotCrowdDisplay: React.FC<SpotCrowdDisplayProps> = ({ spotId }) => {
  const { data: prediction, isLoading, isError, error } = useQuery({
    queryKey: ['crowdPrediction', spotId],
    queryFn: () => fetchCrowdPrediction(spotId),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1, // Retry once on failure
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

  if (isError) {
    return (
      <div className="flex items-center space-x-2 text-sm text-red-500">
        <AlertTriangle className="h-4 w-4" />
        <span>Error: {(error as Error)?.message || 'Could not load crowd info'}</span>
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
      <span className="text-xs text-gray-500 ml-1">({prediction.source.replace(/_/g, ' ')})</span>
    </div>
  );
};

export default SpotCrowdDisplay;
