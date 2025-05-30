
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App is already installed');
        setIsInstallable(false);
        return true;
      }
      return false;
    };

    // Only show install prompt if not already installed
    if (!checkIfInstalled()) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      console.log('Triggering install prompt');
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      console.log('User choice:', choiceResult.outcome);
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    }
  };

  return {
    isOffline,
    isInstallable,
    installPWA
  };
}
