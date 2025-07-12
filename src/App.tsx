
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import LiveSpotsPage from '@/pages/LiveSpotsPage';
import BookSessionsPage from '@/pages/BookSessionsPage';
import SurfLogPage from '@/pages/SurfLogPage';
import MapPage from '@/pages/MapPage';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AdminPage from '@/pages/AdminPage';
import AdminApiConfigPage from '@/pages/AdminApiConfigPage';
import GdprCompliancePage from '@/pages/GdprCompliancePage';
import { ThemeProvider } from '@/components/ThemeProvider';
import PrivacySettingsPage from '@/pages/PrivacySettingsPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import NotFound from '@/pages/NotFound';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import AuthCallback from '@/pages/AuthCallback';
import CanonicalUrl from '@/components/CanonicalUrl';
import ChallengesPage from '@/components/challenges/ChallengesPage';
import NotificationsPage from '@/pages/NotificationsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import DiscoveryPage from '@/pages/DiscoveryPage';
import SafetyPage from '@/pages/SafetyPage';
import MarketplacePage from '@/pages/MarketplacePage';
import LessonsPage from '@/pages/LessonsPage';
import TravelPackagesPage from '@/pages/TravelPackagesPage';
import PremiumWeatherPage from '@/pages/PremiumWeatherPage';
import PremiumPage from '@/pages/PremiumPage';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router>
          <CanonicalUrl />
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <NavBar />
            <main className="pt-16 flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/live-spots" element={<LiveSpotsPage />} />
                <Route path="/book-sessions" element={<BookSessionsPage />} />
                <Route path="/surf-log" element={<SurfLogPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/api-config" element={<AdminApiConfigPage />} />
                <Route path="/gdpr-compliance" element={<GdprCompliancePage />} />
                <Route path="/privacy-settings" element={<PrivacySettingsPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/challenges" element={<ChallengesPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/discovery" element={<DiscoveryPage />} />
                <Route path="/safety" element={<SafetyPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/lessons" element={<LessonsPage />} />
                <Route path="/travel" element={<TravelPackagesPage />} />
                <Route path="/premium-weather" element={<PremiumWeatherPage />} />
                <Route path="/premium" element={<PremiumPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <PWAInstallPrompt />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
