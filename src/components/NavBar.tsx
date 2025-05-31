
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Waves, Menu, X, Crown, Map, Home, Users, Shield, Award, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import AuthDialog from './AuthDialog';
import { ThemeToggle } from './ThemeToggle';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { userRole, isAdmin, isMentor, isStudent } = useUserRole();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <>
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105">
              <Waves className="h-8 w-8 text-ocean dark:text-ocean-light" />
              <span className="text-xl font-bold text-ocean-dark dark:text-white">Wave AI</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`flex items-center space-x-1 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActivePath('/') ? 'text-ocean dark:text-ocean-light' : 'text-gray-600 dark:text-gray-300 hover:text-ocean dark:hover:text-ocean-light'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/map" 
                className={`flex items-center space-x-1 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActivePath('/map') ? 'text-ocean dark:text-ocean-light' : 'text-gray-600 dark:text-gray-300 hover:text-ocean dark:hover:text-ocean-light'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Surf Map</span>
              </Link>

              {/* Role-specific menu items */}
              {user && (
                <>
                  {isAdmin() && (
                    <Link 
                      to="/admin" 
                      className={`flex items-center space-x-1 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                        isActivePath('/admin') ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  )}

                  {isMentor() && (
                    <>
                      <Link 
                        to="/mentor/students" 
                        className={`flex items-center space-x-1 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                          isActivePath('/mentor/students') ? 'text-ocean dark:text-ocean-light' : 'text-gray-600 dark:text-gray-300 hover:text-ocean dark:hover:text-ocean-light'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        <span>My Students</span>
                      </Link>
                      <Link 
                        to="/mentor/availability" 
                        className={`flex items-center space-x-1 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                          isActivePath('/mentor/availability') ? 'text-ocean dark:text-ocean-light' : 'text-gray-600 dark:text-gray-300 hover:text-ocean dark:hover:text-ocean-light'
                        }`}
                      >
                        <Award className="w-4 h-4" />
                        <span>Availability</span>
                      </Link>
                    </>
                  )}

                  {isStudent() && (
                    <>
                      <Link 
                        to="/student/mentors" 
                        className={`flex items-center space-x-1 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                          isActivePath('/student/mentors') ? 'text-ocean dark:text-ocean-light' : 'text-gray-600 dark:text-gray-300 hover:text-ocean dark:hover:text-ocean-light'
                        }`}
                      >
                        <Award className="w-4 h-4" />
                        <span>Find Mentors</span>
                      </Link>
                      <Link 
                        to="/student/progress" 
                        className={`flex items-center space-x-1 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                          isActivePath('/student/progress') ? 'text-ocean dark:text-ocean-light' : 'text-gray-600 dark:text-gray-300 hover:text-ocean dark:hover:text-ocean-light'
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>My Progress</span>
                      </Link>
                    </>
                  )}
                </>
              )}

              <Link 
                to="/premium" 
                className={`flex items-center space-x-1 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActivePath('/premium') ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span>Premium</span>
              </Link>
            </div>

            {/* Auth Buttons & Theme Toggle */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      Welcome, {getUserDisplayName()}
                    </span>
                    {userRole && (
                      <div className="text-xs text-gray-500 capitalize">
                        {userRole}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAuthDialogOpen(true)}
                  className="bg-ocean hover:bg-ocean-dark transition-all duration-200 hover:scale-105"
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="transition-all duration-200 hover:scale-105"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className={`flex items-center space-x-2 text-base font-medium ${
                    isActivePath('/') ? 'text-ocean' : 'text-gray-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                
                <Link 
                  to="/map" 
                  className={`flex items-center space-x-2 text-base font-medium ${
                    isActivePath('/map') ? 'text-ocean' : 'text-gray-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Map className="w-5 h-5" />
                  <span>Surf Map</span>
                </Link>

                {/* Mobile role-specific items */}
                {user && (
                  <>
                    {isAdmin() && (
                      <Link 
                        to="/admin" 
                        className={`flex items-center space-x-2 text-base font-medium ${
                          isActivePath('/admin') ? 'text-red-600' : 'text-gray-600'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Shield className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    {isMentor() && (
                      <>
                        <Link 
                          to="/mentor/students" 
                          className="flex items-center space-x-2 text-base font-medium text-gray-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Users className="w-5 h-5" />
                          <span>My Students</span>
                        </Link>
                        <Link 
                          to="/mentor/availability" 
                          className="flex items-center space-x-2 text-base font-medium text-gray-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Award className="w-5 h-5" />
                          <span>Set Availability</span>
                        </Link>
                      </>
                    )}

                    {isStudent() && (
                      <>
                        <Link 
                          to="/student/mentors" 
                          className="flex items-center space-x-2 text-base font-medium text-gray-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Award className="w-5 h-5" />
                          <span>Find Mentors</span>
                        </Link>
                        <Link 
                          to="/student/progress" 
                          className="flex items-center space-x-2 text-base font-medium text-gray-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <BookOpen className="w-5 h-5" />
                          <span>My Progress</span>
                        </Link>
                      </>
                    )}
                  </>
                )}

                <Link 
                  to="/premium" 
                  className={`flex items-center space-x-2 text-base font-medium ${
                    isActivePath('/premium') ? 'text-yellow-600' : 'text-gray-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Crown className="w-5 h-5" />
                  <span>Premium</span>
                </Link>

                <div className="pt-4 border-t border-gray-200">
                  {user ? (
                    <div className="space-y-3">
                      <div className="text-sm">
                        <p className="text-gray-600">Welcome, {getUserDisplayName()}</p>
                        {userRole && (
                          <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-ocean hover:bg-ocean-dark"
                      onClick={() => {
                        setIsAuthDialogOpen(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
      />
    </>
  );
};

export default NavBar;
