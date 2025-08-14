import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Waves, MapPin, Calendar, Users, TrendingUp, Zap } from 'lucide-react';

interface ComparisonSpot {
  id: string;
  name: string;
  location: string;
  difficulty: string;
  wave_type: string;
  best_season: string;
  crowd_level: string;
  break_type: string;
  rating: number;
  comparative_analysis: string;
}

interface SurfSpotComparisonProps {
  spots: ComparisonSpot[];
  onCompare?: (spot1: string, spot2: string) => void;
}

const SurfSpotComparison: React.FC<SurfSpotComparisonProps> = ({ spots, onCompare }) => {
  const [selectedSpot1, setSelectedSpot1] = useState<string>('');
  const [selectedSpot2, setSelectedSpot2] = useState<string>('');

  const spot1Data = spots.find(s => s.id === selectedSpot1);
  const spot2Data = spots.find(s => s.id === selectedSpot2);

  const getDifficultyScore = (difficulty: string) => {
    const scores = {
      'Beginner': 1,
      'Intermediate': 2,
      'Intermediate to Advanced': 3,
      'Advanced': 4,
      'Advanced to Expert': 5,
      'Expert': 6
    };
    return scores[difficulty as keyof typeof scores] || 3;
  };

  const getCrowdScore = (crowdLevel: string) => {
    const scores = {
      'Very Low': 1,
      'Low': 2,
      'Low to Medium': 2.5,
      'Medium': 3,
      'High': 4,
      'Very High': 5
    };
    return scores[crowdLevel as keyof typeof scores] || 3;
  };

  const renderComparisonMetric = (
    label: string, 
    value1: string | number, 
    value2: string | number,
    icon: React.ReactNode,
    isNumeric: boolean = false
  ) => {
    let comparison = '';
    if (isNumeric && typeof value1 === 'number' && typeof value2 === 'number') {
      if (value1 > value2) comparison = 'higher';
      else if (value1 < value2) comparison = 'lower';
      else comparison = 'equal';
    }

    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <div className="flex gap-4 text-sm">
          <span className={`px-2 py-1 rounded ${comparison === 'higher' && isNumeric ? 'bg-green-100 text-green-800' : ''}`}>
            {value1}
          </span>
          <span className="text-muted-foreground">vs</span>
          <span className={`px-2 py-1 rounded ${comparison === 'lower' && isNumeric ? 'bg-green-100 text-green-800' : ''}`}>
            {value2}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Surf Spot Comparison Tool
          </CardTitle>
          <CardDescription>
            Compare waves, conditions, and characteristics between world-class surf spots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select First Spot</label>
              <Select value={selectedSpot1} onValueChange={setSelectedSpot1}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a surf spot..." />
                </SelectTrigger>
                <SelectContent>
                  {spots.map(spot => (
                    <SelectItem key={spot.id} value={spot.id}>
                      {spot.name} - {spot.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Second Spot</label>
              <Select value={selectedSpot2} onValueChange={setSelectedSpot2}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a surf spot..." />
                </SelectTrigger>
                <SelectContent>
                  {spots.map(spot => (
                    <SelectItem key={spot.id} value={spot.id}>
                      {spot.name} - {spot.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {spot1Data && spot2Data && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{spot1Data.name}</CardTitle>
                    <CardDescription>{spot1Data.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge className="mb-2">{spot1Data.wave_type}</Badge>
                    <div className="flex justify-between text-sm">
                      <span>Rating:</span>
                      <span className="font-medium">{spot1Data.rating}/5</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{spot2Data.name}</CardTitle>
                    <CardDescription>{spot2Data.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge className="mb-2">{spot2Data.wave_type}</Badge>
                    <div className="flex justify-between text-sm">
                      <span>Rating:</span>
                      <span className="font-medium">{spot2Data.rating}/5</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Detailed Comparison</h4>
                
                {renderComparisonMetric(
                  'Difficulty Level',
                  getDifficultyScore(spot1Data.difficulty),
                  getDifficultyScore(spot2Data.difficulty),
                  <Zap className="h-4 w-4 text-yellow-600" />,
                  true
                )}

                {renderComparisonMetric(
                  'Crowd Level',
                  getCrowdScore(spot1Data.crowd_level),
                  getCrowdScore(spot2Data.crowd_level),
                  <Users className="h-4 w-4 text-purple-600" />,
                  true
                )}

                {renderComparisonMetric(
                  'Best Season',
                  spot1Data.best_season,
                  spot2Data.best_season,
                  <Calendar className="h-4 w-4 text-green-600" />
                )}

                {renderComparisonMetric(
                  'Break Type',
                  spot1Data.break_type,
                  spot2Data.break_type,
                  <Waves className="h-4 w-4 text-blue-600" />
                )}

                {renderComparisonMetric(
                  'Overall Rating',
                  spot1Data.rating,
                  spot2Data.rating,
                  <TrendingUp className="h-4 w-4 text-orange-600" />,
                  true
                )}
              </div>

              {spot1Data.comparative_analysis && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Expert Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {spot1Data.comparative_analysis}
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={() => onCompare?.(selectedSpot1, selectedSpot2)}
                  className="flex-1"
                >
                  View Detailed Analysis
                </Button>
                <Button variant="outline" onClick={() => {
                  setSelectedSpot1(selectedSpot2);
                  setSelectedSpot2(selectedSpot1);
                }}>
                  Swap Spots
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SurfSpotComparison;