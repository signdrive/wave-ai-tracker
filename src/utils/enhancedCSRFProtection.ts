
import { enhancedSecurityService } from '@/services/enhancedSecurityService';
import { supabase } from '@/integrations/supabase/client';

interface CSRFToken {
  token: string;
  formId: string;
  expiry: number;
  userId?: string;
}

class EnhancedCSRFProtection {
  private tokens = new Map<string, CSRFToken>();
  private readonly TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes

  async generateToken(formId: string): Promise<string> {
    const token = enhancedSecurityService.generateCSRFToken();
    const expiry = Date.now() + this.TOKEN_EXPIRY;
    
    // Get current user for enhanced tracking
    const { data: { user } } = await supabase.auth.getUser();
    
    const csrfToken: CSRFToken = {
      token,
      formId,
      expiry,
      userId: user?.id
    };
    
    this.tokens.set(formId, csrfToken);
    
    // Log token generation for audit
    await enhancedSecurityService.logSecurityEvent({
      user_id: user?.id,
      event_type: 'csrf_token_generated',
      severity: 'low',
      details: { formId, expiry: new Date(expiry) }
    });
    
    // Clean up expired tokens
    this.cleanupExpiredTokens();
    
    return token;
  }

  async validateToken(formId: string, providedToken: string): Promise<boolean> {
    const tokenData = this.tokens.get(formId);
    
    if (!tokenData) {
      await enhancedSecurityService.logSecurityEvent({
        event_type: 'csrf_token_not_found',
        severity: 'medium',
        details: { formId }
      });
      return false;
    }
    
    if (Date.now() > tokenData.expiry) {
      await enhancedSecurityService.logSecurityEvent({
        event_type: 'csrf_token_expired',
        severity: 'medium',
        details: { formId, expired_at: new Date(tokenData.expiry) }
      });
      this.tokens.delete(formId);
      return false;
    }
    
    const isValid = enhancedSecurityService.validateCSRFToken(providedToken, tokenData.token);
    
    if (isValid) {
      // Token is valid, remove it (one-time use)
      this.tokens.delete(formId);
      
      await enhancedSecurityService.logSecurityEvent({
        user_id: tokenData.userId,
        event_type: 'csrf_token_validated',
        severity: 'low',
        details: { formId }
      });
    } else {
      await enhancedSecurityService.logSecurityEvent({
        user_id: tokenData.userId,
        event_type: 'csrf_token_validation_failed',
        severity: 'high',
        details: { formId, provided_token_length: providedToken.length }
      });
    }
    
    return isValid;
  }

  private cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [formId, tokenData] of this.tokens.entries()) {
      if (tokenData.expiry < now) {
        this.tokens.delete(formId);
      }
    }
  }

  async addCSRFTokenToForm(form: HTMLFormElement, formId: string): Promise<void> {
    // Remove existing CSRF token if present
    const existingToken = form.querySelector('input[name="csrf_token"]');
    if (existingToken) {
      existingToken.remove();
    }
    
    // Add new CSRF token
    const token = await this.generateToken(formId);
    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'csrf_token';
    tokenInput.value = token;
    form.appendChild(tokenInput);
  }

  async validateFormCSRF(formData: FormData, formId: string): Promise<boolean> {
    const token = formData.get('csrf_token') as string;
    if (!token) {
      await enhancedSecurityService.logSecurityEvent({
        event_type: 'csrf_token_missing_in_form',
        severity: 'high',
        details: { formId }
      });
      return false;
    }
    
    return this.validateToken(formId, token);
  }

  // Method to validate CSRF for API requests
  async validateAPIRequest(headers: Headers, formId: string): Promise<boolean> {
    const token = headers.get('X-CSRF-Token');
    if (!token) {
      await enhancedSecurityService.logSecurityEvent({
        event_type: 'csrf_token_missing_in_api_request',
        severity: 'high',
        details: { formId }
      });
      return false;
    }
    
    return this.validateToken(formId, token);
  }

  // Method to add CSRF token to API request headers
  async addCSRFTokenToHeaders(headers: Headers, formId: string): Promise<void> {
    const token = await this.generateToken(formId);
    headers.set('X-CSRF-Token', token);
  }
}

export const enhancedCSRFProtection = new EnhancedCSRFProtection();
