
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, Filter, X, Waves, Wind, Mountain } from 'lucide-react';

interface EnhancedFilterOptions {
  search: string;
  country: string;
  difficulty: string;
  break_type: string;
  crowd_level: string;
  wave_height: string;
  water_temp: string;
  best_season: string;
  big_wave: boolean;
  longboard_friendly: boolean;
  kite_surfing: boolean;
  secret_spots: boolean;
}

interface EnhancedSurfSpotFiltersProps {
  filters: EnhancedFilterOptions;
  onFiltersChange: (filters: EnhancedFilterOptions) => void;
  countries: string[];
  onClearFilters: () => void;
}

const EnhancedSurfSpotFilters: React.FC<EnhancedSurfSpotFiltersProps> = ({
  filters,
  onFiltersChange,
  countries,
  onClearFilters
}) => {
  const waveHeightRanges = [
    { value: 'all', label: 'Any Size' },
    { value: 'small', label: '2-4ft (Small)' },
    { value: 'medium', label: '4-8ft (Medium)' },
    { value: 'large', label: '8-15ft (Large)' },
    { value: 'big', label: '15ft+ (Big Wave)' }
  ];

  const waterTempRanges = [
    { value: 'all', label: 'Any Temperature' },
    { value: 'cold', label: 'Cold (50-65°F)' },
    { value: 'moderate', label: 'Moderate (65-75°F)' },
    { value: 'warm', label: 'Warm (75°F+)' }
  ];

  const seasons = [
    { value: 'all', label: 'Any Season' },
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'fall', label: 'Fall/Autumn' },
    { value: 'winter', label: 'Winter' },
    { value: 'year-round', label: 'Year Round' }
  ];

  const crowdLevels = [
    { value: 'all', label: 'Any Crowd' },
    { value: 'Low', label: 'Low' },
    { value: 'Moderate', label: 'Moderate' },
    { value: 'Heavy', label: 'Heavy' },
    { value: 'Extreme', label: 'Extreme' }
  ];

  const hasActiveFilters = filters.search !== '' || 
    filters.country !== 'all' || 
    filters.difficulty !== 'all' ||
    filters.break_type !== 'all' ||
    filters.crowd_level !== 'all' ||
    filters.wave_height !== 'all' ||
    filters.water_temp !== 'all' ||
    filters.best_season !== 'all' ||
    filters.big_wave ||
    filters.longboard_friendly ||
    filters.kite_surfing ||
    filters.secret_spots;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* Text Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search surf spots..."
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
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="Expert">Expert</SelectItem>
            </SelectContent>
          </Select>

          {/* Break Type */}
          <Select value={filters.break_type} onValueChange={(value) => onFiltersChange({ ...filters, break_type: value })}>
            <SelectTrigger>
              <Waves className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Break Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Breaks</SelectItem>
              <SelectItem value="point">Point Break</SelectItem>
              <SelectItem value="reef">Reef Break</SelectItem>
              <SelectItem value="beach">Beach Break</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Wave Height */}
          <Select value={filters.wave_height} onValueChange={(value) => onFiltersChange({ ...filters, wave_height: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Wave Size" />
            </SelectTrigger>
            <SelectContent>
              {waveHeightRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Water Temperature */}
          <Select value={filters.water_temp} onValueChange={(value) => onFiltersChange({ ...filters, water_temp: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Water Temp" />
            </SelectTrigger>
            <SelectContent>
              {waterTempRanges.map(temp => (
                <SelectItem key={temp.value} value={temp.value}>{temp.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Best Season */}
          <Select value={filters.best_season} onValueChange={(value) => onFiltersChange({ ...filters, best_season: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Best Season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map(season => (
                <SelectItem key={season.value} value={season.value}>{season.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Crowd Level */}
          <Select value={filters.crowd_level} onValueChange={(value) => onFiltersChange({ ...filters, crowd_level: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Crowd Level" />
            </SelectTrigger>
            <SelectContent>
              {crowdLevels.map(crowd => (
                <SelectItem key={crowd.value} value={crowd.value}>{crowd.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Special Feature Toggles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="big-wave"
              checked={filters.big_wave}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, big_wave: checked })}
            />
            <Label htmlFor="big-wave" className="text-sm flex items-center">
              <Mountain className="w-4 h-4 mr-1" />
              Big Wave
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="longboard"
              checked={filters.longboard_friendly}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, longboard_friendly: checked })}
            />
            <Label htmlFor="longboard" className="text-sm">
              Longboard Friendly
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="kite-surf"
              checked={filters.kite_surfing}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, kite_surfing: checked })}
            />
            <Label htmlFor="kite-surf" className="text-sm flex items-center">
              <Wind className="w-4 h-4 mr-1" />
              Kite Surfing
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="secret-spots"
              checked={filters.secret_spots}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, secret_spots: checked })}
            />
            <Label htmlFor="secret-spots" className="text-sm">
              Secret Spots
            </Label>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearFilters}
              className="text-gray-600"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedSurfSpotFilters;
