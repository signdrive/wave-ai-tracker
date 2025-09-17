import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.57d594ec75b04968bd0d99cd82689776',
  appName: 'Wave Mentor',
  webDir: 'dist',
  server: {
    url: 'https://57d594ec-75b0-4968-bd0d-99cd82689776.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0077B6',
      showSpinner: false
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#0077B6'
    }
  }
};

export default config;