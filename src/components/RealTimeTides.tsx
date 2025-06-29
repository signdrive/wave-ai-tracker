
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTideData } from '@/hooks/useRealTimeData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw, MapPin } from 'lucide-react';

interface RealTimeTidesProps {
  stationId: string;
  stationName: string;
  days?: number;
}

const RealTimeTides: React.FC<RealTimeTidesProps> = ({ stationId, stationName, days = 1 }) => {
  const { data: tideData, isLoading, error, isRefetching } = useTideData(stationId, days);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
          <p className="text-sm font-medium">{`${label}: ${payload[0].value}ft`}</p>
          {payload[0].payload.type && (
            <p className="text-xs text-ocean">{payload[0].payload.type} Tide</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-red-500">Error loading tide data for {stationName}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-ocean" />
            <span>Live Tide Chart - {stationName}</span>
          </div>
          {isRefetching && <RefreshCw className="w-4 h-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : tideData ? (
          <>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={tideData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="colorTide" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0077B6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00B4D8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }} 
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: 'Height (ft)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fontSize: 12 }
                    }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="height" 
                    stroke="#0077B6" 
                    fillOpacity={1} 
                    fill="url(#colorTide)" 
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-ocean/10 p-3 rounded-md">
                <p className="text-sm font-medium">Next High Tide</p>
                <p className="text-sm text-gray-600">
                  {tideData.find(t => t.type === 'High')?.time || 'N/A'}
                </p>
              </div>
              <div className="bg-ocean/10 p-3 rounded-md">
                <p className="text-sm font-medium">Next Low Tide</p>
                <p className="text-sm text-gray-600">
                  {tideData.find(t => t.type === 'Low')?.time || 'N/A'}
                </p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Tide data for {stationName} • Station ID: {stationId}
              </p>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default RealTimeTides;
