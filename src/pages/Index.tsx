
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import WavePoolBooking from '@/components/WavePoolBooking';
import SurfCamDisplay from '@/components/SurfCamDisplay';
import TideChart from '@/components/TideChart';
import Footer from '@/components/Footer';
import { useApiKeys } from '@/hooks/useRealTimeData';

const Index = () => {
  const { loadStoredKeys } = useApiKeys();

  useEffect(() => {
    // Load any stored API keys on app start
    loadStoredKeys();
  }, [loadStoredKeys]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main>
        <Hero />
        <WavePoolBooking />
        <SurfCamDisplay />
        <TideChart />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
