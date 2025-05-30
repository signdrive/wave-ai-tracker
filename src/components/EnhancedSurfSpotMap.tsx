
import React, { useEffect, useRef } from 'react';
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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([20, 0], 2);
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
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current!.removeLayer(layer);
      }
    });

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

    // Add markers for filtered spots
    filteredSpots.forEach((spot) => {
      const marker = L.marker([spot.lat, spot.lon]).addTo(mapInstanceRef.current!);
      
      // Create HTML content for popup
      const popupContent = `
        <div style="max-width: 300px;">
          <h3 style="font-weight: bold; font-size: 18px; color: #1e40af; margin-bottom: 8px;">
            ${spot.full_name}
          </h3>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
            ${spot.region}, ${spot.country}
          </p>
          <p style="font-size: 14px; margin-bottom: 12px;">
            ${spot.description}
          </p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; font-size: 14px;">
            <div>
              <span style="font-weight: 500;">Difficulty:</span> ${spot.difficulty}
            </div>
            <div>
              <span style="font-weight: 500;">Break:</span> ${spot.break_type}
            </div>
            <div>
              <span style="font-weight: 500;">Season:</span> ${spot.best_season}
            </div>
            <div>
              <span style="font-weight: 500;">Waves:</span> ${spot.wave_height_range}
            </div>
          </div>

          ${spot.pro_tip ? `
            <div style="background-color: #fefce8; padding: 8px; border-radius: 4px; margin-bottom: 12px;">
              <div style="font-size: 12px; font-weight: 500; color: #b45309;">Pro Tip:</div>
              <div style="font-size: 12px; color: #92400e;">${spot.pro_tip}</div>
            </div>
          ` : ''}

          <div style="display: flex; gap: 8px;">
            <a 
              href="${spot.google_maps_link}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="flex: 1; background-color: #3b82f6; color: white; text-align: center; padding: 4px 8px; border-radius: 4px; font-size: 14px; text-decoration: none;"
            >
              Maps
            </a>
            ${spot.live_cam ? `
              <a 
                href="${spot.live_cam}" 
                target="_blank" 
                rel="noopener noreferrer"
                style="flex: 1; background-color: #10b981; color: white; text-align: center; padding: 4px 8px; border-radius: 4px; font-size: 14px; text-decoration: none;"
              >
                Live Cam
              </a>
            ` : ''}
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent, { maxWidth: 300 });
    });

  }, [spots, filters]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[400px]"
      />
      
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md">
        {spots.filter(spot => {
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
        }).length} spots shown
      </div>
    </div>
  );
};

export default EnhancedSurfSpotMap;
