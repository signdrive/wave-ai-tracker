
import { SurfSpot } from '@/types/surfSpots';
import { useSurfSpots } from '@/hooks/useSurfSpots';

interface SpotRecommendation {
  spot: SurfSpot;
  distance: number;
  score: number;
  reasons: string[];
}

interface RecommendationFactors {
  maxDistance?: number; // km
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  preferredWaveType?: string;
  crowdTolerance?: 'low' | 'medium' | 'high';
}

class RecommendationService {
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private calculateRecommendationScore(
    spot: SurfSpot,
    distance: number,
    factors: RecommendationFactors
  ): { score: number; reasons: string[] } {
    let score = 100;
    const reasons: string[] = [];

    // Distance penalty (closer is better)
    const distanceScore = Math.max(0, 100 - (distance / (factors.maxDistance || 50)) * 50);
    score = score * 0.3 + distanceScore * 0.3;

    // Skill level matching
    if (factors.skillLevel) {
      const skillMatch = this.matchSkillLevel(spot.difficulty, factors.skillLevel);
      score = score * 0.7 + skillMatch * 0.3;
      if (skillMatch > 70) {
        reasons.push(`Perfect for ${factors.skillLevel} surfers`);
      }
    }

    // Wave type preference
    if (factors.preferredWaveType && spot.wave_type.toLowerCase().includes(factors.preferredWaveType.toLowerCase())) {
      score += 10;
      reasons.push(`Matches your preferred ${factors.preferredWaveType} waves`);
    }

    // Crowd factor
    if (factors.crowdTolerance) {
      const crowdScore = this.matchCrowdTolerance(spot.crowd_factor, factors.crowdTolerance);
      score = score * 0.9 + crowdScore * 0.1;
      if (crowdScore > 70) {
        reasons.push('Good crowd levels for your preference');
      }
    }

    // Live cam bonus
    if (spot.live_cam) {
      score += 5;
      reasons.push('Has live camera feed');
    }

    // Distance feedback
    if (distance < 10) {
      reasons.push('Very close to your location');
    } else if (distance < 25) {
      reasons.push('Reasonably close');
    }

    return { score: Math.min(100, Math.max(0, score)), reasons };
  }

  private matchSkillLevel(spotDifficulty: string, userSkill: string): number {
    const difficultyMap: Record<string, number> = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4,
    };

    const spotLevel = this.extractDifficultyLevel(spotDifficulty);
    const userLevel = difficultyMap[userSkill] || 2;

    // Perfect match
    if (spotLevel === userLevel) return 100;
    
    // One level difference
    if (Math.abs(spotLevel - userLevel) === 1) return 75;
    
    // Two levels difference
    if (Math.abs(spotLevel - userLevel) === 2) return 50;
    
    // Too big difference
    return 25;
  }

  private extractDifficultyLevel(difficulty: string): number {
    const lower = difficulty.toLowerCase();
    if (lower.includes('beginner')) return 1;
    if (lower.includes('intermediate')) return 2;
    if (lower.includes('advanced')) return 3;
    if (lower.includes('expert')) return 4;
    return 2; // Default to intermediate
  }

  private matchCrowdTolerance(crowdFactor: string, tolerance: string): number {
    const crowdLevel = crowdFactor.toLowerCase();
    
    switch (tolerance) {
      case 'low':
        return crowdLevel.includes('uncrowded') || crowdLevel.includes('quiet') ? 100 : 30;
      case 'medium':
        return crowdLevel.includes('moderate') ? 100 : 70;
      case 'high':
        return crowdLevel.includes('crowded') || crowdLevel.includes('busy') ? 100 : 80;
      default:
        return 70;
    }
  }

  getRecommendations(
    surfSpots: SurfSpot[],
    userLat: number,
    userLon: number,
    factors: RecommendationFactors = {}
  ): SpotRecommendation[] {
    const maxDistance = factors.maxDistance || 100; // Default 100km radius

    const recommendations = surfSpots
      .map(spot => {
        const distance = this.calculateDistance(userLat, userLon, spot.lat, spot.lon);
        
        // Filter out spots that are too far
        if (distance > maxDistance) return null;

        const { score, reasons } = this.calculateRecommendationScore(spot, distance, factors);

        return {
          spot,
          distance,
          score,
          reasons,
        };
      })
      .filter((rec): rec is SpotRecommendation => rec !== null)
      .sort((a, b) => b.score - a.score);

    return recommendations;
  }
}

export const recommendationService = new RecommendationService();
export type { SpotRecommendation, RecommendationFactors };
