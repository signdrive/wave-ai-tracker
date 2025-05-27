
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SurfSpotMap from './SurfSpotMap';
import SurfSpotFilters from './SurfSpotFilters';
import SurfSpotList from './SurfSpotList';
import { useSurfSpots } from '@/hooks/useSurfSpots';
import { Map, List, LayoutGrid } from 'lucide-react';

interface FilterOptions {
  search: string;
  country: string;
  difficulty: string;
  waveType: string;
  breakType: string;
}

const SurfSpotMapPage: React.FC = () => {
  const { surfSpots, cameraStatuses, isLoading } = useSurfSpots();
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'split'>('split');
  const [selectedSpot, setSelectedSpot] = useState<string | undefined>();
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    country: 'all',
    difficulty: 'all',
    waveType: 'all',
    breakType: 'all'
  });

  // Get unique countries for filter dropdown
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(surfSpots.map(spot => spot.country))];
    return uniqueCountries.sort();
  }, [surfSpots]);

  // Filter spots based on current filters
  const filteredSpots = useMemo(() => {
    return surfSpots.filter(spot => {
      const matchesSearch = filters.search === '' || 
        spot.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        spot.country.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCountry = filters.country === 'all' || spot.country === filters.country;
      
      const matchesDifficulty = filters.difficulty === 'all' || 
        spot.difficulty.toLowerCase().includes(filters.difficulty);
      
      const matchesBreakType = filters.breakType === 'all' || 
        spot.wave_type.toLowerCase().includes(filters.breakType);
      
      const matchesWaveType = filters.waveType === 'all' || 
        spot.wave_type.toLowerCase().includes(filters.waveType);

      return matchesSearch && matchesCountry && matchesDifficulty && 
             matchesBreakType && matchesWaveType;
    });
  }, [surfSpots, filters]);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      country: 'all',
      difficulty: 'all',
      waveType: 'all',
      breakType: 'all'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-ocean-dark">Surf Spot Map</h1>
            <p className="text-gray-600 mt-1">
              Discover {surfSpots.length} surf spots worldwide
              {filteredSpots.length !== surfSpots.length && (
                <span> • {filteredSpots.length} matching filters</span>
              )}
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map className="w-4 h-4 mr-1" />
              Map
            </Button>
            <Button
              variant={viewMode === 'split' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('split')}
            >
              <LayoutGrid className="w-4 h-4 mr-1" />
              Split
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
          </div>
        </div>

        {/* Filters */}
        <SurfSpotFilters
          filters={filters}
          onFiltersChange={setFilters}
          countries={countries}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Content Layout */}
      <div className={`grid gap-6 ${
        viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'
      }`}>
        {/* Map View */}
        {(viewMode === 'map' || viewMode === 'split') && (
          <div className={viewMode === 'map' ? 'col-span-1' : ''}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Interactive Map</span>
                  <Badge variant="outline">
                    {filteredSpots.length} spots
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <SurfSpotMap
                  selectedSpot={selectedSpot}
                  onSpotSelect={setSelectedSpot}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* List View */}
        {(viewMode === 'list' || viewMode === 'split') && (
          <div className={viewMode === 'list' ? 'col-span-1' : ''}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Surf Spots</span>
                  <Badge variant="outline">
                    {filteredSpots.length} results
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <SurfSpotList
                  spots={filteredSpots}
                  cameraStatuses={cameraStatuses}
                  onSpotSelect={setSelectedSpot}
                  selectedSpot={selectedSpot}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurfSpotMapPage;
