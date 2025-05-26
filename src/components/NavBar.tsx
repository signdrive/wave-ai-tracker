
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, MenuIcon, XIcon, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthDialog from './AuthDialog';
import { useToast } from '@/hooks/use-toast';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
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
    <>
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-ocean-dark/90 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 relative">
                  <div className="absolute inset-0 bg-ocean rounded-full"></div>
                  <div className="absolute inset-1 bg-white dark:bg-ocean-dark rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-ocean rounded-full"></div>
                </div>
                <span className="font-bold text-xl text-ocean-dark dark:text-white">WaveFinder</span>
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#wave-pools" className="text-foreground hover:text-ocean transition duration-300">Wave Pools</a>
              <a href="#surf-cams" className="text-foreground hover:text-ocean transition duration-300">Surf Cams</a>
              <a href="#tides" className="text-foreground hover:text-ocean transition duration-300">Tides</a>
              
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
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-ocean-dark border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-2 space-y-2">
              <a 
                href="#wave-pools" 
                className="block py-2 text-foreground hover:text-ocean"
                onClick={() => setIsMenuOpen(false)}
              >
                Wave Pools
              </a>
              <a 
                href="#surf-cams" 
                className="block py-2 text-foreground hover:text-ocean"
                onClick={() => setIsMenuOpen(false)}
              >
                Surf Cams
              </a>
              <a 
                href="#tides" 
                className="block py-2 text-foreground hover:text-ocean"
                onClick={() => setIsMenuOpen(false)}
              >
                Tides
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
                      setIsMenuOpen(false);
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
    </>
  );
};

export default NavBar;
