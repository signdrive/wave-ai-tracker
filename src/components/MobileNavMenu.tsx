
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, LogOut, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { User as AuthUser } from '@supabase/supabase-js';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  user: AuthUser | null;
  userRole: string | null;
  onSignOut: () => void;
  onSignIn: () => void;
}

const MobileNavMenu: React.FC<MobileNavMenuProps> = ({
  isOpen,
  onClose,
  navItems,
  user,
  userRole,
  onSignOut,
  onSignIn,
}) => {
  const location = useLocation();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500';
      case 'mentor': return 'bg-green-500';
      case 'student': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-ocean text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <div>
                <span>{item.label}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
            </Link>
          );
        })}
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 space-y-2">
          {user ? (
            <>
              <div className="px-3 py-2">
                <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">{user.user_metadata?.full_name || user.email}</p>
                <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
                {userRole && <Badge className={`${getRoleBadgeColor(userRole)} mt-2`}>{userRole}</Badge>}
              </div>

              <Link to="/privacy-settings" onClick={onClose} className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Shield className="w-4 h-4" />
                <span>Privacy Settings</span>
              </Link>

              <button onClick={onSignOut} className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <Button
              onClick={() => {
                onSignIn();
                onClose();
              }}
              className="w-full bg-ocean hover:bg-ocean-dark"
            >
              <User className="w-4 h-4 mr-1" />
              Sign In
            </Button>
          )}
          <div className="flex items-center justify-between px-3 py-2 mt-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavMenu;
