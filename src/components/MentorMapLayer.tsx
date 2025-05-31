
import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { Marker, Popup } from 'react-leaflet';
import { useMentorMapData } from '@/hooks/useMentorMapData';
import { validateMentorData } from '@/lib/validateMentors';
import { createSafeMentorIcon } from '@/utils/iconUtils';
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
  }, [map, visible, instructors]);

  if (!visible) {
    return null;
  }

  return (
    <>
      {instructors.map((instructor) => {
        if (!validateMentorData(instructor)) {
          console.warn('Skipping invalid instructor:', instructor);
          return null;
        }

        const icon = createSafeMentorIcon(
          instructor.is_available,
          instructor.certifications,
          instructor.profile_image_url
        );

        if (!icon) {
          console.warn('Failed to create icon for instructor:', instructor.id);
          return null;
        }

        return (
          <Marker
            key={instructor.id}
            position={[instructor.lat, instructor.lng]}
            icon={icon}
            eventHandlers={{
              click: () => {
                console.log('🖱️ Mentor marker clicked:', instructor.name);
              }
            }}
          >
            <Popup 
              maxWidth={300}
              minWidth={280}
              closeButton={true}
              autoPan={true}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <InstructorCard instructor={instructor} onBookSession={onBookSession} />
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default MentorMapLayer;
