
import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface MentorClickOptions {
  enableModal?: boolean;
  onError?: (error: Error) => void;
}

export const useMentorClick = (options: MentorClickOptions = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const isValidMentorId = useCallback((mentorId: string): boolean => {
    // Basic validation for mentor ID format
    if (!mentorId || typeof mentorId !== 'string') {
      return false;
    }
    
    // Check if it's a valid UUID format or mock ID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const mockIdRegex = /^(mock_instructor_|isa_|vdws_|pro_|local_)\w+$/;
    
    return uuidRegex.test(mentorId) || mockIdRegex.test(mentorId);
  }, []);

  const handleMentorClick = useCallback((mentorId: string) => {
    console.log('🎯 Mentor click handler called with ID:', mentorId);
    
    try {
      // Validate mentor ID
      if (!isValidMentorId(mentorId)) {
        console.warn('⚠️ Invalid mentor ID format:', mentorId);
        toast({
          title: "Invalid Mentor",
          description: "The selected mentor could not be found.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Valid mentor ID, processing click');

      // For now, since we don't have a mentor detail page, show a toast instead of navigation
      if (options.enableModal) {
        // Future: Open mentor modal
        console.log('📄 Would open mentor modal for:', mentorId);
        toast({
          title: "Mentor Profile",
          description: `Opening profile for mentor ${mentorId}. Full mentor profiles coming soon!`,
        });
      } else {
        // Show booking intent
        console.log('📅 Showing booking intent for mentor:', mentorId);
        toast({
          title: "Book Session",
          description: "Mentor booking system is being set up. Click 'Book Session' in the popup to continue.",
        });
      }

    } catch (error) {
      console.error('❌ Error in mentor click handler:', error);
      
      // Log error to monitoring service
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error, {
          tags: {
            action: 'mentor_click',
            mentorId
          }
        });
      }

      if (options.onError) {
        options.onError(error as Error);
      } else {
        toast({
          title: "Error",
          description: "Failed to load mentor information. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [isValidMentorId, navigate, location, toast, options]);

  return {
    handleMentorClick,
    isValidMentorId
  };
};
