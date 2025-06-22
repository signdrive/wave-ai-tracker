
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
      
      // Check for existing session data
      const { data: existingSession, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found is ok
        throw error;
      }

      const sessionData: UserSessionData = {
        userId,
        lastUpdated: serverTimestamp,
        sessionId: crypto.randomUUID(),
        deviceInfo: {
          userAgent: navigator.userAgent,
          timestamp: serverTimestamp
        },
        preferences: existingSession?.preferences || {},
        activityLog: existingSession?.activity_log || []
      };

      // Upsert session data
      await this.saveSessionData(sessionData);
      
      // Start real-time sync
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
      if (!localData) return false;

      // Get server session data
      const { data: serverData, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Server session validation failed:', error);
        return false;
      }

      // Check if local data is stale
      const localTimestamp = new Date(localData.lastUpdated).getTime();
      const serverTimestamp = new Date(serverData.last_updated).getTime();

      if (localTimestamp < serverTimestamp) {
        console.log('🔄 Local session data is stale, syncing...');
        await this.syncUserData(userId);
        return false; // Data was stale
      }

      return true; // Data is consistent
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
      console.log('🔄 Syncing user data from server...');

      // Get latest server data
      const { data: serverData, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      // Get local data for conflict resolution
      const localData = this.getLocalSessionData(userId);
      
      if (localData) {
        // Resolve conflicts
        const resolvedData = await this.resolveConflicts(localData, serverData);
        this.saveLocalSessionData(resolvedData);
      } else {
        // No local data, use server data
        this.saveLocalSessionData({
          userId,
          lastUpdated: serverData.last_updated,
          sessionId: serverData.session_id,
          deviceInfo: serverData.device_info,
          preferences: serverData.preferences,
          activityLog: serverData.activity_log
        });
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

  private async resolveConflicts(localData: UserSessionData, serverData: any): Promise<UserSessionData> {
    const conflicts: ConflictResolution[] = [];
    const resolvedData = { ...localData };

    // Strategy: Last Write Wins for most conflicts
    const localTime = new Date(localData.lastUpdated).getTime();
    const serverTime = new Date(serverData.last_updated).getTime();

    if (serverTime > localTime) {
      // Server data is newer, use server values
      resolvedData.preferences = serverData.preferences;
      resolvedData.lastUpdated = serverData.last_updated;
      
      conflicts.push({
        strategy: 'last_write_wins',
        field: 'preferences',
        serverValue: serverData.preferences,
        clientValue: localData.preferences,
        resolvedValue: serverData.preferences
      });
    }

    // Merge activity logs (append server activities not in local)
    const localActivityIds = new Set(localData.activityLog.map(a => `${a.action}_${a.timestamp}`));
    const serverActivities = serverData.activity_log || [];
    
    const newActivities = serverActivities.filter((activity: ActivityEntry) => 
      !localActivityIds.has(`${activity.action}_${activity.timestamp}`)
    );

    if (newActivities.length > 0) {
      resolvedData.activityLog = [...localData.activityLog, ...newActivities]
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    console.log(`🔧 Resolved ${conflicts.length} data conflicts using last-write-wins strategy`);
    return resolvedData;
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

    // Listen for real-time updates
    const channel = supabase.channel(`user_session_${userId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'user_sessions',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          console.log('📡 Real-time session update received');
          this.syncUserData(userId);
        }
      )
      .subscribe();
  }

  private async saveSessionData(sessionData: UserSessionData): Promise<void> {
    const { error } = await supabase
      .from('user_sessions')
      .upsert({
        user_id: sessionData.userId,
        session_id: sessionData.sessionId,
        last_updated: sessionData.lastUpdated,
        device_info: sessionData.deviceInfo,
        preferences: sessionData.preferences,
        activity_log: sessionData.activityLog
      });

    if (error) throw error;

    // Also save locally
    this.saveLocalSessionData(sessionData);
  }

  private saveLocalSessionData(sessionData: UserSessionData): void {
    localStorage.setItem(`session_${sessionData.userId}`, JSON.stringify(sessionData));
  }

  private getLocalSessionData(userId: string): UserSessionData | null {
    const stored = localStorage.getItem(`session_${userId}`);
    return stored ? JSON.parse(stored) : null;
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
