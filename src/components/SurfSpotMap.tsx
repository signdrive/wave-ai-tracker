
import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SurfSpot } from '@/types/surfSpots';
import SurfSpotPopup from './SurfSpotPopup';
import { useSurfSpots } from '@/hooks/useSurfSpots';

// Custom surf spot marker icons with dynamic colors based on conditions
const createSurfSpotIcon = (difficulty: string, hasLiveCam: boolean) => {
  let color = '#0EA5E9'; // Default blue
  
  if (difficulty.toLowerCase().includes('beginner')) color = '#10B981'; // Green
  else if (difficulty.toLowerCase().includes('intermediate')) color = '#F59E0B'; // Orange
  else if (difficulty.toLowerCase().includes('advanced') || difficulty.toLowerCase().includes('expert')) color = '#EF4444'; // Red

  const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 17h5l-1.5-1.5L17 17z"/>
      <path d="M2 17h14l-3-3H2v6z"/>
      <path d="M6 10a4 4 0 1 1 8 0"/>
      ${hasLiveCam ? '<circle cx="20" cy="6" r="2" fill="#10B981"/>' : ''}
    </svg>
  `;

  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(iconSvg),
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

interface SurfSpotMapProps {
  selectedSpot?: string;
  onSpotSelect?: (spotId: string) => void;
  filters?: {
    difficulty?: string;
    waveType?: string;
    country?: string;
  };
}

const SurfSpotMap: React.FC<SurfSpotMapProps> = ({ 
  selectedSpot, 
  onSpotSelect,
  filters = {}
}) => {
  const { surfSpots, isLoading } = useSurfSpots();
  const [selectedSpotData, setSelectedSpotData] = useState<SurfSpot | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  // Filter spots based on current filters
  const filteredSpots = useMemo(() => {
    return surfSpots.filter(spot => {
      if (filters.difficulty && filters.difficulty !== 'all') {
        if (!spot.difficulty.toLowerCase().includes(filters.difficulty)) return false;
      }
      if (filters.waveType && filters.waveType !== 'all') {
        if (!spot.wave_type.toLowerCase().includes(filters.waveType)) return false;
      }
      if (filters.country && filters.country !== 'all') {
        if (spot.country !== filters.country) return false;
      }
      return true;
    });
  }, [surfSpots, filters]);

  // Update map when selected spot changes
  useEffect(() => {
    if (selectedSpot && filteredSpots.length > 0) {
      const spot = filteredSpots.find(s => s.id === selectedSpot);
      if (spot) {
        setMapCenter([spot.lat, spot.lon]);
        setMapZoom(10);
        setSelectedSpotData(spot);
      }
    }
  }, [selectedSpot, filteredSpots]);

  const handleMarkerClick = (spot: SurfSpot) => {
    console.log('Marker clicked for spot:', spot.name);
    setSelectedSpotData(spot);
    setMapCenter([spot.lat, spot.lon]);
    setMapZoom(10);
    onSpotSelect?.(spot.id);
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean mx-auto mb-2"></div>
          <p className="text-gray-600">Loading {surfSpots.length} surf spots...</p>
        </div>
      </div>
    );
  }

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
            icon={createSurfSpotIcon(spot.difficulty, !!spot.live_cam)}
            eventHandlers={{
              click: () => handleMarkerClick(spot),
            }}
          >
            <Popup maxWidth={400} minWidth={300} closeButton={true}>
              <SurfSpotPopup spot={spot} />
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

export default SurfSpotMap;
