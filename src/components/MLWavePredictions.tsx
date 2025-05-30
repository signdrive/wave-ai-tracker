
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Clock, Users } from 'lucide-react';
import { mlPredictionService, PredictionResult, WaveConditions } from '@/services/mlPredictionService';

interface MLWavePredictionsProps {
  spotId: string;
  spotName: string;
  currentConditions?: WaveConditions;
  spotPreferences?: {
    idealWaveHeight?: [number, number];
    idealPeriod?: [number, number];
    idealWindSpeed?: number;
    bestTide?: string;
  };
}

const MLWavePredictions: React.FC<MLWavePredictionsProps> = ({
  spotId,
  spotName,
  currentConditions,
  spotPreferences,
}) => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      
      // Use provided conditions or mock data
      const conditions: WaveConditions = currentConditions || {
        waveHeight: 4.5,
        period: 12,
        windSpeed: 8,
        windDirection: 225,
        tideLevel: 0.2,
        swellDirection: 270,
        temperature: 22,
      };

      try {
        const result = mlPredictionService.predictWaveQuality(conditions, spotPreferences);
        setPrediction(result);
      } catch (error) {
        console.error('Error generating wave prediction:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [spotId, currentConditions, spotPreferences]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 animate-pulse" />
            AI Wave Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prediction) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Brain className="w-5 h-5 mr-2" />
            Prediction Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Unable to generate wave quality prediction at this time.</p>
        </CardContent>
      </Card>
    );
  }

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 45) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 65) return 'bg-blue-500';
    if (score >= 45) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Wave Prediction
          </div>
          <Badge className={getQualityBadgeColor(prediction.qualityScore)}>
            {prediction.qualityScore}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Quality Score */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getQualityColor(prediction.qualityScore)}`}>
            {prediction.qualityScore}%
          </div>
          <p className="text-gray-600 mt-1">{prediction.recommendation}</p>
          <p className="text-sm text-gray-500 mt-2">
            Confidence: {Math.round(prediction.confidence * 100)}%
          </p>
        </div>

        {/* Factor Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-gray-700">Condition Analysis</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm">Wave Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={prediction.factors.waveQuality} className="w-20 h-2" />
                <span className="text-sm font-medium">{prediction.factors.waveQuality}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm">Wind Conditions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={prediction.factors.windConditions} className="w-20 h-2" />
                <span className="text-sm font-medium">{prediction.factors.windConditions}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-purple-500" />
                <span className="text-sm">Tide Timing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={prediction.factors.tideOptimality} className="w-20 h-2" />
                <span className="text-sm font-medium">{prediction.factors.tideOptimality}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-orange-500" />
                <span className="text-sm">Crowd Level</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={prediction.factors.crowdFactor} className="w-20 h-2" />
                <span className="text-sm font-medium">{prediction.factors.crowdFactor}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Best Time Slots */}
        {prediction.bestTimeSlots.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Optimal Times</h4>
            <div className="flex flex-wrap gap-2">
              {prediction.bestTimeSlots.map((timeSlot, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {timeSlot}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start">
            <Brain className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h5 className="text-sm font-medium text-blue-800">AI Insights</h5>
              <p className="text-xs text-blue-700 mt-1">
                Based on current conditions and historical patterns, {spotName} is showing{' '}
                {prediction.qualityScore >= 70 ? 'excellent' : prediction.qualityScore >= 50 ? 'good' : 'moderate'}{' '}
                potential for surfing. Wind patterns suggest{' '}
                {prediction.factors.windConditions > 70 ? 'favorable' : 'challenging'} conditions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MLWavePredictions;
