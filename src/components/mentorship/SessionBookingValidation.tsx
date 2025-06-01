
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface SessionValidationProps {
  errors: string[];
}

export const SessionValidation: React.FC<SessionValidationProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <ul className="space-y-1">
          {errors.map((error, index) => (
            <li key={index}>• {error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export const validateSessionBooking = (formData: {
  mentor_id: string;
  spot_id: string;
  scheduled_at: string;
  duration_minutes: number;
  session_notes: string;
}) => {
  const errors: string[] = [];
  
  // Validate required fields
  if (!formData.mentor_id) {
    errors.push('Please select a mentor');
  }
  
  if (!formData.spot_id) {
    errors.push('Please select a surf spot');
  }
  
  if (!formData.scheduled_at) {
    errors.push('Please select a date and time');
  }
  
  // Validate date/time
  if (formData.scheduled_at) {
    const scheduledDate = new Date(formData.scheduled_at);
    const now = new Date();
    const maxBookingDate = new Date();
    maxBookingDate.setMonth(maxBookingDate.getMonth() + 6); // 6 months ahead
    
    if (scheduledDate <= now) {
      errors.push('Session must be scheduled in the future');
    }
    
    if (scheduledDate > maxBookingDate) {
      errors.push('Sessions can only be booked up to 6 months in advance');
    }
    
    // Check business hours (6 AM to 10 PM)
    const hour = scheduledDate.getHours();
    if (hour < 6 || hour > 22) {
      errors.push('Sessions must be scheduled between 6:00 AM and 10:00 PM');
    }
  }
  
  // Validate duration
  if (formData.duration_minutes < 30) {
    errors.push('Session duration must be at least 30 minutes');
  }
  
  if (formData.duration_minutes > 480) {
    errors.push('Session duration cannot exceed 8 hours');
  }
  
  // Validate session notes length
  if (formData.session_notes && formData.session_notes.length > 500) {
    errors.push('Session notes cannot exceed 500 characters');
  }
  
  return errors;
};
