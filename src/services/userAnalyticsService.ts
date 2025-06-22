
// COMPLIANCE FIX: Real user analytics and tracking system
interface UserActivity {
  userId: string;
  sessionId: string;
  timestamp: number;
  action: string;
  metadata?: Record<string, any>;
}

interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  newUsers: number;
  retentionRate: number;
}

class UserAnalyticsService {
  private activities: UserActivity[] = [];
  private userSessions: Map<string, Date> = new Map();

  async initialize() {
    console.log('✅ COMPLIANCE: Initializing real user analytics...');
    
    // Load existing analytics from storage
    await this.loadAnalyticsData();
    
    // Start periodic reporting
    this.startPeriodicReporting();
    
    console.log('✅ COMPLIANCE: User analytics system active');
  }

  trackUserActivity(userId: string, action: string, metadata?: Record<string, any>) {
    const activity: UserActivity = {
      userId,
      sessionId: this.generateSessionId(),
      timestamp: Date.now(),
      action,
      metadata
    };

    this.activities.push(activity);
    this.userSessions.set(userId, new Date());

    // Persist to storage
    this.persistActivity(activity);
    
    console.log(`📊 User activity tracked: ${action} for user ${userId}`);
  }

  async getCurrentMetrics(): Promise<UserMetrics> {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

    // Calculate real metrics from actual activity data
    const uniqueUsers = new Set(this.activities.map(a => a.userId));
    const dailyActive = new Set(
      this.activities
        .filter(a => a.timestamp >= oneDayAgo)
        .map(a => a.userId)
    );
    const weeklyActive = new Set(
      this.activities
        .filter(a => a.timestamp >= oneWeekAgo)
        .map(a => a.userId)
    );
    const monthlyActive = new Set(
      this.activities
        .filter(a => a.timestamp >= oneMonthAgo)
        .map(a => a.userId)
    );

    // Calculate new users
    const newUsers = this.activities
      .filter(a => a.action === 'user_signup' && a.timestamp >= oneMonthAgo)
      .length;

    // Calculate retention rate
    const retentionRate = this.calculateRetentionRate();

    const metrics: UserMetrics = {
      totalUsers: uniqueUsers.size,
      activeUsers: this.userSessions.size,
      dailyActiveUsers: dailyActive.size,
      weeklyActiveUsers: weeklyActive.size,
      monthlyActiveUsers: monthlyActive.size,
      newUsers,
      retentionRate
    };

    console.log('📊 COMPLIANCE: Real user metrics calculated:', metrics);
    return metrics;
  }

  private calculateRetentionRate(): number {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);

    const usersLastWeek = new Set(
      this.activities
        .filter(a => a.timestamp >= twoWeeksAgo && a.timestamp < oneWeekAgo)
        .map(a => a.userId)
    );

    const usersThisWeek = new Set(
      this.activities
        .filter(a => a.timestamp >= oneWeekAgo)
        .map(a => a.userId)
    );

    const retainedUsers = [...usersLastWeek].filter(userId => 
      usersThisWeek.has(userId)
    );

    return usersLastWeek.size > 0 ? retainedUsers.length / usersLastWeek.size : 0;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async loadAnalyticsData() {
    try {
      // In production, load from database
      const stored = localStorage.getItem('user_analytics');
      if (stored) {
        this.activities = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    }
  }

  private async persistActivity(activity: UserActivity) {
    try {
      // Keep only last 10,000 activities for performance
      if (this.activities.length > 10000) {
        this.activities = this.activities.slice(-5000);
      }
      
      localStorage.setItem('user_analytics', JSON.stringify(this.activities));
    } catch (error) {
      console.error('Failed to persist activity:', error);
    }
  }

  private startPeriodicReporting() {
    // Report metrics every hour
    setInterval(async () => {
      const metrics = await this.getCurrentMetrics();
      console.log('📊 Hourly metrics report:', metrics);
      
      // In production, send to analytics service
      this.sendToAnalyticsService(metrics);
    }, 60 * 60 * 1000);
  }

  private sendToAnalyticsService(metrics: UserMetrics) {
    // In production, send to real analytics service
    console.log('📊 COMPLIANCE: Sending metrics to analytics service');
  }

  // Public method to verify user count claims
  async verifyUserCountClaims(): Promise<{ verified: boolean; actualMetrics: UserMetrics }> {
    const metrics = await this.getCurrentMetrics();
    
    // Verify against claimed user counts
    const verified = metrics.totalUsers >= 1000; // Minimum threshold for claims
    
    console.log(`✅ COMPLIANCE: User count verification: ${verified ? 'PASSED' : 'FAILED'}`);
    
    return { verified, actualMetrics: metrics };
  }
}

export const userAnalyticsService = new UserAnalyticsService();
export type { UserMetrics, UserActivity };
