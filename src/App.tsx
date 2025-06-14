
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '@/pages/Dashboard';
import LiveSpotsPage from '@/pages/LiveSpotsPage';
import BookSessionsPage from '@/pages/BookSessionsPage';
import SurfLogPage from '@/pages/SurfLogPage';
import MapPage from '@/pages/MapPage';
import NavBar from '@/components/NavBar';
import AdminPage from '@/pages/AdminPage';
import AdminApiConfigPage from '@/pages/AdminApiConfigPage';
import { ThemeProvider } from '@/components/ThemeProvider';
import PrivacySettingsPage from '@/pages/PrivacySettingsPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <NavBar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/live-spots" element={<LiveSpotsPage />} />
                <Route path="/book-sessions" element={<BookSessionsPage />} />
                <Route path="/surf-log" element={<SurfLogPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/api-config" element={<AdminApiConfigPage />} />
                <Route path="/privacy-settings" element={<PrivacySettingsPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
