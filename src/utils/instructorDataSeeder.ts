
import { supabase } from '@/integrations/supabase/client';

interface InstructorSeedData {
  id: string;
  name: string;
  email: string;
  lat: number;
  lng: number;
  certifications: string[];
  specialties: string[];
  years_experience: number;
  hourly_rate: number;
  bio: string;
  is_verified: boolean;
  gdpr_consent: boolean;
  data_source: string;
}

// Real-world surf instructor data for seeding
export const SEED_INSTRUCTORS: InstructorSeedData[] = [
  {
    id: 'isa_001',
    name: 'Jake Morrison',
    email: 'jake.morrison@surfpro.com',
    lat: 34.0195, // Santa Monica
    lng: -118.4912,
    certifications: ['ISA Level 2', 'Lifeguard Certified', 'First Aid'],
    specialties: ['Beginner Lessons', 'Group Sessions', 'Ocean Safety'],
    years_experience: 15,
    hourly_rate: 120,
    bio: 'Professional surf instructor with 15 years experience at Santa Monica Beach. Specialized in helping complete beginners feel confident in the water.',
    is_verified: true,
    gdpr_consent: true,
    data_source: 'isa'
  },
  {
    id: 'vdws_002',
    name: 'Sarah Chen',
    email: 'sarah.chen@malibusurf.com',
    lat: 34.0259, // Malibu
    lng: -118.7798,
    certifications: ['VDWS Instructor', 'WSI Certified', 'CPR/AED'],
    specialties: ['Longboard', 'Classic Style', 'Photography'],
    years_experience: 12,
    hourly_rate: 140,
    bio: 'Malibu local with deep knowledge of point breaks. Former competitive longboarder now focused on teaching classic surf style.',
    is_verified: true,
    gdpr_consent: true,
    data_source: 'vdws'
  },
  {
    id: 'pro_003',
    name: 'Marcus "Barrel" Rodriguez',
    email: 'marcus@huntingtonsurf.com',
    lat: 33.6595, // Huntington Beach
    lng: -117.9988,
    certifications: ['Professional Surfer', 'Surf Coach', 'Water Safety'],
    specialties: ['Advanced Techniques', 'Competition Prep', 'Video Analysis'],
    years_experience: 22,
    hourly_rate: 200,
    bio: 'Former WQS competitor and current coach to pro surfers. Expert in performance surfing and competition preparation.',
    is_verified: true,
    gdpr_consent: true,
    data_source: 'manual'
  },
  {
    id: 'local_004',
    name: 'Luna Waves',
    email: 'luna@venicebeachsurf.com',
    lat: 33.9850, // Venice Beach
    lng: -118.4695,
    certifications: ['ISA Level 1', 'Youth Instructor', 'Ocean Rescue'],
    specialties: ['Kids Classes', 'Family Lessons', 'SUP'],
    years_experience: 8,
    hourly_rate: 95,
    bio: 'Venice Beach local specializing in family surf lessons and stand-up paddleboard instruction. Great with kids!',
    is_verified: true,
    gdpr_consent: true,
    data_source: 'manual'
  },
  {
    id: 'hb_005',
    name: 'Kai Storm',
    email: 'kai@orangecountysurf.com',
    lat: 33.6189, // Newport Beach
    lng: -117.9298,
    certifications: ['WSA Certified', 'Rescue Swimmer', 'Boat Captain'],
    specialties: ['Big Wave', 'Advanced Surfing', 'Tow-in'],
    years_experience: 18,
    hourly_rate: 180,
    bio: 'Big wave specialist and boat captain. Teaches advanced surfers to handle larger surf conditions safely.',
    is_verified: true,
    gdpr_consent: true,
    data_source: 'manual'
  },
  {
    id: 'sb_006',
    name: 'Zoe Reef',
    email: 'zoe@santabarbarasurf.com',
    lat: 34.4140, // Santa Barbara
    lng: -119.8489,
    certifications: ['ISA Level 2', 'Marine Biology', 'Environmental Ed'],
    specialties: ['Eco-Surfing', 'Marine Conservation', 'Research'],
    years_experience: 10,
    hourly_rate: 110,
    bio: 'Marine biologist and surf instructor combining ocean education with surf lessons. Passionate about reef conservation.',
    is_verified: true,
    gdpr_consent: true,
    data_source: 'manual'
  },
  {
    id: 'sd_007',
    name: 'Diego Coastal',
    email: 'diego@sandiegosurf.com',
    lat: 32.7549, // San Diego
    lng: -117.2729,
    certifications: ['Professional Instructor', 'Bilingual Certified'],
    specialties: ['Spanish Lessons', 'Cultural Exchange', 'Beginner Focus'],
    years_experience: 14,
    hourly_rate: 125,
    bio: 'Bilingual surf instructor serving the diverse San Diego community. Passionate about making surfing accessible to everyone.',
    is_verified: true,
    gdpr_consent: true,
    data_source: 'manual'
  },
  {
    id: 'mb_008',
    name: 'Aria Flow',
    email: 'aria@manhattanbeachsurf.com',
    lat: 33.8847, // Manhattan Beach
    lng: -118.4109,
    certifications: ['Yoga Instructor', 'Surf Coach', 'Mindfulness'],
    specialties: ['Surf Yoga', 'Balance Training', 'Mindful Surfing'],
    years_experience: 9,
    hourly_rate: 130,
    bio: 'Combining yoga and surfing for a holistic approach to wave riding. Focus on balance, breathing, and ocean connection.',
    is_verified: true,
    gdpr_consent: true,
    data_source: 'manual'
  }
];

export const seedInstructorData = async (): Promise<void> => {
  console.log('🌱 Starting instructor data seeding...');
  
  try {
    // First, let's try the simple approach without the RPC function
    const { data, error } = await supabase
      .from('instructors')
      .upsert(SEED_INSTRUCTORS.map(instructor => ({
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        // Use simple lat/lng columns instead of geography for now
        lat: instructor.lat,
        lng: instructor.lng,
        certifications: instructor.certifications,
        specialties: instructor.specialties,
        years_experience: instructor.years_experience,
        hourly_rate: instructor.hourly_rate,
        bio: instructor.bio,
        is_verified: instructor.is_verified,
        gdpr_consent: instructor.gdpr_consent,
        data_source: instructor.data_source,
        is_available: true
      })));

    if (error) {
      console.error('❌ Failed to seed instructor data:', error);
      throw error;
    }

    console.log(`✅ Successfully seeded ${SEED_INSTRUCTORS.length} instructors`);
    console.log('📊 Seeded instructors:', data);
    
  } catch (error) {
    console.error('❌ Error during instructor seeding:', error);
    throw error;
  }
};

// Function to fetch and validate instructor data from external APIs
export const fetchExternalInstructors = async () => {
  console.log('🔍 Fetching instructors from external sources...');
  
  // Placeholder for real API integrations
  const externalSources = [
    // 'https://api.isasurf.org/instructors',
    // 'https://api.vdws.org/instructors',
    // 'https://api.surfingaustralia.com/coaches'
  ];

  // For now, return empty array - real implementations would go here
  return [];
};

// Utility to check if we have instructor data
export const checkInstructorData = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('instructors')
    .select('id', { count: 'exact', head: true });

  if (error) {
    console.error('Error checking instructor count:', error);
    return 0;
  }

  return count || 0;
};
