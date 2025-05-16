
import React from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import WavePoolBooking from '@/components/WavePoolBooking';
import SurfCamDisplay from '@/components/SurfCamDisplay';
import TideChart from '@/components/TideChart';
import Footer from '@/components/Footer';

const Index = () => {
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
