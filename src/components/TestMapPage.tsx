
import React from 'react';
import SafeMap from './SafeMap';
import FixedMentorMapLayer from './FixedMentorMapLayer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const testMentors = [
  {
    id: '1',
    name: 'Pipeline Pro',
    lat: 21.6633,
    lng: -158.0667,
    bio: 'Expert at Pipeline, 20+ years experience',
    hourly_rate: 150,
    is_available: true
  },
  {
    id: '2',
    name: 'Malibu Mike',
    lat: 34.0522,
    lng: -118.2437,
    bio: 'Perfect waves instructor in Malibu',
    hourly_rate: 120,
    is_available: false
  },
  {
    id: '3',
    name: 'Santa Cruz Sam',
    lat: 36.9741,
    lng: -122.0308,
    bio: 'Cold water surfing specialist',
    hourly_rate: 100,
    is_available: true
  }
];

const TestMapPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBookSession = (mentorId: string) => {
    console.log('Booking session with mentor:', mentorId);
    alert(`Booking session with mentor ${mentorId}`);
  };

  return (
    <div className="relative h-screen w-full">
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/')}
          className="bg-white/90 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
      
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm">
          <div className="font-semibold">Test Map</div>
          <div className="text-gray-600">{testMentors.length} mentors</div>
        </div>
      </div>

      <SafeMap 
        center={[34.0522, -118.2437]} 
        zoom={6}
      >
        <FixedMentorMapLayer 
          mentors={testMentors} 
          onBookSession={handleBookSession} 
        />
      </SafeMap>
    </div>
  );
};

export default TestMapPage;
