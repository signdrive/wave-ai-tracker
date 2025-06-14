
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import { useApiKeys } from '@/hooks/useRealTimeData';
import EnhancedSurfInterface from '@/components/EnhancedSurfInterface';
import PremiumGate from '@/components/PremiumGate';

const Index = () => {
  const { loadStoredKeys } = useApiKeys();

  useEffect(() => {
    // Load any stored API keys on app start
    loadStoredKeys();
  }, [loadStoredKeys]);

  return (
    <div className="bg-gradient-to-br from-ocean/5 to-sand/20">
      {/* Hero Section - Always Visible */}
      <Hero />
      
      {/* Enhanced Surf Interface - Protected by Premium */}
      <PremiumGate>
        <section id="surf-platform" className="py-16">
          <EnhancedSurfInterface />
        </section>
      </PremiumGate>
    </div>
  );
};

export default Index;
