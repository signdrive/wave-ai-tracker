
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

// Simplified marker icons based on difficulty
const createSurfSpotIcon = (spot: EnhancedSurfSpot) => {
  let color = '#0EA5E9'; // Default blue
  
  if (spot.difficulty === 'Beginner') color = '#10B981'; // Green
  else if (spot.difficulty === 'Intermediate') color = '#F59E0B'; // Orange
  else if (spot.difficulty === 'Advanced') color = '#EF4444'; // Red
  else if (spot.difficulty === 'Expert') color = '#7C2D12'; // Dark red

  // Use a simple colored circle instead of complex SVG
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>
  `;

  return L.divIcon({
    html: iconHtml,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
    className: 'custom-surf-marker'
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
              <div style={{ width: '320px', maxWidth: '100%' }}>
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '18px', color: '#1e40af', marginBottom: '4px' }}>
                    {spot.full_name}
                  </h3>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                    {spot.region}, {spot.country}
                  </div>
                  <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
                    {spot.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ backgroundColor: '#eff6ff', padding: '8px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Break Type</div>
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>{spot.break_type}</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#f9fafb', padding: '8px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Wave Height</div>
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>{spot.wave_height_range}</p>
                  </div>

                  <div style={{ backgroundColor: '#eff6ff', padding: '8px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Best Season</div>
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>{spot.best_season}</p>
                  </div>

                  <div style={{ backgroundColor: '#f9fafb', padding: '8px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Difficulty</div>
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>{spot.difficulty}</p>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#6b7280' }}>Water Temp:</span>
                    <span style={{ fontWeight: '500' }}>{spot.water_temp_range}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#6b7280' }}>Best Tide:</span>
                    <span style={{ fontWeight: '500' }}>{spot.best_tide}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#6b7280' }}>Ideal Swell:</span>
                    <span style={{ fontWeight: '500' }}>{spot.ideal_swell_direction}</span>
                  </div>
                </div>

                {spot.pro_tip && (
                  <div style={{ backgroundColor: '#fefce8', padding: '8px', borderRadius: '6px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#a16207', fontWeight: '500', marginBottom: '4px' }}>Pro Tip</div>
                    <p style={{ fontSize: '12px', color: '#92400e' }}>{spot.pro_tip}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a 
                    href={spot.google_maps_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      flex: 1, 
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      textAlign: 'center', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      textDecoration: 'none'
                    }}
                  >
                    Maps
                  </a>
                  {spot.live_cam && (
                    <a 
                      href={spot.live_cam} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        flex: 1, 
                        backgroundColor: '#10b981', 
                        color: 'white', 
                        textAlign: 'center', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        textDecoration: 'none'
                      }}
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
