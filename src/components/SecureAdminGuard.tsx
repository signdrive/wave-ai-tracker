
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SecureAdminGuardProps {
  children: React.ReactNode;
}

const SecureAdminGuard: React.FC<SecureAdminGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReauthenticated, setIsReauthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [showReauth, setShowReauth] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Check admin role using existing user_roles table
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (!roleData) {
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      console.log('Admin access granted for user:', user.id);

    } catch (error) {
      console.error('Admin check failed:', error);
      toast.error('Security check failed');
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
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password
      });

      if (error) {
        toast.error('Re-authentication failed');
        return;
      }

      setIsReauthenticated(true);
      setShowReauth(false);
      setPassword('');
      toast.success('Re-authentication successful');
    } catch (error) {
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
            Re-authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

  return <>{children}</>;
};

export default SecureAdminGuard;
