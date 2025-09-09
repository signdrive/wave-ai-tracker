
import React from 'react';
import PremiumGate from '@/components/PremiumGate';
import DatabaseMapView from '@/components/DatabaseMapView';
import SEOFriendlyMapPage from '@/components/SEOFriendlyMapPage';

const MapPage = () => {
  // Check if this is a search engine crawler or bot
  const isBot = typeof navigator !== 'undefined' && (
    /bot|crawler|spider|crawling/i.test(navigator.userAgent) ||
    navigator.userAgent === '' // Often the case for headless crawlers
  );

  // For SEO/crawlers, show the SEO-friendly version
  if (isBot) {
    return <SEOFriendlyMapPage />;
  }

  // For regular users, show the premium-gated version
  return (
    <div className="bg-gradient-to-br from-ocean/5 to-sand/20 min-h-screen">
      <PremiumGate>
        <DatabaseMapView />
      </PremiumGate>
    </div>
  );
};

export default MapPage;
