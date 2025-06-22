
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { useSurfForecast, useWeatherData, useSurfConditions } from '@/hooks/useRealTimeData';
import SurfForecast from './SurfForecast';
import WeatherWidget from './WeatherWidget';
import SurfConditionsDisplay from './SurfConditionsDisplay';
import TideChart from './TideChart';

const SearchableWeatherForecast: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState('Pipeline, Hawaii');
  const [currentSpotId, setCurrentSpotId] = useState('pipeline');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch real data using existing hooks
  const { data: weatherData, isLoading: weatherLoading } = useWeatherData(currentSpotId);
  const { data: surfConditions, isLoading: surfLoading } = useSurfConditions(currentSpotId);

  const handleSearch = async () => {
    if (!searchLocation.trim()) return;
    
    setIsSearching(true);
    // Simple spot ID generation from location name
    const spotId = searchLocation.toLowerCase().replace(/[^a-z0-9]/g, '-');
    setCurrentSpotId(spotId);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const popularSpots = [
    { name: 'Pipeline, Hawaii', id: 'pipeline' },
    { name: 'Mavericks, CA', id: 'mavericks' },
    { name: 'Bondi Beach, AU', id: 'bondi' },
    { name: 'Jeffreys Bay, SA', id: 'jeffreys' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            7-Day Weather Forecast Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Enter surf spot or location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Popular spots:</span>
            {popularSpots.map((spot) => (
              <Button
                key={spot.id}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchLocation(spot.name);
                  setCurrentSpotId(spot.id);
                }}
                className="text-xs"
              >
                {spot.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Display real data components when search is performed */}
      {currentSpotId && (
        <div className="space-y-6">
          {/* Current Weather Conditions */}
          <WeatherWidget
            weatherData={weatherData}
            isLoading={weatherLoading}
            spotName={searchLocation}
          />

          {/* Current Surf Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Current Surf Conditions - {searchLocation}</CardTitle>
            </CardHeader>
            <CardContent>
              <SurfConditionsDisplay
                conditions={surfConditions}
                isLoading={surfLoading}
              />
            </CardContent>
          </Card>

          {/* 7-Day Surf Forecast */}
          <SurfForecast spotId={currentSpotId} spotName={searchLocation} />

          {/* Tide Chart */}
          <TideChart />
        </div>
      )}
    </div>
  );
};

export default SearchableWeatherForecast;
