
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge'; // Assuming Shadcn UI Badge is available
import { Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client'; // Use the shared Supabase client

interface CrowdPrediction {
  spot_id: string;
  predicted_level: 'Low' | 'Medium' | 'High';
  source: string;
}

interface SpotCrowdDisplayProps {
  spotId: string;
}

const fetchCrowdPrediction = async (spotId: string): Promise<CrowdPrediction> => {
  // Ensure user is authenticated to get the token
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    throw new Error(sessionError?.message || 'User not authenticated');
  }

  const { data, error } = await supabase.functions.invoke('get-crowd-prediction', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ spot_id: spotId }),
  });

  if (error) {
    console.error('Error invoking get-crowd-prediction:', error);
    throw new Error(error.message || 'Failed to fetch crowd prediction');
  }
  // The 'data' from invoke might be the function's response body directly
  // or nested under another data property depending on Supabase client version / function setup.
  // Assuming 'data' is the expected CrowdPrediction object.
  return data as CrowdPrediction;
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
        return 'default'; // Greenish in default themes often
      case 'Medium':
        return 'secondary'; // Yellowish/Orangish
      case 'High':
        return 'destructive'; // Reddish
      default:
        return 'outline';
    }
  };

  // Tailwind classes for colors (approximate, depends on actual theme config)
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
        // variant={getBadgeVariant(prediction.predicted_level)} // Using custom colors via className
      >
        {prediction.predicted_level}
      </Badge>
      <span className="text-xs text-gray-500 ml-1">({prediction.source.replace(/_/g, ' ')})</span>
    </div>
  );
};

export default SpotCrowdDisplay;
