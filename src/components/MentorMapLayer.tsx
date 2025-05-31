
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Star, MapPin, Clock } from 'lucide-react';

interface Mentor {
  id: string;
  full_name: string;
  certification_level: string;
  years_experience: number;
  hourly_rate: number;
  lat: number;
  lon: number;
  is_available: boolean;
  bio: string;
  rating: number;
}

// Custom mentor marker icons
const createMentorIcon = (isAvailable: boolean, certification: string) => {
  const color = isAvailable ? '#10B981' : '#EF4444'; // Green for available, red for busy
  const badge = certification?.includes('ISA') ? '🏆' : certification?.includes('VDWS') ? '⭐' : '👨‍🏫';
  
  const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" font-size="12" fill="white">${badge}</text>
    </svg>
  `;

  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(iconSvg),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface MentorCardProps {
  mentor: Mentor;
  onBookSession: (mentorId: string) => void;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, onBookSession }) => {
  return (
    <Card className="w-64 border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          {mentor.full_name}
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm">{mentor.rating}</span>
          </div>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant={mentor.is_available ? 'default' : 'secondary'}>
            {mentor.is_available ? 'Available Now' : 'Busy'}
          </Badge>
          <Badge variant="outline">{mentor.certification_level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">{mentor.bio}</p>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {mentor.years_experience}y exp
          </div>
          <div className="flex items-center">
            <span className="text-green-600 font-semibold">${mentor.hourly_rate}/hr</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => onBookSession(mentor.id)}
            disabled={!mentor.is_available}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Book Session
          </Button>
          
          {mentor.is_available && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => onBookSession(mentor.id)}
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
  onBookSession: (mentorId: string) => void;
  userLocation?: [number, number];
  radius?: number;
}

const MentorMapLayer: React.FC<MentorMapLayerProps> = ({ 
  visible, 
  onBookSession, 
  userLocation,
  radius = 50 
}) => {
  const { data: mentors = [], isLoading } = useQuery({
    queryKey: ['nearby-mentors', userLocation, radius],
    queryFn: async (): Promise<Mentor[]> => {
      // Get mentors from profiles table with mentor role
      const { data: mentorProfiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          certification_level,
          years_experience,
          hourly_rate,
          bio,
          user_roles!inner(role)
        `)
        .eq('user_roles.role', 'mentor');

      if (error) throw error;

      // For demo purposes, add mock location data
      // In production, you'd have a mentors_location table
      const mentorsWithLocation = mentorProfiles?.map(mentor => ({
        ...mentor,
        lat: userLocation ? userLocation[0] + (Math.random() - 0.5) * 0.1 : 34.0522 + (Math.random() - 0.5) * 0.1,
        lon: userLocation ? userLocation[1] + (Math.random() - 0.5) * 0.1 : -118.2437 + (Math.random() - 0.5) * 0.1,
        is_available: Math.random() > 0.3, // 70% chance of being available
        rating: 4.2 + Math.random() * 0.8, // Random rating between 4.2-5.0
      })) || [];

      return mentorsWithLocation;
    },
    enabled: visible && !!userLocation
  });

  if (!visible) return null;

  return (
    <>
      {mentors.map((mentor) => (
        <Marker
          key={mentor.id}
          position={[mentor.lat, mentor.lon]}
          icon={createMentorIcon(mentor.is_available, mentor.certification_level)}
        >
          <Popup maxWidth={280} minWidth={260} closeButton={true}>
            <MentorCard mentor={mentor} onBookSession={onBookSession} />
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default MentorMapLayer;
