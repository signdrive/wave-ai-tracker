
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

      <DirectMapView />
    </div>
  );
};

export default TestMapPage;
