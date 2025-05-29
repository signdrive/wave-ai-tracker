
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Wind, Waves } from 'lucide-react';

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

interface SurfSpotFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  countries: string[];
  onClearFilters: () => void;
}

const SurfSpotFilters: React.FC<SurfSpotFiltersProps> = ({
  filters,
  onFiltersChange,
  countries,
  onClearFilters
}) => {
  const waveHeightRanges = [
    { value: 'all', label: 'Any Size' },
    { value: 'small', label: '1-3ft (Small)' },
    { value: 'medium', label: '3-6ft (Medium)' },
    { value: 'large', label: '6-10ft (Large)' },
    { value: 'huge', label: '10ft+ (Huge)' }
  ];

  const windDirections = [
    { value: 'all', label: 'Any Wind' },
    { value: 'offshore', label: 'Offshore' },
    { value: 'onshore', label: 'Onshore' },
    { value: 'cross', label: 'Cross-shore' },
    { value: 'calm', label: 'Calm (<5mph)' }
  ];

  const crowdLevels = [
    { value: 'all', label: 'Any Crowd' },
    { value: 'empty', label: 'Empty (1-2)' },
    { value: 'light', label: 'Light (3-4)' },
    { value: 'moderate', label: 'Moderate (5-6)' },
    { value: 'crowded', label: 'Crowded (7+)' }
  ];

  const hasActiveFilters = filters.search !== '' || 
    filters.country !== 'all' || 
    filters.difficulty !== 'all' ||
    filters.waveType !== 'all' ||
    filters.breakType !== 'all' ||
    filters.waveHeight !== 'all' ||
    filters.windDirection !== 'all' ||
    filters.crowdLevel !== 'all' ||
    filters.surfNow;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search spots..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>

          {/* Country */}
          <Select value={filters.country} onValueChange={(value) => onFiltersChange({ ...filters, country: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Difficulty */}
          <Select value={filters.difficulty} onValueChange={(value) => onFiltersChange({ ...filters, difficulty: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>

          {/* Wave Height */}
          <Select value={filters.waveHeight} onValueChange={(value) => onFiltersChange({ ...filters, waveHeight: value })}>
            <SelectTrigger>
              <Waves className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Wave Size" />
            </SelectTrigger>
            <SelectContent>
              {waveHeightRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Wind Direction */}
          <Select value={filters.windDirection} onValueChange={(value) => onFiltersChange({ ...filters, windDirection: value })}>
            <SelectTrigger>
              <Wind className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Wind" />
            </SelectTrigger>
            <SelectContent>
              {windDirections.map(wind => (
                <SelectItem key={wind.value} value={wind.value}>{wind.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Crowd Level */}
          <Select value={filters.crowdLevel} onValueChange={(value) => onFiltersChange({ ...filters, crowdLevel: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Crowd" />
            </SelectTrigger>
            <SelectContent>
              {crowdLevels.map(crowd => (
                <SelectItem key={crowd.value} value={crowd.value}>{crowd.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearFilters}
              className="text-gray-600"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SurfSpotFilters;
