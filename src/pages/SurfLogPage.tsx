
import React from 'react';
import { Helmet } from 'react-helmet';
import { useQueryClient } from '@tanstack/react-query';
import PremiumGate from '@/components/PremiumGate';
import SessionLogger from '@/components/SessionLogger';
import SurfLogHeader from '@/components/surf-log/SurfLogHeader';
import SurfLogInsights from '@/components/surf-log/SurfLogInsights';
import RecentSessionsList from '@/components/surf-log/RecentSessionsList';
import SEOFriendlySurfLogPage from '@/components/SEOFriendlySurfLogPage';
import { useSurfLogInsights } from '@/hooks/useSurfLogInsights';

const SurfLogPage = () => {
  const queryClient = useQueryClient();
  const canonicalUrl = 'https://www.wavementor.com/surf-log';
  const pageTitle = 'Surf Session Log & Analytics - Track Your Progress | WaveMentor';
  const pageDescription = 'Log your surf sessions and track your progress with AI-powered analytics. Get personalized insights and improve your surfing performance.';

  // Check if this is a search engine crawler or bot
  const isBot = typeof navigator !== 'undefined' && (
    /bot|crawler|spider|crawling/i.test(navigator.userAgent) ||
    navigator.userAgent === '' // Often the case for headless crawlers
  );

  // For SEO/crawlers, show the SEO-friendly version
  if (isBot) {
    return <SEOFriendlySurfLogPage />;
  }

  const {
    data: insightsData,
    isLoading: isLoadingInsights,
    error: insightsError,
    refetch: refetchInsights
  } = useSurfLogInsights();

  const sessions = insightsData?.raw_sessions_for_debug || [];

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="surf log, surf session tracker, surf analytics, wave tracking, surf progress, surfing performance" />
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
      <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <PremiumGate>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <SurfLogHeader />

          {/* Session Logger Form */}
          <SessionLogger onSessionSaved={refetchInsights} />

          {/* Surf Log Insights */}
          <SurfLogInsights 
            insightsData={insightsData}
            isLoading={isLoadingInsights}
            error={insightsError as Error | undefined}
          />

          {/* Recent Sessions List */}
          <RecentSessionsList 
            sessions={sessions}
            isLoading={isLoadingInsights}
            error={insightsError as Error | null}
          />
        </div>
      </PremiumGate>
    </div>
    </>
  );
};

export default SurfLogPage;
