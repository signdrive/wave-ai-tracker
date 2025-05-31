
interface ValidMentor {
  id: string;
  name: string;
  lat: number;
  lng: number;
  certifications: string[];
  specialties: string[];
  years_experience: number;
  hourly_rate: number;
  bio: string;
  profile_image_url?: string;
  is_available: boolean;
  distance_km: number;
}

export const validateMentors = (mentors: any[]): ValidMentor[] => {
  if (!Array.isArray(mentors)) {
    console.warn('Invalid mentors data: not an array');
    return [];
  }

  return mentors.filter(mentor => {
    const isValid = 
      mentor?.id &&
      mentor?.name &&
      typeof mentor.lat === 'number' &&
      typeof mentor.lng === 'number' &&
      Array.isArray(mentor.certifications) &&
      typeof mentor.is_available === 'boolean';
    
    if (!isValid) {
      console.warn('Invalid mentor data:', mentor);
      return false;
    }
    return true;
  });
};

export const validateMentorData = (mentor: any): boolean => {
  return !!(
    mentor?.id &&
    mentor?.name &&
    typeof mentor.lat === 'number' &&
    typeof mentor.lng === 'number' &&
    Array.isArray(mentor.certifications)
  );
};
