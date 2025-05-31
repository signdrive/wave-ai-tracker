
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import MentorSelection from './MentorSelection';
import SessionScheduling from './SessionScheduling';

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

  const handleSelectMentor = (mentor: any) => {
    setSelectedMentor(mentor);
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBack = () => {
    setStep(1);
  };

  const timeSlots = getAvailableTimeSlots();

  if (step === 1) {
    return (
      <MentorSelection
        mentors={mentors}
        mentorsLoading={mentorsLoading}
        spotName={spotName}
        onSelectMentor={handleSelectMentor}
      />
    );
  }

  if (step === 2) {
    return (
      <SessionScheduling
        selectedMentor={selectedMentor}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        timeSlots={timeSlots}
        loading={loading}
        onDateSelect={handleDateSelect}
        onTimeSelect={handleTimeSelect}
        onBack={handleBack}
        onBookSession={handleBookSession}
      />
    );
  }

  return null;
};

export default BookingFlow;
