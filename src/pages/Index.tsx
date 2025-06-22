
import React from 'react';
import Hero from '@/components/Hero';
import SurfForecast from '@/components/SurfForecast';
import SurfCamDisplay from '@/components/SurfCamDisplay';
import AdvancedFeaturesShowcase from '@/components/AdvancedFeaturesShowcase';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <SurfForecast />
      <SurfCamDisplay />
      <AdvancedFeaturesShowcase />
    </div>
  );
};

export default Index;
