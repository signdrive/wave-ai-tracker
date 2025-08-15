
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Waves, BarChart3, Calendar, Map, User, Shield, Settings, Trophy, Bell, TrendingUp, Search, AlertTriangle, ShoppingBag, GraduationCap, Plane, Cloud, Users, UserPlus, Zap, BookOpen, Star, Camera, Brain, Target } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useMentorship } from '@/hooks/useMentorship';
import EnhancedAuthDialog from '@/components/EnhancedAuthDialog';
import { UserNav } from './UserNav';
import MobileNavMenu from './MobileNavMenu';

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
    // Core Features
    { path: '/', label: 'Dashboard', icon: BarChart3, description: 'Surf conditions summary' },
    { path: '/live-spots', label: 'Live Spots', icon: Camera, description: 'AI camera feeds' },
    { path: '/map', label: 'Map', icon: Map, description: 'Interactive surf spot map' },
    { path: '/surf-log', label: 'Surf Log', icon: BookOpen, description: 'Track your sessions' },
    
    // Learning & Growth
    { path: '/lessons', label: 'Lessons', icon: GraduationCap, description: 'Book surf lessons with instructors' },
    { path: '/mentorship', label: 'Mentorship', icon: Users, description: 'Connect with mentors' },
    { path: '/challenges', label: 'Challenges', icon: Target, description: 'Surf challenges & goals' },
    { path: '/gamification', label: 'Gamification', icon: Trophy, description: 'Achievements & rewards' },
    
    // Community & Social
    { path: '/community', label: 'Community', icon: Users, description: 'Connect with surfers' },
    { path: '/discovery', label: 'Discovery', icon: Search, description: 'Discover new spots' },
    { path: '/book-sessions', label: 'Sessions', icon: Calendar, description: 'Book surf sessions' },
    
    // Premium & Commerce
    { path: '/premium', label: 'Premium', icon: Zap, description: 'Premium features' },
    { path: '/premium-weather', label: 'Weather+', icon: Cloud, description: 'Premium weather data' },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag, description: 'Buy & sell surf gear' },
    { path: '/travel', label: 'Travel', icon: Plane, description: 'Surf travel packages' },
    
    // Content & Tools
    { path: '/surf-blog', label: 'Surf Blog', icon: Waves, description: 'World\'s best surf spots guide' },
    { path: '/analytics', label: 'Analytics', icon: TrendingUp, description: 'Performance analytics' },
    { path: '/notifications', label: 'Notifications', icon: Bell, description: 'Alerts & updates' },
    { path: '/safety', label: 'Safety', icon: AlertTriangle, description: 'Safety information' },
  ];

  // Add admin links for admin users
  const adminNavItems = userRole === 'admin' ? [
    { path: '/admin', label: 'Admin Panel', icon: Shield, description: 'System administration' },
    { path: '/admin/api-config', label: 'API Config', icon: Settings, description: 'API key management' }
  ] : [];

  const allNavItems = [...navItems, ...adminNavItems];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-ocean dark:text-ocean-light">
              <Waves className="w-8 h-8" />
              <span>WaveMentor</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {allNavItems.map((item) => {
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
                    title={item.description}
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
                <UserNav />
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
        <MobileNavMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          navItems={allNavItems}
          user={user}
          userRole={userRole}
          onSignOut={handleSignOut}
          onSignIn={() => setShowAuthDialog(true)}
        />
      </nav>

      <EnhancedAuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
    </>
  );
};

export default NavBar;
