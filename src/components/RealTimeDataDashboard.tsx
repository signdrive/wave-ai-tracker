
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Waves, Wind, Clock, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { realTimeDataService, RealWaveData, TideData } from '@/services/realTimeDataService';

interface RealTimeDataDashboardProps {
  spotLocation: { lat: number; lon: number; name: string };
  stationId?: string;
}

const RealTimeDataDashboard: React.FC<RealTimeDataDashboardProps> = ({ 
  spotLocation, 
  stationId = '9414290' 
}) => {
  const [waveData, setWaveData] = useState<RealWaveData | null>(null);
  const [tideData, setTideData] = useState<TideData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadRealTimeData();
    
    // Set up real-time updates every 15 minutes
    const interval = setInterval(loadRealTimeData, 15 * 60 * 1000);
    
    // Subscribe to real-time updates via Supabase channels
    const unsubscribe = realTimeDataService.subscribeToRealTimeUpdates(
      spotLocation.name,
      (newData) => {
        setWaveData(newData);
        setLastUpdate(new Date());
      }
    );

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [spotLocation]);

  const loadRealTimeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch wave data from real APIs
      const waveResponse = await realTimeDataService.getWaveData(
        spotLocation.lat, 
        spotLocation.lon
      );
      setWaveData(waveResponse);

      // Fetch tide data
      const tideResponse = await realTimeDataService.getTideData(stationId);
      setTideData(tideResponse);

      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch real-time data');
      console.error('Real-time data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWaveQualityRating = (waveData: RealWaveData): number => {
    if (!waveData) return 0;
    
    // Safely handle potentially undefined values
    const waveHeight = waveData.waveHeight || 0;
    const period = waveData.period || 0;
    const windSpeed = waveData.windSpeed || 0;
    
    // Simple quality algorithm based on wave height, period, and wind
    const heightScore = Math.min(waveHeight / 8, 1) * 40;
    const periodScore = Math.min(period / 15, 1) * 30;
    const windScore = Math.max(0, (20 - windSpeed) / 20) * 30;
    
    return Math.round(heightScore + periodScore + windScore);
  };

  const getConditionStatus = (rating: number): { color: string; label: string } => {
    if (rating >= 80) return { color: 'text-green-600', label: 'Epic' };
    if (rating >= 60) return { color: 'text-blue-600', label: 'Good' };
    if (rating >= 40) return { color: 'text-yellow-600', label: 'Fair' };
    return { color: 'text-red-600', label: 'Poor' };
  };

  const formatWindDirection = (degrees: number): string => {
    if (typeof degrees !== 'number' || isNaN(degrees)) return 'N/A';
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const safeToFixed = (value: number | undefined | null, decimals: number = 1): string => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return value.toFixed(decimals);
  };

  if (loading && !waveData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Activity className="h-5 w-5 animate-spin" />
            <span>Loading real-time data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button 
            size="sm" 
            variant="outline" 
            className="ml-2"
            onClick={loadRealTimeData}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const qualityRating = waveData ? getWaveQualityRating(waveData) : 0;
  const conditionStatus = getConditionStatus(qualityRating);

  return (
    <div className="space-y-6">
      {/* Data Source & Last Update */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-gray-600">
            Real data from {waveData?.source || 'API'}
          </span>
        </div>
        {lastUpdate && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Updated {lastUpdate.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* Current Conditions Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{spotLocation.name} - Live Conditions</span>
            <Badge className={conditionStatus.color}>
              {conditionStatus.label} ({qualityRating}/100)
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Waves className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{safeToFixed(waveData?.waveHeight)}ft</div>
              <div className="text-sm text-gray-500">Wave Height</div>
            </div>
            
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{safeToFixed(waveData?.period, 0)}s</div>
              <div className="text-sm text-gray-500">Period</div>
            </div>
            
            <div className="text-center">
              <Wind className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <div className="text-2xl font-bold">
                {safeToFixed(waveData?.windSpeed, 0)}mph
              </div>
              <div className="text-sm text-gray-500">
                {waveData ? formatWindDirection(waveData.windDirection) : 'N/A'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">
                {waveData ? formatWindDirection(waveData.swellDirection) : 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Swell Direction</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tide Information */}
      {tideData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tide Chart - Next 24 Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tideData.slice(0, 6).map((tide, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <Badge variant={tide.type === 'High' ? 'default' : 'secondary'}>
                      {tide.type}
                    </Badge>
                    <span className="font-medium">{safeToFixed(tide.height)}ft</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(tide.time).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <Button 
        onClick={loadRealTimeData} 
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Activity className="h-4 w-4 mr-2 animate-spin" />
            Updating...
          </>
        ) : (
          'Refresh Data'
        )}
      </Button>
    </div>
  );
};

export default RealTimeDataDashboard;
