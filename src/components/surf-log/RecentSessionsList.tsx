
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Waves, MapPin, TrendingUp, Loader2, AlertTriangle } from 'lucide-react';

interface ConditionSnapshotData {
  waveHeight_ft?: number | null;
  wavePeriod_s?: number | null;
  waveDirection_cardinal?: string | null;
  windSpeed_mph_range?: string | null;
  windDirection_cardinal?: string | null;
}

interface SurfSessionEntry {
  id: string;
  session_date: string;
  spot_id: string;
  spot_name?: string | null;
  rating?: number | null;
  duration_minutes?: number | null;
  wave_count?: number | null;
  notes?: string | null;
  conditions_snapshot?: ConditionSnapshotData | null;
}

interface RecentSessionsListProps {
  sessions: SurfSessionEntry[];
  isLoading: boolean;
  error: Error | null;
}

const RecentSessionsList: React.FC<RecentSessionsListProps> = ({ sessions, isLoading, error }) => {
  const formatDurationFromMinutes = (minutes: number | null | undefined) => {
    if (minutes == null || minutes <= 0) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0 && remainingMinutes > 0) return `${hours}h ${remainingMinutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${remainingMinutes}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Recent Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-ocean" />
            <p className="ml-2">Loading sessions...</p>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center py-8 text-red-500">
            <AlertTriangle className="w-8 h-8 mr-2" />
            <p>Error loading sessions: {error.message}</p>
          </div>
        )}
        {!isLoading && !error && sessions.length === 0 && (
          <p className="text-center py-8 text-gray-500">No surf sessions logged yet. Use the form above to add your first session!</p>
        )}
        {sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{session.spot_name || session.spot_id}</h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(session.session_date).toLocaleDateString()}
                      <Clock className="w-4 h-4 ml-3 mr-1" />
                      {formatDurationFromMinutes(session.duration_minutes)}
                    </div>
                  </div>
                  {session.rating && (
                    <Badge className={`${
                      session.rating >= 4 ? 'bg-green-500' :
                      session.rating >= 3 ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`}>
                      {session.rating}/5 stars
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center">
                    <Waves className="w-4 h-4 mr-2 text-blue-500" />
                    <div>
                      <div className="font-medium">{session.wave_count ?? 'N/A'} waves</div>
                      <div className="text-gray-600 dark:text-gray-400">Caught</div>
                    </div>
                  </div>

                  {session.conditions_snapshot?.waveHeight_ft && (
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                      <div>
                        <div className="font-medium">{session.conditions_snapshot.waveHeight_ft.toFixed(1)} ft</div>
                        <div className="text-gray-600 dark:text-gray-400">Wave Height</div>
                      </div>
                    </div>
                  )}
                  {session.conditions_snapshot?.windSpeed_mph_range && (
                     <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                      <div>
                        <div className="font-medium">{session.conditions_snapshot.windSpeed_mph_range}</div>
                        <div className="text-gray-600 dark:text-gray-400">Wind</div>
                      </div>
                    </div>
                  )}
                  {session.notes && (
                    <div className="col-span-2 md:col-span-4 mt-2">
                       <p className="text-xs text-gray-500 dark:text-gray-400"><strong>Notes:</strong> {session.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentSessionsList;
