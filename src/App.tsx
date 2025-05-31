
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Index from './pages/Index';
import MapPage from './pages/MapPage';
import PremiumPage from './pages/PremiumPage';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { monitoring } from './lib/monitoring';
import { useEffect } from 'react';
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
  useEffect(() => {
    // Initialize monitoring
    monitoring.init({
      environment: import.meta.env.MODE,
      // dsn: process.env.SENTRY_DSN, // Add this when you have Sentry DSN
    });

    // Add breadcrumb for app initialization
    monitoring.addBreadcrumb('App initialized', 'lifecycle');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <div className="min-h-screen bg-background">
            <NavBar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/premium" element={<PremiumPage />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute role="admin">
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
