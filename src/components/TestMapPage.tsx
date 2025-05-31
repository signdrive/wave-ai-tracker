
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
          <div className="font-semibold text-blue-600 mb-1">🏄 Surf Spots & Mentors</div>
          <div className="text-gray-600 text-xs mb-1">🌊 4 surf spots available</div>
          <div className="text-gray-600 text-xs mb-1">👨‍🏫 3 mentors online</div>
          <div className="text-xs text-gray-500 mt-2">
            <div>🟢 Green = Good conditions</div>
            <div>🔴 Red = Poor conditions</div>
          </div>
        </div>
      </div>

      <DirectMapView />
    </div>
  );
};

export default TestMapPage;
