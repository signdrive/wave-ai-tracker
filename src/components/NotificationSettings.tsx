
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Settings, TestTube } from 'lucide-react';
import { usePushNotifications } from '@/hooks/useIntegrations';
import { AlertPreferences } from '@/services/notificationService';

const NotificationSettings: React.FC = () => {
  const { 
    isEnabled, 
    preferences, 
    enableNotifications, 
    updateAlertPreferences, 
    sendTestAlert 
  } = usePushNotifications();
  
  const [localPreferences, setLocalPreferences] = useState<AlertPreferences>(
    preferences || {
      waveHeightMin: 3,
      waveHeightMax: 15,
      windSpeedMax: 20,
      ratingMin: 3,
      spots: [],
      timeRanges: ['6-9', '15-18'],
      enabled: false
    }
  );

  const handleEnableNotifications = async () => {
    const granted = await enableNotifications();
    if (granted) {
      setLocalPreferences(prev => ({ ...prev, enabled: true }));
    }
  };

  const handleSavePreferences = () => {
    updateAlertPreferences(localPreferences);
  };

  const handleTestNotification = async () => {
    if (isEnabled) {
      await sendTestAlert();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            {isEnabled ? (
              <Bell className="w-5 h-5 mr-2 text-green-600" />
            ) : (
              <BellOff className="w-5 h-5 mr-2 text-gray-400" />
            )}
            Surf Alert Notifications
          </div>
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isEnabled ? (
          <div className="text-center py-6">
            <BellOff className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium mb-2">Enable Surf Alerts</h3>
            <p className="text-gray-600 mb-4">
              Get notified when conditions match your preferences at your favorite spots.
            </p>
            <Button onClick={handleEnableNotifications}>
              <Bell className="w-4 h-4 mr-2" />
              Enable Notifications
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="alerts-enabled">Surf Alerts</Label>
                <p className="text-sm text-gray-500">Receive notifications for good surf conditions</p>
              </div>
              <Switch
                id="alerts-enabled"
                checked={localPreferences.enabled}
                onCheckedChange={(checked) => 
                  setLocalPreferences(prev => ({ ...prev, enabled: checked }))
                }
              />
            </div>

            {localPreferences.enabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wave-height-min">Min Wave Height (ft)</Label>
                    <Input
                      id="wave-height-min"
                      type="number"
                      min="1"
                      max="30"
                      value={localPreferences.waveHeightMin}
                      onChange={(e) => 
                        setLocalPreferences(prev => ({ 
                          ...prev, 
                          waveHeightMin: Number(e.target.value) 
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="wave-height-max">Max Wave Height (ft)</Label>
                    <Input
                      id="wave-height-max"
                      type="number"
                      min="1"
                      max="30"
                      value={localPreferences.waveHeightMax}
                      onChange={(e) => 
                        setLocalPreferences(prev => ({ 
                          ...prev, 
                          waveHeightMax: Number(e.target.value) 
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wind-speed-max">Max Wind Speed (mph)</Label>
                    <Input
                      id="wind-speed-max"
                      type="number"
                      min="0"
                      max="50"
                      value={localPreferences.windSpeedMax}
                      onChange={(e) => 
                        setLocalPreferences(prev => ({ 
                          ...prev, 
                          windSpeedMax: Number(e.target.value) 
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating-min">Min Rating (1-5)</Label>
                    <Input
                      id="rating-min"
                      type="number"
                      min="1"
                      max="5"
                      value={localPreferences.ratingMin}
                      onChange={(e) => 
                        setLocalPreferences(prev => ({ 
                          ...prev, 
                          ratingMin: Number(e.target.value) 
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleSavePreferences}>
                    <Settings className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                  <Button onClick={handleTestNotification} variant="outline">
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Alert
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📱 How it works</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Notifications are sent when conditions match your preferences</li>
            <li>• Alerts work even when the app is closed (if supported by your browser)</li>
            <li>• You can customize which spots and conditions trigger alerts</li>
            <li>• Background sync keeps you updated with the latest conditions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
