
import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface SurfSpot {
  id: string;
  full_name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
  difficulty: string;
  wave_type: string;
  best_swell_direction: string;
  best_wind: string;
  best_tide: string;
  crowd_factor: string;
}

interface SurfSpotSearchProps {
  spots: SurfSpot[];
  onSearch: (searchTerm: string) => void;
  onSelectSpot: (spot: SurfSpot) => void;
  searchTerm: string;
}

const SurfSpotSearch: React.FC<SurfSpotSearchProps> = ({
  spots,
  onSearch,
  onSelectSpot,
  searchTerm
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter spots for suggestions
  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    return spots
      .filter(spot => 
        spot.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 8); // Limit to 8 suggestions
  }, [spots, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearch(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSelectSpot = (spot: SurfSpot) => {
    onSelectSpot(spot);
    onSearch(spot.full_name);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    onSearch('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search surf spots, regions, difficulty..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(searchTerm.length >= 2)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-y-auto">
          <CardContent className="p-0">
            {suggestions.map((spot) => (
              <button
                key={spot.id}
                onClick={() => handleSelectSpot(spot)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-ocean-dark">{spot.full_name}</div>
                <div className="text-sm text-gray-600">
                  {spot.state}, {spot.country} • {spot.difficulty}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SurfSpotSearch;
