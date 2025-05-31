
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  role, 
  fallback 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { userRole, isLoading: roleLoading, hasRole } = useUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-600">Please sign in to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (role && !hasRole(role)) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600">
              You don't have permission to access this page. Required role: {role}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
