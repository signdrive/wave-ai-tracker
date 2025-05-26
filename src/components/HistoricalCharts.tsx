
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Wind, Users, Thermometer } from 'lucide-react';
import WaveHeightChart from './charts/WaveHeightChart';
import WindPatternChart from './charts/WindPatternChart';
import CrowdLevelChart from './charts/CrowdLevelChart';
import TemperatureChart from './charts/TemperatureChart';

interface HistoricalChartsProps {
  spotId: string;
  spotName: string;
}

const HistoricalCharts: React.FC<HistoricalChartsProps> = ({ spotId, spotName }) => {
  const [timeRange, setTimeRange] = useState<number>(30);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Historical Analytics - {spotName}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange(7)}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === 7 ? 'bg-ocean text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange(30)}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === 30 ? 'bg-ocean text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange(90)}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === 90 ? 'bg-ocean text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              3 Months
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="waves" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="waves" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Wave Trends
            </TabsTrigger>
            <TabsTrigger value="wind" className="flex items-center">
              <Wind className="w-4 h-4 mr-1" />
              Wind Patterns
            </TabsTrigger>
            <TabsTrigger value="crowd" className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Crowd Levels
            </TabsTrigger>
            <TabsTrigger value="temperature" className="flex items-center">
              <Thermometer className="w-4 h-4 mr-1" />
              Temperature
            </TabsTrigger>
          </TabsList>

          <TabsContent value="waves" className="mt-6">
            <WaveHeightChart spotId={spotId} days={timeRange} />
          </TabsContent>

          <TabsContent value="wind" className="mt-6">
            <WindPatternChart spotId={spotId} days={timeRange} />
          </TabsContent>

          <TabsContent value="crowd" className="mt-6">
            <CrowdLevelChart spotId={spotId} days={timeRange} />
          </TabsContent>

          <TabsContent value="temperature" className="mt-6">
            <TemperatureChart spotId={spotId} days={timeRange} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HistoricalCharts;
