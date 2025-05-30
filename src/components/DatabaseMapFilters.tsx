
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SurfSpotSearch from './SurfSpotSearch';

interface DatabaseMapFiltersProps {
  surfSpots: any[];
  searchTerm: string;
  selectedCountry: string;
  selectedDifficulty: string;
  countries: string[];
  difficulties: string[];
  onSearch: (term: string) => void;
  onCountryChange: (country: string) => void;
  onDifficultyChange: (difficulty: string) => void;
  onSelectSpot: (spot: any) => void;
}

const DatabaseMapFilters: React.FC<DatabaseMapFiltersProps> = ({
  surfSpots,
  searchTerm,
  selectedCountry,
  selectedDifficulty,
  countries,
  difficulties,
  onSearch,
  onCountryChange,
  onDifficultyChange,
  onSelectSpot
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SurfSpotSearch 
            spots={surfSpots}
            onSearch={onSearch}
            onSelectSpot={onSelectSpot}
            searchTerm={searchTerm}
          />

          <Select value={selectedCountry} onValueChange={onCountryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseMapFilters;
