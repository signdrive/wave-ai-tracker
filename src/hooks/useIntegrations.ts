
import { useState, useEffect } from 'react';
import { realApiService, RealSurfApiConfig } from '@/services/realApiService';
import { sharingService, ShareOptions } from '@/services/sharingService';
import { notificationService, AlertPreferences } from '@/services/notificationService';

export function useApiIntegration() {
  const [apiConfig, setApiConfig] = useState<RealSurfApiConfig>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    realApiService.loadStoredKeys();
  }, []);

  const connectApi = (config: RealSurfApiConfig) => {
    realApiService.setApiKeys(config);
    setApiConfig(config);
    setIsConnected(Object.values(config).some(key => !!key));
  };

  const getForecastFromApi = async (spotId: string, source: 'surfline' | 'magicseaweed' | 'stormglass' = 'surfline') => {
    switch (source) {
      case 'surfline':
        return realApiService.getSurflineForecast(spotId);
      case 'magicseaweed':
        return realApiService.getMagicSeaweedForecast(spotId);
      case 'stormglass':
        // For StormGlass, we need coordinates
        return realApiService.getStormGlassForecast(34.0259, -118.7798); // Default to Malibu
      default:
        return realApiService.getSurflineForecast(spotId);
    }
  };

  return {
    apiConfig,
    isConnected,
    connectApi,
    getForecastFromApi
  };
}

export function useSocialSharing() {
  const shareSpotConditions = async (options: ShareOptions) => {
    await sharingService.shareSpotConditions(options);
  };

  const shareToSocial = (platform: 'twitter' | 'facebook' | 'whatsapp', data: any) => {
    switch (platform) {
      case 'twitter':
        sharingService.shareToTwitter(data);
        break;
      case 'facebook':
        sharingService.shareToFacebook(data);
        break;
      case 'whatsapp':
        sharingService.shareToWhatsApp(data);
        break;
    }
  };

  return {
    shareSpotConditions,
    shareToSocial
  };
}

export function usePushNotifications() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [preferences, setPreferences] = useState<AlertPreferences | null>(null);

  useEffect(() => {
    setIsEnabled(notificationService.isPermissionGranted());
    setPreferences(notificationService.getAlertPreferences());
  }, []);

  const enableNotifications = async () => {
    const granted = await notificationService.requestPermission();
    setIsEnabled(granted);
    
    if (granted) {
      await notificationService.setupBackgroundSync();
    }
    
    return granted;
  };

  const updateAlertPreferences = (newPreferences: AlertPreferences) => {
    notificationService.setAlertPreferences(newPreferences);
    setPreferences(newPreferences);
  };

  const sendTestAlert = async () => {
    await notificationService.showNotification({
      title: '🌊 Wave AI Tracker',
      body: 'Test notification - your surf alerts are working!',
      tag: 'test-notification'
    });
  };

  return {
    isEnabled,
    preferences,
    enableNotifications,
    updateAlertPreferences,
    sendTestAlert
  };
}
