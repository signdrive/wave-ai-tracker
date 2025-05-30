
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Map, List, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSupabaseSurfSpots } from '@/hooks/useSupabaseSurfSpots';
import DatabaseSurfSpotMap from './DatabaseSurfSpotMap';
import SurfSpotSearch from './SurfSpotSearch';
import SurfSpotInfoPanel from './SurfSpotInfoPanel';

const DatabaseMapView: React.FC = () => {
  const { surfSpots, rawSpots, isLoading, error } = useSupabaseSurfSpots();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [selectedRawSpot, setSelectedRawSpot] = useState<any>(null);

  // Get unique countries and difficulties
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(rawSpots.map(spot => spot.country))].sort();
    return uniqueCountries;
  }, [rawSpots]);

  const difficulties = useMemo(() => {
    const uniqueDifficulties = [...new Set(rawSpots.map(spot => spot.difficulty))].sort();
    return uniqueDifficulties;
  }, [rawSpots]);

  // Filter spots
  const filteredSpots = useMemo(() => {
    return surfSpots.filter(spot => {
      const matchesSearch = searchTerm === '' || 
        spot.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.difficulty.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = selectedCountry === 'all' || spot.country === selectedCountry;
      const matchesDifficulty = selectedDifficulty === 'all' || spot.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCountry && matchesDifficulty;
    });
  }, [surfSpots, searchTerm, selectedCountry, selectedDifficulty]);

  const handleSelectSpot = (spot: any) => {
    setSelectedSpot(spot);
    // Find the corresponding raw spot data
    const rawSpot = rawSpots.find(raw => raw.name === spot.full_name || raw.id === parseInt(spot.id));
    setSelectedRawSpot(rawSpot);
  };

  const handleSpotClick = (spotId: string) => {
    const spot = surfSpots.find(s => s.id === spotId);
    if (spot) {
      handleSelectSpot(spot);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading surf spots from database: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-ocean-dark">Real Surf Spots Database</h1>
            <p className="text-gray-600 mt-1">
              {isLoading ? 'Loading...' : `${surfSpots.length} surf spots from Supabase database`}
            </p>
            {!isLoading && (
              <p className="text-sm text-green-600 font-medium">
                ✅ Connected to live database - showing {filteredSpots.length} filtered results
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map className="w-4 h-4 mr-1" />
              Map
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SurfSpotSearch 
                spots={surfSpots}
                onSearch={setSearchTerm}
                onSelectSpot={handleSelectSpot}
                searchTerm={searchTerm}
              />

              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
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

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
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
              {filteredSpots.filter(s => s.difficulty.toLowerCase().includes('beginner')).length}
            </div>
            <div className="text-sm text-gray-600">Beginner Spots</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {filteredSpots.filter(s => s.wave_type.toLowerCase().includes('point')).length}
            </div>
            <div className="text-sm text-gray-600">Point Breaks</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {countries.length}
            </div>
            <div className="text-sm text-gray-600">Countries</div>
          </CardContent>
        </Card>
      </div>

      {/* Map or List View */}
      {viewMode === 'map' ? (
        <div className="space-y-6">
          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Database Map</span>
                <Badge variant="outline">
                  {filteredSpots.length} spots
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px]">
                <DatabaseSurfSpotMap 
                  spots={filteredSpots} 
                  isLoading={isLoading}
                  onSpotClick={handleSpotClick}
                  selectedSpotId={selectedSpot?.id}
                />
              </div>
            </CardContent>
          </Card>

          {/* Information Panel */}
          <SurfSpotInfoPanel 
            selectedSpot={selectedSpot}
            rawSpotData={selectedRawSpot}
          />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Database Surf Spots Directory</span>
              <Badge variant="outline">
                {filteredSpots.length} results
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredSpots.map((spot) => (
                <div 
                  key={spot.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectSpot(spot)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-ocean-dark text-lg">{spot.full_name}</h3>
                    <Badge className="bg-blue-500 text-xs">DB #{spot.id}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    <div className="text-sm">
                      <span className="text-gray-500">Location:</span>
                      <span className="ml-1 font-medium">{spot.state}, {spot.country}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Difficulty:</span>
                      <span className="ml-1 font-medium">{spot.difficulty}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Break:</span>
                      <span className="ml-1 font-medium">{spot.wave_type}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Coordinates:</span>
                      <span className="ml-1 font-medium">{spot.lat.toFixed(3)}, {spot.lon.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredSpots.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                <p>No surf spots found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseMapView;
