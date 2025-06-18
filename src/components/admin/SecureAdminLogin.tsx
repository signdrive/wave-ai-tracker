
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertTriangle, Key } from 'lucide-react';
import { adminSecurityService } from '@/services/adminSecurityService';
import { toast } from 'sonner';

interface SecureAdminLoginProps {
  onSuccess: (role: string) => void;
}

const SecureAdminLogin: React.FC<SecureAdminLoginProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'credentials' | 'mfa' | 'emergency'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [emergencyCode, setEmergencyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminSecurityService.authenticateAdmin(email, password);
      
      if (result.success && result.session) {
        toast.success('Admin authentication successful');
        onSuccess(result.session.role);
      } else if (result.requiresMfa) {
        setStep('mfa');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (error) {
      setError('Authentication service error');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminSecurityService.authenticateAdmin(email, password, mfaCode);
      
      if (result.success && result.session) {
        toast.success('MFA verification successful');
        onSuccess(result.session.role);
      } else {
        setError(result.error || 'MFA verification failed');
      }
    } catch (error) {
      setError('MFA verification error');
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const granted = await adminSecurityService.emergencyAccess(emergencyCode);
      
      if (granted) {
        toast.success('Emergency access granted');
        onSuccess('super_admin');
      } else {
        setError('Invalid emergency code');
      }
    } catch (error) {
      setError('Emergency access error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-900">
            Secure Admin Access
          </CardTitle>
          <p className="text-red-600">
            Multi-factor authentication required
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Continue to MFA'}
                <Lock className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}

          {step === 'mfa' && (
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="text-center text-sm text-gray-600 mb-4">
                Enter the 6-digit code from your authenticator app
              </div>
              
              <div>
                <Label htmlFor="mfaCode">MFA Code</Label>
                <Input
                  id="mfaCode"
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setStep('credentials')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Access Admin'}
                  <Key className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          )}

          {step === 'emergency' && (
            <form onSubmit={handleEmergencyAccess} className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Emergency access will be logged and monitored. Use only in critical situations.
                </AlertDescription>
              </Alert>
              
              <div>
                <Label htmlFor="emergencyCode">Emergency Code</Label>
                <Input
                  id="emergencyCode"
                  type="password"
                  value={emergencyCode}
                  onChange={(e) => setEmergencyCode(e.target.value)}
                  placeholder="Enter emergency access code"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setStep('credentials')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  variant="destructive"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Emergency Access'}
                </Button>
              </div>
            </form>
          )}

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStep(step === 'emergency' ? 'credentials' : 'emergency')}
              className="text-red-600 hover:text-red-700"
            >
              {step === 'emergency' ? 'Normal Login' : 'Emergency Access'}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>🔒 All admin access is logged and monitored</p>
            <p>🛡️ Rate limiting and IP tracking active</p>
            <p>⚡ Session timeout: 60 minutes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureAdminLogin;
