import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Waves, Clock, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NotificationPreferences {
  wave_alerts: boolean;
  crowd_alerts: boolean;
  challenge_alerts: boolean;
  daily_forecast: boolean;
  session_reminders: boolean;
}

const NotificationSetup: React.FC = () => {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    wave_alerts: true,
    crowd_alerts: false,
    challenge_alerts: true,
    daily_forecast: false,
    session_reminders: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in this browser",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        await registerServiceWorker();
        toast({
          title: "Notifications Enabled! 🔔",
          description: "You'll now receive surf alerts and updates",
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "Enable notifications in your browser settings to receive alerts",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Error",
        description: "Failed to enable notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const registerServiceWorker = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);

        // Get FCM token and store it
        if (user) {
          await storeNotificationToken(registration);
        }
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const storeNotificationToken = async (registration: ServiceWorkerRegistration) => {
    try {
      // This is a simplified version - in a real app, you'd use Firebase Cloud Messaging
      const token = btoa(user?.id + Date.now()); // Simple token generation
      
      const { error } = await supabase
        .from('fcm_tokens')
        .upsert({
          user_id: user?.id,
          token: token,
          device_info: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
          active: true,
        }, { onConflict: 'user_id' });

      if (error) throw error;
    } catch (error) {
      console.error('Error storing notification token:', error);
    }
  };

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    if (!user) return;

    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    toast({
      title: "Preferences Updated",
      description: `${key.replace('_', ' ')} notifications ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const testNotification = () => {
    if (permission === 'granted') {
      new Notification('🌊 WaveMentor Test', {
        body: 'Great waves detected at your favorite spot!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Sign in for Notifications</h3>
          <p className="text-muted-foreground">Create an account to receive personalized surf alerts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Permission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Browser Support</p>
              <p className="text-sm text-muted-foreground">
                {isSupported ? 'Supported' : 'Not supported in this browser'}
              </p>
            </div>
            <Badge variant={isSupported ? 'default' : 'destructive'}>
              {isSupported ? 'Supported' : 'Not Supported'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Permission Status</p>
              <p className="text-sm text-muted-foreground">
                Current notification permission level
              </p>
            </div>
            <Badge variant={permission === 'granted' ? 'default' : permission === 'denied' ? 'destructive' : 'secondary'}>
              {permission === 'granted' ? 'Enabled' : permission === 'denied' ? 'Denied' : 'Not Asked'}
            </Badge>
          </div>

          {permission !== 'granted' && isSupported && (
            <Button onClick={requestPermission} disabled={loading} className="w-full">
              {loading ? 'Requesting...' : 'Enable Notifications'}
            </Button>
          )}

          {permission === 'granted' && (
            <div className="flex gap-2">
              <Button onClick={testNotification} variant="outline" className="flex-1">
                Test Notification
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      {permission === 'granted' && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Waves className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Wave Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when conditions are perfect at your favorite spots
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.wave_alerts}
                onCheckedChange={(checked) => updatePreference('wave_alerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium">Crowd Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get warned when your spots are getting crowded
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.crowd_alerts}
                onCheckedChange={(checked) => updatePreference('crowd_alerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">Challenge Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new challenges and achievements
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.challenge_alerts}
                onCheckedChange={(checked) => updatePreference('challenge_alerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium">Daily Forecast</p>
                  <p className="text-sm text-muted-foreground">
                    Receive morning surf forecasts for your area
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.daily_forecast}
                onCheckedChange={(checked) => updatePreference('daily_forecast', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Session Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Reminders for your scheduled surf sessions
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.session_reminders}
                onCheckedChange={(checked) => updatePreference('session_reminders', checked)}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationSetup;