
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface FilterOptions {
  search: string;
  country: string;
  difficulty: string;
  waveType: string;
  breakType: string;
  surfNow: boolean;
  waveHeight: string;
  windDirection: string;
  crowdLevel: string;
}

interface ActiveFiltersDisplayProps {
  filters: FilterOptions;
}

const ActiveFiltersDisplay: React.FC<ActiveFiltersDisplayProps> = ({ filters }) => {
  const hasActiveFilters = filters.surfNow || 
    filters.country !== 'all' || 
    filters.difficulty !== 'all' ||
    filters.waveHeight !== 'all' ||
    filters.windDirection !== 'all' ||
    filters.crowdLevel !== 'all' ||
    filters.search !== '';

  if (!hasActiveFilters) return null;

  const getWaveHeightLabel = (value: string) => {
    const labels: Record<string, string> = {
      'small': '1-3ft',
      'medium': '3-6ft', 
      'large': '6-10ft',
      'huge': '10ft+'
    };
    return labels[value] || value;
  };

  const getWindLabel = (value: string) => {
    const labels: Record<string, string> = {
      'offshore': 'Offshore Wind',
      'onshore': 'Onshore Wind',
      'cross': 'Cross-shore Wind',
      'calm': 'Calm Wind'
    };
    return labels[value] || value;
  };

  const getCrowdLabel = (value: string) => {
    const labels: Record<string, string> = {
      'empty': 'Empty',
      'light': 'Light Crowd',
      'moderate': 'Moderate Crowd',
      'crowded': 'Crowded'
    };
    return labels[value] || value;
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {filters.surfNow && (
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          🏄‍♂️ Surf Now Active
        </Badge>
      )}
      {filters.country !== 'all' && (
        <Badge variant="outline">{filters.country}</Badge>
      )}
      {filters.difficulty !== 'all' && (
        <Badge variant="outline">{filters.difficulty}</Badge>
      )}
      {filters.waveHeight !== 'all' && (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          🌊 {getWaveHeightLabel(filters.waveHeight)}
        </Badge>
      )}
      {filters.windDirection !== 'all' && (
        <Badge variant="outline" className="bg-gray-50 text-gray-700">
          💨 {getWindLabel(filters.windDirection)}
        </Badge>
      )}
      {filters.crowdLevel !== 'all' && (
        <Badge variant="outline" className="bg-orange-50 text-orange-700">
          👥 {getCrowdLabel(filters.crowdLevel)}
        </Badge>
      )}
      {filters.search && (
        <Badge variant="outline" className="bg-purple-50 text-purple-700">
          🔍 "{filters.search}"
        </Badge>
      )}
    </div>
  );
};

export default ActiveFiltersDisplay;
