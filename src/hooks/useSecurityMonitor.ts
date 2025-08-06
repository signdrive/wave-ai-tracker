import { useState, useEffect } from 'react';
import { comprehensiveSecurityService } from '@/services/security/comprehensiveSecurityService';
import { enhancedSecurityService } from '@/services/enhancedSecurityService';

interface SecurityStatus {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  lastCheck: string;
  loading: boolean;
}

export const useSecurityMonitor = (intervalMs: number = 30000) => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    status: 'healthy',
    issues: [],
    lastCheck: '',
    loading: true
  });

  const runSecurityCheck = async () => {
    try {
      setSecurityStatus(prev => ({ ...prev, loading: true }));
      
      const [healthStatus, auditResult] = await Promise.all([
        comprehensiveSecurityService.monitorSecurityHealth(),
        comprehensiveSecurityService.runSecurityAudit()
      ]);

      // Combine results
      const allIssues = [
        ...healthStatus.issues,
        ...auditResult.issues.filter(i => i.failed).map(i => i.description)
      ];

      const criticalIssues = auditResult.issues.filter(
        i => i.failed && i.severity === 'critical'
      ).length;

      const finalStatus = criticalIssues > 0 ? 'critical' : 
                         (allIssues.length > 0 ? 'warning' : 'healthy');

      setSecurityStatus({
        status: finalStatus,
        issues: allIssues,
        lastCheck: new Date().toISOString(),
        loading: false
      });

      // Log monitoring result
      await enhancedSecurityService.logSecurityEvent({
        event_type: 'security_monitoring_check',
        severity: finalStatus === 'critical' ? 'high' : 'low',
        details: {
          status: finalStatus,
          issuesCount: allIssues.length,
          criticalIssues,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Security monitoring error:', error);
      setSecurityStatus({
        status: 'critical',
        issues: ['Security monitoring system error'],
        lastCheck: new Date().toISOString(),
        loading: false
      });

      await enhancedSecurityService.logSecurityEvent({
        event_type: 'security_monitoring_error',
        severity: 'critical',
        details: {
          error: String(error),
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  useEffect(() => {
    // Run initial check
    runSecurityCheck();

    // Set up interval for periodic checks
    const interval = setInterval(runSecurityCheck, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return {
    securityStatus,
    runSecurityCheck,
    isSecure: securityStatus.status === 'healthy',
    hasWarnings: securityStatus.status === 'warning',
    isCritical: securityStatus.status === 'critical'
  };
};