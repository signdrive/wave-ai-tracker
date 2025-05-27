import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, MenuIcon, XIcon, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthDialog from './AuthDialog';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import Waves from '@/components/ui/waves';
import Menu from '@/components/ui/menu';
import X from '@/components/ui/x';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Waves className="h-8 w-8 text-ocean" />
            <span className="text-xl font-bold text-ocean-dark">SurfSpotter</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#surf-cams" className="text-gray-700 hover:text-ocean transition-colors">
              Live Cams
            </a>
            <Link to="/map" className="text-gray-700 hover:text-ocean transition-colors">
              Surf Map
            </Link>
            <a href="/#forecast" className="text-gray-700 hover:text-ocean transition-colors">
              Forecast
            </a>
            <a href="/#spots" className="text-gray-700 hover:text-ocean transition-colors">
              Spots
            </a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                <Button variant="outline" onClick={handleSignOut} className="border-ocean text-ocean hover:bg-ocean hover:text-white">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAuthDialogOpen(true)}
                  className="border-ocean text-ocean hover:bg-ocean hover:text-white"
                >
                  Sign In
                </Button>
                <Button className="bg-ocean hover:bg-ocean-dark">Book Now</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-gray-200">
          <div className="flex flex-col space-y-3">
            <a href="/#surf-cams" className="text-gray-700 hover:text-ocean transition-colors px-2 py-1">
              Live Cams
            </a>
            <Link to="/map" className="text-gray-700 hover:text-ocean transition-colors px-2 py-1">
              Surf Map
            </Link>
            <a href="/#forecast" className="text-gray-700 hover:text-ocean transition-colors px-2 py-1">
              Forecast
            </a>
            <a href="/#spots" className="text-gray-700 hover:text-ocean transition-colors px-2 py-1">
              Spots
            </a>
            
            {user ? (
              <div className="pt-2 space-y-2">
                <p className="text-sm text-gray-600">Welcome, {user.email}</p>
                <Button onClick={handleSignOut} variant="outline" className="w-full border-ocean text-ocean">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="pt-2 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full border-ocean text-ocean"
                  onClick={() => {
                    setIsAuthDialogOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button className="w-full bg-ocean hover:bg-ocean-dark">Book Now</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>

    <AuthDialog 
      open={isAuthDialogOpen} 
      onOpenChange={setIsAuthDialogOpen} 
    />
  );
};

export default NavBar;
