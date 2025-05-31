
import React from 'react';
import DatabaseMapView from '@/components/DatabaseMapView';

const MapPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <main className="pt-16">
        <DatabaseMapView />
      </main>
    </div>
  );
};

export default MapPage;
