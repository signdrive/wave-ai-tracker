
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Watch, Smartphone, Bluetooth, Battery, Waves, Wind } from 'lucide-react';

interface WearableData {
  heartRate?: number;
  sessionTime: number;
  wavesRidden: number;
  distance: number; // meters
  calories: number;
  maxSpeed: number; // km/h
  connected: boolean;
  batteryLevel: number;
}

const WearableIntegration: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceType, setDeviceType] = useState<'apple-watch' | 'garmin' | 'fitbit' | null>(null);
  const [wearableData, setWearableData] = useState<WearableData>({
    sessionTime: 0,
    wavesRidden: 0,
    distance: 0,
    calories: 0,
    maxSpeed: 0,
    connected: false,
    batteryLevel: 85
  });

  // Simulate wearable data updates
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setWearableData(prev => ({
        ...prev,
        sessionTime: prev.sessionTime + 1,
        heartRate: Math.floor(Math.random() * (160 - 120) + 120),
        wavesRidden: prev.wavesRidden + (Math.random() > 0.85 ? 1 : 0),
        distance: prev.distance + Math.floor(Math.random() * 10),
        calories: prev.calories + Math.floor(Math.random() * 3),
        maxSpeed: Math.max(prev.maxSpeed, Math.floor(Math.random() * 25 + 15)),
        batteryLevel: Math.max(0, prev.batteryLevel - (Math.random() > 0.95 ? 1 : 0))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const connectDevice = (type: 'apple-watch' | 'garmin' | 'fitbit') => {
    setDeviceType(type);
    setIsConnected(true);
    setWearableData(prev => ({ ...prev, connected: true }));
  };

  const disconnectDevice = () => {
    setIsConnected(false);
    setDeviceType(null);
    setWearableData(prev => ({ 
      ...prev, 
      connected: false,
      sessionTime: 0,
      wavesRidden: 0,
      distance: 0,
      calories: 0,
      maxSpeed: 0
    }));
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'apple-watch':
        return <Watch className="w-5 h-5" />;
      case 'garmin':
      case 'fitbit':
        return <Smartphone className="w-5 h-5" />;
      default:
        return <Watch className="w-5 h-5" />;
    }
  };

  const getDeviceName = () => {
    switch (deviceType) {
      case 'apple-watch':
        return 'Apple Watch';
      case 'garmin':
        return 'Garmin Device';
      case 'fitbit':
        return 'Fitbit Device';
      default:
        return 'Wearable Device';
    }
  };

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            {getDeviceIcon()}
            <span className="ml-2">Wearable Integration</span>
          </div>
          <div className="flex items-center space-x-2">
            {isConnected && (
              <>
                <Badge className="bg-green-500">
                  <Bluetooth className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
                <Badge variant="outline">
                  <Battery className="w-3 h-3 mr-1" />
                  {wearableData.batteryLevel}%
                </Badge>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Connect your wearable device to track surf session metrics
            </p>
            
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                onClick={() => connectDevice('apple-watch')}
                className="justify-start"
              >
                <Watch className="w-4 h-4 mr-2" />
                Connect Apple Watch
              </Button>
              
              <Button
                variant="outline"
                onClick={() => connectDevice('garmin')}
                className="justify-start"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Connect Garmin Device
              </Button>
              
              <Button
                variant="outline"
                onClick={() => connectDevice('fitbit')}
                className="justify-start"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Connect Fitbit Device
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{getDeviceName()}</span>
              <Button variant="outline" size="sm" onClick={disconnectDevice}>
                Disconnect
              </Button>
            </div>

            {/* Real-time Session Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(wearableData.sessionTime)}
                </div>
                <div className="text-xs text-gray-600">Session Time</div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold text-green-600">
                  {wearableData.wavesRidden}
                </div>
                <div className="text-xs text-gray-600">Waves Ridden</div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {wearableData.calories}
                </div>
                <div className="text-xs text-gray-600">Calories</div>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-md text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {(wearableData.distance / 1000).toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">Distance (km)</div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="space-y-2">
              {wearableData.heartRate && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Heart Rate</span>
                  <span className="font-medium">{wearableData.heartRate} BPM</span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Max Speed</span>
                <span className="font-medium">{wearableData.maxSpeed} km/h</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                <Waves className="w-3 h-3 mr-1" />
                Log Wave
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                <Wind className="w-3 h-3 mr-1" />
                Check Wind
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WearableIntegration;
