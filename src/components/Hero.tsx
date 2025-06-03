import React from 'react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
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
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Your Perfect Wave
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Book surf sessions at premium wave pools or find the best natural waves with our AI-powered surf cameras.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-ocean hover:bg-ocean-dark text-lg">
              Book Wave Pool
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 text-lg">
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

