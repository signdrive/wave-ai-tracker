
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import LiveSpotsPage from "./pages/LiveSpotsPage";
import BookSessionsPage from "./pages/BookSessionsPage";
import SurfLogPage from "./pages/SurfLogPage";
import MentorshipPage from "./pages/MentorshipPage";
import PremiumPage from "./pages/PremiumPage";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="wavefinder-theme">
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/live-spots" element={<LiveSpotsPage />} />
              <Route path="/book-sessions" element={<BookSessionsPage />} />
              <Route path="/surf-log" element={<SurfLogPage />} />
              <Route path="/mentorship" element={<MentorshipPage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
