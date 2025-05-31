
import { Instructor } from '@/components/mentor/InstructorCard';

export const generateMockInstructors = (center: [number, number], count: number, maxRadius: number): Instructor[] => {
  const certifications = [
    ['ISA Level 2', 'First Aid'],
    ['VDWS Instructor', 'Rescue Certified'],
    ['ISA Level 1', 'CPR Certified'],
    ['WSA Certified', 'Bronze Medallion'],
    ['Professional Surfer', 'Surf Coach']
  ];

  const specialties = [
    ['Beginner Friendly', 'Group Lessons'],
    ['Advanced Techniques', 'Competition Prep'],
    ['Longboard', 'Classic Style'],
    ['Shortboard', 'Performance'],
    ['SUP', 'Paddleboard'],
    ['Big Wave', 'Tow-in'],
    ['Kids Classes', 'Family Lessons'],
    ['Photography', 'Video Analysis']
  ];

  const names = [
    'Jake "Pipeline" Morrison', 'Sarah Wave Rider', 'Marcus Barrel King',
    'Luna Ocean Flow', 'Kai Storm Chaser', 'Zoe Reef Master',
    'Diego Big Wave', 'Aria Surf Goddess', 'Reef Break Ryan',
    'Maya Current Queen', 'Storm Surge Sam', 'Coral Bay Clara',
    'Tide Pool Tim', 'Swell Sister Sophie', 'Offshore Ollie'
  ];

  const bios = [
    "20+ years riding the world's best breaks. Specialized in helping beginners catch their first wave safely.",
    "Former pro competitor turned coach. Expert in performance surfing and wave reading.",
    "Local legend with deep knowledge of secret spots and optimal conditions.",
    "Certified rescue swimmer with a passion for ocean safety and surf education.",
    "Photographer and surfer documenting the perfect wave for over a decade."
  ];

  return Array.from({ length: count }, (_, i) => {
    // Spread instructors around the center point
    const latOffset = (Math.random() - 0.5) * 0.2; // ~11km spread
    const lngOffset = (Math.random() - 0.5) * 0.2;
    
    return {
      id: `mock_instructor_${i}`,
      name: names[i % names.length],
      lat: center[0] + latOffset,
      lng: center[1] + lngOffset,
      certifications: certifications[i % certifications.length],
      specialties: specialties[i % specialties.length],
      years_experience: Math.floor(Math.random() * 20) + 3,
      hourly_rate: Math.floor(Math.random() * 100) + 80,
      bio: bios[i % bios.length],
      is_available: Math.random() > 0.3, // 70% available
      distance_km: Math.random() * maxRadius,
      profile_image_url: `https://images.unsplash.com/photo-150724055${i.toString().padStart(2, '0')}?w=64&h=64&fit=crop&crop=face`
    };
  });
};
