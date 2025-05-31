
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { createSafeMentorIcon } from '@/utils/iconUtils';
import { validateMentorData } from '@/lib/validateMentors';
import InstructorCard, { Instructor } from '@/components/mentor/InstructorCard';

interface MentorMarkerProps {
  instructor: Instructor;
  onBookSession: (instructorId: string) => void;
}

const MentorMarker: React.FC<MentorMarkerProps> = ({ instructor, onBookSession }) => {
  // Skip invalid instructor data
  if (!validateMentorData(instructor)) {
    console.warn('Skipping invalid instructor:', instructor);
    return null;
  }

  return (
    <Marker
      key={instructor.id}
      position={[instructor.lat, instructor.lng]}
      icon={createSafeMentorIcon(instructor.is_available, instructor.certifications, instructor.profile_image_url)}
    >
      <Popup maxWidth={300} minWidth={280} closeButton={true}>
        <InstructorCard instructor={instructor} onBookSession={onBookSession} />
      </Popup>
    </Marker>
  );
};

export default MentorMarker;
