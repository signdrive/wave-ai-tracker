
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Smartphone, Download } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, installPWA } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    console.log('PWAInstallPrompt - isInstallable:', isInstallable, 'isDismissed:', isDismissed);
  }, [isInstallable, isDismissed]);

  if (!isInstallable || isDismissed) {
    console.log('Not showing install prompt - isInstallable:', isInstallable, 'isDismissed:', isDismissed);
    return null;
  }

  console.log('Showing PWA install prompt');

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300 md:left-auto md:right-4 md:w-80">
      <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-ocean/10 dark:bg-ocean/20 rounded-lg">
                <Smartphone className="w-5 h-5 text-ocean dark:text-ocean-light" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Install Wave AI</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Get the full app experience
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <span>• Offline access to surf data</span>
            </div>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <span>• Push notifications for alerts</span>
            </div>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <span>• Faster loading times</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={installPWA}
              className="flex-1 bg-ocean hover:bg-ocean-dark text-white text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Install
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDismissed(true)}
              className="text-sm"
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
