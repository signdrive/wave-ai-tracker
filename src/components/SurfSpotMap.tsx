
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SurfSpot } from '@/types/surfSpots';
import SurfSpotPopup from './SurfSpotPopup';
import MapControls from './MapControls';
import { useSurfSpots } from '@/hooks/useSurfSpots';

// Custom surf spot marker icon
const surfSpotIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 17h5l-1.5-1.5L17 17z"/>
      <path d="M2 17h14l-3-3H2v6z"/>
      <path d="M6 10a4 4 0 1 1 8 0"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

interface SurfSpotMapProps {
  selectedSpot?: string;
  onSpotSelect?: (spotId: string) => void;
}

const SurfSpotMap: React.FC<SurfSpotMapProps> = ({ selectedSpot, onSpotSelect }) => {
  const { surfSpots, isLoading } = useSurfSpots();
  const [selectedSpotData, setSelectedSpotData] = useState<SurfSpot | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  // Update map when selected spot changes
  useEffect(() => {
    if (selectedSpot && surfSpots.length > 0) {
      const spot = surfSpots.find(s => s.id === selectedSpot);
      if (spot) {
        setMapCenter([spot.lat, spot.lon]);
        setMapZoom(10);
        setSelectedSpotData(spot);
      }
    }
  }, [selectedSpot, surfSpots]);

  const handleMarkerClick = (spot: SurfSpot) => {
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
          <p className="text-gray-600">Loading surf spots...</p>
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
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapControls />
        
        <MarkerClusterGroup>
          {surfSpots.map((spot) => (
            <Marker
              key={spot.id}
              position={[spot.lat, spot.lon]}
              icon={surfSpotIcon}
              eventHandlers={{
                click: () => handleMarkerClick(spot),
              }}
            >
              <Popup maxWidth={400} minWidth={300}>
                <SurfSpotPopup spot={spot} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default SurfSpotMap;
