
// Push notification service for surf alerts
interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

interface AlertPreferences {
  waveHeightMin: number;
  waveHeightMax: number;
  windSpeedMax: number;
  ratingMin: number;
  spots: string[];
  timeRanges: string[];
  enabled: boolean;
}

class NotificationService {
  private isSupported = 'Notification' in window && 'serviceWorker' in navigator;
  private permission: NotificationPermission = 'default';

  constructor() {
    this.permission = this.isSupported ? Notification.permission : 'denied';
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notifications not supported');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async showNotification(options: NotificationOptions): Promise<void> {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/placeholder.svg',
          badge: options.badge || '/placeholder.svg',
          tag: options.tag,
          data: options.data,
          requireInteraction: true,
          actions: [
            {
              action: 'view',
              title: 'View Details'
            },
            {
              action: 'dismiss',
              title: 'Dismiss'
            }
          ]
        });
      } else {
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/placeholder.svg'
        });
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  async scheduleSurfAlert(spot: string, conditions: any): Promise<void> {
    const preferences = this.getAlertPreferences();
    
    if (!preferences.enabled || !preferences.spots.includes(spot)) {
      return;
    }

    const meetsWaveHeight = conditions.waveHeight >= preferences.waveHeightMin && 
                           conditions.waveHeight <= preferences.waveHeightMax;
    const meetsWindSpeed = conditions.windSpeed <= preferences.windSpeedMax;
    const meetsRating = conditions.rating >= preferences.ratingMin;

    if (meetsWaveHeight && meetsWindSpeed && meetsRating) {
      await this.showNotification({
        title: `🏄‍♂️ Great surf at ${spot}!`,
        body: `${conditions.waveHeight}ft waves, ${conditions.windSpeed}mph wind, ${conditions.rating}/5 rating`,
        tag: `surf-alert-${spot}`,
        data: { spot, conditions }
      });
    }
  }

  setAlertPreferences(preferences: AlertPreferences): void {
    localStorage.setItem('surf-alert-preferences', JSON.stringify(preferences));
  }

  getAlertPreferences(): AlertPreferences {
    const stored = localStorage.getItem('surf-alert-preferences');
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      waveHeightMin: 3,
      waveHeightMax: 15,
      windSpeedMax: 20,
      ratingMin: 3,
      spots: [],
      timeRanges: ['6-9', '15-18'],
      enabled: false
    };
  }

  async setupBackgroundSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'ServiceWorkerRegistration' in window && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await (registration as any).sync.register('surf-conditions-sync');
        console.log('Background sync registered for surf conditions');
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    } else {
      console.warn('Background sync not supported');
    }
  }

  isPermissionGranted(): boolean {
    return this.permission === 'granted';
  }
}

export const notificationService = new NotificationService();
export type { NotificationOptions, AlertPreferences };
