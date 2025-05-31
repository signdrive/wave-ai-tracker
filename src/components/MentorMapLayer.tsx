
import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useMentorMapData } from '@/hooks/useMentorMapData';
import { validateMentorData } from '@/lib/validateMentors';
import InstructorCard from '@/components/mentor/InstructorCard';

interface MentorMapLayerProps {
  visible: boolean;
  onBookSession: (instructorId: string) => void;
  userLocation?: [number, number];
  radius?: number;
}

const MentorMapLayer: React.FC<MentorMapLayerProps> = ({ 
  visible, 
  onBookSession, 
  userLocation = [34.0522, -118.2437],
  radius = 50 
}) => {
  const map = useMap();
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const { instructors } = useMentorMapData({
    visible,
    userLocation,
    radius
  });

  useEffect(() => {
    if (!visible || !map) {
      return;
    }

    console.log('🗺️ MentorMapLayer mounted with', instructors.length, 'instructors');

    // Create layer group if it doesn't exist
    if (!layerGroupRef.current) {
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    // Clear existing markers
    layerGroupRef.current.clearLayers();

    // Add markers for each instructor
    instructors.forEach((instructor) => {
      if (!validateMentorData(instructor)) {
        console.warn('Skipping invalid instructor:', instructor);
        return;
      }

      // Create safe mentor icon
      const color = instructor.is_available ? '#10B981' : '#EF4444';
      const badge = instructor.certifications.some(cert => cert.includes('ISA')) ? '🏆' : '👨‍🏫';

      const iconHtml = `
        <div style="
          width: 36px; 
          height: 36px; 
          background-color: ${color}; 
          border: 2px solid white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">${badge}</div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
        className: 'custom-mentor-marker'
      });

      // Create marker
      const marker = L.marker([instructor.lat, instructor.lng], {
        icon: customIcon
      });

      // Create popup content
      const popupDiv = document.createElement('div');
      popupDiv.style.width = '300px';
      popupDiv.style.padding = '0';
      popupDiv.innerHTML = `
        <div style="font-family: system-ui; padding: 16px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: ${color}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
              ${instructor.name.charAt(0)}
            </div>
            <div>
              <h3 style="margin: 0; font-size: 18px; font-weight: 600;">${instructor.name}</h3>
              <p style="margin: 0; color: #666; font-size: 14px;">${instructor.certifications[0] || 'Certified Instructor'}</p>
            </div>
          </div>
          <p style="margin: 8px 0; color: #333; font-size: 14px;">${instructor.bio || 'Professional surf instructor'}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
            <span style="color: #059669; font-weight: 600;">$${instructor.hourly_rate}/hr</span>
            <button 
              onclick="window.parent.postMessage({type: 'bookSession', instructorId: '${instructor.id}'}, '*')"
              style="background: #059669; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;"
              ${!instructor.is_available ? 'disabled style="background: #ccc;"' : ''}
            >
              ${instructor.is_available ? 'Book Session' : 'Unavailable'}
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupDiv, {
        maxWidth: 300,
        minWidth: 280,
        closeButton: true,
        autoPan: true
      });

      marker.on('click', () => {
        console.log('🖱️ Mentor marker clicked:', instructor.name);
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
  }, [map, visible, instructors, onBookSession]);

  // Handle booking messages from popups
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'bookSession') {
        onBookSession(event.data.instructorId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
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

export default MentorMapLayer;
