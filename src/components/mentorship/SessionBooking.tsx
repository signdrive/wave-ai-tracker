
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { useMentorship } from '@/hooks/useMentorship';
import { useSupabaseSurfSpots } from '@/hooks/useSupabaseSurfSpots';
import { SessionValidation, validateSessionBooking } from './SessionBookingValidation';

const SessionBooking: React.FC = () => {
  const { mentors, createSession, isCreatingSession, userRole } = useMentorship();
  const { surfSpots } = useSupabaseSurfSpots();
  
  const [formData, setFormData] = useState({
    mentor_id: '',
    spot_id: '',
    scheduled_at: '',
    duration_minutes: 60,
    session_notes: '',
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const errors = validateSessionBooking(formData);
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      return;
    }

    const sessionData = {
      ...formData,
      scheduled_at: new Date(formData.scheduled_at).toISOString(),
      status: 'pending' as const,
    };

    createSession(sessionData);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation errors when user makes changes
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  // Get tomorrow's date as minimum for scheduling
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);
  
  // Get max date (6 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  const maxDateString = maxDate.toISOString().slice(0, 16);

  // Only allow students to book sessions
  if (userRole && userRole !== 'student') {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Only students can book mentorship sessions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Book a Surfing Session
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <SessionValidation errors={validationErrors} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mentor Selection */}
          <div className="space-y-2">
            <Label htmlFor="mentor">Select Mentor *</Label>
            <Select value={formData.mentor_id} onValueChange={(value) => handleChange('mentor_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a mentor">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Select Mentor
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {mentors.map((mentor) => (
                  <SelectItem key={mentor.id} value={mentor.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{mentor.full_name || 'Mentor'}</span>
                      {mentor.hourly_rate && (
                        <span className="text-green-600 font-medium ml-2">
                          ${mentor.hourly_rate}/hr
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Surf Spot Selection */}
          <div className="space-y-2">
            <Label htmlFor="spot">Surf Spot *</Label>
            <Select value={formData.spot_id} onValueChange={(value) => handleChange('spot_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a surf spot">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Select Surf Spot
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {surfSpots.slice(0, 50).map((spot) => (
                  <SelectItem key={spot.id} value={spot.id}>
                    <div>
                      <div className="font-medium">{spot.name}</div>
                      <div className="text-sm text-gray-500">
                        {spot.state}, {spot.country}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="datetime">Date & Time *</Label>
              <Input
                id="datetime"
                type="datetime-local"
                min={minDate}
                max={maxDateString}
                value={formData.scheduled_at}
                onChange={(e) => handleChange('scheduled_at', e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Sessions available 6:00 AM - 10:00 PM, up to 6 months in advance
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Select 
                value={formData.duration_minutes.toString()} 
                onValueChange={(value) => handleChange('duration_minutes', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {formData.duration_minutes} minutes
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Session Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Session Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any specific goals, experience level, or preferences you'd like to share with your mentor..."
              value={formData.session_notes}
              onChange={(e) => handleChange('session_notes', e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              {formData.session_notes.length}/500 characters
            </p>
          </div>

          {/* Booking Summary */}
          {formData.mentor_id && formData.spot_id && formData.scheduled_at && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Booking Summary
                </h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Mentor:</strong>{' '}
                    {mentors.find(m => m.id === formData.mentor_id)?.full_name || 'Selected mentor'}
                  </p>
                  <p>
                    <strong>Surf Spot:</strong>{' '}
                    {surfSpots.find(s => s.id === formData.spot_id)?.name || 'Selected spot'}
                  </p>
                  <p>
                    <strong>Date & Time:</strong>{' '}
                    {new Date(formData.scheduled_at).toLocaleString()}
                  </p>
                  <p>
                    <strong>Duration:</strong> {formData.duration_minutes} minutes
                  </p>
                  {mentors.find(m => m.id === formData.mentor_id)?.hourly_rate && (
                    <p>
                      <strong>Estimated Cost:</strong> $
                      {Math.round((mentors.find(m => m.id === formData.mentor_id)?.hourly_rate || 0) * (formData.duration_minutes / 60))}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-ocean hover:bg-ocean-dark"
            disabled={isCreatingSession || validationErrors.length > 0}
          >
            {isCreatingSession ? 'Booking Session...' : 'Book Session'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SessionBooking;
