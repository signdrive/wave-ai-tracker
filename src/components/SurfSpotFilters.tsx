
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface FilterOptions {
  search: string;
  country: string;
  difficulty: string;
  waveType: string;
  breakType: string;
  surfNow: boolean;
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
  const handleFilterChange = (key: keyof FilterOptions, value: string | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== '';
    if (key === 'surfNow') return value === true;
    return value !== 'all';
  }).length;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Filter className="w-5 h-5 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search surf spots..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Country</label>
            <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Difficulty</label>
            <Select value={filters.difficulty} onValueChange={(value) => handleFilterChange('difficulty', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Break Type</label>
            <Select value={filters.breakType} onValueChange={(value) => handleFilterChange('breakType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="beach">Beach break</SelectItem>
                <SelectItem value="point">Point break</SelectItem>
                <SelectItem value="reef">Reef break</SelectItem>
                <SelectItem value="river">River mouth</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Wave Type</label>
            <Select value={filters.waveType} onValueChange={(value) => handleFilterChange('waveType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All waves" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All waves</SelectItem>
                <SelectItem value="left">Left-hand</SelectItem>
                <SelectItem value="right">Right-hand</SelectItem>
                <SelectItem value="barrel">Barrels</SelectItem>
                <SelectItem value="big wave">Big wave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurfSpotFilters;
