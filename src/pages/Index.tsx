
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { useApiKeys } from '@/hooks/useRealTimeData';
import EnhancedSurfInterface from '@/components/EnhancedSurfInterface';

const Index = () => {
  const { loadStoredKeys } = useApiKeys();

  useEffect(() => {
    // Load any stored API keys on app start
    loadStoredKeys();
  }, [loadStoredKeys]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <NavBar />
      <main>
        {/* Hero Section - Full Screen */}
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
