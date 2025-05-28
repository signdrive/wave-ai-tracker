
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface FilterOptions {
  search: string;
  country: string;
  difficulty: string;
  waveType: string;
  breakType: string;
  surfNow: boolean;
}

interface ActiveFiltersDisplayProps {
  filters: FilterOptions;
}

const ActiveFiltersDisplay: React.FC<ActiveFiltersDisplayProps> = ({ filters }) => {
  const hasActiveFilters = filters.surfNow || 
    filters.country !== 'all' || 
    filters.difficulty !== 'all' ||
    filters.search !== '';

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {filters.surfNow && (
        <Badge variant="secondary" className="bg-ocean/10 text-ocean-dark">
          Surf Now Active
        </Badge>
      )}
      {filters.country !== 'all' && (
        <Badge variant="outline">{filters.country}</Badge>
      )}
      {filters.difficulty !== 'all' && (
        <Badge variant="outline">{filters.difficulty}</Badge>
      )}
      {filters.search && (
        <Badge variant="outline">Search: "{filters.search}"</Badge>
      )}
    </div>
  );
};

export default ActiveFiltersDisplay;
