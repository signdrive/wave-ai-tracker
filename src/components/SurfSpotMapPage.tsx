
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SurfSpotMap from './SurfSpotMap';
import SurfSpotFilters from './SurfSpotFilters';
import SurfSpotList from './SurfSpotList';
import { useSurfSpots } from '@/hooks/useSurfSpots';
import { Map, List, LayoutGrid, Waves } from 'lucide-react';

interface FilterOptions {
  search: string;
  country: string;
  difficulty: string;
  waveType: string;
  breakType: string;
  surfNow: boolean;
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
    breakType: 'all',
    surfNow: false
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

      // "Surf Now" filter - spots with good conditions (simplified logic)
      const matchesSurfNow = !filters.surfNow || (
        spot.live_cam && // Has live cam for verification
        !spot.difficulty.toLowerCase().includes('expert') // Not expert-only
      );

      return matchesSearch && matchesCountry && matchesDifficulty && 
             matchesBreakType && matchesWaveType && matchesSurfNow;
    });
  }, [surfSpots, filters]);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      country: 'all',
      difficulty: 'all',
      waveType: 'all',
      breakType: 'all',
      surfNow: false
    });
  };

  const handleSurfNowToggle = () => {
    setFilters(prev => ({ ...prev, surfNow: !prev.surfNow }));
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
            <h1 className="text-3xl font-bold text-ocean-dark">Global Surf Spots</h1>
            <p className="text-gray-600 mt-1">
              Discover {surfSpots.length} surf spots worldwide with live conditions
              {filteredSpots.length !== surfSpots.length && (
                <span> • {filteredSpots.length} matching filters</span>
              )}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant={filters.surfNow ? 'default' : 'outline'}
              size="sm"
              onClick={handleSurfNowToggle}
              className="mr-4"
            >
              <Waves className="w-4 h-4 mr-1" />
              Surf Now
            </Button>
            
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

        {/* Enhanced Filters */}
        <SurfSpotFilters
          filters={filters}
          onFiltersChange={setFilters}
          countries={countries}
          onClearFilters={handleClearFilters}
        />
        
        {/* Active Filters Display */}
        {(filters.surfNow || filters.country !== 'all' || filters.difficulty !== 'all') && (
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
          </div>
        )}
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
                  <span>Interactive Surf Map</span>
                  <div className="flex items-center space-x-2">
                    {filters.surfNow && (
                      <Badge className="bg-green-500">
                        Live Conditions
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {filteredSpots.length} spots
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <SurfSpotMap
                  selectedSpot={selectedSpot}
                  onSpotSelect={setSelectedSpot}
                  filters={{
                    difficulty: filters.difficulty,
                    waveType: filters.waveType,
                    country: filters.country
                  }}
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

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-ocean">{surfSpots.length}</div>
          <div className="text-sm text-gray-600">Total Spots</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {surfSpots.filter(s => s.live_cam).length}
          </div>
          <div className="text-sm text-gray-600">Live Cams</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{countries.length}</div>
          <div className="text-sm text-gray-600">Countries</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">
            {filteredSpots.filter(s => s.difficulty.toLowerCase().includes('beginner')).length}
          </div>
          <div className="text-sm text-gray-600">Beginner Spots</div>
        </Card>
      </div>
    </div>
  );
};

export default SurfSpotMapPage;
