
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Trash2 } from 'lucide-react';

interface TimeSlot {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const AvailabilityScheduler: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: '1', day: 1, startTime: '09:00', endTime: '12:00', isAvailable: true },
    { id: '2', day: 3, startTime: '14:00', endTime: '17:00', isAvailable: true },
    { id: '3', day: 6, startTime: '08:00', endTime: '11:00', isAvailable: true },
  ]);

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      day: 1,
      startTime: '09:00',
      endTime: '12:00',
      isAvailable: true,
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const toggleAvailability = (id: string) => {
    setTimeSlots(timeSlots.map(slot =>
      slot.id === id ? { ...slot, isAvailable: !slot.isAvailable } : slot
    ));
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string | number) => {
    setTimeSlots(timeSlots.map(slot =>
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Set Your Availability
          </CardTitle>
          <Button onClick={addTimeSlot} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Time Slot
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {timeSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No availability set yet.</p>
              <p className="text-sm">Add time slots to let students book sessions with you.</p>
            </div>
          ) : (
            timeSlots.map((slot) => (
              <Card key={slot.id} className="p-4">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <select
                      value={slot.day}
                      onChange={(e) => updateTimeSlot(slot.id, 'day', parseInt(e.target.value))}
                      className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
                    >
                      {daysOfWeek.map((day, index) => (
                        <option key={index} value={index}>
                          {day}
                        </option>
                      ))}
                    </select>

                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                      className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
                    />

                    <span className="text-gray-500">to</span>

                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                      className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
                    />

                    <Badge
                      variant={slot.isAvailable ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleAvailability(slot.id)}
                    >
                      {slot.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTimeSlot(slot.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}

          {timeSlots.length > 0 && (
            <div className="pt-4 border-t">
              <Button className="w-full bg-ocean hover:bg-ocean-dark">
                Save Availability
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityScheduler;
