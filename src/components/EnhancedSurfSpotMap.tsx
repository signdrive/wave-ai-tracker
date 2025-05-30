
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EnhancedSurfSpot } from '@/types/enhancedSurfSpots';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

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
            <Popup maxWidth={300}>
              <div>
                <h3 style={{ fontWeight: 'bold', fontSize: '18px', color: '#1e40af', marginBottom: '8px' }}>
                  {spot.full_name}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                  {spot.region}, {spot.country}
                </p>
                <p style={{ fontSize: '14px', marginBottom: '12px' }}>
                  {spot.description}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '14px' }}>
                  <div>
                    <span style={{ fontWeight: '500' }}>Difficulty:</span> {spot.difficulty}
                  </div>
                  <div>
                    <span style={{ fontWeight: '500' }}>Break:</span> {spot.break_type}
                  </div>
                  <div>
                    <span style={{ fontWeight: '500' }}>Season:</span> {spot.best_season}
                  </div>
                  <div>
                    <span style={{ fontWeight: '500' }}>Waves:</span> {spot.wave_height_range}
                  </div>
                </div>

                {spot.pro_tip && (
                  <div style={{ backgroundColor: '#fefce8', padding: '8px', borderRadius: '4px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '500', color: '#b45309' }}>Pro Tip:</div>
                    <div style={{ fontSize: '12px', color: '#92400e' }}>{spot.pro_tip}</div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a 
                    href={spot.google_maps_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      flex: '1', 
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      textAlign: 'center', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '14px', 
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
                        flex: '1', 
                        backgroundColor: '#10b981', 
                        color: 'white', 
                        textAlign: 'center', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '14px', 
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
      
      <div style={{ 
        position: 'absolute', 
        top: '8px', 
        right: '8px', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(4px)', 
        padding: '4px 12px', 
        borderRadius: '9999px', 
        fontSize: '14px', 
        fontWeight: '500', 
        color: '#374151', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
      }}>
        {filteredSpots.length} spots shown
      </div>
    </div>
  );
};

export default EnhancedSurfSpotMap;
