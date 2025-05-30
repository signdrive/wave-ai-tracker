
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const OfflineIndicator: React.FC = () => {
  const { isOffline } = usePWA();

  if (!isOffline) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300">
      <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-medium shadow-lg">
        <WifiOff className="w-4 h-4 mr-2" />
        You're offline • Using cached data
      </Badge>
    </div>
  );
};

export default OfflineIndicator;
