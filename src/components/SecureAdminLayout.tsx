
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { securityService } from '@/services/securityService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import AdminNav from './AdminNav';

interface SecureAdminLayoutProps {
  children: React.ReactNode;
}

const SecureAdminLayout: React.FC<SecureAdminLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReauthenticated, setIsReauthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [showReauth, setShowReauth] = useState(false);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkAdminPermissions();
    return () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
    };
  }, [user]);

  const checkAdminPermissions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Validate current session
      const sessionValid = await securityService.validateSession();
      if (!sessionValid) {
        await securityService.logSecurityEvent({
          user_id: user.id,
          event_type: 'admin_access_invalid_session',
          severity: 'high',
          details: { user_id: user.id }
        });
        setLoading(false);
        return;
      }

      // Check admin role
      const hasAdminRole = await securityService.checkUserRole('admin');
      setIsAdmin(hasAdminRole);

      if (hasAdminRole) {
        await securityService.logSecurityEvent({
          user_id: user.id,
          event_type: 'admin_panel_access',
          severity: 'medium',
          details: { user_id: user.id }
        });
      }
    } catch (error) {
      console.error('Admin permission check failed:', error);
      await securityService.logSecurityEvent({
        user_id: user?.id,
        event_type: 'admin_permission_check_failed',
        severity: 'high',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReauthentication = async () => {
    if (!user?.email || !password) {
      toast.error('Please enter your password');
      return;
    }

    try {
      // Rate limit re-authentication attempts
      if (!securityService.checkRateLimit(user.id, 'admin_reauth', 3)) {
        toast.error('Too many re-authentication attempts. Please wait.');
        return;
      }

      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password
      });

      if (error) {
        await securityService.logSecurityEvent({
          user_id: user.id,
          event_type: 'admin_reauth_failed',
          severity: 'high',
          details: { error: error.message }
        });
        toast.error('Re-authentication failed');
        return;
      }

      setIsReauthenticated(true);
      setShowReauth(false);
      setPassword('');
      
      // Set session timeout for 30 minutes
      const timeout = setTimeout(() => {
        setIsReauthenticated(false);
        toast.warning('Admin session expired. Please re-authenticate.');
      }, 30 * 60 * 1000);
      setSessionTimer(timeout);

      await securityService.logSecurityEvent({
        user_id: user.id,
        event_type: 'admin_reauth_success',
        severity: 'low',
        details: {}
      });

      toast.success('Re-authentication successful');
    } catch (error) {
      await securityService.logSecurityEvent({
        user_id: user?.id,
        event_type: 'admin_reauth_error',
        severity: 'high',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      toast.error('Re-authentication error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Lock className="w-5 h-5 mr-2" />
            Authentication Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please sign in to access admin features.</p>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Shield className="w-5 h-5 mr-2" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Administrator privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  if (!isReauthenticated && !showReauth) {
    return (
      <Card className="max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-600">
            <Shield className="w-5 h-5 mr-2" />
            Additional Security Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 text-amber-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Admin session requires re-authentication</span>
          </div>
          <p>Please re-authenticate to access sensitive admin features.</p>
          <Button onClick={() => setShowReauth(true)} className="w-full">
            Re-authenticate
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showReauth) {
    return (
      <Card className="max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-600">
            <Lock className="w-5 h-5 mr-2" />
            Admin Re-authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              onKeyPress={(e) => e.key === 'Enter' && handleReauthentication()}
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleReauthentication} className="flex-1">
              Authenticate
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowReauth(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNav />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default SecureAdminLayout;
