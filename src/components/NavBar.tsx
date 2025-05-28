
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Waves, Map, Home } from 'lucide-react';

const NavBar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Waves className="w-8 h-8 text-ocean" />
            <span className="text-xl font-bold text-ocean-dark">SurfCam Global</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-ocean bg-ocean/10' 
                  : 'text-gray-600 hover:text-ocean hover:bg-ocean/5'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/map"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/map') 
                  ? 'text-ocean bg-ocean/10' 
                  : 'text-gray-600 hover:text-ocean hover:bg-ocean/5'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Map</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
