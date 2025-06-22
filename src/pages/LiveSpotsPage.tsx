
import React from 'react';
import PremiumGate from '@/components/PremiumGate';
import SurfCamDisplay from '@/components/SurfCamDisplay';

const LiveSpotsPage = () => {
  return (
    <div className="bg-gradient-to-br from-ocean/5 to-sand/20 min-h-screen">
      <PremiumGate>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ocean-dark mb-2">Live Surf Spots</h1>
            <p className="text-gray-600">Watch live surf conditions with AI-powered camera feeds</p>
          </div>
          <SurfCamDisplay />
        </div>
      </PremiumGate>
    </div>
  );
};

export default LiveSpotsPage;
