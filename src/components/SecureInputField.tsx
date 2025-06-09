
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputValidator } from '@/utils/inputValidator';
import { securityService } from '@/services/securityService';
import { AlertTriangle, Shield } from 'lucide-react';

interface SecureInputFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'tel';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  validation?: 'email' | 'password' | 'url' | 'phone' | 'coordinates';
  maxLength?: number;
  className?: string;
}

const SecureInputField: React.FC<SecureInputFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  validation,
  maxLength = 255,
  className
}) => {
  const [error, setError] = useState<string>('');
  const [isSafe, setIsSafe] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    validateInput(value);
  }, [value, validation]);

  const validateInput = async (inputValue: string) => {
    if (!inputValue) {
      setError('');
      setIsSafe(true);
      return;
    }

    setIsValidating(true);

    try {
      // Check for malicious content
      const isSafeInput = securityService.validateInput(inputValue, `${id}_field`);
      setIsSafe(isSafeInput);

      if (!isSafeInput) {
        setError('Input contains potentially unsafe content');
        setIsValidating(false);
        return;
      }

      // Apply specific validation rules
      let validationError = '';

      switch (validation) {
        case 'email':
          if (!InputValidator.validateEmail(inputValue)) {
            validationError = 'Please enter a valid email address';
          }
          break;

        case 'password':
          const passwordValidation = InputValidator.validatePassword(inputValue);
          if (!passwordValidation.valid && passwordValidation.errors.length > 0) {
            validationError = passwordValidation.errors[0];
          }
          break;

        case 'url':
          if (!InputValidator.validateUrl(inputValue)) {
            validationError = 'Please enter a valid URL';
          }
          break;

        case 'phone':
          if (!InputValidator.validatePhoneNumber(inputValue)) {
            validationError = 'Please enter a valid phone number';
          }
          break;

        case 'coordinates':
          // Assuming format: "lat,lng"
          const coords = inputValue.split(',').map(c => parseFloat(c.trim()));
          if (coords.length !== 2 || !InputValidator.validateCoordinates(coords[0], coords[1])) {
            validationError = 'Please enter valid coordinates (lat,lng)';
          }
          break;
      }

      setError(validationError);
    } catch (error) {
      console.error('Input validation error:', error);
      setError('Validation error occurred');
    } finally {
      setIsValidating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Apply length limit
    if (newValue.length > maxLength) {
      newValue = newValue.substring(0, maxLength);
    }

    // Sanitize input
    newValue = InputValidator.sanitizeString(newValue);

    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center space-x-1">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
        {isSafe && !error && value && (
          <Shield className="w-3 h-3 text-green-500" title="Input is secure" />
        )}
      </Label>
      
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        className={`${className} ${!isSafe || error ? 'border-red-500' : ''} ${
          isValidating ? 'border-yellow-500' : ''
        }`}
        maxLength={maxLength}
      />

      {(!isSafe || error) && (
        <Alert variant="destructive" className="py-2">
          <AlertTriangle className="h-3 w-3" />
          <AlertDescription className="text-xs">
            {error || 'Input contains potentially unsafe content'}
          </AlertDescription>
        </Alert>
      )}

      {isValidating && (
        <div className="flex items-center space-x-1 text-xs text-yellow-600">
          <div className="w-3 h-3 border border-yellow-600 border-t-transparent rounded-full animate-spin" />
          <span>Validating...</span>
        </div>
      )}
    </div>
  );
};

export default SecureInputField;
