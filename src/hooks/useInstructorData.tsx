
import { useQuery } from '@tanstack/react-query';
import { useMonitoring } from '@/lib/monitoring';
import { validateMentors } from '@/lib/validateMentors';
import { generateMockInstructors } from '@/utils/mockInstructorGenerator';
import { Instructor } from '@/components/mentor/InstructorCard';

interface UseInstructorDataProps {
  userLocation: [number, number];
  radius: number;
  visible: boolean;
}

export const useInstructorData = ({ userLocation, radius, visible }: UseInstructorDataProps) => {
  const { captureException, addBreadcrumb } = useMonitoring();
  
  return useQuery({
    queryKey: ['nearby-instructors', userLocation, radius],
    queryFn: async (): Promise<Instructor[]> => {
      console.log('🔍 Fetching nearby instructors...');
      addBreadcrumb('Fetching nearby instructors', 'query', { userLocation, radius });
      
      try {
        // For now, generate mock data since the database migration hasn't been applied
        console.log('📝 Generating mock instructor data...');
        return generateMockInstructors(userLocation, 15, radius);
      } catch (error) {
        console.error('❌ Error fetching instructors:', error);
        captureException(error as Error, {
          userLocation,
          radius,
          action: 'fetch_instructors'
        });
        throw error;
      }
    },
    enabled: visible,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Only retry network errors, not validation errors
      if (failureCount < 2) {
        addBreadcrumb(`Retrying instructor fetch (attempt ${failureCount + 1})`, 'retry');
        return true;
      }
      return false;
    },
    select: validateMentors // Add validation to query
  });
};
