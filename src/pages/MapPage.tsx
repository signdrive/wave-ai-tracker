
import React from 'react';
import PremiumGate from '@/components/PremiumGate';
import DatabaseMapView from '@/components/DatabaseMapView';
import SEOFriendlyMapPage from '@/components/SEOFriendlyMapPage';

const MapPage = () => {
  // Always show SEO-friendly version for better indexing
  // The DatabaseMapView is accessible without premium for browsing
  return (
    <div className="bg-gradient-to-br from-ocean/5 to-sand/20 min-h-screen">
      <DatabaseMapView />
    </div>
  );
};

export default MapPage;
