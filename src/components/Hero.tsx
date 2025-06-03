
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <div className="relative w-full h-64 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute min-w-full min-h-full object-cover"
          poster="https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
        >
          <source src="https://player.vimeo.com/external/372357424.hd.mp4?s=ea6aec3f7f71f2c139ec57f568fb943d42584cc9&profile_id=175&oauth2_token_id=57447761" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/30 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <div className="animate-fade-in max-w-3xl mx-auto">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 leading-tight">
            Discover Your Perfect Wave
          </h1>
          <p className="text-xs md:text-sm lg:text-base mb-4 max-w-xl mx-auto leading-relaxed">
            Book surf sessions at premium wave pools or find the best natural waves with our AI-powered surf cameras.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
            <Button size="sm" className="bg-ocean hover:bg-ocean-dark px-4 py-1.5 text-sm">
              Book Wave Pool
            </Button>
            <Button size="sm" variant="outline" className="border-white text-white hover:bg-white/20 px-4 py-1.5 text-sm">
              Check Live Surf Cams
            </Button>
          </div>
        </div>
      </div>

      {/* Wave Animation */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
      </div>
    </div>
  );
};

export default Hero;
