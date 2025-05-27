
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

interface SurfConditions {
  waveHeight: number;
  period: number;
  windSpeed: number;
  windDirection: string;
  temperature: number;
  crowdLevel: number;
  setsPerHour: number;
  lastUpdated: string;
}

interface LiveAnalysisPanelProps {
  conditions?: SurfConditions;
  isLoading: boolean;
}

const LiveAnalysisPanel: React.FC<LiveAnalysisPanelProps> = ({ conditions, isLoading }) => {
  return (
    <div>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Live Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 flex-grow">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : conditions ? (
            <>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Crowd Level</label>
                  <span className="text-sm text-gray-500">
                    {conditions.crowdLevel < 30 ? 'Low' : conditions.crowdLevel < 70 ? 'Moderate' : 'High'}
                  </span>
                </div>
                <Progress value={conditions.crowdLevel} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="bg-sand/50 p-3 rounded-md">
                  <p className="text-sm font-medium text-ocean-dark">Sets Per Hour</p>
                  <p className="text-sm text-gray-600">{conditions.setsPerHour} sets detected</p>
                </div>

                <div className="bg-sand/50 p-3 rounded-md">
                  <p className="text-sm font-medium text-ocean-dark">Last Update</p>
                  <p className="text-sm text-gray-600">
                    {new Date(conditions.lastUpdated).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                </div>

                <div className="bg-sand/50 p-3 rounded-md">
                  <p className="text-sm font-medium text-ocean-dark">Conditions</p>
                  <p className="text-sm text-gray-600">
                    {conditions.waveHeight > 6 ? 'Epic' : conditions.waveHeight > 4 ? 'Good' : conditions.waveHeight > 2 ? 'Fair' : 'Small'} waves today
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveAnalysisPanel;
