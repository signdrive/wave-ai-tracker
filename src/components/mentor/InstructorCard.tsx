
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Star, MapPin, Clock, Award } from 'lucide-react';
import { useMentorClick } from '@/hooks/useMentorClick';
import { useMonitoring } from '@/lib/monitoring';
import { validateMentorId } from '@/utils/mentorValidation';
import { createSafeAvatarUrl } from '@/utils/iconUtils';

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

interface InstructorCardProps {
  instructor: Instructor;
  onBookSession: (instructorId: string) => void;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, onBookSession }) => {
  const { captureException } = useMonitoring();
  const { handleMentorClick } = useMentorClick();
  
  const topCertification = instructor.certifications[0] || 'Certified';
  const rating = 4.2 + Math.random() * 0.8; // Mock rating for now
  const safeAvatarUrl = createSafeAvatarUrl(instructor.profile_image_url || '');

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
            {safeAvatarUrl !== '/default-mentor.png' ? (
              <img 
                src={safeAvatarUrl} 
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

export default InstructorCard;
export type { Instructor, InstructorCardProps };
