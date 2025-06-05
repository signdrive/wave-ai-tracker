
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Globe, Waves } from 'lucide-react';

interface GlobalRegion {
  id: string;
  name: string;
  emoji: string;
  countries: string[];
  popularSpots: Array<{
    name: string;
    country: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    currentConditions?: {
      waveHeight: number;
      quality: number;
    };
  }>;
}

const globalRegions: GlobalRegion[] = [
  {
    id: 'pacific-rim',
    name: 'Pacific Rim',
    emoji: '🌏',
    countries: ['Australia', 'New Zealand', 'Indonesia', 'Japan', 'Philippines'],
    popularSpots: [
      { name: 'Gold Coast', country: 'Australia', difficulty: 'Intermediate' },
      { name: 'Uluwatu', country: 'Indonesia', difficulty: 'Advanced' },
      { name: 'Tavarua', country: 'Fiji', difficulty: 'Expert' },
      { name: 'Raglan', country: 'New Zealand', difficulty: 'Intermediate' }
    ]
  },
  {
    id: 'atlantic',
    name: 'Atlantic',
    emoji: '🌊',
    countries: ['Portugal', 'Spain', 'France', 'Brazil', 'USA East Coast'],
    popularSpots: [
      { name: 'Ericeira', country: 'Portugal', difficulty: 'Intermediate' },
      { name: 'Hossegor', country: 'France', difficulty: 'Advanced' },
      { name: 'Florianópolis', country: 'Brazil', difficulty: 'Intermediate' },
      { name: 'Outer Banks', country: 'USA', difficulty: 'Advanced' }
    ]
  },
  {
    id: 'indian-ocean',
    name: 'Indian Ocean',
    emoji: '🏝️',
    countries: ['Maldives', 'Sri Lanka', 'South Africa', 'Mauritius'],
    popularSpots: [
      { name: 'Chickens', country: 'Maldives', difficulty: 'Advanced' },
      { name: 'Arugam Bay', country: 'Sri Lanka', difficulty: 'Intermediate' },
      { name: 'Jeffreys Bay', country: 'South Africa', difficulty: 'Advanced' },
      { name: 'Tamarin Bay', country: 'Mauritius', difficulty: 'Intermediate' }
    ]
  },
  {
    id: 'wave-pools',
    name: 'Wave Pools',
    emoji: '🏊‍♂️',
    countries: ['Global'],
    popularSpots: [
      { name: 'Surf Ranch', country: 'USA', difficulty: 'Advanced' },
      { name: 'The Cove', country: 'Australia', difficulty: 'Beginner' },
      { name: 'Wavegarden', country: 'Spain', difficulty: 'Intermediate' },
      { name: 'BSR Cable Park', country: 'USA', difficulty: 'Beginner' }
    ]
  }
];

interface GlobalLocationPickerProps {
  onLocationSelect: (location: { name: string; country: string; region: string }) => void;
  selectedLocation?: string;
}

const GlobalLocationPicker: React.FC<GlobalLocationPickerProps> = ({ 
  onLocationSelect, 
  selectedLocation 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    // Get user's current location for regional suggestions
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Location access denied:', error);
        }
      );
    }
  }, []);

  const filteredRegions = globalRegions.filter(region => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      region.name.toLowerCase().includes(searchLower) ||
      region.countries.some(country => country.toLowerCase().includes(searchLower)) ||
      region.popularSpots.some(spot => 
        spot.name.toLowerCase().includes(searchLower) ||
        spot.country.toLowerCase().includes(searchLower)
      )
    );
  });

  const handleSpotSelect = (spot: any, region: GlobalRegion) => {
    onLocationSelect({
      name: spot.name,
      country: spot.country,
      region: region.name
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search spots, countries, or regions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* User Location Detection */}
      {userLocation && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Detected location: {userLocation.lat.toFixed(2)}, {userLocation.lon.toFixed(2)}
              </span>
              <Button size="sm" variant="outline">
                Find Nearby Spots
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regional Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedRegion === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedRegion(null)}
          className="flex items-center space-x-1"
        >
          <Globe className="h-4 w-4" />
          <span>All Regions</span>
        </Button>
        {globalRegions.map((region) => (
          <Button
            key={region.id}
            variant={selectedRegion === region.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRegion(region.id)}
            className="flex items-center space-x-1"
          >
            <span>{region.emoji}</span>
            <span>{region.name}</span>
          </Button>
        ))}
      </div>

      {/* Regions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRegions
          .filter(region => !selectedRegion || region.id === selectedRegion)
          .map((region) => (
          <Card key={region.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">{region.emoji}</span>
                <span>{region.name}</span>
                <Badge variant="outline">
                  {region.popularSpots.length} spots
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Countries */}
              <div className="flex flex-wrap gap-1">
                {region.countries.map((country) => (
                  <Badge key={country} variant="secondary" className="text-xs">
                    {country}
                  </Badge>
                ))}
              </div>

              {/* Popular Spots */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Popular Spots:</h4>
                {region.popularSpots.map((spot) => (
                  <div
                    key={`${spot.name}-${spot.country}`}
                    className={`p-2 rounded border cursor-pointer transition-colors ${
                      selectedLocation === spot.name 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSpotSelect(spot, region)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-sm">{spot.name}</span>
                        <span className="text-xs text-gray-500 ml-2">{spot.country}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={
                            spot.difficulty === 'Beginner' ? 'default' :
                            spot.difficulty === 'Intermediate' ? 'secondary' :
                            spot.difficulty === 'Advanced' ? 'destructive' : 'outline'
                          }
                          className="text-xs"
                        >
                          {spot.difficulty}
                        </Badge>
                        {spot.currentConditions && (
                          <div className="flex items-center text-xs text-blue-600">
                            <Waves className="h-3 w-3 mr-1" />
                            {spot.currentConditions.waveHeight}ft
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GlobalLocationPicker;
