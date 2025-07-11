
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
