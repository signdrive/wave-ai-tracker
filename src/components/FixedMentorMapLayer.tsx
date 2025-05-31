
import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

type Mentor = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  avatar?: string;
  bio?: string;
  hourly_rate?: number;
  is_available?: boolean;
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

interface FixedMentorMapLayerProps {
  mentors: Mentor[];
  onBookSession?: (mentorId: string) => void;
}

const FixedMentorMapLayer: React.FC<FixedMentorMapLayerProps> = ({ 
  mentors, 
  onBookSession 
}) => {
  const map = useMap();
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    console.log('🗺️ FixedMentorMapLayer rendering', mentors.length, 'mentors');

    // Create layer group if it doesn't exist
    if (!layerGroupRef.current) {
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    // Clear existing markers
    layerGroupRef.current.clearLayers();

    // Default icon
    const defaultIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add markers for each mentor
    mentors.forEach((mentor) => {
      if (!mentor.lat || !mentor.lng) {
        console.warn('Skipping mentor with invalid coordinates:', mentor);
        return;
      }

      // Create custom icon for available/unavailable mentors
      const color = mentor.is_available !== false ? '#10B981' : '#EF4444';
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

      // Create marker
      const marker = L.marker([mentor.lat, mentor.lng], {
        icon: customIcon
      });

      // Create popup content
      const popupContent = `
        <div style="font-family: system-ui; padding: 12px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${mentor.name}</h3>
          ${mentor.bio ? `<p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${mentor.bio}</p>` : ''}
          <div style="display: flex; justify-content: space-between; align-items: center;">
            ${mentor.hourly_rate ? `<span style="color: #059669; font-weight: 600;">$${mentor.hourly_rate}/hr</span>` : ''}
            <span style="
              padding: 4px 8px; 
              border-radius: 4px; 
              font-size: 12px; 
              background: ${mentor.is_available !== false ? '#10B981' : '#EF4444'}; 
              color: white;
            ">
              ${mentor.is_available !== false ? 'Available' : 'Unavailable'}
            </span>
          </div>
          ${onBookSession ? `
            <button 
              onclick="window.dispatchEvent(new CustomEvent('bookMentor', {detail: '${mentor.id}'}))"
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
                ${mentor.is_available === false ? 'background: #ccc; cursor: not-allowed;' : ''}
              "
              ${mentor.is_available === false ? 'disabled' : ''}
            >
              ${mentor.is_available !== false ? 'Book Session' : 'Unavailable'}
            </button>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 250,
        closeButton: true,
        autoPan: true
      });

      marker.on('click', () => {
        console.log('🖱️ Mentor marker clicked:', mentor.name);
      });

      // Add marker to layer group
      if (layerGroupRef.current) {
        marker.addTo(layerGroupRef.current);
      }
    });

    // Cleanup function
    return () => {
      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
      }
    };
  }, [map, mentors, onBookSession]);

  // Handle booking events
  useEffect(() => {
    const handleBookMentor = (event: CustomEvent) => {
      if (onBookSession) {
        onBookSession(event.detail);
      }
    };

    window.addEventListener('bookMentor', handleBookMentor as EventListener);
    return () => window.removeEventListener('bookMentor', handleBookMentor as EventListener);
  }, [onBookSession]);

  // Cleanup layer group on unmount
  useEffect(() => {
    return () => {
      if (layerGroupRef.current) {
        layerGroupRef.current.remove();
        layerGroupRef.current = null;
      }
    };
  }, []);

  return null;
};

export default FixedMentorMapLayer;
