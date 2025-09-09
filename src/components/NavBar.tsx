
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Waves, BarChart3, Calendar, Map, User, Shield, Settings, Trophy, Bell, TrendingUp, Search, AlertTriangle, ShoppingBag, GraduationCap, Plane, Cloud, Users, UserPlus, Zap, BookOpen, Star, Camera, Brain, Target, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useMentorship } from '@/hooks/useMentorship';
import EnhancedAuthDialog from '@/components/EnhancedAuthDialog';
import { UserNav } from './UserNav';
import MobileNavMenu from './MobileNavMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  // Core navigation items (always visible)
  const coreNavItems: any[] = [];

  // Grouped navigation items for dropdowns
  const menuGroups = {
    spots: {
      label: 'Surf Spots',
      icon: Map,
      items: [
        { path: '/live-spots', label: 'Live Spots', icon: Camera, description: 'AI camera feeds' },
        { path: '/map', label: 'Map', icon: Map, description: 'Interactive surf spot map' },
      ]
    },
    learning: {
      label: 'Learning',
      icon: GraduationCap,
      items: [
        { path: '/surf-log', label: 'Surf Log', icon: BookOpen, description: 'Track your sessions' },
        { path: '/lessons', label: 'Lessons', icon: GraduationCap, description: 'Book surf lessons with instructors' },
        { path: '/mentorship', label: 'Mentorship', icon: Users, description: 'Connect with mentors' },
        { path: '/challenges', label: 'Challenges', icon: Target, description: 'Surf challenges & goals' },
        { path: '/gamification', label: 'Gamification', icon: Trophy, description: 'Achievements & rewards' },
      ]
    },
    community: {
      label: 'Community',
      icon: Users,
      items: [
        { path: '/community', label: 'Community', icon: Users, description: 'Connect with surfers' },
        { path: '/discovery', label: 'Discovery', icon: Search, description: 'Discover new spots' },
        { path: '/book-sessions', label: 'Sessions', icon: Calendar, description: 'Book surf sessions' },
      ]
    },
    premium: {
      label: 'Premium',
      icon: Zap,
      items: [
        { path: '/premium', label: 'Premium', icon: Zap, description: 'Premium features' },
        { path: '/premium-weather', label: 'Weather+', icon: Cloud, description: 'Premium weather data' },
        { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag, description: 'Buy & sell surf gear' },
        { path: '/travel', label: 'Travel', icon: Plane, description: 'Surf travel packages' },
      ]
    },
    tools: {
      label: 'Tools',
      icon: Settings,
      items: [
        { path: '/', label: 'Dashboard', icon: BarChart3, description: 'Surf conditions summary' },
        { path: '/surf-blog', label: 'Surf Blog', icon: Waves, description: 'World\'s best surf spots guide' },
        { path: '/analytics', label: 'Analytics', icon: TrendingUp, description: 'Performance analytics' },
        { path: '/notifications', label: 'Notifications', icon: Bell, description: 'Alerts & updates' },
        { path: '/safety', label: 'Safety', icon: AlertTriangle, description: 'Safety information' },
      ]
    }
  };

  // Flatten all items for mobile menu
  const allNavItems = [
    ...coreNavItems,
    ...Object.values(menuGroups).flatMap(group => group.items)
  ];

  // Add admin links for admin users
  const adminNavItems = userRole === 'admin' ? [
    { path: '/admin', label: 'Admin Panel', icon: Shield, description: 'System administration' },
    { path: '/admin/api-config', label: 'API Config', icon: Settings, description: 'API key management' }
  ] : [];

  // Combine all items for mobile menu
  const mobileNavItems = [...allNavItems, ...adminNavItems];

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
            <div className="hidden md:flex items-center space-x-2">
              {/* Core Navigation Items */}
              {coreNavItems.map((item) => {
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

              {/* Dropdown Menus */}
              {Object.entries(menuGroups).map(([key, group]) => {
                const GroupIcon = group.icon;
                const isGroupActive = group.items.some(item => location.pathname === item.path);
                
                return (
                  <DropdownMenu key={key}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                          isGroupActive
                            ? 'bg-ocean text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <GroupIcon className="w-4 h-4" />
                        <span>{group.label}</span>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="start" 
                      className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                    >
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                          <DropdownMenuItem key={item.path} asChild>
                            <Link
                              to={item.path}
                              className={`flex items-center space-x-2 px-3 py-2 text-sm transition-colors w-full ${
                                isActive
                                  ? 'bg-ocean text-white'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <ItemIcon className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{item.label}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              })}

              {/* Admin Items (if applicable) */}
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                    title={item.description}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side items - More prominent */}
            <div className="hidden md:flex items-center space-x-3">
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Welcome, {user.email?.split('@')[0]}
                  </span>
                  <UserNav />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => setShowAuthDialog(true)}
                    className="border-ocean text-ocean hover:bg-ocean hover:text-white"
                  >
                    <User className="w-4 h-4 mr-1" />
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => setShowAuthDialog(true)}
                    className="bg-ocean hover:bg-ocean-dark text-white"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Sign Up
                  </Button>
                </div>
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
          navItems={mobileNavItems}
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
