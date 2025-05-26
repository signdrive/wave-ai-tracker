
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useHistoricalCrowdData } from '@/hooks/useHistoricalData';
import { Skeleton } from '@/components/ui/skeleton';

interface CrowdLevelChartProps {
  spotId: string;
  days: number;
}

const CrowdLevelChart: React.FC<CrowdLevelChartProps> = ({ spotId, days }) => {
  const { data, isLoading, error } = useHistoricalCrowdData(spotId, days);

  if (isLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  if (error || !data) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        Error loading crowd level data
      </div>
    );
  }

  const getCrowdColor = (level: number) => {
    if (level < 30) return '#10b981'; // green
    if (level < 70) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{data.lowCrowdDays}</div>
          <div className="text-sm text-gray-600">Low Crowd Days</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{data.moderateCrowdDays}</div>
          <div className="text-sm text-gray-600">Moderate Days</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{data.highCrowdDays}</div>
          <div className="text-sm text-gray-600">High Crowd Days</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{data.bestTimeSlot}</div>
          <div className="text-sm text-gray-600">Best Time Slot</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.dailyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'Crowd Level (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(0)}%`, 'Crowd Level']}
            labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          />
          <Bar dataKey="crowdLevel" radius={[2, 2, 0, 0]}>
            {data.dailyData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getCrowdColor(entry.crowdLevel)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CrowdLevelChart;
