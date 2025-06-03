
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { lazy } from "react";
import LazyLoader from "@/components/LazyLoader";
import ErrorBoundary from "@/components/ErrorBoundary";
import OfflineIndicator from "./components/OfflineIndicator";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const MapPage = lazy(() => import("./pages/MapPage"));
const PremiumPage = lazy(() => import("./pages/PremiumPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MentorshipPage = lazy(() => import("./pages/MentorshipPage"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && 'status' in error && typeof error.status === 'number') {
          return error.status >= 500 && failureCount < 3;
        }
        return failureCount < 3;
      },
    },
  },
});

const App = () => {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="wave-ai-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <OfflineIndicator />
            <PWAInstallPrompt />
            <BrowserRouter>
              <div className="min-h-screen w-full transition-colors duration-300">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <LazyLoader skeletonType="tabs">
                        <Index />
                      </LazyLoader>
                    } 
                  />
                  <Route 
                    path="/map" 
                    element={
                      <LazyLoader skeletonType="forecast">
                        <MapPage />
                      </LazyLoader>
                    } 
                  />
                  <Route 
                    path="/mentorship" 
                    element={
                      <LazyLoader skeletonType="card">
                        <MentorshipPage />
                      </LazyLoader>
                    } 
                  />
                  <Route 
                    path="/auth/callback" 
                    element={
                      <LazyLoader skeletonType="card">
                        <AuthCallback />
                      </LazyLoader>
                    } 
                  />
                  <Route 
                    path="/premium" 
                    element={
                      <LazyLoader skeletonType="card">
                        <PremiumPage />
                      </LazyLoader>
                    } 
                  />
                  <Route 
                    path="*" 
                    element={
                      <LazyLoader>
                        <NotFound />
                      </LazyLoader>
                    } 
                  />
                </Routes>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
