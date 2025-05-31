
import React from 'react';
import { useMentorMapData } from '@/hooks/useMentorMapData';
import MentorMarker from '@/components/mentor/MentorMarker';

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
  const { instructors } = useMentorMapData({
    visible,
    userLocation,
    radius
  });

  if (!visible) return null;

  return (
    <>
      {instructors.map((instructor) => (
        <MentorMarker
          key={instructor.id}
          instructor={instructor}
          onBookSession={onBookSession}
        />
      ))}
    </>
  );
};

export default MentorMapLayer;
