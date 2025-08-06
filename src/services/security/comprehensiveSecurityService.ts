import { supabase } from '@/integrations/supabase/client';
import { enhancedSecurityService } from '../enhancedSecurityService';
import { InputValidator } from '@/utils/inputValidator';

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  check: () => Promise<boolean>;
}

interface SecurityAuditResult {
  passed: boolean;
  failed: boolean;
  total: number;
  issues: Array<{
    policy: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    failed: boolean;
  }>;
}

class ComprehensiveSecurityService {
  private policies: SecurityPolicy[] = [
    {
      id: 'auth_required',
      name: 'Authentication Required',
      description: 'User must be authenticated to access protected resources',
      severity: 'critical',
      check: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return !!user;
      }
    },
    {
      id: 'session_valid',
      name: 'Valid Session',
      description: 'User session must be valid and not expired',
      severity: 'high',
      check: async () => {
        return enhancedSecurityService.validateSession();
      }
    },
    {
      id: 'secure_headers',
      name: 'Security Headers',
      description: 'Check for security headers in responses',
      severity: 'medium',
      check: async () => {
        // This would typically check server response headers
        // For client-side, we'll check if CSP is enabled
        const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        return !!meta;
      }
    },
    {
      id: 'input_sanitization',
      name: 'Input Sanitization',
      description: 'All user inputs should be properly sanitized',
      severity: 'high',
      check: async () => {
        // Test a sample input
        const testInput = '<script>alert("xss")</script>';
        const sanitized = InputValidator.sanitizeHtml(testInput);
        return !sanitized.includes('<script>');
      }
    }
  ];

  async runSecurityAudit(): Promise<SecurityAuditResult> {
    const results: SecurityAuditResult['issues'] = [];
    
    for (const policy of this.policies) {
      try {
        const passed = await policy.check();
        results.push({
          policy: policy.name,
          severity: policy.severity,
          description: policy.description,
          failed: !passed
        });
      } catch (error) {
        console.error(`Security policy check failed for ${policy.id}:`, error);
        results.push({
          policy: policy.name,
          severity: policy.severity,
          description: policy.description,
          failed: true
        });
      }
    }

    const failed = results.filter(r => r.failed).length;
    const total = results.length;
    const passed = total - failed;

    // Log security audit results
    await enhancedSecurityService.logSecurityEvent({
      event_type: 'security_audit',
      severity: failed > 0 ? 'medium' : 'low',
      details: {
        total_checks: total,
        passed_checks: passed,
        failed_checks: failed,
        critical_failures: results.filter(r => r.failed && r.severity === 'critical').length
      }
    });

    return {
      passed: passed > 0,
      failed: failed > 0,
      total,
      issues: results
    };
  }

  async validateUserAction(action: string, resource: string, userId?: string): Promise<boolean> {
    try {
      // Log the action attempt
      await enhancedSecurityService.logSecurityEvent({
        user_id: userId,
        event_type: 'user_action_validation',
        severity: 'low',
        details: { action, resource, timestamp: new Date().toISOString() }
      });

      // Validate session
      const sessionValid = await enhancedSecurityService.validateSession();
      if (!sessionValid) {
        await enhancedSecurityService.logSecurityEvent({
          user_id: userId,
          event_type: 'invalid_session_access_attempt',
          severity: 'high',
          details: { action, resource, timestamp: new Date().toISOString() }
        });
        return false;
      }

      // Check rate limiting
      const identifier = userId || 'anonymous';
      const rateLimitPassed = await enhancedSecurityService.checkRateLimit(identifier, action, 10);
      if (!rateLimitPassed) {
        await enhancedSecurityService.logSecurityEvent({
          user_id: userId,
          event_type: 'rate_limit_exceeded',
          severity: 'medium',
          details: { action, resource, timestamp: new Date().toISOString() }
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating user action:', error);
      await enhancedSecurityService.logSecurityEvent({
        user_id: userId,
        event_type: 'action_validation_error',
        severity: 'high',
        details: { action, resource, error: String(error), timestamp: new Date().toISOString() }
      });
      return false;
    }
  }

  async enforceDataSecurity(data: any, operation: 'read' | 'write' | 'delete'): Promise<boolean> {
    try {
      // Sanitize data for write operations
      if (operation === 'write' && data) {
        const sanitizedData = enhancedSecurityService.sanitizeUserInput(data);
        if (JSON.stringify(sanitizedData) !== JSON.stringify(data)) {
          await enhancedSecurityService.logSecurityEvent({
            event_type: 'data_sanitization_applied',
            severity: 'medium',
            details: { operation, sanitized: true, timestamp: new Date().toISOString() }
          });
        }
      }

      // Validate data structure
      if (data && typeof data === 'object') {
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === 'string') {
            const isValid = enhancedSecurityService.validateInput(value, key);
            if (!isValid) {
              await enhancedSecurityService.logSecurityEvent({
                event_type: 'invalid_data_detected',
                severity: 'high',
                details: { operation, field: key, timestamp: new Date().toISOString() }
              });
              return false;
            }
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error enforcing data security:', error);
      await enhancedSecurityService.logSecurityEvent({
        event_type: 'data_security_error',
        severity: 'high',
        details: { operation, error: String(error), timestamp: new Date().toISOString() }
      });
      return false;
    }
  }

  async monitorSecurityHealth(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    lastCheck: string;
  }> {
    const issues: string[] = [];
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    try {
      // Check authentication status
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        issues.push('User not authenticated');
        status = 'warning';
      }

      // Check recent security events
      const recentEvents = await enhancedSecurityService.getSecurityEvents(undefined, 'high');
      if (recentEvents.length > 10) {
        issues.push('High number of high-severity security events');
        status = 'critical';
      }

      // Check session validity
      const sessionValid = await enhancedSecurityService.validateSession();
      if (!sessionValid) {
        issues.push('Invalid session detected');
        status = status === 'critical' ? 'critical' : 'warning';
      }

      return {
        status,
        issues,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error monitoring security health:', error);
      return {
        status: 'critical',
        issues: ['Security monitoring system error'],
        lastCheck: new Date().toISOString()
      };
    }
  }
}

export const comprehensiveSecurityService = new ComprehensiveSecurityService();