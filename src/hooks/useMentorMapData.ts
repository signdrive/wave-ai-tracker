
import { useMonitoring } from '@/lib/monitoring';
import { useInstructorData } from '@/hooks/useInstructorData';

interface UseMentorMapDataProps {
  visible: boolean;
  userLocation: [number, number];
  radius: number;
}

export const useMentorMapData = ({ visible, userLocation, radius }: UseMentorMapDataProps) => {
  const { captureException, addBreadcrumb } = useMonitoring();
  
  const { data: instructors = [], isLoading, error } = useInstructorData({
    userLocation,
    radius,
    visible
  });

  if (error) {
    console.error('❌ Error in MentorMapData:', error);
    captureException(error as Error, { component: 'MentorMapData' });
  }

  console.log(`🗺️ Fetched ${instructors.length} instructor markers`);
  addBreadcrumb(`Fetched ${instructors.length} instructor markers`, 'data');

  return {
    instructors,
    isLoading,
    error
  };
};
