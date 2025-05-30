
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSupabaseSurfSpots } from '@/hooks/useSupabaseSurfSpots';
import DatabaseSurfSpotMap from './DatabaseSurfSpotMap';
import SurfSpotInfoPanel from './SurfSpotInfoPanel';
import DatabaseMapHeader from './DatabaseMapHeader';
import DatabaseMapFilters from './DatabaseMapFilters';
import DatabaseMapStats from './DatabaseMapStats';
import DatabaseMapListView from './DatabaseMapListView';

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
      <DatabaseMapHeader
        surfSpots={surfSpots}
        filteredSpots={filteredSpots}
        isLoading={isLoading}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Search and Filters */}
      <DatabaseMapFilters
        surfSpots={surfSpots}
        searchTerm={searchTerm}
        selectedCountry={selectedCountry}
        selectedDifficulty={selectedDifficulty}
        countries={countries}
        difficulties={difficulties}
        onSearch={setSearchTerm}
        onCountryChange={setSelectedCountry}
        onDifficultyChange={setSelectedDifficulty}
        onSelectSpot={handleSelectSpot}
      />

      {/* Statistics */}
      <DatabaseMapStats
        filteredSpots={filteredSpots}
        countries={countries}
      />

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
        <DatabaseMapListView
          filteredSpots={filteredSpots}
          isLoading={isLoading}
          onSelectSpot={handleSelectSpot}
        />
      )}
    </div>
  );
};

export default DatabaseMapView;
