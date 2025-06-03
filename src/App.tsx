
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import OfflineIndicator from '@/components/OfflineIndicator';
import PremiumGate from '@/components/PremiumGate';
import ProtectedRoute from '@/components/ProtectedRoute';

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
      staleTime: 5 * 60 * 1000,
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
                <Route path="/premium" element={<PremiumPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                
                {/* Premium-gated routes */}
                <Route path="/" element={
                  <PremiumGate>
                    <Index />
                  </PremiumGate>
                } />
                <Route path="/map" element={
                  <PremiumGate>
                    <MapPage />
                  </PremiumGate>
                } />
                <Route path="/live-spots" element={
                  <PremiumGate>
                    <LiveSpotsPage />
                  </PremiumGate>
                } />
                <Route path="/book-sessions" element={
                  <PremiumGate>
                    <BookSessionsPage />
                  </PremiumGate>
                } />
                <Route path="/surf-log" element={
                  <PremiumGate>
                    <SurfLogPage />
                  </PremiumGate>
                } />
                <Route path="/mentorship" element={
                  <PremiumGate>
                    <MentorshipPage />
                  </PremiumGate>
                } />
                
                {/* Admin-only routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/api-config" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminApiConfigPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminSettingsPage />
                  </ProtectedRoute>
                } />
                
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
