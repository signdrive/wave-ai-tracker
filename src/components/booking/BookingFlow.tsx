
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { MapPin, Star, DollarSign, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

interface BookingFlowProps {
  spotId?: string;
  spotName?: string;
  onBookingComplete?: () => void;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ 
  spotId, 
  spotName, 
  onBookingComplete 
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch available mentors
  const { data: mentors = [], isLoading: mentorsLoading } = useQuery({
    queryKey: ['available-mentors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          bio,
          hourly_rate,
          certification_level,
          years_experience,
          mentor_availability(*)
        `)
        .eq('user_type', 'mentor')
        .not('mentor_availability', 'is', null);

      if (error) throw error;
      return data || [];
    }
  });

  // Get mentor availability for selected mentor
  const { data: availability = [] } = useQuery({
    queryKey: ['mentor-availability', selectedMentor?.id],
    queryFn: async () => {
      if (!selectedMentor) return [];
      
      const { data, error } = await supabase
        .from('mentor_availability')
        .select('*')
        .eq('mentor_id', selectedMentor.id)
        .eq('is_available', true);

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedMentor
  });

  const handleBookSession = async () => {
    if (!user || !selectedMentor || !selectedDate || !selectedTime) return;

    setLoading(true);
    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}`);
      
      const { error } = await supabase
        .from('mentorship_sessions')
        .insert({
          student_id: user.id,
          mentor_id: selectedMentor.id,
          spot_id: spotId || 'general',
          scheduled_at: scheduledAt.toISOString(),
          duration_minutes: 60,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Session booked successfully! Your mentor will confirm shortly.');
      onBookingComplete?.();
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error('Failed to book session');
    } finally {
      setLoading(false);
    }
  };

  // Generate available time slots based on mentor availability
  const getAvailableTimeSlots = () => {
    if (!selectedDate || !availability.length) return [];

    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    
    const dayAvailability = availability.filter(slot => slot.day_of_week === dayOfWeek);
    
    const timeSlots: string[] = [];
    dayAvailability.forEach(slot => {
      const start = new Date(`1970-01-01T${slot.start_time}`);
      const end = new Date(`1970-01-01T${slot.end_time}`);
      
      while (start < end) {
        timeSlots.push(start.toTimeString().slice(0, 5));
        start.setHours(start.getHours() + 1);
      }
    });

    return timeSlots;
  };

  // Generate next 30 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 1; i <= 30; i++) {
      dates.push(addDays(new Date(), i));
    }
    return dates;
  };

  if (step === 1) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Choose Your Surf Mentor
          </CardTitle>
          {spotName && (
            <p className="text-gray-600">
              Book a session at {spotName}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {mentorsLoading ? (
            <div className="text-center py-8">Loading mentors...</div>
          ) : mentors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No mentors available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{mentor.full_name}</h3>
                          <Badge variant="outline">{mentor.certification_level}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${mentor.hourly_rate}/hr</p>
                          <p className="text-sm text-gray-600">{mentor.years_experience} years</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 line-clamp-3">{mentor.bio}</p>
                      
                      <Button 
                        className="w-full"
                        onClick={() => {
                          setSelectedMentor(mentor);
                          setStep(2);
                        }}
                      >
                        Select Mentor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (step === 2) {
    const availableDates = getAvailableDates();
    const timeSlots = getAvailableTimeSlots();

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Schedule Your Session
          </CardTitle>
          <p className="text-gray-600">
            Booking with {selectedMentor.full_name} • ${selectedMentor.hourly_rate}/hour
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Choose a Date</h4>
            <div className="grid grid-cols-7 gap-2">
              {availableDates.slice(0, 14).map((date) => (
                <Button
                  key={date.toISOString()}
                  variant={selectedDate === format(date, 'yyyy-MM-dd') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedDate(format(date, 'yyyy-MM-dd'));
                    setSelectedTime('');
                  }}
                  className="text-xs"
                >
                  {format(date, 'dd')}
                </Button>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div>
              <h4 className="font-medium mb-3">Choose a Time</h4>
              {timeSlots.length === 0 ? (
                <p className="text-gray-600">No available times for this date</p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button 
              className="flex-1"
              disabled={!selectedDate || !selectedTime || loading}
              onClick={handleBookSession}
            >
              {loading ? 'Booking...' : 'Book Session'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default BookingFlow;
