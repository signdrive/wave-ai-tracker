
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../lib/leaflet-fix';
import { useSupabaseSurfSpots } from '@/hooks/useSupabaseSurfSpots';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Waves, Users, MapPin } from 'lucide-react';
import SurfSpotInfoPanel from './SurfSpotInfoPanel';

const testMentors = [
  {
    id: '1',
    name: 'Pipeline Pro',
    lat: 21.6633,
    lng: -158.0667,
    bio: 'Expert at Pipeline, 20+ years experience',
    hourly_rate: 150,
    is_available: true
  },
  {
    id: '2',
    name: 'Malibu Mike',
    lat: 34.0522,
    lng: -118.2437,
    bio: 'Perfect waves instructor in Malibu',
    hourly_rate: 120,
    is_available: false
  },
  {
    id: '3',
    name: 'Santa Cruz Sam',
    lat: 36.9741,
    lng: -122.0308,
    bio: 'Cold water surfing specialist',
    hourly_rate: 100,
    is_available: true
  }
];

export default function DirectMapView() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'spots' | 'mentors' | 'both'>('spots');
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [selectedRawSpot, setSelectedRawSpot] = useState<any>(null);
  
  const { surfSpots, rawSpots, isLoading, error } = useSupabaseSurfSpots();

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    console.log('🗺️ Initializing direct Leaflet map...');

    // Initialize map
    mapRef.current = L.map(containerRef.current, {
      center: [34.0522, -118.2437],
      zoom: 6,
      preferCanvas: true,
      zoomControl: true,
      attributionControl: true
    });

    console.log('✅ Map instance created');

    // Add tiles
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    });

    tileLayer.addTo(mapRef.current);
    console.log('✅ Tiles added');

    return () => {
      if (mapRef.current) {
        console.log('🧹 Cleaning up map...');
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Render Surf Spot Markers
  useEffect(() => {
    if (!mapRef.current || surfSpots.length === 0 || isLoading || (viewMode === 'mentors')) return;

    console.log('🏄 Adding surf spot markers', surfSpots.length);

    const spotLayer = L.layerGroup().addTo(mapRef.current);

    surfSpots.forEach(spot => {
      // Mock swell data for now
      const mockSwell = Math.random() * 6 + 1;
      const color = mockSwell > 3 ? '#10B981' : '#EF4444';
      
      const spotIcon = L.divIcon({
        className: 'surf-spot-marker',
        html: `
          <div style="
            width: 28px; 
            height: 28px; 
            border-radius: 50%; 
            border: 3px solid ${color}; 
            background: white;
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-weight: bold;
            font-size: 11px;
            color: ${color};
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">${mockSwell.toFixed(1)}ft</div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });

      const spotMarker = L.marker([spot.lat, spot.lon], {
        icon: spotIcon
      });

      const spotPopupContent = `
        <div style="font-family: system-ui; padding: 12px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #059669;">🏄 ${spot.full_name}</h3>
          <div style="margin: 8px 0;">
            <div style="margin: 4px 0; color: #374151;">
              <strong>Difficulty:</strong> ${spot.difficulty}
            </div>
            <div style="margin: 4px 0; color: #374151;">
              <strong>Wave Type:</strong> ${spot.wave_type}
            </div>
            <div style="margin: 4px 0; color: #374151;">
              <strong>Best Swell:</strong> ${spot.best_swell_direction}
            </div>
            <div style="margin: 4px 0; color: #374151;">
              <strong>Best Wind:</strong> ${spot.best_wind}
            </div>
          </div>
          <button 
            onclick="window.selectSurfSpot('${spot.id}')"
            style="
              margin-top: 8px;
              width: 100%;
              background: #059669; 
              color: white; 
              border: none; 
              padding: 8px; 
              border-radius: 4px; 
              cursor: pointer; 
              font-size: 14px;
            "
          >
            View Details
          </button>
        </div>
      `;

      spotMarker.bindPopup(spotPopupContent, {
        maxWidth: 250,
        closeButton: true,
        autoPan: true
      });

      spotMarker.addTo(spotLayer);
    });

    return () => {
      spotLayer.remove();
    };
  }, [surfSpots, isLoading, viewMode]);

  // Render Mentor Markers
  useEffect(() => {
    if (!mapRef.current || (viewMode === 'spots')) return;

    console.log('👨‍🏫 Adding mentor markers');

    const mentorLayer = L.layerGroup().addTo(mapRef.current);

    testMentors.forEach((mentor) => {
      const color = mentor.is_available ? '#3B82F6' : '#EF4444';
      
      const customIcon = L.divIcon({
        html: `
          <div style="
            width: 32px; 
            height: 32px; 
            background-color: ${color}; 
            border: 2px solid white; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            color: white;
            font-weight: bold;
          ">${mentor.name.charAt(0)}</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
        className: 'custom-mentor-marker'
      });

      const marker = L.marker([mentor.lat, mentor.lng], {
        icon: customIcon
      }).addTo(mentorLayer);

      const popupContent = `
        <div style="font-family: system-ui; padding: 12px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">👨‍🏫 ${mentor.name}</h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${mentor.bio}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #059669; font-weight: 600;">$${mentor.hourly_rate}/hr</span>
            <span style="
              padding: 4px 8px; 
              border-radius: 4px; 
              font-size: 12px; 
              background: ${mentor.is_available ? '#10B981' : '#EF4444'}; 
              color: white;
            ">
              ${mentor.is_available ? 'Available' : 'Unavailable'}
            </span>
          </div>
          <button 
            onclick="alert('Booking session with ${mentor.name} - $${mentor.hourly_rate}/hr')"
            style="
              margin-top: 8px;
              width: 100%;
              background: ${mentor.is_available ? '#059669' : '#ccc'}; 
              color: white; 
              border: none; 
              padding: 8px; 
              border-radius: 4px; 
              cursor: ${mentor.is_available ? 'pointer' : 'not-allowed'}; 
              font-size: 14px;
            "
            ${!mentor.is_available ? 'disabled' : ''}
          >
            ${mentor.is_available ? 'Book Session' : 'Unavailable'}
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 250,
        closeButton: true,
        autoPan: true
      });
    });

    return () => {
      mentorLayer.remove();
    };
  }, [viewMode]);

  // Global function to handle surf spot selection
  useEffect(() => {
    (window as any).selectSurfSpot = (spotId: string) => {
      const spot = surfSpots.find(s => s.id === spotId);
      const rawSpot = rawSpots.find(r => r.id === parseInt(spotId));
      if (spot) {
        setSelectedSpot(spot);
        setSelectedRawSpot(rawSpot);
      }
    };

    return () => {
      delete (window as any).selectSurfSpot;
    };
  }, [surfSpots, rawSpots]);

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-600">Error loading surf spots: {error.message}</div>
      </div>
    );
  }

  const availableMentors = testMentors.filter(mentor => mentor.is_available).length;

  return (
    <div className="h-full w-full flex flex-col">
      {/* Tabs for switching between views */}
      <div className="bg-white/90 backdrop-blur-sm p-4 border-b">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="spots" className="flex items-center gap-2">
              <Waves className="w-4 h-4" />
              Surf Spots
              <Badge variant="outline" className="ml-1">
                {surfSpots.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="mentors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Mentors
              <Badge variant="outline" className="ml-1">
                {availableMentors}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="both" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Both
              <Badge variant="outline" className="ml-1">
                {surfSpots.length + availableMentors}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div 
          ref={containerRef} 
          className="h-full w-full"
          style={{
            background: '#f8fafc',
            zIndex: 10
          }}
        />
        
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <div className="text-gray-600">Loading surf spots...</div>
            </div>
          </div>
        )}
      </div>

      {/* Information Panel - Only shows when a spot is selected */}
      {selectedSpot && (
        <div className="bg-white border-t max-h-96 overflow-y-auto">
          <SurfSpotInfoPanel 
            selectedSpot={selectedSpot}
            rawSpotData={selectedRawSpot}
          />
        </div>
      )}
    </div>
  );
}
