
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

interface DatabaseSurfSpot {
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

interface DatabaseSurfSpotMapProps {
  spots: DatabaseSurfSpot[];
  isLoading: boolean;
}

const DatabaseSurfSpotMap: React.FC<DatabaseSurfSpotMapProps> = ({ 
  spots,
  isLoading
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map centered on California (where most spots are)
    const map = L.map(mapRef.current).setView([34.0522, -118.2437], 6);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || isLoading) return;

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current!.removeLayer(layer);
      }
    });

    console.log(`Adding ${spots.length} markers to map from database`);

    // Add markers for all spots
    spots.forEach((spot) => {
      if (!spot.lat || !spot.lon) {
        console.warn(`Skipping spot ${spot.full_name} - missing coordinates`);
        return;
      }

      const marker = L.marker([spot.lat, spot.lon]).addTo(mapInstanceRef.current!);
      
      // Create HTML content for popup
      const popupContent = `
        <div style="max-width: 300px;">
          <h3 style="font-weight: bold; font-size: 18px; color: #1e40af; margin-bottom: 8px;">
            ${spot.full_name}
          </h3>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
            ${spot.state}, ${spot.country}
          </p>
          <p style="font-size: 12px; color: #10b981; margin-bottom: 8px;">
            🗄️ Database ID: ${spot.id}
          </p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; font-size: 14px;">
            <div>
              <span style="font-weight: 500;">Difficulty:</span> ${spot.difficulty}
            </div>
            <div>
              <span style="font-weight: 500;">Break:</span> ${spot.wave_type}
            </div>
            <div>
              <span style="font-weight: 500;">Best Swell:</span> ${spot.best_swell_direction}
            </div>
            <div>
              <span style="font-weight: 500;">Best Tide:</span> ${spot.best_tide}
            </div>
            <div>
              <span style="font-weight: 500;">Best Wind:</span> ${spot.best_wind}
            </div>
            <div>
              <span style="font-weight: 500;">Crowd:</span> ${spot.crowd_factor}
            </div>
          </div>

          <div style="background-color: #f0f9ff; padding: 8px; border-radius: 4px; margin-bottom: 8px;">
            <div style="font-size: 12px; font-weight: 500; color: #0369a1;">Real Database Data:</div>
            <div style="font-size: 11px; color: #0284c7;">Lat: ${spot.lat.toFixed(6)}, Lon: ${spot.lon.toFixed(6)}</div>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent, { maxWidth: 300 });
    });

    // Auto-fit map to show all markers if we have spots
    if (spots.length > 0) {
      const group = L.featureGroup(
        spots
          .filter(spot => spot.lat && spot.lon)
          .map(spot => L.marker([spot.lat, spot.lon]))
      );
      
      if (group.getBounds().isValid()) {
        mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
      }
    }

  }, [spots, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean mx-auto mb-2"></div>
          <p className="text-gray-600">Loading surf spots from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[400px]"
      />
      
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md">
        🗄️ {spots.length} database spots
      </div>

      <div className="absolute bottom-2 left-2 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white shadow-md">
        ✅ Live Supabase Data
      </div>
    </div>
  );
};

export default DatabaseSurfSpotMap;
