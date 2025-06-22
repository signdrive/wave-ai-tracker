
class InputValidationService {
  validateInput(input: string, context: string): boolean {
    // Basic input validation
    if (!input || typeof input !== 'string') {
      return false;
    }

    // Check for common injection patterns
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /onload=/i,
      /onclick=/i,
      /eval\(/i,
      /union\s+select/i,
      /drop\s+table/i
    ];

    return !dangerousPatterns.some(pattern => pattern.test(input));
  }

  sanitizeUserInput(input: any): any {
    if (typeof input === 'string') {
      return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }

    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeUserInput(item));
    }

    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeUserInput(value);
      }
      return sanitized;
    }

    return input;
  }
}

export const inputValidationService = new InputValidationService();
