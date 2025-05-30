
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Map, List } from 'lucide-react';
import { EnhancedSurfSpot } from '@/types/enhancedSurfSpots';
import enhancedSurfSpotsData from '@/data/enhancedSurfSpots.json';
import EnhancedSurfSpotMap from './EnhancedSurfSpotMap';

const BasicMapView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const surfSpots: EnhancedSurfSpot[] = enhancedSurfSpotsData.surf_spots;

  // Simple filtering
  const filteredSpots = surfSpots.filter(spot => {
    const matchesSearch = searchTerm === '' || 
      spot.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = selectedCountry === 'all' || spot.country === selectedCountry;
    
    return matchesSearch && matchesCountry;
  });

  const countries = [...new Set(surfSpots.map(spot => spot.country))].sort();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-ocean-dark">Global Surf Spots</h1>
            <p className="text-gray-600 mt-1">
              Discover {surfSpots.length} surf spots worldwide
            </p>
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

        {/* Simple Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search surf spots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

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

      {/* Map or List View */}
      {viewMode === 'map' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Interactive Surf Map</span>
              <Badge variant="outline">
                {filteredSpots.length} spots
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[600px]">
              <EnhancedSurfSpotMap
                spots={filteredSpots}
                filters={{
                  difficulty: 'all',
                  break_type: 'all',
                  country: selectedCountry,
                  big_wave: false,
                  longboard_friendly: false,
                  kite_surfing: false
                }}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Surf Spots Directory</span>
              <Badge variant="outline">
                {filteredSpots.length} results
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSpots.map((spot) => (
                <div key={spot.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-ocean-dark text-lg">{spot.full_name}</h3>
                    <div className="flex space-x-1">
                      {spot.big_wave && <Badge className="bg-red-500 text-xs">Big Wave</Badge>}
                      {spot.longboard_friendly && <Badge className="bg-purple-500 text-xs">Longboard</Badge>}
                      {spot.kite_surfing && <Badge className="bg-green-500 text-xs">Kite</Badge>}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{spot.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    <div className="text-sm">
                      <span className="text-gray-500">Location:</span>
                      <span className="ml-1 font-medium">{spot.region}, {spot.country}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Difficulty:</span>
                      <span className="ml-1 font-medium">{spot.difficulty}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Break:</span>
                      <span className="ml-1 font-medium">{spot.break_type}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Season:</span>
                      <span className="ml-1 font-medium">{spot.best_season}</span>
                    </div>
                  </div>

                  {spot.pro_tip && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-2">
                      <div className="text-xs text-yellow-700 font-medium">Pro Tip:</div>
                      <div className="text-xs text-yellow-800">{spot.pro_tip}</div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <a 
                      href={spot.google_maps_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white text-center py-1 px-3 rounded text-sm hover:bg-blue-600"
                    >
                      View on Maps
                    </a>
                    {spot.live_cam && (
                      <a 
                        href={spot.live_cam} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white text-center py-1 px-3 rounded text-sm hover:bg-green-600"
                      >
                        Live Cam
                      </a>
                    )}
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
      )}
    </div>
  );
};

export default BasicMapView;
