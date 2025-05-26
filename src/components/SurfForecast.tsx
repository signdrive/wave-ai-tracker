
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSurfForecast } from '@/hooks/useRealTimeData';
import { Waves, Wind, Clock, TrendingUp } from 'lucide-react';

interface SurfForecastProps {
  spotId: string;
  spotName: string;
}

const SurfForecast: React.FC<SurfForecastProps> = ({ spotId, spotName }) => {
  const { data: forecast, isLoading, error } = useSurfForecast(spotId);

  const getSwellArrow = (degrees: number) => ({
    transform: `rotate(${degrees}deg)`,
  });

  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-red-500">Error loading surf forecast</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          7-Day Surf Forecast - {spotName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 border rounded-md">
                <Skeleton className="h-16 w-16" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : forecast ? (
          <div className="space-y-3">
            {forecast.days.map((day, index) => (
              <div
                key={day.timestamp}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  index === 0 ? 'bg-ocean/5 border-ocean' : 'bg-gray-50'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  {/* Date and Rating */}
                  <div className="text-center">
                    <div className="font-semibold text-sm">
                      {index === 0 ? 'Today' : day.date}
                    </div>
                    <div className={`text-lg ${getRatingColor(day.rating)}`}>
                      {getRatingStars(day.rating)}
                    </div>
                    <div className="text-xs text-gray-500">{day.conditions}</div>
                  </div>

                  {/* Wave Height */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Waves className="w-4 h-4 text-ocean mr-1" />
                    </div>
                    <div className="font-bold text-lg text-ocean-dark">
                      {day.waveHeight.min}-{day.waveHeight.max}ft
                    </div>
                    <div className="text-xs text-gray-500">
                      Avg {day.waveHeight.avg}ft
                    </div>
                  </div>

                  {/* Period and Swell Direction */}
                  <div className="text-center">
                    <div className="font-semibold">{day.period}s</div>
                    <div className="flex items-center justify-center mt-1">
                      <div
                        className="w-6 h-6 flex items-center justify-center text-ocean"
                        style={getSwellArrow(day.swellDirection)}
                      >
                        ↑
                      </div>
                      <span className="ml-1 text-sm">{day.swellDirectionText}</span>
                    </div>
                    <div className="text-xs text-gray-500">Swell</div>
                  </div>

                  {/* Wind */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Wind className="w-4 h-4 text-gray-600 mr-1" />
                    </div>
                    <div className="font-semibold">{day.windSpeed}mph</div>
                    <div className="text-xs text-gray-500">{day.windDirection}</div>
                  </div>

                  {/* Best Times */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 text-green-600 mr-1" />
                    </div>
                    {day.bestTimes.length > 0 ? (
                      <div className="space-y-1">
                        {day.bestTimes.map((time, i) => (
                          <div key={i} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {time}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">No prime times</div>
                    )}
                  </div>

                  {/* Overall Rating Badge */}
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        day.rating >= 4
                          ? 'bg-green-100 text-green-800'
                          : day.rating >= 3
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {day.rating}/5
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default SurfForecast;
