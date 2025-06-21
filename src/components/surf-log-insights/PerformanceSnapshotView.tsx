import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BarChart2, Clock, Waves, MapPin } from 'lucide-react'; // Example icons

interface PerformanceSnapshotData {
  total_sessions: number;
  average_rating: number | null;
  most_frequented_spot_id?: string | null;
  most_frequented_spot_name?: string | null;
  total_duration_minutes: number;
  total_wave_count: number;
}

interface PerformanceSnapshotViewProps {
  snapshotData?: PerformanceSnapshotData;
  isLoading: boolean;
  error?: Error | null;
}

const PerformanceSnapshotView: React.FC<PerformanceSnapshotViewProps> = ({ snapshotData, isLoading, error }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Performance Snapshot</CardTitle></CardHeader>
        <CardContent><p>Loading snapshot...</p></CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-red-600">Performance Snapshot</CardTitle></CardHeader>
        <CardContent><p>Error loading performance snapshot: {error.message}</p></CardContent>
      </Card>
    );
  }

  if (!snapshotData || snapshotData.total_sessions === 0) {
     return (
      <Card>
        <CardHeader><CardTitle>Performance Snapshot</CardTitle></CardHeader>
        <CardContent><p>No session data yet to generate a snapshot. Go log some surfs!</p></CardContent>
      </Card>
    );
  }

  const formatDuration = (minutes: number) => {
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
            <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
            Performance Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Users className="w-6 h-6 mb-1 text-blue-500" />
          <span className="font-semibold text-lg">{snapshotData.total_sessions}</span>
          <span className="text-gray-600 dark:text-gray-400">Total Sessions</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <BarChart2 className="w-6 h-6 mb-1 text-green-500" />
          <span className="font-semibold text-lg">{snapshotData.average_rating?.toFixed(1) || 'N/A'}</span>
          <span className="text-gray-600 dark:text-gray-400">Avg Rating</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Clock className="w-6 h-6 mb-1 text-purple-500" />
          <span className="font-semibold text-lg">{formatDuration(snapshotData.total_duration_minutes)}</span>
          <span className="text-gray-600 dark:text-gray-400">Total Time</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Waves className="w-6 h-6 mb-1 text-teal-500" />
          <span className="font-semibold text-lg">{snapshotData.total_wave_count || 0}</span>
          <span className="text-gray-600 dark:text-gray-400">Total Waves</span>
        </div>
        <div className="col-span-2 md:col-span-1 flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <MapPin className="w-6 h-6 mb-1 text-orange-500" />
          <span className="font-semibold text-lg truncate" title={snapshotData.most_frequented_spot_name || snapshotData.most_frequented_spot_id || 'N/A'}>
            {snapshotData.most_frequented_spot_name || snapshotData.most_frequented_spot_id || 'N/A'}
          </span>
          <span className="text-gray-600 dark:text-gray-400">Fave Spot</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceSnapshotView;
