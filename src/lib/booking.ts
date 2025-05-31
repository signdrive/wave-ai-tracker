
import { supabase } from '@/integrations/supabase/client';

export interface SurfSpot {
  id: string;
  name: string;
  lat: number;
  lon: number;
  swellHeight?: number;
  windDirection?: string;
  windSpeed?: number;
  tideLevel?: string;
}

export interface BookingConditions {
  isIdeal: boolean;
  score: number;
  factors: {
    swell: 'poor' | 'fair' | 'good' | 'excellent';
    wind: 'poor' | 'fair' | 'good' | 'excellent';
    tide: 'poor' | 'fair' | 'good' | 'excellent';
  };
  recommendation: string;
}

export const checkIdealConditions = (spot: SurfSpot): BookingConditions => {
  let score = 0;
  let swellRating: 'poor' | 'fair' | 'good' | 'excellent' = 'poor';
  let windRating: 'poor' | 'fair' | 'good' | 'excellent' = 'poor';
  let tideRating: 'poor' | 'fair' | 'good' | 'excellent' = 'fair';

  // Swell height scoring (0-40 points)
  if (spot.swellHeight) {
    if (spot.swellHeight >= 6) {
      score += 40;
      swellRating = 'excellent';
    } else if (spot.swellHeight >= 4) {
      score += 30;
      swellRating = 'good';
    } else if (spot.swellHeight >= 2) {
      score += 20;
      swellRating = 'fair';
    } else {
      score += 5;
      swellRating = 'poor';
    }
  }

  // Wind conditions scoring (0-35 points)
  if (spot.windDirection && spot.windSpeed) {
    const isOffshore = spot.windDirection.toLowerCase().includes('offshore') || 
                       spot.windDirection.toLowerCase().includes('land');
    
    if (isOffshore && spot.windSpeed <= 10) {
      score += 35;
      windRating = 'excellent';
    } else if (isOffshore && spot.windSpeed <= 15) {
      score += 25;
      windRating = 'good';
    } else if (spot.windSpeed <= 20) {
      score += 15;
      windRating = 'fair';
    } else {
      score += 5;
      windRating = 'poor';
    }
  }

  // Tide conditions scoring (0-25 points)
  if (spot.tideLevel) {
    const idealTides = ['mid', 'rising', 'high'];
    if (idealTides.some(tide => spot.tideLevel?.toLowerCase().includes(tide))) {
      score += 25;
      tideRating = 'excellent';
    } else {
      score += 15;
      tideRating = 'good';
    }
  }

  const isIdeal = score >= 70;
  let recommendation = '';

  if (score >= 85) {
    recommendation = '🔥 Perfect conditions! Book now for an epic session!';
  } else if (score >= 70) {
    recommendation = '✅ Great conditions for a surf lesson!';
  } else if (score >= 50) {
    recommendation = '⚠️ Decent conditions - good for beginners.';
  } else {
    recommendation = '❌ Challenging conditions - experienced surfers only.';
  }

  return {
    isIdeal,
    score,
    factors: {
      swell: swellRating,
      wind: windRating,
      tide: tideRating
    },
    recommendation
  };
};

export const createBookingSession = async (
  mentorId: string, 
  studentId: string, 
  spotId: string,
  scheduledAt: Date,
  waveConditions?: any
) => {
  const { data, error } = await supabase
    .from('mentorship_sessions')
    .insert({
      mentor_id: mentorId,
      student_id: studentId,
      spot_id: spotId,
      scheduled_at: scheduledAt.toISOString(),
      wave_conditions: waveConditions,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAvailableSlotsForMentor = async (mentorId: string, date: Date) => {
  // Get mentor's availability for the day
  const dayOfWeek = date.getDay();
  
  const { data: availability, error } = await supabase
    .from('mentor_availability')
    .select('*')
    .eq('mentor_id', mentorId)
    .eq('day_of_week', dayOfWeek)
    .eq('is_available', true);

  if (error) throw error;

  // Get existing bookings for the date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data: bookings, error: bookingsError } = await supabase
    .from('mentorship_sessions')
    .select('scheduled_at, duration_minutes')
    .eq('mentor_id', mentorId)
    .gte('scheduled_at', startOfDay.toISOString())
    .lte('scheduled_at', endOfDay.toISOString())
    .in('status', ['pending', 'confirmed']);

  if (bookingsError) throw bookingsError;

  // Calculate available slots (simplified logic)
  const availableSlots: Date[] = [];
  
  availability?.forEach(slot => {
    const [startHour, startMinute] = slot.start_time.split(':').map(Number);
    const [endHour, endMinute] = slot.end_time.split(':').map(Number);
    
    // Generate hourly slots
    for (let hour = startHour; hour < endHour; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      
      // Check if slot is not already booked
      const isBooked = bookings?.some(booking => {
        const bookingTime = new Date(booking.scheduled_at);
        const bookingEnd = new Date(bookingTime.getTime() + (booking.duration_minutes * 60000));
        return slotTime >= bookingTime && slotTime < bookingEnd;
      });
      
      if (!isBooked && slotTime > new Date()) {
        availableSlots.push(slotTime);
      }
    }
  });

  return availableSlots;
};
