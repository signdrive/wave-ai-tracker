
import React, { useState } from 'react';
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

  // Simple filtering
  const filteredSpots = spots.filter(spot => {
    if (filters.difficulty && filters.difficulty !== 'all' && spot.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.country && filters.country !== 'all' && spot.country !== filters.country) {
      return false;
    }
    if (filters.big_wave && !spot.big_wave) {
      return false;
    }
    if (filters.longboard_friendly && !spot.longboard_friendly) {
      return false;
    }
    if (filters.kite_surfing && !spot.kite_surfing) {
      return false;
    }
    return true;
  });

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {filteredSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lon]}
          >
            <Popup>
              <div className="w-80">
                <h3 className="font-bold text-lg text-blue-800 mb-2">
                  {spot.full_name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {spot.region}, {spot.country}
                </p>
                <p className="text-sm mb-3">
                  {spot.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <span className="font-medium">Difficulty:</span> {spot.difficulty}
                  </div>
                  <div>
                    <span className="font-medium">Break:</span> {spot.break_type}
                  </div>
                  <div>
                    <span className="font-medium">Season:</span> {spot.best_season}
                  </div>
                  <div>
                    <span className="font-medium">Waves:</span> {spot.wave_height_range}
                  </div>
                </div>

                {spot.pro_tip && (
                  <div className="bg-yellow-50 p-2 rounded mb-3">
                    <div className="text-xs font-medium text-yellow-700">Pro Tip:</div>
                    <div className="text-xs text-yellow-800">{spot.pro_tip}</div>
                  </div>
                )}

                <div className="flex gap-2">
                  <a 
                    href={spot.google_maps_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-500 text-white text-center py-1 px-2 rounded text-sm hover:bg-blue-600"
                  >
                    Maps
                  </a>
                  {spot.live_cam && (
                    <a 
                      href={spot.live_cam} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-500 text-white text-center py-1 px-2 rounded text-sm hover:bg-green-600"
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
