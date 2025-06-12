
// CSRF Protection utility
import { securityService } from '@/services/securityService';

interface CSRFTokens {
  [key: string]: {
    token: string;
    expiry: number;
  };
}

class CSRFProtection {
  private tokens: CSRFTokens = {};
  private readonly TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes

  generateToken(formId: string): string {
    const token = securityService.generateCSRFToken();
    this.tokens[formId] = {
      token,
      expiry: Date.now() + this.TOKEN_EXPIRY
    };
    
    // Clean up expired tokens
    this.cleanupExpiredTokens();
    
    return token;
  }

  validateToken(formId: string, providedToken: string): boolean {
    const tokenData = this.tokens[formId];
    
    if (!tokenData) {
      console.warn('CSRF token not found for form:', formId);
      return false;
    }
    
    if (Date.now() > tokenData.expiry) {
      console.warn('CSRF token expired for form:', formId);
      delete this.tokens[formId];
      return false;
    }
    
    const isValid = securityService.validateCSRFToken(providedToken, tokenData.token);
    
    if (isValid) {
      // Token is valid, remove it (one-time use)
      delete this.tokens[formId];
    }
    
    return isValid;
  }

  private cleanupExpiredTokens(): void {
    const now = Date.now();
    Object.keys(this.tokens).forEach(formId => {
      if (this.tokens[formId].expiry < now) {
        delete this.tokens[formId];
      }
    });
  }

  addCSRFTokenToForm(form: HTMLFormElement, formId: string): void {
    // Remove existing CSRF token if present
    const existingToken = form.querySelector('input[name="csrf_token"]');
    if (existingToken) {
      existingToken.remove();
    }
    
    // Add new CSRF token
    const token = this.generateToken(formId);
    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'csrf_token';
    tokenInput.value = token;
    form.appendChild(tokenInput);
  }

  validateFormCSRF(formData: FormData, formId: string): boolean {
    const token = formData.get('csrf_token') as string;
    if (!token) {
      console.warn('No CSRF token found in form data');
      return false;
    }
    
    return this.validateToken(formId, token);
  }
}

export const csrfProtection = new CSRFProtection();
