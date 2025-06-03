
import React from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import WavePoolBooking from '@/components/WavePoolBooking';
import SurfCamDisplay from '@/components/SurfCamDisplay';
import TideChart from '@/components/TideChart';
import Footer from '@/components/Footer';
import EnhancedSurfInterface from '@/components/EnhancedSurfInterface';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <NavBar />
      <main className="pt-16">
        {/* Hero Section */}
        <Hero />
        
        {/* Enhanced Surf Interface - The Core Platform */}
        <section id="surf-platform" className="py-16">
          <EnhancedSurfInterface />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
