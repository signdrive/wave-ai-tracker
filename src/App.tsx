
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { OfflineIndicator } from '@/components/OfflineIndicator';

// Pages
import Index from '@/pages/Index';
import MapPage from '@/pages/MapPage';
import LiveSpotsPage from '@/pages/LiveSpotsPage';
import BookSessionsPage from '@/pages/BookSessionsPage';
import SurfLogPage from '@/pages/SurfLogPage';
import MentorshipPage from '@/pages/MentorshipPage';
import PremiumPage from '@/pages/PremiumPage';
import AdminPage from '@/pages/AdminPage';
import AdminApiConfigPage from '@/pages/AdminApiConfigPage';
import AdminSettingsPage from '@/pages/AdminSettingsPage';
import AuthCallback from '@/pages/AuthCallback';
import NotFound from '@/pages/NotFound';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import CookiePolicyPage from '@/pages/CookiePolicyPage';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="wavefinder-theme">
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/live-spots" element={<LiveSpotsPage />} />
                <Route path="/book-sessions" element={<BookSessionsPage />} />
                <Route path="/surf-log" element={<SurfLogPage />} />
                <Route path="/mentorship" element={<MentorshipPage />} />
                <Route path="/premium" element={<PremiumPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/api-config" element={<AdminApiConfigPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <PWAInstallPrompt />
              <OfflineIndicator />
            </div>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
