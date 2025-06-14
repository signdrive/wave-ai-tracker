
import React from 'react';
import PremiumGate from '@/components/PremiumGate';
import DatabaseMapView from '@/components/DatabaseMapView';

const MapPage = () => {
  return (
    <div className="bg-gradient-to-br from-ocean/5 to-sand/20 h-full">
      <PremiumGate>
        <DatabaseMapView />
      </PremiumGate>
    </div>
  );
};

export default MapPage;
