
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

type WaveStyle = 'Barrel' | 'Performance' | 'Aerial' | 'Beginner';
type WavePool = 'Kelly Slater Surf Ranch' | 'BSR Surf Resort' | 'Urbnsurf Melbourne' | 'The Wave Bristol';

const WavePoolBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [waveHeight, setWaveHeight] = useState<number[]>([3]);
  const [waveLength, setWaveLength] = useState<number[]>([15]);
  const [waveStyle, setWaveStyle] = useState<WaveStyle>('Performance');
  const [selectedPool, setSelectedPool] = useState<WavePool>('Kelly Slater Surf Ranch');
  const [perfectWaveGuarantee, setPerfectWaveGuarantee] = useState<boolean>(false);

  const availableTimes = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const handleSubmit = () => {
    // In a real app, this would submit the booking
    alert(`Booking request submitted for ${selectedPool} on ${selectedDate ? format(selectedDate, 'PPP') : 'No date selected'}`);
  };

  const wavePoolImages: Record<WavePool, string> = {
    'Kelly Slater Surf Ranch': 'https://images.unsplash.com/photo-1590056468075-7c0720777fe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    'BSR Surf Resort': 'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80', 
    'Urbnsurf Melbourne': 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    'The Wave Bristol': 'https://images.unsplash.com/photo-1455729552865-3658a5d39692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
  };

  return (
    <section id="wave-pools" className="py-16 bg-sand-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ocean-dark mb-4">Wave Pool Booking</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Design your perfect wave session at world-class artificial wave facilities.
            Customize your wave height, length, and style for the ultimate surf experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Wave Pool Selection */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Select Wave Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={selectedPool} 
                  onValueChange={(value) => setSelectedPool(value as WavePool)}
                  className="space-y-4"
                >
                  {Object.keys(wavePoolImages).map((pool) => (
                    <div key={pool} className="flex items-center space-x-2">
                      <RadioGroupItem value={pool} id={`pool-${pool}`} />
                      <Label htmlFor={`pool-${pool}`} className="flex-1 cursor-pointer">{pool}</Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="mt-6 rounded-lg overflow-hidden h-48">
                  <img 
                    src={wavePoolImages[selectedPool]} 
                    alt={selectedPool} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Wave Settings */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Customize Your Wave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Wave Height</Label>
                    <span className="text-sm font-medium">{waveHeight[0]}ft</span>
                  </div>
                  <Slider 
                    value={waveHeight} 
                    onValueChange={setWaveHeight}
                    max={8}
                    min={1}
                    step={0.5}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Wave Length</Label>
                    <span className="text-sm font-medium">{waveLength[0]}s</span>
                  </div>
                  <Slider 
                    value={waveLength} 
                    onValueChange={setWaveLength}
                    max={30}
                    min={5}
                    step={1}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Wave Style</Label>
                  <RadioGroup 
                    value={waveStyle} 
                    onValueChange={(value) => setWaveStyle(value as WaveStyle)}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Barrel" id="style-barrel" />
                      <Label htmlFor="style-barrel">Barrel</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Performance" id="style-performance" />
                      <Label htmlFor="style-performance">Performance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Aerial" id="style-aerial" />
                      <Label htmlFor="style-aerial">Aerial</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Beginner" id="style-beginner" />
                      <Label htmlFor="style-beginner">Beginner</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="perfect-wave" 
                    checked={perfectWaveGuarantee}
                    onCheckedChange={(checked) => setPerfectWaveGuarantee(checked as boolean)}
                  />
                  <Label htmlFor="perfect-wave" className="text-sm">
                    Perfect Wave Guarantee (+$25)
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Date and Time */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Session Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Available Times</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map((time) => (
                      <Button key={time} variant="outline" className="text-sm">
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-ocean hover:bg-ocean-dark"
                  onClick={handleSubmit}
                >
                  Book Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WavePoolBooking;
