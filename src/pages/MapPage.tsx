
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SimpleSurfSpotMapPage from '@/components/SimpleSurfSpotMapPage';

const MapPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <NavBar />
      <main className="pt-16">
        <SimpleSurfSpotMapPage />
      </main>
      <Footer />
    </div>
  );
};

export default MapPage;
