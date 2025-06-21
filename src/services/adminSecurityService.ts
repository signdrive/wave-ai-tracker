
import { supabase } from '@/integrations/supabase/client';
import { AdminRole, AdminPermission, ADMIN_PERMISSIONS } from '@/types/adminRoles';

interface AdminSession {
  userId: string;
  role: AdminRole;
  mfaVerified: boolean;
  sessionStart: number;
  lastActivity: number;
  ipAddress: string;
}

interface SecurityEvent {
  userId: string;
  action: string;
  resource: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  timestamp: number;
}

class AdminSecurityService {
  private activeSessions = new Map<string, AdminSession>();
  private readonly SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
  private readonly MAX_FAILED_ATTEMPTS = 3;
  private readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  private readonly RATE_LIMIT_MAX = 100;
  
  private failedAttempts = new Map<string, number>();
  private rateLimitTracker = new Map<string, { count: number; windowStart: number }>();

  async authenticateAdmin(email: string, password: string, mfaCode?: string): Promise<{
    success: boolean;
    session?: AdminSession;
    requiresMfa?: boolean;
    error?: string;
  }> {
    const identifier = `${email}:${this.getClientIP()}`;
    
    // Check rate limiting
    if (!this.checkRateLimit(identifier)) {
      await this.logSecurityEvent({
        userId: email,
        action: 'admin_login_rate_limited',
        resource: 'auth',
        severity: 'high',
        details: { email, ip: this.getClientIP() },
        timestamp: Date.now()
      });
      return { success: false, error: 'Rate limit exceeded. Please try again later.' };
    }

    // Check failed attempts
    const failedCount = this.failedAttempts.get(identifier) || 0;
    if (failedCount >= this.MAX_FAILED_ATTEMPTS) {
      await this.logSecurityEvent({
        userId: email,
        action: 'admin_login_blocked',
        resource: 'auth',
        severity: 'critical',
        details: { email, ip: this.getClientIP(), failedAttempts: failedCount },
        timestamp: Date.now()
      });
      return { success: false, error: 'Account temporarily locked due to failed attempts.' };
    }

    try {
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.user) {
        this.failedAttempts.set(identifier, failedCount + 1);
        await this.logSecurityEvent({
          userId: email,
          action: 'admin_login_failed',
          resource: 'auth',
          severity: 'medium',
          details: { email, error: error?.message },
          timestamp: Date.now()
        });
        return { success: false, error: 'Invalid credentials' };
      }

      // Check admin role
      const userRole = await this.getUserRole(data.user.id);
      if (!userRole || !['admin', 'moderator'].includes(userRole)) {
        await this.logSecurityEvent({
          userId: data.user.id,
          action: 'admin_access_denied',
          resource: 'auth',
          severity: 'high',
          details: { email, role: userRole },
          timestamp: Date.now()
        });
        return { success: false, error: 'Insufficient privileges' };
      }

      // Check if MFA is required
      if (!mfaCode) {
        return { success: false, requiresMfa: true };
      }

      // Verify MFA (simplified - in production, use proper MFA service)
      const mfaValid = await this.verifyMFA(data.user.id, mfaCode);
      if (!mfaValid) {
        await this.logSecurityEvent({
          userId: data.user.id,
          action: 'admin_mfa_failed',
          resource: 'auth',
          severity: 'high',
          details: { email },
          timestamp: Date.now()
        });
        return { success: false, error: 'Invalid MFA code' };
      }

      // Create admin session
      const session: AdminSession = {
        userId: data.user.id,
        role: userRole as AdminRole,
        mfaVerified: true,
        sessionStart: Date.now(),
        lastActivity: Date.now(),
        ipAddress: this.getClientIP()
      };

      this.activeSessions.set(data.user.id, session);
      this.failedAttempts.delete(identifier);

      await this.logSecurityEvent({
        userId: data.user.id,
        action: 'admin_login_success',
        resource: 'auth',
        severity: 'low',
        details: { email, role: userRole },
        timestamp: Date.now()
      });

      return { success: true, session };
    } catch (error) {
      await this.logSecurityEvent({
        userId: email,
        action: 'admin_login_error',
        resource: 'auth',
        severity: 'high',
        details: { email, error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: Date.now()
      });
      return { success: false, error: 'Authentication service error' };
    }
  }

  async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const session = this.activeSessions.get(userId);
    if (!session || !this.isSessionValid(session)) {
      return false;
    }

    const rolePermissions = ADMIN_PERMISSIONS.find(rp => rp.role === session.role);
    if (!rolePermissions) return false;

    const resourcePermission = rolePermissions.permissions.find(p => p.resource === resource);
    return resourcePermission?.actions.includes(action as any) || false;
  }

  async logAdminAction(userId: string, action: string, resource: string, details: Record<string, any> = {}): Promise<void> {
    const session = this.activeSessions.get(userId);
    if (!session) return;

    // Update last activity
    session.lastActivity = Date.now();

    // Determine severity based on action
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (action.includes('delete') || action.includes('system')) severity = 'high';
    if (action.includes('config') || action.includes('key')) severity = 'medium';

    await this.logSecurityEvent({
      userId,
      action: `admin_${action}`,
      resource,
      severity,
      details: { ...details, role: session.role, ip: session.ipAddress },
      timestamp: Date.now()
    });
  }

  private async getUserRole(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      return error ? null : data?.role;
    } catch {
      return null;
    }
  }

  private async verifyMFA(userId: string, code: string): Promise<boolean> {
    // Simplified MFA verification - in production, integrate with proper MFA service
    // For now, accept any 6-digit code for demonstration
    return /^\d{6}$/.test(code);
  }

  private checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const record = this.rateLimitTracker.get(identifier);

    if (!record || now - record.windowStart > this.RATE_LIMIT_WINDOW) {
      this.rateLimitTracker.set(identifier, { count: 1, windowStart: now });
      return true;
    }

    if (record.count >= this.RATE_LIMIT_MAX) {
      return false;
    }

    record.count++;
    return true;
  }

  private isSessionValid(session: AdminSession): boolean {
    const now = Date.now();
    return (now - session.lastActivity) < this.SESSION_TIMEOUT;
  }

  private async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      console.log('Security Event:', event);
      
      // Store in database using type assertion to bypass TypeScript checking
      try {
        const { error } = await (supabase as any)
          .from('security_events')
          .insert({
            user_id: event.userId,
            event_type: event.action,
            severity: event.severity,
            details: event.details,
            ip_address: event.details.ip || this.getClientIP(),
            user_agent: navigator?.userAgent || 'unknown',
            created_at: new Date(event.timestamp).toISOString()
          });

        if (error) {
          console.error('Failed to store security event:', error);
        }
      } catch (dbError) {
        console.error('Database error when logging security event:', dbError);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  private getClientIP(): string {
    // In production, get from proper source (reverse proxy headers, etc.)
    return 'unknown';
  }

  // Emergency break-glass procedure
  async emergencyAccess(emergencyCode: string): Promise<boolean> {
    // This should be a secure emergency code known only to system administrators
    const validEmergencyCode = 'EMERGENCY_2024';
    
    if (emergencyCode === validEmergencyCode) {
      await this.logSecurityEvent({
        userId: 'system',
        action: 'emergency_access_used',
        resource: 'system',
        severity: 'critical',
        details: { timestamp: Date.now() },
        timestamp: Date.now()
      });
      return true;
    }
    
    return false;
  }

  // Clean up expired sessions
  cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [userId, session] of this.activeSessions.entries()) {
      if (!this.isSessionValid(session)) {
        this.activeSessions.delete(userId);
      }
    }
  }
}

export const adminSecurityService = new AdminSecurityService();

// Set up periodic cleanup
setInterval(() => {
  adminSecurityService.cleanupExpiredSessions();
}, 5 * 60 * 1000); // Every 5 minutes
