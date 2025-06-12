
import { InputValidator } from '@/utils/inputValidator';
import { securityEventLogger } from './securityEventLogger';

class InputValidationService {
  private suspiciousPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
    /<script.*?>/i,
    /javascript:/i,
    /eval\(/i,
    /expression\(/i,
    /document\.cookie/i,
    /window\.location/i,
    /\.innerHTML/i
  ];

  validateInput(input: string, context: string): boolean {
    if (!input) return true;
    
    // Enhanced pattern detection
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(input)) {
        securityEventLogger.logSecurityEvent({
          event_type: 'suspicious_input_detected',
          severity: 'high',
          details: { 
            input: input.substring(0, 100), 
            context, 
            pattern: pattern.source,
            inputLength: input.length 
          }
        });
        return false;
      }
    }
    
    // Check for excessive length
    if (input.length > 10000) {
      securityEventLogger.logSecurityEvent({
        event_type: 'excessive_input_length',
        severity: 'medium',
        details: { context, inputLength: input.length }
      });
      return false;
    }
    
    return true;
  }

  sanitizeUserInput(input: any): any {
    if (typeof input === 'string') {
      return InputValidator.sanitizeString(input);
    }
    
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeUserInput(item));
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[InputValidator.sanitizeString(key)] = this.sanitizeUserInput(value);
      }
      return sanitized;
    }
    
    return input;
  }
}

export const inputValidationService = new InputValidationService();
