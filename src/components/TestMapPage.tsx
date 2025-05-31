
import React from 'react';
import DirectMapView from './DirectMapView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TestMapPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full">
      <div className="absolute top-4 left-4 z-20">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/')}
          className="bg-white/90 backdrop-blur-sm shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
      
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm shadow-lg">
          <div className="font-semibold text-blue-600">Surf Mentor Map</div>
          <div className="text-gray-600">3 mentors available</div>
          <div className="text-xs text-gray-500 mt-1">Click markers for details</div>
        </div>
      </div>

      <DirectMapView />
    </div>
  );
};

export default TestMapPage;
