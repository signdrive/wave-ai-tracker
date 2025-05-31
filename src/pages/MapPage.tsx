
import React from 'react';
import TestMapPage from '@/components/TestMapPage';
import MapErrorBoundary from '@/components/MapErrorBoundary';
import ErrorBoundary from '@/components/ErrorBoundary';

const MapPage = () => {
  return (
    <div className="min-h-screen">
      <ErrorBoundary>
        <MapErrorBoundary>
          <TestMapPage />
        </MapErrorBoundary>
      </ErrorBoundary>
    </div>
  );
};

export default MapPage;
