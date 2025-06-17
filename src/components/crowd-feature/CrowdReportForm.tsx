
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client'; // Use the shared Supabase client
import type { Session } from '@supabase/supabase-js';

type CrowdLevel = 'Low' | 'Medium' | 'High';

interface CrowdReportFormProps {
  spotId: string;
}

interface SubmitCrowdReportPayload {
  spot_id: string;
  reported_level: CrowdLevel;
}

const submitCrowdReport = async (payload: SubmitCrowdReportPayload): Promise<any> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    throw new Error(sessionError?.message || 'User not authenticated');
  }

  const { data, error } = await supabase.functions.invoke('submit-crowd-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify(payload), // Ensure body is stringified for functions
  });

  if (error) {
    throw new Error(error.message || 'Failed to submit crowd report');
  }
  return data;
};

const CrowdReportForm: React.FC<CrowdReportFormProps> = ({ spotId }) => {
  const queryClient = useQueryClient();
  const [currentUserSession, setCurrentUserSession] = useState<Session | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoadingSession(true);
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserSession(session);
      setIsLoadingSession(false);
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserSession(session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const mutation = useMutation({
    mutationFn: (level: CrowdLevel) => submitCrowdReport({ spot_id: spotId, reported_level: level }),
    onSuccess: () => {
      toast.success('Crowd report submitted! Thanks for contributing.');
      // Invalidate the query for this spot's crowd prediction to refetch
      queryClient.invalidateQueries({ queryKey: ['crowdPrediction', spotId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit report: ${error.message}`);
    },
  });

  const handleSubmit = (level: CrowdLevel) => {
    mutation.mutate(level);
  };

  if (isLoadingSession) {
    return <div className="text-xs text-gray-400">Loading form...</div>;
  }

  if (!currentUserSession) {
    return <div className="text-xs text-gray-500 py-2">Log in to report crowd levels.</div>;
  }

  return (
    <div className="mt-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Report current crowd level:</p>
      <div className="flex space-x-2">
        {(['Low', 'Medium', 'High'] as CrowdLevel[]).map((level) => (
          <Button
            key={level}
            variant="outline"
            size="sm"
            onClick={() => handleSubmit(level)}
            disabled={mutation.isPending}
            className="flex-1 text-xs px-2 py-1 h-auto"
          >
            {mutation.isPending && mutation.variables === level ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <Send className="h-3 w-3 mr-1" />
            )}
            {level}
          </Button>
        ))}
      </div>
      {mutation.isError && (
         <p className="text-xs text-red-500 mt-1">Error: {mutation.error?.message}</p>
      )}
    </div>
  );
};

export default CrowdReportForm;
