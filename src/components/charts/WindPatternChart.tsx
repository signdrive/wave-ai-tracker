
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { useHistoricalWindData } from '@/hooks/useHistoricalData';
import { Skeleton } from '@/components/ui/skeleton';

interface WindPatternChartProps {
  spotId: string;
  days: number;
}

const WindPatternChart: React.FC<WindPatternChartProps> = ({ spotId, days }) => {
  const { data, isLoading, error } = useHistoricalWindData(spotId, days);

  if (isLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  if (error || !data) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        Error loading wind pattern data
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{data.avgWindSpeed.toFixed(1)} mph</div>
          <div className="text-sm text-gray-600">Average Speed</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{data.maxWindSpeed.toFixed(1)} mph</div>
          <div className="text-sm text-gray-600">Maximum Speed</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{data.dominantDirection}</div>
          <div className="text-sm text-gray-600">Dominant Direction</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.dailyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'Wind Speed (mph)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(1)} mph`, 'Wind Speed']}
            labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          />
          <Line 
            type="monotone" 
            dataKey="windSpeed" 
            stroke="#ea580c" 
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WindPatternChart;
