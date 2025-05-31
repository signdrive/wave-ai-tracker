
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { CheckCircle, User, Award, Clock, DollarSign } from 'lucide-react';

interface MentorOnboardingWizardProps {
  onComplete: () => void;
}

const MentorOnboardingWizard: React.FC<MentorOnboardingWizardProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    bio: '',
    certification_level: '',
    years_experience: 0,
    hourly_rate: 50,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const [availability, setAvailability] = useState<Array<{
    day: number;
    start_time: string;
    end_time: string;
  }>>([]);

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          user_type: 'mentor',
          bio: formData.bio,
          certification_level: formData.certification_level,
          years_experience: formData.years_experience,
          hourly_rate: formData.hourly_rate,
          timezone: formData.timezone
        })
        .eq('id', user.id);

      if (error) throw error;
      setStep(2);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilitySubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Delete existing availability
      await supabase
        .from('mentor_availability')
        .delete()
        .eq('mentor_id', user.id);

      // Insert new availability
      if (availability.length > 0) {
        const { error } = await supabase
          .from('mentor_availability')
          .insert(
            availability.map(slot => ({
              mentor_id: user.id,
              day_of_week: slot.day,
              start_time: slot.start_time,
              end_time: slot.end_time
            }))
          );

        if (error) throw error;
      }

      toast.success('Mentor profile created successfully!');
      onComplete();
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error('Failed to save availability');
    } finally {
      setLoading(false);
    }
  };

  const addAvailabilitySlot = () => {
    setAvailability([...availability, { day: 1, start_time: '09:00', end_time: '17:00' }]);
  };

  const updateAvailabilitySlot = (index: number, field: string, value: string | number) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  };

  const removeAvailabilitySlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (step === 1) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Become a Surf Mentor
          </CardTitle>
          <p className="text-gray-600">Share your surfing expertise with students worldwide</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="certification">Certification Level</Label>
              <Select value={formData.certification_level} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, certification_level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="isa-level-1">ISA Level 1</SelectItem>
                  <SelectItem value="isa-level-2">ISA Level 2</SelectItem>
                  <SelectItem value="wsa-certified">WSA Certified</SelectItem>
                  <SelectItem value="professional">Professional Surfer</SelectItem>
                  <SelectItem value="lifeguard">Lifeguard Certified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                type="number"
                min="0"
                value={formData.years_experience}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  years_experience: parseInt(e.target.value) || 0 
                }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
            <Input
              type="number"
              min="10"
              max="500"
              value={formData.hourly_rate}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                hourly_rate: parseFloat(e.target.value) || 50 
              }))}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              placeholder="Tell students about your surfing background, teaching style, and what makes you passionate about surfing..."
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              value={formData.timezone}
              onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
              placeholder="UTC"
            />
          </div>

          <Button 
            onClick={handleProfileUpdate} 
            disabled={loading || !formData.bio || !formData.certification_level}
            className="w-full"
          >
            {loading ? 'Saving...' : 'Continue to Availability'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Set Your Availability
        </CardTitle>
        <p className="text-gray-600">When are you available to teach? Students will book sessions during these times.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {availability.map((slot, index) => (
            <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
              <Select 
                value={slot.day.toString()} 
                onValueChange={(value) => updateAvailabilitySlot(index, 'day', parseInt(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dayNames.map((day, i) => (
                    <SelectItem key={i} value={i.toString()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="time"
                value={slot.start_time}
                onChange={(e) => updateAvailabilitySlot(index, 'start_time', e.target.value)}
                className="w-32"
              />

              <span className="text-gray-500">to</span>

              <Input
                type="time"
                value={slot.end_time}
                onChange={(e) => updateAvailabilitySlot(index, 'end_time', e.target.value)}
                className="w-32"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => removeAvailabilitySlot(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={addAvailabilitySlot}>
          Add Time Slot
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStep(1)}>
            Back
          </Button>
          <Button 
            onClick={handleAvailabilitySubmit} 
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Creating Profile...' : 'Complete Setup'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorOnboardingWizard;
