
// ML-powered wave quality prediction service
interface WaveConditions {
  waveHeight: number;
  period: number;
  windSpeed: number;
  windDirection: number;
  tideLevel: number;
  swellDirection: number;
  temperature: number;
}

interface PredictionResult {
  qualityScore: number; // 0-100
  confidence: number; // 0-1
  factors: {
    waveQuality: number;
    windConditions: number;
    tideOptimality: number;
    crowdFactor: number;
  };
  recommendation: string;
  bestTimeSlots: string[];
}

class MLPredictionService {
  // Simplified ML model using heuristics (in real implementation, this would use actual ML models)
  predictWaveQuality(
    conditions: WaveConditions,
    spotPreferences?: {
      idealWaveHeight?: [number, number];
      idealPeriod?: [number, number];
      idealWindSpeed?: number;
      bestTide?: string;
      bestSwellDirection?: number;
    }
  ): PredictionResult {
    const factors = {
      waveQuality: this.calculateWaveQuality(conditions, spotPreferences),
      windConditions: this.calculateWindScore(conditions, spotPreferences),
      tideOptimality: this.calculateTideScore(conditions, spotPreferences),
      crowdFactor: this.estimateCrowdFactor(conditions),
    };

    // Weighted average for overall quality
    const qualityScore = Math.round(
      factors.waveQuality * 0.4 +
      factors.windConditions * 0.3 +
      factors.tideOptimality * 0.2 +
      factors.crowdFactor * 0.1
    );

    const confidence = this.calculateConfidence(conditions);
    const recommendation = this.generateRecommendation(qualityScore, factors);
    const bestTimeSlots = this.predictBestTimes(conditions, factors);

    return {
      qualityScore,
      confidence,
      factors,
      recommendation,
      bestTimeSlots,
    };
  }

  private calculateWaveQuality(
    conditions: WaveConditions,
    preferences?: { idealWaveHeight?: [number, number]; idealPeriod?: [number, number] }
  ): number {
    let score = 50; // Base score

    // Wave height scoring
    const idealHeight = preferences?.idealWaveHeight || [3, 8];
    if (conditions.waveHeight >= idealHeight[0] && conditions.waveHeight <= idealHeight[1]) {
      score += 30;
    } else if (conditions.waveHeight < idealHeight[0]) {
      score += Math.max(0, 30 - (idealHeight[0] - conditions.waveHeight) * 10);
    } else {
      score += Math.max(0, 30 - (conditions.waveHeight - idealHeight[1]) * 5);
    }

    // Period scoring (longer periods are generally better)
    const idealPeriod = preferences?.idealPeriod || [8, 15];
    if (conditions.period >= idealPeriod[0] && conditions.period <= idealPeriod[1]) {
      score += 20;
    } else if (conditions.period < idealPeriod[0]) {
      score += Math.max(0, 20 - (idealPeriod[0] - conditions.period) * 3);
    }

    return Math.min(100, Math.max(0, score));
  }

  private calculateWindScore(
    conditions: WaveConditions,
    preferences?: { idealWindSpeed?: number }
  ): number {
    const idealWindSpeed = preferences?.idealWindSpeed || 10;
    
    // Light offshore or no wind is ideal
    if (conditions.windSpeed <= idealWindSpeed) {
      return 100 - conditions.windSpeed * 2;
    } else {
      return Math.max(0, 100 - (conditions.windSpeed - idealWindSpeed) * 8);
    }
  }

  private calculateTideScore(
    conditions: WaveConditions,
    preferences?: { bestTide?: string }
  ): number {
    // Simplified tide scoring - in reality, this would be more complex
    const tideOptimal = preferences?.bestTide || 'mid';
    
    // Assuming tideLevel is -1 to 1 (low to high)
    switch (tideOptimal.toLowerCase()) {
      case 'low':
        return Math.max(0, 100 - Math.abs(conditions.tideLevel + 0.5) * 100);
      case 'high':
        return Math.max(0, 100 - Math.abs(conditions.tideLevel - 0.5) * 100);
      case 'mid':
      default:
        return Math.max(0, 100 - Math.abs(conditions.tideLevel) * 100);
    }
  }

  private estimateCrowdFactor(conditions: WaveConditions): number {
    // Good conditions = more crowds
    const waveQuality = conditions.waveHeight * conditions.period;
    const isWeekend = new Date().getDay() % 6 === 0; // Simplified weekend check
    
    let crowdScore = 70; // Base score assuming moderate crowds
    
    if (waveQuality > 40) crowdScore -= 20; // Good waves = more crowds
    if (isWeekend) crowdScore -= 15; // Weekends = more crowds
    if (conditions.temperature > 20) crowdScore -= 10; // Warm weather = more crowds
    
    return Math.min(100, Math.max(20, crowdScore));
  }

  private calculateConfidence(conditions: WaveConditions): number {
    // Higher confidence with more consistent conditions
    let confidence = 0.7; // Base confidence
    
    if (conditions.period > 10) confidence += 0.1;
    if (conditions.windSpeed < 15) confidence += 0.1;
    if (conditions.waveHeight > 1 && conditions.waveHeight < 12) confidence += 0.1;
    
    return Math.min(1, confidence);
  }

  private generateRecommendation(score: number, factors: any): string {
    if (score >= 80) {
      return "Excellent conditions! Perfect time to surf.";
    } else if (score >= 65) {
      return "Good conditions. Should be a fun session.";
    } else if (score >= 45) {
      return "Fair conditions. Suitable for practice or less demanding sessions.";
    } else if (score >= 30) {
      return "Marginal conditions. Consider waiting for better waves.";
    } else {
      return "Poor conditions. Better to wait for improvement.";
    }
  }

  private predictBestTimes(conditions: WaveConditions, factors: any): string[] {
    const times = [];
    const currentHour = new Date().getHours();
    
    // Early morning (less crowded, often better wind)
    if (factors.windConditions > 60) {
      times.push("6:00 AM - 8:00 AM");
    }
    
    // Mid-morning
    if (factors.waveQuality > 70) {
      times.push("9:00 AM - 11:00 AM");
    }
    
    // Evening (potentially less crowded)
    if (factors.crowdFactor > 70) {
      times.push("5:00 PM - 7:00 PM");
    }
    
    return times.length > 0 ? times : ["Conditions may improve throughout the day"];
  }

  // Batch prediction for multiple spots
  predictMultipleSpots(
    spotsWithConditions: Array<{ spotId: string; conditions: WaveConditions; preferences?: any }>
  ): Array<{ spotId: string; prediction: PredictionResult }> {
    return spotsWithConditions.map(({ spotId, conditions, preferences }) => ({
      spotId,
      prediction: this.predictWaveQuality(conditions, preferences),
    }));
  }

  // Historical trend analysis (simplified)
  analyzeTrends(historicalData: WaveConditions[]): {
    averageQuality: number;
    bestDays: string[];
    seasonalTrends: Record<string, number>;
  } {
    const qualities = historicalData.map(conditions => 
      this.predictWaveQuality(conditions).qualityScore
    );
    
    const averageQuality = qualities.reduce((a, b) => a + b, 0) / qualities.length;
    
    return {
      averageQuality,
      bestDays: ['Wednesday', 'Thursday'], // Simplified
      seasonalTrends: {
        'Winter': 75,
        'Spring': 65,
        'Summer': 60,
        'Fall': 70,
      },
    };
  }
}

export const mlPredictionService = new MLPredictionService();
export type { WaveConditions, PredictionResult };
