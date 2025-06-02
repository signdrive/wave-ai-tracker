
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMentorship } from '@/hooks/useMentorship';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Shield, LogIn } from 'lucide-react';
import { UserRole } from '@/types/mentorship';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  fallbackPath = '/'
}) => {
  const { user, loading: authLoading } = useAuth();
  const { userRole, roleLoading } = useMentorship();
  const location = useLocation();

  console.log('ProtectedRoute - Current state:', { 
    user: !!user, 
    userEmail: user?.email, 
    authLoading, 
    userRole, 
    roleLoading, 
    requiredRole,
    currentPath: location.pathname,
    fallbackPath
  });

  // Show loading while auth is being determined
  if (authLoading) {
    console.log('ProtectedRoute - Auth loading, showing spinner');
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Verifying authentication...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to fallback if not authenticated
  if (!user) {
    console.log('ProtectedRoute - No authenticated user, redirecting to:', fallbackPath);
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Show loading while role is being determined (only if we have a user and require a role)
  if (requiredRole && roleLoading) {
    console.log('ProtectedRoute - Role loading, showing spinner');
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Checking permissions...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole && userRole !== requiredRole) {
    console.log('ProtectedRoute - Role mismatch. Required:', requiredRole, 'User role:', userRole);
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Shield className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 text-center mb-4">
              You don't have permission to access this area. 
              Required role: {requiredRole}, your role: {userRole || 'none'}
            </p>
            <div className="flex space-x-2">
              <button 
                onClick={() => window.history.back()}
                className="text-ocean hover:underline"
              >
                Go back
              </button>
              <span className="text-gray-400">|</span>
              <button 
                onClick={() => window.location.href = '/'}
                className="text-ocean hover:underline"
              >
                Go to Home
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('ProtectedRoute - Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
