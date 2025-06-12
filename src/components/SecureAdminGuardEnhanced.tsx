
import React, { useState, useEffect } from 'react';
import { useSecureAuthenticationWrapper } from '@/hooks/useSecureAuthenticationWrapper';
import { enhancedSecurityService } from '@/services/enhancedSecurityService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, AlertTriangle, Clock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import SecureInputField from './SecureInputField';

interface SecureAdminGuardEnhancedProps {
  children: React.ReactNode;
  requireReauth?: boolean;
  sessionTimeout?: number; // in minutes
}

const SecureAdminGuardEnhanced: React.FC<SecureAdminGuardEnhancedProps> = ({ 
  children, 
  requireReauth = true,
  sessionTimeout = 15 
}) => {
  const { user, securityLevel } = useSecureAuthenticationWrapper();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReauthenticated, setIsReauthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [showReauth, setShowReauth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(sessionTimeout * 60);

  useEffect(() => {
    checkAdminStatus();
    return () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
    };
  }, [user]);

  useEffect(() => {
    if (isReauthenticated && requireReauth) {
      startSessionTimer();
    }
  }, [isReauthenticated, requireReauth]);

  const checkAdminStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const hasAdminRole = await enhancedSecurityService.checkUserRole('admin');
      setIsAdmin(hasAdminRole);

      if (hasAdminRole) {
        await enhancedSecurityService.logSecurityEvent({
          user_id: user.id,
          event_type: 'admin_panel_access_attempt',
          severity: 'medium',
          details: { 
            security_level: securityLevel,
            require_reauth: requireReauth 
          }
        });
      }
    } catch (error) {
      console.error('Admin check failed:', error);
      await enhancedSecurityService.logSecurityEvent({
        user_id: user?.id,
        event_type: 'admin_permission_check_failed',
        severity: 'high',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      setLoading(false);
    }
  };

  const startSessionTimer = () => {
    const timeoutMs = sessionTimeout * 60 * 1000;
    
    // Clear existing timer
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }

    // Start countdown
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSessionTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Set main timeout
    const timeout = setTimeout(() => {
      clearInterval(interval);
      handleSessionTimeout();
    }, timeoutMs);

    setSessionTimer(timeout);
    setTimeRemaining(sessionTimeout * 60);
  };

  const handleSessionTimeout = () => {
    setIsReauthenticated(false);
    toast.warning('Admin session expired. Please re-authenticate.');
    
    enhancedSecurityService.logSecurityEvent({
      user_id: user?.id,
      event_type: 'admin_session_timeout',
      severity: 'medium',
      details: { session_duration_minutes: sessionTimeout }
    });
  };

  const handleReauthentication = async () => {
    if (!user?.email || !password) {
      toast.error('Please enter your password');
      return;
    }

    try {
      // Rate limit re-authentication attempts
      if (!await enhancedSecurityService.checkRateLimit(user.id, 'admin_reauth', 3)) {
        toast.error('Too many re-authentication attempts. Please wait.');
        return;
      }

      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password
      });

      if (error) {
        await enhancedSecurityService.logSecurityEvent({
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
      
      await enhancedSecurityService.logSecurityEvent({
        user_id: user.id,
        event_type: 'admin_reauth_success',
        severity: 'low',
        details: { security_level: securityLevel }
      });

      toast.success('Re-authentication successful');
    } catch (error) {
      await enhancedSecurityService.logSecurityEvent({
        user_id: user?.id,
        event_type: 'admin_reauth_error',
        severity: 'high',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      toast.error('Re-authentication error');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <div className="space-y-2">
            <p>Administrator privileges required.</p>
            <div className="text-xs text-gray-500">
              Security Level: {securityLevel}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (requireReauth && !isReauthenticated && !showReauth) {
    return (
      <Card className="max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-600">
            <Shield className="w-5 h-5 mr-2" />
            Enhanced Security Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 text-amber-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Admin session requires re-authentication</span>
          </div>
          <div className="text-xs text-gray-500">
            Security Level: {securityLevel}
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
          <SecureInputField
            id="admin-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
            validation="password"
            required
          />
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              {showPassword ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {showPassword ? 'Hide' : 'Show'} password
            </button>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleReauthentication} 
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleReauthentication()}
            >
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

  // Render admin content with session timer
  return (
    <div className="relative">
      {requireReauth && isReauthenticated && (
        <div className="fixed top-4 right-4 z-50">
          <Card className="w-64">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Admin Session</span>
                </div>
                <div className="text-sm font-mono">
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Session expires automatically
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {children}
    </div>
  );
};

export default SecureAdminGuardEnhanced;
