
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, Clock, MapPin, Star, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define a list of known surf spots for the dropdown
const surfSpotsList = [
  { id: 'spot-pipeline', name: 'Pipeline, Hawaii' },
  { id: 'spot-mavericks', name: 'Mavericks, CA' },
  { id: 'spot-bondi', name: 'Bondi Beach, AU' },
  { id: 'spot-jeffreys', name: 'Jeffreys Bay, SA' },
  { id: 'spot-nazare', name: 'Nazaré, Portugal' },
  { id: 'spot-malibu', name: 'Malibu, CA' },
  { id: 'spot-lower-trestles', name: 'Lower Trestles, CA' },
  { id: 'spot-ulwatu', name: 'Uluwatu, Bali' },
];

interface SessionData {
  session_date: string; // ISO YYYY-MM-DD
  spot_id: string;
  spot_name?: string;
  rating?: number; // 1-5
  duration_minutes?: number;
  wave_count?: number;
  notes?: string;
}

// Props for SessionLogger - onSessionSaved might be used to trigger UI updates on the parent page
interface SessionLoggerProps {
  onSessionSaved?: () => void; // Callback after successful save
}

const SessionLogger: React.FC<SessionLoggerProps> = ({ onSessionSaved }) => {
  const queryClient = useQueryClient();
  const [sessionFormData, setSessionFormData] = useState<Partial<SessionData>>({
    session_date: new Date().toISOString().split('T')[0],
    spot_id: surfSpotsList[0]?.id || '', // Default to first spot or empty
    rating: 5,
    duration_minutes: 90, // Default duration
  });

  const logSessionMutation = useMutation({
    mutationFn: async (newSession: SessionData) => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) throw new Error("User not authenticated.");

      const payload = { ...newSession };
      // Ensure spot_name is set if spot_id is present
      if (payload.spot_id && !payload.spot_name) {
        payload.spot_name = surfSpotsList.find(s => s.id === payload.spot_id)?.name;
      }

      const { data, error } = await supabase.functions.invoke('log-surf-session', {
        body: JSON.stringify(payload),
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Session logged successfully!");
      queryClient.invalidateQueries({ queryKey: ['surf-log-insights'] });
      if (onSessionSaved) onSessionSaved();
    },
    onError: (error: Error) => {
      toast.error(`Failed to log session: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SessionLogger: Form submission values:', sessionFormData); // LOG ADDED
    if (!sessionFormData.spot_id || !sessionFormData.session_date) {
      toast.error("Please select a spot and date.");
      return;
    }
    logSessionMutation.mutate(sessionFormData as SessionData);
  };

  const handleInputChange = (field: keyof SessionData, value: string | number | undefined) => {
    setSessionFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="w-5 h-5 mr-2 text-ocean" />
          Log New Surf Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="spot_id">Surf Spot</Label>
              <Select
                value={sessionFormData.spot_id}
                onValueChange={(value) => handleInputChange('spot_id', value)}
              >
                <SelectTrigger id="spot_id">
                  <SelectValue placeholder="Select a spot" />
                </SelectTrigger>
                <SelectContent>
                  {surfSpotsList.map(spot => (
                    <SelectItem key={spot.id} value={spot.id}>
                      {spot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="session_date">Date</Label>
              <Input
                id="session_date"
                type="date"
                value={sessionFormData.session_date}
                onChange={(e) => handleInputChange('session_date', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="duration_minutes">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                value={sessionFormData.duration_minutes || ''}
                onChange={(e) => handleInputChange('duration_minutes', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g., 90"
              />
            </div>
            <div>
              <Label htmlFor="wave_count">Wave Count (approx.)</Label>
              <Input
                id="wave_count"
                type="number"
                value={sessionFormData.wave_count || ''}
                onChange={(e) => handleInputChange('wave_count', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g., 15"
              />
            </div>
            <div>
              <Label htmlFor="rating">Session Rating (1-5)</Label>
              <div className="flex items-center space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleInputChange('rating', star)}
                    className={`text-2xl p-1 ${star <= (sessionFormData.rating || 0) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                    aria-label={`Rate ${star} out of 5 stars`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes / Highlights</Label>
            <Textarea
              id="notes"
              value={sessionFormData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="How was the session? Any notable waves, maneuvers, or wildlife sightings?"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={logSessionMutation.isPending}>
            {logSessionMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Log Session
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SessionLogger;
