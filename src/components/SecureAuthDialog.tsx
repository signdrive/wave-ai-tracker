
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { useSecureAuthWrapper } from '@/hooks/useSecureAuthWrapper';
import { toast } from '@/hooks/use-toast';
import SecureInputField from './SecureInputField';

interface SecureAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SecureAuthDialog: React.FC<SecureAuthDialogProps> = ({ open, onOpenChange }) => {
  const { signIn, signUp, loading, error, isSecure } = useSecureAuthWrapper();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (type: 'signin' | 'signup') => {
    const errors: Record<string, string> = {};

    if (type === 'signup') {
      if (!formData.fullName) {
        errors.fullName = 'Full name is required';
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm('signin')) return;

    setIsLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (!error) {
        toast({
          title: "Welcome back!",
          description: `Signed in securely ${isSecure ? 'with enhanced security' : ''}`,
        });
        onOpenChange(false);
        resetForm();
      } else {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm('signup')) return;

    setIsLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      
      if (!error) {
        toast({
          title: "Account Created!",
          description: "Check your email for confirmation. Your account uses enhanced security.",
        });
        onOpenChange(false);
        resetForm();
      } else {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
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
    });
    setFormErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  React.useEffect(() => {
    if (!open) {
      resetForm();
      setActiveTab('signin');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Welcome to WaveMentor</span>
            <Shield className="w-4 h-4 text-green-500" title="Secure Authentication" />
          </DialogTitle>
        </DialogHeader>

        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Enhanced security authentication with input validation and rate limiting.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error.message || 'An error occurred during authentication'}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <SecureInputField
                id="signin-email"
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                validation="email"
                required
              />

              <SecureInputField
                id="signin-password"
                label="Password"
                type="password"
                placeholder="Your password"
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                required
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In Securely
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <SecureInputField
                id="signup-name"
                label="Full Name"
                type="text"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={(value) => handleInputChange('fullName', value)}
                maxLength={100}
                required
              />
              {formErrors.fullName && (
                <p className="text-sm text-red-600">{formErrors.fullName}</p>
              )}

              <SecureInputField
                id="signup-email"
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                validation="email"
                required
              />

              <SecureInputField
                id="signup-password"
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                validation="password"
                required
              />

              <SecureInputField
                id="signup-confirm"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(value) => handleInputChange('confirmPassword', value)}
                required
              />
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Secure Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SecureAuthDialog;
