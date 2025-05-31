
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { createSafeMentorIcon } from '@/utils/iconUtils';
import { validateMentorData } from '@/lib/validateMentors';
import { validateLeafletContext } from '@/lib/leafletUtils';
import InstructorCard, { Instructor } from '@/components/mentor/InstructorCard';

interface MentorMarkerProps {
  instructor: Instructor;
  onBookSession: (instructorId: string) => void;
}

const MentorMarker: React.FC<MentorMarkerProps> = ({ instructor, onBookSession }) => {
  // Validate Leaflet context and instructor data
  if (!validateLeafletContext() || !validateMentorData(instructor)) {
    if (!validateMentorData(instructor)) {
      console.warn('Skipping invalid instructor:', instructor);
    }
    return null;
  }

  const icon = createSafeMentorIcon(
    instructor.is_available, 
    instructor.certifications, 
    instructor.profile_image_url
  );

  // Skip if icon creation failed
  if (!icon) {
    console.warn('Failed to create icon for instructor:', instructor.id);
    return null;
  }

  return (
    <Marker
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
        closeOnEscapeKey={true}
        autoPan={true}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <InstructorCard instructor={instructor} onBookSession={onBookSession} />
        </div>
      </Popup>
    </Marker>
  );
};

export default MentorMarker;
