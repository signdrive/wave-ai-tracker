
import React from 'react';
import Hero from '@/components/Hero';
import EnhancedSurfInterface from '@/components/EnhancedSurfInterface';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Advanced Features Interface - AR Zone, AI Instructor, etc. */}
      <section className="py-8">
        <div className="container mx-auto px-4 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ocean-dark mb-4">
              Advanced Surf Features
            </h2>
            <p className="text-xl text-gray-600">
              Access AR Vision, AI Coach, Live Forecasts, and more advanced tools
            </p>
          </div>
        </div>
        <EnhancedSurfInterface />
      </section>
    </div>
  );
};

export default Index;
