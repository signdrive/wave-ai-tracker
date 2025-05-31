
import React from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { useMentorMapData } from '@/hooks/useMentorMapData';
import MentorMarker from '@/components/mentor/MentorMarker';
import { validateLeafletContext } from '@/lib/leafletUtils';

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
  const map = useMap();
  const { instructors } = useMentorMapData({
    visible,
    userLocation,
    radius
  });

  // Validate Leaflet context before rendering
  if (!visible || !validateLeafletContext() || !map) {
    return null;
  }

  // Use map events to ensure proper context
  useMapEvents({
    ready: () => {
      console.log('🗺️ Map is ready for mentor markers');
    }
  });

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
