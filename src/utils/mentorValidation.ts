
interface MentorValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateMentorId = (mentorId: string): MentorValidationResult => {
  const errors: string[] = [];

  if (!mentorId) {
    errors.push('Mentor ID is required');
  }

  if (typeof mentorId !== 'string') {
    errors.push('Mentor ID must be a string');
  }

  // Check UUID format or mock ID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const mockIdRegex = /^(mock_instructor_|isa_|vdws_|pro_|local_)\w+$/;
  
  if (!uuidRegex.test(mentorId) && !mockIdRegex.test(mentorId)) {
    errors.push('Invalid mentor ID format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const isMockMentor = (mentorId: string): boolean => {
  const mockIdRegex = /^(mock_instructor_|isa_|vdws_|pro_|local_)\w+$/;
  return mockIdRegex.test(mentorId);
};

export const getMentorType = (mentorId: string): 'uuid' | 'mock' | 'invalid' => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const mockIdRegex = /^(mock_instructor_|isa_|vdws_|pro_|local_)\w+$/;
  
  if (uuidRegex.test(mentorId)) return 'uuid';
  if (mockIdRegex.test(mentorId)) return 'mock';
  return 'invalid';
};
