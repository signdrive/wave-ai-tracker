import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Map, List, LayoutGrid, Download } from 'lucide-react';
import EnhancedSurfSpotMap from './EnhancedSurfSpotMap';
import EnhancedSurfSpotFilters from './EnhancedSurfSpotFilters';
import { EnhancedSurfSpot } from '@/types/enhancedSurfSpots';
import enhancedSurfSpotsData from '@/data/enhancedSurfSpots.json';

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

const SimpleSurfSpotMapPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'split'>('split');
  const [filters, setFilters] = useState<EnhancedFilterOptions>({
    search: '',
    country: 'all',
    difficulty: 'all',
    break_type: 'all',
    crowd_level: 'all',
    wave_height: 'all',
    water_temp: 'all',
    best_season: 'all',
    big_wave: false,
    longboard_friendly: false,
    kite_surfing: false,
    secret_spots: false
  });

  // Load enhanced surf spots data
  const surfSpots: EnhancedSurfSpot[] = enhancedSurfSpotsData.surf_spots;

  // Get unique countries for filter
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(surfSpots.map(spot => spot.country))];
    return uniqueCountries.sort();
  }, [surfSpots]);

  // Filter spots based on current filters with null safety
  const filteredSpots = useMemo(() => {
    return surfSpots.filter(spot => {
      // Text search with null safety
      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          (spot.full_name?.toLowerCase() || '').includes(searchTerm) ||
          (spot.country?.toLowerCase() || '').includes(searchTerm) ||
          (spot.region?.toLowerCase() || '').includes(searchTerm) ||
          (spot.description?.toLowerCase() || '').includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Country filter with null safety
      if (filters.country !== 'all' && spot.country !== filters.country) return false;

      // Difficulty filter with null safety
      if (filters.difficulty !== 'all' && spot.difficulty !== filters.difficulty) return false;

      // Break type filter with null safety
      if (filters.break_type !== 'all') {
        const hasBreakType = 
          (filters.break_type === 'point' && spot.point_break) ||
          (filters.break_type === 'reef' && spot.reef_break) ||
          (filters.break_type === 'beach' && spot.beach_break);
        if (!hasBreakType) return false;
      }

      // Crowd level filter with null safety
      if (filters.crowd_level !== 'all' && spot.crowd_levels !== filters.crowd_level) return false;

      // Special features with null safety
      if (filters.big_wave && !spot.big_wave) return false;
      if (filters.longboard_friendly && !spot.longboard_friendly) return false;
      if (filters.kite_surfing && !spot.kite_surfing) return false;
      if (filters.secret_spots && !spot.secret) return false;

      return true;
    });
  }, [surfSpots, filters]);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      country: 'all',
      difficulty: 'all',
      break_type: 'all',
      crowd_level: 'all',
      wave_height: 'all',
      water_temp: 'all',
      best_season: 'all',
      big_wave: false,
      longboard_friendly: false,
      kite_surfing: false,
      secret_spots: false
    });
  };

  const exportToGeoJSON = () => {
    const geoJSON = {
      type: "FeatureCollection",
      features: filteredSpots.map(spot => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [spot.lon, spot.lat]
        },
        properties: {
          ...spot
        }
      }))
    };

    const dataStr = JSON.stringify(geoJSON, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'surf_spots.geojson';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-ocean-dark">Global Surf Spots Explorer</h1>
            <p className="text-gray-600 mt-1">
              Discover {surfSpots.length} epic surf spots worldwide with detailed metadata and travel planning info
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToGeoJSON}
              className="hidden md:flex"
            >
              <Download className="w-4 h-4 mr-1" />
              Export GeoJSON
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
        <EnhancedSurfSpotFilters
          filters={filters}
          onFiltersChange={setFilters}
          countries={countries}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-ocean-dark">{filteredSpots.length}</div>
            <div className="text-sm text-gray-600">Spots Found</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {filteredSpots.filter(s => s.big_wave).length}
            </div>
            <div className="text-sm text-gray-600">Big Wave Spots</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {filteredSpots.filter(s => s.longboard_friendly).length}
            </div>
            <div className="text-sm text-gray-600">Longboard Friendly</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {filteredSpots.filter(s => s.kite_surfing).length}
            </div>
            <div className="text-sm text-gray-600">Kite Surf Spots</div>
          </CardContent>
        </Card>
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
                    <Badge variant="outline">
                      {filteredSpots.length} spots
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EnhancedSurfSpotMap
                  spots={filteredSpots}
                  filters={{
                    difficulty: filters.difficulty,
                    break_type: filters.break_type,
                    country: filters.country,
                    big_wave: filters.big_wave,
                    longboard_friendly: filters.longboard_friendly,
                    kite_surfing: filters.kite_surfing
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
                  <span>Surf Spots Directory</span>
                  <Badge variant="outline">
                    {filteredSpots.length} results
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {filteredSpots.map((spot) => (
                    <div key={spot.id} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-ocean-dark">{spot.full_name || 'Unknown Spot'}</h3>
                        <div className="flex space-x-1">
                          {spot.big_wave && <Badge className="bg-red-500 text-xs">Big Wave</Badge>}
                          {spot.longboard_friendly && <Badge className="bg-purple-500 text-xs">Longboard</Badge>}
                          {spot.kite_surfing && <Badge className="bg-green-500 text-xs">Kite</Badge>}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{spot.description || 'No description available'}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{spot.region || 'Unknown'}, {spot.country || 'Unknown'}</span>
                        <span>{spot.difficulty || 'Unknown'} • {spot.crowd_levels || 'Unknown'} crowd</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredSpots.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No surf spots found matching your criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleSurfSpotMapPage;
