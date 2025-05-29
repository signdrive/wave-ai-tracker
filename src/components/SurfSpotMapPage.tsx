
import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SurfSpotMap from './SurfSpotMap';
import SurfSpotFilters from './SurfSpotFilters';
import SurfSpotList from './SurfSpotList';
import MapPageHeader from './MapPageHeader';
import ActiveFiltersDisplay from './ActiveFiltersDisplay';
import SurfSpotStats from './SurfSpotStats';
import { useSurfSpots } from '@/hooks/useSurfSpots';
import { useSurfConditions } from '@/hooks/useRealTimeData';

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
    surfNow: false,
    waveHeight: 'all',
    windDirection: 'all',
    crowdLevel: 'all'
  });

  // Memoized countries list
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(surfSpots.map(spot => spot.country))];
    return uniqueCountries.sort();
  }, [surfSpots]);

  // Enhanced filtering logic with performance optimization
  const filteredSpots = useMemo(() => {
    return surfSpots.filter(spot => {
      // Text search
      if (filters.search !== '') {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = spot.full_name.toLowerCase().includes(searchTerm) ||
          spot.country.toLowerCase().includes(searchTerm) ||
          spot.state?.toLowerCase().includes(searchTerm) ||
          spot.wave_type.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Country filter
      if (filters.country !== 'all' && spot.country !== filters.country) return false;

      // Difficulty filter
      if (filters.difficulty !== 'all') {
        if (!spot.difficulty.toLowerCase().includes(filters.difficulty.toLowerCase())) return false;
      }

      // Wave type filter
      if (filters.waveType !== 'all') {
        if (!spot.wave_type.toLowerCase().includes(filters.waveType.toLowerCase())) return false;
      }

      // Break type filter
      if (filters.breakType !== 'all') {
        if (!spot.wave_type.toLowerCase().includes(filters.breakType.toLowerCase())) return false;
      }

      // Wave height filter (simulated based on spot characteristics)
      if (filters.waveHeight !== 'all') {
        const isExpertSpot = spot.difficulty.toLowerCase().includes('expert');
        const isAdvancedSpot = spot.difficulty.toLowerCase().includes('advanced');
        
        switch (filters.waveHeight) {
          case 'small':
            if (isExpertSpot || isAdvancedSpot) return false;
            break;
          case 'medium':
            if (isExpertSpot) return false;
            break;
          case 'large':
            if (!isAdvancedSpot && !isExpertSpot) return false;
            break;
          case 'huge':
            if (!isExpertSpot) return false;
            break;
        }
      }

      // Wind direction filter (simplified logic)
      if (filters.windDirection !== 'all') {
        const bestWind = spot.best_wind.toLowerCase();
        switch (filters.windDirection) {
          case 'offshore':
            if (!bestWind.includes('offshore') && !bestWind.includes('land')) return false;
            break;
          case 'onshore':
            if (!bestWind.includes('onshore') && !bestWind.includes('sea')) return false;
            break;
          case 'cross':
            if (!bestWind.includes('cross') && !bestWind.includes('side')) return false;
            break;
          case 'calm':
            if (!bestWind.includes('light') && !bestWind.includes('calm')) return false;
            break;
        }
      }

      // Crowd level filter
      if (filters.crowdLevel !== 'all') {
        const crowdFactor = spot.crowd_factor.toLowerCase();
        switch (filters.crowdLevel) {
          case 'empty':
            if (!crowdFactor.includes('low') && !crowdFactor.includes('empty')) return false;
            break;
          case 'light':
            if (!crowdFactor.includes('light') && !crowdFactor.includes('medium-low')) return false;
            break;
          case 'moderate':
            if (!crowdFactor.includes('medium') && !crowdFactor.includes('moderate')) return false;
            break;
          case 'crowded':
            if (!crowdFactor.includes('high') && !crowdFactor.includes('busy')) return false;
            break;
        }
      }

      // "Surf Now" filter - enhanced logic
      if (filters.surfNow) {
        const hasLiveCam = !!spot.live_cam;
        const isNotExpert = !spot.difficulty.toLowerCase().includes('expert');
        const isAccessible = !spot.crowd_factor.toLowerCase().includes('locals only');
        
        if (!hasLiveCam || !isNotExpert || !isAccessible) return false;
      }

      return true;
    });
  }, [surfSpots, filters]);

  // Optimized filter change handler
  const handleFiltersChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      country: 'all',
      difficulty: 'all',
      waveType: 'all',
      breakType: 'all',
      surfNow: false,
      waveHeight: 'all',
      windDirection: 'all',
      crowdLevel: 'all'
    });
  }, []);

  const handleSurfNowToggle = useCallback(() => {
    setFilters(prev => ({ ...prev, surfNow: !prev.surfNow }));
  }, []);

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
          onFiltersChange={handleFiltersChange}
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
                        🏄‍♂️ Live Conditions
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

      {/* Enhanced Quick Stats */}
      <SurfSpotStats 
        surfSpots={surfSpots}
        countries={countries}
        filteredSpots={filteredSpots}
      />
    </div>
  );
};

export default SurfSpotMapPage;
