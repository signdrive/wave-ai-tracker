
import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EnhancedSurfSpot } from '@/types/enhancedSurfSpots';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Waves, Wind, Thermometer, AlertTriangle } from 'lucide-react';

// Custom marker icons based on difficulty and wave type
const createSurfSpotIcon = (spot: EnhancedSurfSpot) => {
  let color = '#0EA5E9'; // Default blue
  
  if (spot.difficulty === 'Beginner') color = '#10B981'; // Green
  else if (spot.difficulty === 'Intermediate') color = '#F59E0B'; // Orange
  else if (spot.difficulty === 'Advanced') color = '#EF4444'; // Red
  else if (spot.difficulty === 'Expert') color = '#7C2D12'; // Dark red

  // Add special indicators
  const indicators = [];
  if (spot.big_wave) indicators.push('<circle cx="6" cy="6" r="2" fill="#DC2626"/>');
  if (spot.kite_surfing) indicators.push('<circle cx="18" cy="6" r="2" fill="#059669"/>');
  if (spot.longboard_friendly) indicators.push('<circle cx="12" cy="18" r="2" fill="#7C3AED"/>');

  const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 17h5l-1.5-1.5L17 17z"/>
      <path d="M2 17h14l-3-3H2v6z"/>
      <path d="M6 10a4 4 0 1 1 8 0"/>
      ${indicators.join('')}
    </svg>
  `;

  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(iconSvg),
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

interface DetailedSurfSpotPopupProps {
  spot: EnhancedSurfSpot;
}

const DetailedSurfSpotPopup: React.FC<DetailedSurfSpotPopupProps> = ({ spot }) => {
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Beginner': 'bg-green-500',
      'Intermediate': 'bg-yellow-500',
      'Advanced': 'bg-red-500',
      'Expert': 'bg-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500';
  };

  const getCrowdColor = (crowd: string) => {
    const colors = {
      'Low': 'bg-green-500',
      'Moderate': 'bg-yellow-500',
      'Heavy': 'bg-orange-500',
      'Extreme': 'bg-red-500'
    };
    return colors[crowd as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="w-80 max-w-sm">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-ocean-dark">{spot.full_name}</h3>
          <div className="flex flex-col space-y-1">
            <Badge className={`${getDifficultyColor(spot.difficulty)} text-white text-xs`}>
              {spot.difficulty}
            </Badge>
            {spot.secret && (
              <Badge variant="secondary" className="text-xs">
                Secret Spot
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {spot.region}, {spot.country}
        </div>

        <p className="text-sm text-gray-700 mb-2">{spot.description}</p>
      </div>

      {/* Wave Info Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-ocean/5 p-2 rounded-md">
          <div className="text-xs text-gray-600 mb-1">Break Type</div>
          <p className="text-sm font-medium">{spot.break_type}</p>
        </div>
        
        <div className="bg-sand/50 p-2 rounded-md">
          <div className="text-xs text-gray-600 mb-1">Wave Height</div>
          <p className="text-sm font-medium">{spot.wave_height_range}</p>
        </div>

        <div className="bg-blue/5 p-2 rounded-md">
          <div className="text-xs text-gray-600 mb-1">Best Season</div>
          <p className="text-sm font-medium">{spot.best_season}</p>
        </div>

        <div className="bg-purple/5 p-2 rounded-md">
          <div className="text-xs text-gray-600 mb-1">Crowd Level</div>
          <Badge className={`${getCrowdColor(spot.crowd_levels)} text-white text-xs`}>
            {spot.crowd_levels}
          </Badge>
        </div>
      </div>

      {/* Special Features */}
      <div className="flex flex-wrap gap-1 mb-3">
        {spot.big_wave && (
          <Badge variant="destructive" className="text-xs">
            Big Wave
          </Badge>
        )}
        {spot.longboard_friendly && (
          <Badge className="bg-purple-500 text-xs">
            Longboard
          </Badge>
        )}
        {spot.kite_surfing && (
          <Badge className="bg-green-500 text-xs">
            Kite Surf
          </Badge>
        )}
      </div>

      {/* Conditions */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Water Temp:</span>
          <span className="font-medium">{spot.water_temp_range}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Best Tide:</span>
          <span className="font-medium">{spot.best_tide}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Ideal Swell:</span>
          <span className="font-medium">{spot.ideal_swell_direction}</span>
        </div>
      </div>

      {/* Hazards */}
      {spot.hazards.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center text-xs text-red-600 mb-1">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Hazards
          </div>
          <div className="flex flex-wrap gap-1">
            {spot.hazards.slice(0, 3).map((hazard, index) => (
              <Badge key={index} variant="outline" className="text-xs text-red-600 border-red-200">
                {hazard}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Pro Tip */}
      {spot.pro_tip && (
        <div className="bg-yellow-50 p-2 rounded-md mb-3">
          <div className="text-xs text-yellow-700 font-medium mb-1">Pro Tip</div>
          <p className="text-xs text-yellow-800">{spot.pro_tip}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button size="sm" variant="outline" className="flex-1" asChild>
          <a href={spot.google_maps_link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3 h-3 mr-1" />
            Maps
          </a>
        </Button>
        {spot.live_cam && (
          <Button size="sm" className="flex-1">
            Live Cam
          </Button>
        )}
      </div>
    </div>
  );
};

interface EnhancedSurfSpotMapProps {
  spots: EnhancedSurfSpot[];
  filters?: {
    difficulty?: string;
    break_type?: string;
    country?: string;
    big_wave?: boolean;
    longboard_friendly?: boolean;
    kite_surfing?: boolean;
  };
}

const EnhancedSurfSpotMap: React.FC<EnhancedSurfSpotMapProps> = ({ 
  spots,
  filters = {}
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  // Filter spots based on current filters
  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      if (filters.difficulty && filters.difficulty !== 'all') {
        if (spot.difficulty !== filters.difficulty) return false;
      }
      if (filters.break_type && filters.break_type !== 'all') {
        const hasBreakType = 
          (filters.break_type === 'point' && spot.point_break) ||
          (filters.break_type === 'reef' && spot.reef_break) ||
          (filters.break_type === 'beach' && spot.beach_break);
        if (!hasBreakType) return false;
      }
      if (filters.country && filters.country !== 'all') {
        if (spot.country !== filters.country) return false;
      }
      if (filters.big_wave && !spot.big_wave) return false;
      if (filters.longboard_friendly && !spot.longboard_friendly) return false;
      if (filters.kite_surfing && !spot.kite_surfing) return false;
      
      return true;
    });
  }, [spots, filters]);

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full"
        zoomControl={true}
        maxZoom={18}
        minZoom={2}
        worldCopyJump={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />
        
        {filteredSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lon]}
            icon={createSurfSpotIcon(spot)}
          >
            <Popup maxWidth={350} minWidth={320} closeButton={true}>
              <DetailedSurfSpotPopup spot={spot} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Spot counter overlay */}
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md">
        {filteredSpots.length} spots shown
      </div>
    </div>
  );
};

export default EnhancedSurfSpotMap;
