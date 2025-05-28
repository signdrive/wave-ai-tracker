
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SurfSpotMap from './SurfSpotMap';
import SurfSpotFilters from './SurfSpotFilters';
import SurfSpotList from './SurfSpotList';
import MapPageHeader from './MapPageHeader';
import ActiveFiltersDisplay from './ActiveFiltersDisplay';
import SurfSpotStats from './SurfSpotStats';
import { useSurfSpots } from '@/hooks/useSurfSpots';

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
        <MapPageHeader
          totalSpots={surfSpots.length}
          filteredSpots={filteredSpots.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          surfNowActive={filters.surfNow}
          onSurfNowToggle={handleSurfNowToggle}
        />

        {/* Enhanced Filters */}
        <SurfSpotFilters
          filters={filters}
          onFiltersChange={setFilters}
          countries={countries}
          onClearFilters={handleClearFilters}
        />
        
        {/* Active Filters Display */}
        <ActiveFiltersDisplay filters={filters} />
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
      <SurfSpotStats 
        surfSpots={surfSpots}
        countries={countries}
        filteredSpots={filteredSpots}
      />
    </div>
  );
};

export default SurfSpotMapPage;
