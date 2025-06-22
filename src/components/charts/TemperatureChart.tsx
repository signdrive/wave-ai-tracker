
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useHistoricalTemperatureData } from '@/hooks/useHistoricalData';
import { Skeleton } from '@/components/ui/skeleton';

interface TemperatureChartProps {
  spotId: string;
  days: number;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ spotId, days }) => {
  const { data, isLoading, error } = useHistoricalTemperatureData(spotId, days);

  if (isLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  if (error || !data) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        Error loading temperature data
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{data.avgAirTemp.toFixed(1)}°F</div>
          <div className="text-sm text-gray-600">Avg Air Temp</div>
        </div>
        <div className="text-center p-3 bg-ocean/10 rounded-lg">
          <div className="text-2xl font-bold text-ocean-dark">{data.avgWaterTemp.toFixed(1)}°F</div>
          <div className="text-sm text-gray-600">Avg Water Temp</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{data.tempRange.toFixed(1)}°F</div>
          <div className="text-sm text-gray-600">Temperature Range</div>
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
            label={{ value: 'Temperature (°F)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)}°F`,
              name === 'airTemp' ? 'Air Temperature' : 'Water Temperature'
            ]}
            labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          />
          <Line 
            type="monotone" 
            dataKey="airTemp" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="airTemp"
            dot={{ r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="waterTemp" 
            stroke="#0891b2" 
            strokeWidth={2}
            name="waterTemp"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
