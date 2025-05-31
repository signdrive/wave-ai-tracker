import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Star, MapPin, Clock, Shield, Award } from 'lucide-react';
import { useMentorClick } from '@/hooks/useMentorClick';
import { useMonitoring } from '@/lib/monitoring';
import { validateMentorId } from '@/utils/mentorValidation';

interface Instructor {
  id: string;
  name: string;
  email?: string;
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

// Custom mentor marker icons based on certifications
const createMentorIcon = (isAvailable: boolean, certifications: string[]) => {
  const color = isAvailable ? '#10B981' : '#EF4444';
  const hasISA = certifications.some(cert => cert.includes('ISA'));
  const hasVDWS = certifications.some(cert => cert.includes('VDWS'));
  
  let badge = '👨‍🏫';
  if (hasISA) badge = '🏆';
  else if (hasVDWS) badge = '⭐';
  
  const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" font-size="10" fill="white">${badge}</text>
    </svg>
  `;

  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(iconSvg),
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

interface InstructorCardProps {
  instructor: Instructor;
  onBookSession: (instructorId: string) => void;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, onBookSession }) => {
  const { captureException } = useMonitoring();
  const { handleMentorClick } = useMentorClick();
  
  const topCertification = instructor.certifications[0] || 'Certified';
  const rating = 4.2 + Math.random() * 0.8; // Mock rating for now

  const handleCardClick = () => {
    try {
      // Validate instructor first
      const validation = validateMentorId(instructor.id);
      if (!validation.isValid) {
        console.warn('⚠️ Invalid instructor:', validation.errors);
        captureException(new Error(`Invalid instructor: ${validation.errors.join(', ')}`), {
          instructorId: instructor.id,
          errors: validation.errors
        });
        return;
      }

      handleMentorClick(instructor.id);
    } catch (error) {
      console.error('❌ Error in instructor card click:', error);
      captureException(error as Error, {
        instructorId: instructor.id,
        action: 'card_click'
      });
    }
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    try {
      onBookSession(instructor.id);
    } catch (error) {
      console.error('❌ Error in booking click:', error);
      captureException(error as Error, {
        instructorId: instructor.id,
        action: 'booking_click'
      });
    }
  };

  return (
    <Card className="w-72 border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {instructor.profile_image_url ? (
              <img 
                src={instructor.profile_image_url} 
                alt={instructor.name}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  // Fallback to initials if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-ocean flex items-center justify-center text-white text-sm">
                {instructor.name.charAt(0)}
              </div>
            )}
            <span className="truncate">{instructor.name}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm">{rating.toFixed(1)}</span>
          </div>
        </CardTitle>
        
        <div className="flex flex-wrap gap-1">
          <Badge variant={instructor.is_available ? 'default' : 'secondary'}>
            {instructor.is_available ? 'Available Now' : 'Busy'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Award className="w-3 h-3 mr-1" />
            {topCertification}
          </Badge>
          {instructor.distance_km && (
            <Badge variant="outline" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              {instructor.distance_km.toFixed(1)}km
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {instructor.bio && (
          <p className="text-sm text-gray-600 line-clamp-2">{instructor.bio}</p>
        )}
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {instructor.years_experience}y exp
          </div>
          <div className="flex items-center">
            <span className="text-green-600 font-semibold">
              ${instructor.hourly_rate}/hr
            </span>
          </div>
        </div>

        {instructor.specialties && instructor.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {instructor.specialties.slice(0, 3).map((specialty, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Button 
            size="sm" 
            className="w-full"
            onClick={handleBookingClick}
            disabled={!instructor.is_available}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Book Session
          </Button>
          
          {instructor.is_available && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={handleBookingClick}
            >
              🌊 Instant Session
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

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
  
  const { data: instructors = [], isLoading, error } = useQuery({
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
    }
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
      {instructors.map((instructor) => (
        <Marker
          key={instructor.id}
          position={[instructor.lat, instructor.lng]}
          icon={createMentorIcon(instructor.is_available, instructor.certifications)}
        >
          <Popup maxWidth={300} minWidth={280} closeButton={true}>
            <InstructorCard instructor={instructor} onBookSession={onBookSession} />
          </Popup>
        </Marker>
      ))}
    </>
  );
};

// Mock data generator for demonstration
const generateMockInstructors = (center: [number, number], count: number, maxRadius: number): Instructor[] => {
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
    const latOffset = (Math.random() - 0.5) * 0.2; // ~11km radius spread
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

export default MentorMapLayer;
