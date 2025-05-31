
import React from 'react';
import EnhancedDatabaseMapView from '@/components/EnhancedDatabaseMapView';
import MapErrorBoundary from '@/components/MapErrorBoundary';
import ErrorBoundary from '@/components/ErrorBoundary';

const MapPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <main className="pt-16">
        <ErrorBoundary>
          <MapErrorBoundary>
            <EnhancedDatabaseMapView />
          </MapErrorBoundary>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default MapPage;
