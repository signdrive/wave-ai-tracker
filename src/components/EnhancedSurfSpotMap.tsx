
import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EnhancedSurfSpot } from '@/types/enhancedSurfSpots';

// Fix for default markers in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons based on difficulty and wave type
const createSurfSpotIcon = (spot: EnhancedSurfSpot) => {
  let color = '#0EA5E9'; // Default blue
  
  if (spot.difficulty === 'Beginner') color = '#10B981'; // Green
  else if (spot.difficulty === 'Intermediate') color = '#F59E0B'; // Orange
  else if (spot.difficulty === 'Advanced') color = '#EF4444'; // Red
  else if (spot.difficulty === 'Expert') color = '#7C2D12'; // Dark red

  // Create a simple colored marker
  const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41" fill="none">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="${color}"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      ${spot.big_wave ? '<circle cx="12.5" cy="12.5" r="3" fill="#DC2626"/>' : ''}
      ${spot.kite_surfing ? '<circle cx="12.5" cy="8" r="2" fill="#059669"/>' : ''}
      ${spot.longboard_friendly ? '<circle cx="12.5" cy="17" r="2" fill="#7C3AED"/>' : ''}
    </svg>
  `;

  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(iconSvg),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
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
  const [mapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom] = useState(2);

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
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
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
              <div className="w-80 max-w-sm">
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-blue-800">{spot.full_name}</h3>
                  <div className="text-sm text-gray-600 mb-2">
                    {spot.region}, {spot.country}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{spot.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-blue-50 p-2 rounded-md">
                    <div className="text-xs text-gray-600 mb-1">Break Type</div>
                    <p className="text-sm font-medium">{spot.break_type}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="text-xs text-gray-600 mb-1">Wave Height</div>
                    <p className="text-sm font-medium">{spot.wave_height_range}</p>
                  </div>

                  <div className="bg-blue-50 p-2 rounded-md">
                    <div className="text-xs text-gray-600 mb-1">Best Season</div>
                    <p className="text-sm font-medium">{spot.best_season}</p>
                  </div>

                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="text-xs text-gray-600 mb-1">Difficulty</div>
                    <p className="text-sm font-medium">{spot.difficulty}</p>
                  </div>
                </div>

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

                {spot.pro_tip && (
                  <div className="bg-yellow-50 p-2 rounded-md mb-3">
                    <div className="text-xs text-yellow-700 font-medium mb-1">Pro Tip</div>
                    <p className="text-xs text-yellow-800">{spot.pro_tip}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <a 
                    href={spot.google_maps_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-500 text-white text-center py-1 px-2 rounded text-xs hover:bg-blue-600"
                  >
                    Maps
                  </a>
                  {spot.live_cam && (
                    <a 
                      href={spot.live_cam} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-500 text-white text-center py-1 px-2 rounded text-xs hover:bg-green-600"
                    >
                      Live Cam
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md">
        {filteredSpots.length} spots shown
      </div>
    </div>
  );
};

export default EnhancedSurfSpotMap;
