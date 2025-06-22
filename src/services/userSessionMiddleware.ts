
import { supabase } from '@/integrations/supabase/client';
import { enhancedSecurityService } from './enhancedSecurityService';

interface UserSessionData {
  userId: string;
  lastUpdated: string;
  sessionId: string;
  deviceInfo: {
    userAgent: string;
    timestamp: string;
  };
  preferences: Record<string, any>;
  activityLog: ActivityEntry[];
}

interface ActivityEntry {
  action: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ConflictResolution {
  strategy: 'last_write_wins' | 'merge_changes' | 'user_prompt';
  field: string;
  serverValue: any;
  clientValue: any;
  resolvedValue: any;
}

class UserSessionMiddleware {
  private syncInterval: NodeJS.Timeout | null = null;
  private pendingSync = false;

  async initializeSession(userId: string): Promise<UserSessionData> {
    console.log('🔄 Initializing user session consistency check...');
    
    try {
      // Get current server timestamp
      const serverTimestamp = new Date().toISOString();
      
      const sessionData: UserSessionData = {
        userId,
        lastUpdated: serverTimestamp,
        sessionId: crypto.randomUUID(),
        deviceInfo: {
          userAgent: navigator.userAgent,
          timestamp: serverTimestamp
        },
        preferences: {},
        activityLog: []
      };

      // Save session data locally for now
      this.saveLocalSessionData(sessionData);
      
      // Start real-time sync monitoring
      this.startRealtimeSync(userId);
      
      await enhancedSecurityService.logSecurityEvent({
        user_id: userId,
        event_type: 'session_consistency_initialized',
        severity: 'low',
        details: { sessionId: sessionData.sessionId }
      });

      return sessionData;
    } catch (error) {
      console.error('❌ Failed to initialize session:', error);
      throw error;
    }
  }

  async validateSessionConsistency(userId: string): Promise<boolean> {
    try {
      // Get local session data
      const localData = this.getLocalSessionData(userId);
      if (!localData) {
        console.log('⚠️ No local session data found');
        return false;
      }

      // For now, without user_sessions table, we'll just validate local data integrity
      const isValid = this.validateLocalSessionData(localData);
      
      if (!isValid) {
        console.log('🔄 Local session data validation failed');
        await this.syncUserData(userId);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session consistency validation failed:', error);
      return false;
    }
  }

  async syncUserData(userId: string): Promise<void> {
    if (this.pendingSync) {
      console.log('⏳ Sync already in progress, skipping...');
      return;
    }

    this.pendingSync = true;

    try {
      console.log('🔄 Syncing user data...');

      // Get local data for conflict resolution
      const localData = this.getLocalSessionData(userId);
      
      if (localData) {
        // Refresh local data timestamp
        localData.lastUpdated = new Date().toISOString();
        this.saveLocalSessionData(localData);
      } else {
        // Create new session if none exists
        await this.initializeSession(userId);
      }

      await enhancedSecurityService.logSecurityEvent({
        user_id: userId,
        event_type: 'user_data_synced',
        severity: 'low',
        details: { syncTimestamp: new Date().toISOString() }
      });

    } catch (error) {
      console.error('❌ User data sync failed:', error);
      await enhancedSecurityService.logSecurityEvent({
        user_id: userId,
        event_type: 'user_data_sync_failed',
        severity: 'medium',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      this.pendingSync = false;
    }
  }

  private validateLocalSessionData(sessionData: UserSessionData): boolean {
    // Basic validation checks
    if (!sessionData.userId || !sessionData.sessionId || !sessionData.lastUpdated) {
      return false;
    }

    // Check if session is not too old (24 hours)
    const sessionAge = Date.now() - new Date(sessionData.lastUpdated).getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    return sessionAge < maxAge;
  }

  private startRealtimeSync(userId: string): void {
    // Clean up existing sync
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Sync every 30 seconds
    this.syncInterval = setInterval(async () => {
      const isConsistent = await this.validateSessionConsistency(userId);
      if (!isConsistent) {
        console.log('🔄 Session inconsistency detected, syncing...');
      }
    }, 30000);

    // For now, without user_sessions table, we'll just monitor local changes
    console.log('📡 Real-time session monitoring started');
  }

  private saveLocalSessionData(sessionData: UserSessionData): void {
    try {
      localStorage.setItem(`session_${sessionData.userId}`, JSON.stringify(sessionData));
      console.log('💾 Session data saved locally');
    } catch (error) {
      console.error('Failed to save session data locally:', error);
    }
  }

  private getLocalSessionData(userId: string): UserSessionData | null {
    try {
      const stored = localStorage.getItem(`session_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get local session data:', error);
      return null;
    }
  }

  cleanup(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

export const userSessionMiddleware = new UserSessionMiddleware();
export type { UserSessionData, ConflictResolution };
