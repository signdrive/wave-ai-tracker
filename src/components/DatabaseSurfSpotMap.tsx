
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

// Create custom highlighted marker icon
const highlightedIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  iconSize: [30, 46],
  iconAnchor: [15, 46],
  popupAnchor: [1, -34],
  shadowSize: [46, 46]
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
  onSpotClick?: (spotId: string) => void;
  selectedSpotId?: string;
}

const DatabaseSurfSpotMap: React.FC<DatabaseSurfSpotMapProps> = ({ 
  spots,
  isLoading,
  onSpotClick,
  selectedSpotId
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!mapRef.current) {
      console.log('❌ Map container ref not ready');
      return;
    }

    console.log('🗺️ Initializing map...');

    try {
      // Initialize map centered on California (where most spots are)
      const map = L.map(mapRef.current, {
        center: [34.0522, -118.2437],
        zoom: 6,
        zoomControl: true,
        preferCanvas: false
      });
      
      mapInstanceRef.current = map;
      console.log('✅ Map instance created');

      // Add tile layer with error handling
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 1
      });
      
      tileLayer.addTo(map);
      console.log('🌍 Tile layer added');
      
      // Add event listeners for debugging
      tileLayer.on('loading', () => {
        console.log('🔄 Map tiles loading...');
      });
      
      tileLayer.on('load', () => {
        console.log('✅ Map tiles loaded successfully');
      });

      tileLayer.on('tileerror', (e) => {
        console.error('❌ Tile loading error:', e);
      });

      // Force map to render
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          console.log('🔄 Map size invalidated');
        }
      }, 100);

      console.log('✅ Map initialized successfully');

    } catch (error) {
      console.error('❌ Error initializing map:', error);
    }

    return () => {
      console.log('🧹 Cleaning up map...');
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      console.log('🚫 Map not ready for adding markers');
      return;
    }

    if (isLoading) {
      console.log('⏳ Still loading data, skipping marker update');
      return;
    }

    console.log(`🎯 Processing ${spots.length} spots for map display`);

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current.clear();

    if (spots.length === 0) {
      console.log('❗ No spots to display on map');
      return;
    }

    console.log(`📍 Adding ${spots.length} markers to map`);

    let validSpots = 0;
    const bounds = L.latLngBounds([]);

    // Add markers for all spots
    spots.forEach((spot, index) => {
      console.log(`Processing spot ${index + 1}/${spots.length}: ${spot.full_name} at [${spot.lat}, ${spot.lon}]`);
      
      if (!spot.lat || !spot.lon || isNaN(spot.lat) || isNaN(spot.lon)) {
        console.warn(`❌ Skipping spot ${spot.full_name} - invalid coordinates: lat=${spot.lat}, lon=${spot.lon}`);
        return;
      }

      // Check coordinate bounds
      if (spot.lat < -90 || spot.lat > 90 || spot.lon < -180 || spot.lon > 180) {
        console.warn(`❌ Skipping spot ${spot.full_name} - coordinates out of bounds: lat=${spot.lat}, lon=${spot.lon}`);
        return;
      }

      validSpots++;
      const latLng = L.latLng(spot.lat, spot.lon);
      bounds.extend(latLng);

      try {
        const isSelected = selectedSpotId === spot.id;
        const marker = L.marker(latLng, {
          icon: isSelected ? highlightedIcon : undefined
        });

        if (!mapInstanceRef.current) {
          console.error('❌ Map instance lost while adding markers');
          return;
        }

        marker.addTo(mapInstanceRef.current);
        
        // Store marker reference
        markersRef.current.set(spot.id, marker);

        // Add click handler
        marker.on('click', () => {
          console.log(`🖱️ Marker clicked for spot: ${spot.full_name}`);
          if (onSpotClick) {
            onSpotClick(spot.id);
          }
        });
        
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

            <button 
              onclick="window.parent.postMessage({type: 'selectSpot', spotId: '${spot.id}'}, '*')"
              style="width: 100%; background-color: #3b82f6; color: white; padding: 8px; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; margin-top: 8px;"
            >
              View Details
            </button>
          </div>
        `;
        
        marker.bindPopup(popupContent, { maxWidth: 300 });

        console.log(`✅ Added marker for ${spot.full_name}`);

      } catch (error) {
        console.error(`❌ Error adding marker for ${spot.full_name}:`, error);
      }
    });

    console.log(`✅ Successfully added ${validSpots} valid markers out of ${spots.length} total spots`);

    // Auto-fit map to show all markers if we have valid spots
    if (validSpots > 0 && bounds.isValid() && mapInstanceRef.current) {
      console.log('🔍 Fitting map bounds to show all spots');
      try {
        mapInstanceRef.current.fitBounds(bounds, { 
          padding: [20, 20],
          maxZoom: 10
        });
        console.log('✅ Map bounds fitted successfully');
      } catch (error) {
        console.error('❌ Error fitting bounds:', error);
      }
    } else {
      console.log('❗ No valid spots to fit bounds, keeping default view');
    }

  }, [spots, isLoading, selectedSpotId, onSpotClick]);

  // Handle spot selection from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'selectSpot' && onSpotClick) {
        onSpotClick(event.data.spotId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSpotClick]);

  // Center map on selected spot
  useEffect(() => {
    if (selectedSpotId && mapInstanceRef.current) {
      const selectedSpot = spots.find(spot => spot.id === selectedSpotId);
      if (selectedSpot && selectedSpot.lat && selectedSpot.lon) {
        mapInstanceRef.current.setView([selectedSpot.lat, selectedSpot.lon], 12);
        console.log(`🎯 Centered map on ${selectedSpot.full_name}`);
        
        // Update marker icons
        markersRef.current.forEach((marker, spotId) => {
          const isSelected = spotId === selectedSpotId;
          marker.setIcon(isSelected ? highlightedIcon : new L.Icon.Default());
        });
      }
    }
  }, [selectedSpotId, spots]);

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
        style={{ minHeight: '400px', width: '100%', height: '100%' }}
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
