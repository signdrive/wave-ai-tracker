
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useHistoricalWaveData } from '@/hooks/useHistoricalData';
import { Skeleton } from '@/components/ui/skeleton';

interface WaveHeightChartProps {
  spotId: string;
  days: number;
}

const WaveHeightChart: React.FC<WaveHeightChartProps> = ({ spotId, days }) => {
  const { data, isLoading, error } = useHistoricalWaveData(spotId, days);

  if (isLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  if (error || !data) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        Error loading wave height data
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-ocean/5 rounded-lg">
          <div className="text-2xl font-bold text-ocean-dark">{data.avgWaveHeight.toFixed(1)}ft</div>
          <div className="text-sm text-gray-600">Average Height</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{data.maxWaveHeight.toFixed(1)}ft</div>
          <div className="text-sm text-gray-600">Maximum Height</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{data.minWaveHeight.toFixed(1)}ft</div>
          <div className="text-sm text-gray-600">Minimum Height</div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data.dailyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'Wave Height (ft)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(1)}ft`, 'Wave Height']}
            labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          />
          <Area 
            type="monotone" 
            dataKey="waveHeight" 
            stroke="#0891b2" 
            fill="#0891b2" 
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaveHeightChart;
