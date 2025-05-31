
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useMonitoring } from '@/lib/monitoring';
import { validateMentorData } from '@/lib/validateMentors';
import { createSafeMentorIcon } from '@/utils/iconUtils';
import { useInstructorData } from '@/hooks/useInstructorData';
import InstructorCard, { Instructor } from '@/components/mentor/InstructorCard';

interface MentorMapLayerProps {
  visible: boolean;
  onBookSession: (instructorId: string) => void;
  userLocation?: [number, number];
  radius?: number;
}

const MentorMapLayer: React.FC<MentorMapLayerProps> = ({ 
  visible, 
  onBookSession, 
  userLocation = [34.0522, -118.2437], // Default to LA
  radius = 50 
}) => {
  const { captureException, addBreadcrumb } = useMonitoring();
  
  const { data: instructors = [], isLoading, error } = useInstructorData({
    userLocation,
    radius,
    visible
  });

  if (!visible) return null;

  if (error) {
    console.error('❌ Error in MentorMapLayer:', error);
    captureException(error as Error, { component: 'MentorMapLayer' });
  }

  console.log(`🗺️ Rendering ${instructors.length} instructor markers`);
  addBreadcrumb(`Rendering ${instructors.length} instructor markers`, 'render');

  return (
    <>
      {instructors.map((instructor) => {
        // Additional validation before rendering
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
      })}
    </>
  );
};

export default MentorMapLayer;
