
// Secure session management with enhanced security
import { supabase } from '@/integrations/supabase/client';
import { securityService } from '@/services/securityService';

interface SessionData {
  sessionId: string;
  userId: string;
  loginTime: number;
  lastActivity: number;
  ipAddress?: string;
  userAgent?: string;
}

class SecureSessionManager {
  private activeSessions = new Map<string, SessionData>();
  private readonly MAX_CONCURRENT_SESSIONS = 3;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly ADMIN_SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes for admin
  private activityTimer: NodeJS.Timeout | null = null;

  async initializeSession(userId: string): Promise<void> {
    try {
      const sessionId = crypto.randomUUID();
      const now = Date.now();
      
      // Check for existing sessions
      await this.enforceSessionLimits(userId);
      
      const sessionData: SessionData = {
        sessionId,
        userId,
        loginTime: now,
        lastActivity: now,
        ipAddress: await this.getCurrentIP(),
        userAgent: navigator.userAgent
      };
      
      this.activeSessions.set(sessionId, sessionData);
      
      // Store session in localStorage for tracking
      localStorage.setItem('session_id', sessionId);
      localStorage.setItem('session_start', now.toString());
      
      // Start activity monitoring
      this.startActivityMonitoring();
      
      await securityService.logSecurityEvent({
        user_id: userId,
        event_type: 'session_initialized',
        severity: 'low',
        details: { sessionId, timestamp: now }
      });
      
    } catch (error) {
      console.error('Failed to initialize session:', error);
      await securityService.logSecurityEvent({
        user_id: userId,
        event_type: 'session_initialization_failed',
        severity: 'medium',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  }

  async validateSession(): Promise<boolean> {
    try {
      const sessionId = localStorage.getItem('session_id');
      if (!sessionId) {
        return false;
      }
      
      const sessionData = this.activeSessions.get(sessionId);
      if (!sessionData) {
        await this.invalidateSession('Session not found');
        return false;
      }
      
      const now = Date.now();
      const isAdmin = await securityService.checkUserRole('admin');
      const timeout = isAdmin ? this.ADMIN_SESSION_TIMEOUT : this.SESSION_TIMEOUT;
      
      // Check session timeout
      if (now - sessionData.lastActivity > timeout) {
        await this.invalidateSession('Session timeout');
        return false;
      }
      
      // Update last activity
      sessionData.lastActivity = now;
      this.activeSessions.set(sessionId, sessionData);
      
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      await this.invalidateSession('Validation error');
      return false;
    }
  }

  async invalidateSession(reason: string): Promise<void> {
    try {
      const sessionId = localStorage.getItem('session_id');
      if (sessionId) {
        const sessionData = this.activeSessions.get(sessionId);
        
        this.activeSessions.delete(sessionId);
        localStorage.removeItem('session_id');
        localStorage.removeItem('session_start');
        
        if (sessionData) {
          await securityService.logSecurityEvent({
            user_id: sessionData.userId,
            event_type: 'session_invalidated',
            severity: 'low',
            details: { sessionId, reason, timestamp: Date.now() }
          });
        }
      }
      
      // Stop activity monitoring
      if (this.activityTimer) {
        clearInterval(this.activityTimer);
        this.activityTimer = null;
      }
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
    } catch (error) {
      console.error('Failed to invalidate session:', error);
    }
  }

  private async enforceSessionLimits(userId: string): Promise<void> {
    const userSessions = Array.from(this.activeSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.lastActivity - a.lastActivity);
    
    // If user has too many sessions, remove the oldest ones
    if (userSessions.length >= this.MAX_CONCURRENT_SESSIONS) {
      const sessionsToRemove = userSessions.slice(this.MAX_CONCURRENT_SESSIONS - 1);
      
      for (const session of sessionsToRemove) {
        this.activeSessions.delete(session.sessionId);
        
        await securityService.logSecurityEvent({
          user_id: userId,
          event_type: 'concurrent_session_limit_enforced',
          severity: 'medium',
          details: { removedSessionId: session.sessionId }
        });
      }
    }
  }

  private startActivityMonitoring(): void {
    // Monitor user activity every minute
    this.activityTimer = setInterval(async () => {
      const isValid = await this.validateSession();
      if (!isValid) {
        // Session is no longer valid, redirect to login
        window.location.href = '/';
      }
    }, 60000); // 1 minute
    
    // Update activity on user interactions
    const updateActivity = () => {
      const sessionId = localStorage.getItem('session_id');
      if (sessionId) {
        const sessionData = this.activeSessions.get(sessionId);
        if (sessionData) {
          sessionData.lastActivity = Date.now();
          this.activeSessions.set(sessionId, sessionData);
        }
      }
    };
    
    // Listen for user interactions
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });
  }

  private async getCurrentIP(): Promise<string> {
    try {
      // In a real application, you would get this from your backend
      // For now, we'll use a placeholder
      return 'unknown';
    } catch {
      return 'unknown';
    }
  }

  getSessionInfo(): SessionData | null {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) return null;
    
    return this.activeSessions.get(sessionId) || null;
  }

  async forceLogoutAllSessions(userId: string): Promise<void> {
    const userSessions = Array.from(this.activeSessions.entries())
      .filter(([_, session]) => session.userId === userId);
    
    for (const [sessionId, _] of userSessions) {
      this.activeSessions.delete(sessionId);
    }
    
    await securityService.logSecurityEvent({
      user_id: userId,
      event_type: 'all_sessions_terminated',
      severity: 'medium',
      details: { terminatedSessions: userSessions.length }
    });
  }
}

export const secureSessionManager = new SecureSessionManager();
