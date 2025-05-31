
import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useMentorMapData } from '@/hooks/useMentorMapData';
import { validateLeafletContext } from '@/lib/leafletUtils';
import { createSafeMentorIcon } from '@/utils/iconUtils';
import { validateMentorData } from '@/lib/validateMentors';

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
  const layerRef = useRef<L.LayerGroup | null>(null);
  const { instructors } = useMentorMapData({
    visible,
    userLocation,
    radius
  });

  useEffect(() => {
    if (!visible || !validateLeafletContext() || !map) {
      return;
    }

    console.log('🗺️ Map is ready for mentor markers');

    // Create layer group if it doesn't exist
    if (!layerRef.current) {
      layerRef.current = L.layerGroup().addTo(map);
    }

    // Clear existing markers
    if (layerRef.current) {
      layerRef.current.clearLayers();
    }

    // Add instructor markers
    instructors.forEach((instructor) => {
      if (!validateMentorData(instructor) || !layerRef.current) {
        console.warn('Skipping invalid instructor:', instructor);
        return;
      }

      const icon = createSafeMentorIcon(
        instructor.is_available,
        instructor.certifications,
        instructor.profile_image_url
      );

      if (!icon) {
        console.warn('Failed to create icon for instructor:', instructor.id);
        return;
      }

      const marker = L.marker([instructor.lat, instructor.lng], { icon })
        .bindPopup(`
          <div style="max-width: 280px; min-width: 250px;">
            <div style="padding: 12px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${instructor.name}</h3>
              <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${instructor.bio || 'Professional surf instructor'}</p>
              <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                <span style="background: ${instructor.is_available ? '#10B981' : '#EF4444'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                  ${instructor.is_available ? 'Available' : 'Busy'}
                </span>
                <span style="background: #E5E7EB; color: #374151; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                  $${instructor.hourly_rate}/hr
                </span>
              </div>
              <button 
                onclick="window.bookSession?.('${instructor.id}')"
                style="width: 100%; background: #2563EB; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;"
                ${!instructor.is_available ? 'disabled style="background: #9CA3AF; cursor: not-allowed;"' : ''}
              >
                ${instructor.is_available ? 'Book Session' : 'Unavailable'}
              </button>
            </div>
          </div>
        `, {
          maxWidth: 300,
          minWidth: 280,
          closeButton: true,
          autoPan: true
        })
        .on('click', () => {
          console.log('🖱️ Mentor marker clicked:', instructor.name);
        });

      layerRef.current.addLayer(marker);
    });

    // Expose booking function globally for popup buttons
    (window as any).bookSession = onBookSession;

    // Cleanup function
    return () => {
      if (layerRef.current) {
        layerRef.current.clearLayers();
      }
      delete (window as any).bookSession;
    };
  }, [map, visible, instructors, onBookSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (layerRef.current && map) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
      delete (window as any).bookSession;
    };
  }, [map]);

  return null;
};

export default MentorMapLayer;
