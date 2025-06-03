
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, Lock, User, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthErrorBoundary } from './auth/AuthErrorBoundary';

interface EnhancedAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EnhancedAuthDialog: React.FC<EnhancedAuthDialogProps> = ({ open, onOpenChange }) => {
  const { signIn, signUp, signInWithGoogle, resetPassword, loading, error, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
    resetEmail: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (type: 'signin' | 'signup' | 'reset') => {
    const errors: Record<string, string> = {};

    if (type === 'signin' || type === 'signup') {
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }

      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      }
    }

    if (type === 'signup') {
      if (!formData.fullName) {
        errors.fullName = 'Full name is required';
      } else if (formData.fullName.length < 2) {
        errors.fullName = 'Full name must be at least 2 characters';
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    if (type === 'reset') {
      if (!formData.resetEmail) {
        errors.resetEmail = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.resetEmail)) {
        errors.resetEmail = 'Please enter a valid email address';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm('signin')) return;

    setIsLoading(true);
    clearError();

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (!error) {
        onOpenChange(false);
        resetForm();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm('signup')) return;

    setIsLoading(true);
    clearError();

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      
      if (!error) {
        onOpenChange(false);
        resetForm();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    clearError();

    try {
      await signInWithGoogle();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm('reset')) return;

    setIsLoading(true);
    clearError();

    try {
      const { error } = await resetPassword(formData.resetEmail);
      
      if (!error) {
        setResetEmailSent(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: '',
      resetEmail: '',
    });
    setFormErrors({});
    setResetEmailSent(false);
    clearError();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general error
    if (error) {
      clearError();
    }
  };

  React.useEffect(() => {
    if (!open) {
      resetForm();
      setActiveTab('signin');
    }
  }, [open]);

  return (
    <AuthErrorBoundary>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to WaveFinder</DialogTitle>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error.message || 'An error occurred during authentication'}
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="reset">Reset</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {formErrors.password && (
                    <p className="text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Google
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-sm text-red-600">{formErrors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password (min 8 characters)"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {formErrors.password && (
                    <p className="text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="reset" className="space-y-4">
              {resetEmailSent ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Reset email sent!</p>
                      <p className="text-sm">
                        Check your email for password reset instructions.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.resetEmail}
                        onChange={(e) => handleInputChange('resetEmail', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    {formErrors.resetEmail && (
                      <p className="text-sm text-red-600">{formErrors.resetEmail}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Email
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </AuthErrorBoundary>
  );
};

export default EnhancedAuthDialog;
