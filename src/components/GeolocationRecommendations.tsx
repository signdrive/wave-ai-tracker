
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Star, Navigation, Camera } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSurfSpots } from '@/hooks/useSurfSpots';
import { recommendationService, SpotRecommendation, RecommendationFactors } from '@/services/recommendationService';
import { Skeleton } from '@/components/ui/skeleton';

const GeolocationRecommendations: React.FC = () => {
  const location = useGeolocation();
  const { surfSpots } = useSurfSpots();
  const [recommendations, setRecommendations] = useState<SpotRecommendation[]>([]);
  const [factors, setFactors] = useState<RecommendationFactors>({
    maxDistance: 50,
    skillLevel: 'intermediate',
    crowdTolerance: 'medium',
  });

  useEffect(() => {
    if (location.latitude && location.longitude && surfSpots.length > 0) {
      const recs = recommendationService.getRecommendations(
        surfSpots,
        location.latitude,
        location.longitude,
        factors
      );
      setRecommendations(recs.slice(0, 6)); // Show top 6 recommendations
    }
  }, [location.latitude, location.longitude, surfSpots, factors]);

  if (location.loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Navigation className="w-5 h-5 mr-2" />
            Finding Your Perfect Surf Spots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (location.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <MapPin className="w-5 h-5 mr-2" />
            Location Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Enable location access to get personalized surf spot recommendations near you.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Navigation className="w-5 h-5 mr-2" />
          Recommended Surf Spots Near You
        </CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Select value={factors.skillLevel} onValueChange={(value: any) => setFactors(prev => ({ ...prev, skillLevel: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Skill Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>

          <Select value={factors.crowdTolerance} onValueChange={(value: any) => setFactors(prev => ({ ...prev, crowdTolerance: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Crowd Preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Quiet Spots</SelectItem>
              <SelectItem value="medium">Moderate Crowds</SelectItem>
              <SelectItem value="high">Don't Mind Crowds</SelectItem>
            </SelectContent>
          </Select>

          <Select value={factors.maxDistance?.toString() || '50'} onValueChange={(value) => setFactors(prev => ({ ...prev, maxDistance: parseInt(value) }))}>
            <SelectTrigger>
              <SelectValue placeholder="Max Distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25 km</SelectItem>
              <SelectItem value="50">50 km</SelectItem>
              <SelectItem value="100">100 km</SelectItem>
              <SelectItem value="200">200 km</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No surf spots found within your specified criteria. Try increasing the distance or adjusting your preferences.
          </p>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={rec.spot.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <h3 className="font-semibold text-lg">{rec.spot.full_name}</h3>
                    {rec.spot.live_cam && <Camera className="w-4 h-4 text-green-600" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{Math.round(rec.score)}</span>
                    </div>
                    <Badge variant="secondary">
                      {rec.distance.toFixed(1)} km
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 mb-3">
                  {rec.spot.country} • {rec.spot.difficulty} • {rec.spot.wave_type}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {rec.reasons.slice(0, 3).map((reason, i) => (
                    <Badge key={i} className="text-xs bg-blue-100 text-blue-800">
                      {reason}
                    </Badge>
                  ))}
                </div>

                <div className="flex space-x-2">
                  {rec.spot.live_cam && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={rec.spot.live_cam} target="_blank" rel="noopener noreferrer">
                        Live Cam
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" asChild>
                    <a 
                      href={`https://www.google.com/maps/dir/${location.latitude},${location.longitude}/${rec.spot.lat},${rec.spot.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeolocationRecommendations;
