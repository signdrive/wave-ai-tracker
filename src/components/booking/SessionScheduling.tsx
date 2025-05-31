
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface Mentor {
  id: string;
  full_name: string;
  hourly_rate: number;
}

interface SessionSchedulingProps {
  selectedMentor: Mentor;
  selectedDate: string;
  selectedTime: string;
  timeSlots: string[];
  loading: boolean;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onBack: () => void;
  onBookSession: () => void;
}

const SessionScheduling: React.FC<SessionSchedulingProps> = ({
  selectedMentor,
  selectedDate,
  selectedTime,
  timeSlots,
  loading,
  onDateSelect,
  onTimeSelect,
  onBack,
  onBookSession
}) => {
  // Generate next 30 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 1; i <= 30; i++) {
      dates.push(addDays(new Date(), i));
    }
    return dates;
  };

  const availableDates = getAvailableDates();

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
                  onDateSelect(format(date, 'yyyy-MM-dd'));
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
                    onClick={() => onTimeSelect(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            className="flex-1"
            disabled={!selectedDate || !selectedTime || loading}
            onClick={onBookSession}
          >
            {loading ? 'Booking...' : 'Book Session'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionScheduling;
