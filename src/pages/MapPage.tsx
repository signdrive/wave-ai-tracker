
import React from 'react';
import { Helmet } from 'react-helmet';
import PremiumGate from '@/components/PremiumGate';
import DatabaseMapView from '@/components/DatabaseMapView';
import SEOFriendlyMapPage from '@/components/SEOFriendlyMapPage';

const MapPage = () => {
  const canonicalUrl = 'https://www.wavementor.com/map';
  const pageTitle = 'Interactive Surf Spot Map - Global Locations | WaveMentor';
  const pageDescription = 'Explore surf spots worldwide with our interactive map. Find wave conditions, local crowds, and detailed forecasts for thousands of locations.';

  // Always show SEO-friendly version for better indexing
  // The DatabaseMapView is accessible without premium for browsing
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="surf map, surf spots, interactive surf map, global surf locations, surf forecast map, wave conditions map" />
        <link rel="canonical" href={canonicalUrl} />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="WaveMentor" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": pageTitle,
            "description": pageDescription,
            "url": canonicalUrl,
            "isPartOf": {
              "@type": "WebSite",
              "name": "WaveMentor",
              "url": "https://www.wavementor.com"
            }
          })}
        </script>
      </Helmet>
      <div className="bg-gradient-to-br from-ocean/5 to-sand/20 min-h-screen">
        <DatabaseMapView />
      </div>
    </>
  );
};

export default MapPage;
