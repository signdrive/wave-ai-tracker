
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Waves, Wind, Clock, Users, AlertTriangle, Car, Thermometer } from 'lucide-react';

interface SurfSpot {
  id: string;
  full_name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
  difficulty: string;
  wave_type: string;
  best_swell_direction: string;
  best_wind: string;
  best_tide: string;
  crowd_factor: string;
}

interface RawSurfSpot {
  name: string;
  region: string;
  country: string;
  state: string;
  difficulty: string;
  description: string;
  break_type: string;
  wave_direction: string;
  wave_height_range: string;
  bottom_type: string;
  ideal_swell_direction: string;
  best_season: string;
  best_tide: string;
  wind_direction: string;
  crowd_levels: string;
  parking: string;
  water_temp_range: string;
  'amenities/0'?: string;
  'amenities/1'?: string;
  'amenities/2'?: string;
  'amenities/3'?: string;
  'amenities/4'?: string;
  'hazards/0'?: string;
  'hazards/1'?: string;
  'hazards/2'?: string;
  'hazards/3'?: string;
  'hazards/4'?: string;
  'hazards/5'?: string;
}

interface SurfSpotInfoPanelProps {
  selectedSpot: SurfSpot | null;
  rawSpotData: RawSurfSpot | null;
}

const SurfSpotInfoPanel: React.FC<SurfSpotInfoPanelProps> = ({ 
  selectedSpot, 
  rawSpotData 
}) => {
  if (!selectedSpot) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Select a surf spot to see details</p>
            <p className="text-sm">Click on any marker on the map or search for a specific spot</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Collect amenities from the raw data
  const amenities = rawSpotData ? [
    rawSpotData['amenities/0'],
    rawSpotData['amenities/1'],
    rawSpotData['amenities/2'],
    rawSpotData['amenities/3'],
    rawSpotData['amenities/4']
  ].filter(Boolean) : [];

  // Collect hazards from the raw data
  const hazards = rawSpotData ? [
    rawSpotData['hazards/0'],
    rawSpotData['hazards/1'],
    rawSpotData['hazards/2'],
    rawSpotData['hazards/3'],
    rawSpotData['hazards/4'],
    rawSpotData['hazards/5']
  ].filter(Boolean) : [];

  const getDifficultyColor = (difficulty: string) => {
    const lower = difficulty.toLowerCase();
    if (lower.includes('beginner')) return 'bg-green-100 text-green-800';
    if (lower.includes('intermediate')) return 'bg-yellow-100 text-yellow-800';
    if (lower.includes('advanced') || lower.includes('expert')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-ocean-dark">{selectedSpot.full_name}</CardTitle>
          <Badge className={getDifficultyColor(selectedSpot.difficulty)}>
            {selectedSpot.difficulty}
          </Badge>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{rawSpotData?.region || selectedSpot.state}, {selectedSpot.country}</span>
          <span className="ml-4 text-sm">
            {selectedSpot.lat.toFixed(4)}, {selectedSpot.lon.toFixed(4)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description */}
        {rawSpotData?.description && (
          <div>
            <p className="text-gray-700">{rawSpotData.description}</p>
          </div>
        )}

        {/* Wave Characteristics */}
        <div>
          <h3 className="text-lg font-semibold text-ocean-dark mb-3 flex items-center">
            <Waves className="w-5 h-5 mr-2" />
            Wave Characteristics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Break Type</span>
              <p className="text-sm">{rawSpotData?.break_type || selectedSpot.wave_type}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Wave Direction</span>
              <p className="text-sm">{rawSpotData?.wave_direction || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Wave Height</span>
              <p className="text-sm">{rawSpotData?.wave_height_range || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Bottom Type</span>
              <p className="text-sm">{rawSpotData?.bottom_type || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div>
          <h3 className="text-lg font-semibold text-ocean-dark mb-3 flex items-center">
            <Wind className="w-5 h-5 mr-2" />
            Surf Conditions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Best Season</span>
              <p className="text-sm">{rawSpotData?.best_season || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Best Tide</span>
              <p className="text-sm">{rawSpotData?.best_tide || selectedSpot.best_tide}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Wind Direction</span>
              <p className="text-sm">{rawSpotData?.wind_direction || selectedSpot.best_wind}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Ideal Swell</span>
              <p className="text-sm">{rawSpotData?.ideal_swell_direction || selectedSpot.best_swell_direction}</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Crowd & Parking */}
          <div>
            <h4 className="font-semibold text-ocean-dark mb-2 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Crowd & Access
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500">Crowd Level</span>
                <p className="text-sm">{rawSpotData?.crowd_levels || selectedSpot.crowd_factor}</p>
              </div>
              {rawSpotData?.parking && (
                <div>
                  <span className="text-sm font-medium text-gray-500 flex items-center">
                    <Car className="w-3 h-3 mr-1" />
                    Parking
                  </span>
                  <p className="text-sm">{rawSpotData.parking}</p>
                </div>
              )}
              {rawSpotData?.water_temp_range && (
                <div>
                  <span className="text-sm font-medium text-gray-500 flex items-center">
                    <Thermometer className="w-3 h-3 mr-1" />
                    Water Temp
                  </span>
                  <p className="text-sm">{rawSpotData.water_temp_range}</p>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div>
              <h4 className="font-semibold text-ocean-dark mb-2">Amenities</h4>
              <div className="space-y-1">
                {amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Hazards */}
          {hazards.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-600 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Hazards
              </h4>
              <div className="space-y-1">
                {hazards.map((hazard, index) => (
                  <Badge key={index} variant="outline" className="text-xs mr-1 mb-1 border-red-200 text-red-700">
                    {hazard}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SurfSpotInfoPanel;
