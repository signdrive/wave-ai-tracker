
// Points and rewards system for session logging
interface SurfSession {
  id: string;
  spotId: string;
  spotName: string;
  duration: number; // minutes
  waveConditions: {
    height: number;
    quality: number; // 1-5
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  maneuvers?: string[];
  notes?: string;
  timestamp: Date;
  photos?: string[];
}

interface PointsBreakdown {
  sessionDuration: number;
  waveQuality: number;
  difficulty: number;
  newSpot: number;
  consistency: number;
  total: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface UserProfile {
  totalPoints: number;
  level: number;
  sessionsCount: number;
  spotsVisited: string[];
  achievements: Achievement[];
  streak: number; // consecutive days
  rank: string;
}

class PointsRewardService {
  private readonly LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 18000];
  private readonly RANK_NAMES = [
    'Grom', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 
    'Pro', 'Legend', 'Master', 'Guru', 'Wave Rider'
  ];

  calculateSessionPoints(session: SurfSession, userProfile: UserProfile): PointsBreakdown {
    const breakdown: PointsBreakdown = {
      sessionDuration: 0,
      waveQuality: 0,
      difficulty: 0,
      newSpot: 0,
      consistency: 0,
      total: 0,
    };

    // Base points for session duration (1 point per 10 minutes)
    breakdown.sessionDuration = Math.floor(session.duration / 10) * 1;

    // Wave quality bonus (1-5 rating × 10 points)
    breakdown.waveQuality = session.waveConditions.quality * 10;

    // Difficulty multiplier
    const difficultyMultipliers = {
      beginner: 1,
      intermediate: 1.2,
      advanced: 1.5,
      expert: 2,
    };
    breakdown.difficulty = Math.floor(
      (breakdown.sessionDuration + breakdown.waveQuality) * 
      (difficultyMultipliers[session.difficulty] - 1)
    );

    // New spot bonus
    if (!userProfile.spotsVisited.includes(session.spotId)) {
      breakdown.newSpot = 50;
    }

    // Consistency bonus (daily streak)
    if (userProfile.streak >= 7) {
      breakdown.consistency = 25;
    } else if (userProfile.streak >= 3) {
      breakdown.consistency = 10;
    }

    breakdown.total = Object.values(breakdown).reduce((sum, val) => sum + val, 0) - breakdown.total;

    return breakdown;
  }

  checkAchievements(session: SurfSession, userProfile: UserProfile): Achievement[] {
    const newAchievements: Achievement[] = [];
    
    // Define all possible achievements
    const achievementDefinitions: Omit<Achievement, 'unlockedAt' | 'progress'>[] = [
      {
        id: 'first_session',
        title: 'First Wave',
        description: 'Log your first surf session',
        icon: '🏄‍♂️',
        points: 50,
      },
      {
        id: 'early_bird',
        title: 'Dawn Patrol',
        description: 'Surf before 7 AM',
        icon: '🌅',
        points: 30,
      },
      {
        id: 'marathon_session',
        title: 'Marathon Surfer',
        description: 'Surf for 3+ hours in one session',
        icon: '⏰',
        points: 100,
      },
      {
        id: 'spot_explorer',
        title: 'Spot Explorer',
        description: 'Surf at 10 different spots',
        icon: '🗺️',
        points: 200,
        maxProgress: 10,
      },
      {
        id: 'week_streak',
        title: 'Weekly Warrior',
        description: 'Surf 7 days in a row',
        icon: '🔥',
        points: 150,
      },
      {
        id: 'big_wave_rider',
        title: 'Big Wave Rider',
        description: 'Surf waves over 8 feet',
        icon: '🌊',
        points: 200,
      },
      {
        id: 'progression_master',
        title: 'Progression Master',
        description: 'Log sessions at all difficulty levels',
        icon: '📈',
        points: 300,
      },
      {
        id: 'photo_enthusiast',
        title: 'Photo Enthusiast',
        description: 'Add photos to 20 sessions',
        icon: '📸',
        points: 100,
        maxProgress: 20,
      },
    ];

    // Check each achievement
    achievementDefinitions.forEach(achievementDef => {
      const existingAchievement = userProfile.achievements.find(a => a.id === achievementDef.id);
      
      if (!existingAchievement || !existingAchievement.unlockedAt) {
        let shouldUnlock = false;
        let progress = existingAchievement?.progress || 0;

        switch (achievementDef.id) {
          case 'first_session':
            shouldUnlock = userProfile.sessionsCount === 1;
            break;
          case 'early_bird':
            shouldUnlock = session.timestamp.getHours() < 7;
            break;
          case 'marathon_session':
            shouldUnlock = session.duration >= 180;
            break;
          case 'spot_explorer':
            progress = userProfile.spotsVisited.length;
            shouldUnlock = progress >= 10;
            break;
          case 'week_streak':
            shouldUnlock = userProfile.streak >= 7;
            break;
          case 'big_wave_rider':
            shouldUnlock = session.waveConditions.height > 8;
            break;
          case 'progression_master':
            // Check if user has sessions at all difficulty levels (simplified)
            shouldUnlock = userProfile.sessionsCount >= 20; // Simplified check
            break;
          case 'photo_enthusiast':
            if (session.photos && session.photos.length > 0) {
              progress += 1;
            }
            shouldUnlock = progress >= 20;
            break;
        }

        if (shouldUnlock) {
          newAchievements.push({
            ...achievementDef,
            unlockedAt: new Date(),
            progress: achievementDef.maxProgress || undefined,
          });
        } else if (achievementDef.maxProgress && progress > (existingAchievement?.progress || 0)) {
          // Update progress for ongoing achievements
          newAchievements.push({
            ...achievementDef,
            progress,
            maxProgress: achievementDef.maxProgress,
          });
        }
      }
    });

    return newAchievements;
  }

  calculateLevel(totalPoints: number): { level: number; pointsToNext: number; rank: string } {
    let level = 0;
    
    for (let i = 0; i < this.LEVEL_THRESHOLDS.length; i++) {
      if (totalPoints >= this.LEVEL_THRESHOLDS[i]) {
        level = i;
      } else {
        break;
      }
    }

    const nextThreshold = this.LEVEL_THRESHOLDS[level + 1] || this.LEVEL_THRESHOLDS[this.LEVEL_THRESHOLDS.length - 1];
    const pointsToNext = nextThreshold - totalPoints;
    const rank = this.RANK_NAMES[Math.min(level, this.RANK_NAMES.length - 1)];

    return { level, pointsToNext: Math.max(0, pointsToNext), rank };
  }

  generateLeaderboard(users: UserProfile[]): UserProfile[] {
    return users
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((user, index) => ({
        ...user,
        rank: this.RANK_NAMES[Math.min(user.level, this.RANK_NAMES.length - 1)],
      }));
  }

  getWeeklyChallenge(): { 
    title: string; 
    description: string; 
    target: number; 
    reward: number; 
    icon: string;
  } {
    const challenges = [
      {
        title: 'Session Streak',
        description: 'Surf 5 times this week',
        target: 5,
        reward: 200,
        icon: '🔥',
      },
      {
        title: 'Spot Explorer',
        description: 'Visit 3 different surf spots',
        target: 3,
        reward: 150,
        icon: '🗺️',
      },
      {
        title: 'Duration Master',
        description: 'Surf for 8 total hours this week',
        target: 480, // minutes
        reward: 250,
        icon: '⏰',
      },
      {
        title: 'Photo Logger',
        description: 'Add photos to 5 sessions',
        target: 5,
        reward: 100,
        icon: '📸',
      },
    ];

    // Return a random challenge for this week
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    return challenges[weekNumber % challenges.length];
  }

  // Simplified session validation
  validateSession(session: Omit<SurfSession, 'id' | 'timestamp'>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (session.duration < 15) {
      errors.push('Session must be at least 15 minutes');
    }
    if (session.duration > 600) {
      errors.push('Session cannot exceed 10 hours');
    }
    if (session.waveConditions.height < 0.5 || session.waveConditions.height > 30) {
      errors.push('Wave height must be between 0.5 and 30 feet');
    }
    if (session.waveConditions.quality < 1 || session.waveConditions.quality > 5) {
      errors.push('Wave quality must be between 1 and 5');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const pointsRewardService = new PointsRewardService();
export type { SurfSession, PointsBreakdown, Achievement, UserProfile };
