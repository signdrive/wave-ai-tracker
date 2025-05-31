
import React from 'react';
import EnhancedDatabaseMapView from '@/components/EnhancedDatabaseMapView';

const MapPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <main className="pt-16">
        <EnhancedDatabaseMapView />
      </main>
    </div>
  );
};

export default MapPage;
