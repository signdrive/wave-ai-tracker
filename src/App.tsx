import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { Dashboard } from '@/pages/Dashboard';
import LiveSpots from '@/pages/LiveSpots';
import BookSessions from '@/pages/BookSessions';
import SurfLog from '@/pages/SurfLog';
import MapPage from '@/pages/MapPage';
import NavBar from '@/components/NavBar';
import AdminPage from '@/pages/AdminPage';
import AuthenticationManager from '@/components/AuthenticationManager';
import AdminApiConfigPage from '@/pages/AdminApiConfigPage';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <NavBar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/live-spots" element={<LiveSpots />} />
              <Route path="/book-sessions" element={<BookSessions />} />
              <Route path="/surf-log" element={<SurfLog />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/api-config" element={<AdminApiConfigPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
