import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Waves, Map, Users, Crown, User, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useMentorship } from '@/hooks/useMentorship';
import EnhancedAuthDialog from '@/components/EnhancedAuthDialog';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { userRole } = useMentorship();

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Surf Tracker', icon: Waves },
    { path: '/map', label: 'Map View', icon: Map },
    { path: '/mentorship', label: 'Mentorship', icon: Users },
    { path: '/premium', label: 'Premium', icon: Crown },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500';
      case 'mentor': return 'bg-green-500';
      case 'student': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-ocean dark:text-ocean-light">
              <Waves className="w-8 h-8" />
              <span>WaveFinder</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-ocean text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side items */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center space-x-3">
                  {userRole && (
                    <Badge className={getRoleBadgeColor(userRole)}>
                      {userRole}
                    </Badge>
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user.email}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowAuthDialog(true)}
                  className="bg-ocean hover:bg-ocean-dark"
                >
                  <User className="w-4 h-4 mr-1" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-ocean text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <ThemeToggle />
                  
                  {user ? (
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        {userRole && (
                          <Badge className={getRoleBadgeColor(userRole)}>
                            {userRole}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {user.email}
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSignOut}
                        className="flex items-center space-x-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => {
                        setShowAuthDialog(true);
                        setIsMenuOpen(false);
                      }}
                      className="bg-ocean hover:bg-ocean-dark"
                    >
                      <User className="w-4 h-4 mr-1" />
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <EnhancedAuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    </>
  );
};

export default NavBar;
