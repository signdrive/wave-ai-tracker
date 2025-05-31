
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../lib/leaflet-fix';

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

    // Add mentor markers
    testMentors.forEach((mentor) => {
      const color = mentor.is_available ? '#10B981' : '#EF4444';
      
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
      }).addTo(mapRef.current!);

      const popupContent = `
        <div style="font-family: system-ui; padding: 12px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${mentor.name}</h3>
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

    console.log('✅ Markers added');

    return () => {
      if (mapRef.current) {
        console.log('🧹 Cleaning up map...');
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="h-[100vh] w-full"
      style={{
        background: '#f8fafc',
        zIndex: 10
      }}
    />
  );
}
